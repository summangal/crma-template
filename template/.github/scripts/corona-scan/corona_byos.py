#!/usr/bin/env python

""" Uploads Component information (json) to Corona

Parameters
----------
product_id : str
    Product Id for the Cisco Product created in Corona tool
engineering_contact : str
    Contact email for Engineering
security_contact : str
    Contact email for Security
csdl_identifier : str
    Cisco Secure Development Identifier
Returns
-------
None

"""
import argparse
import getpass
import hashlib
import json
import os
import re
import sys
import time

from pprint import pprint

import requests

from termcolor import colored

import config

from exception.corona_exceptions import ImageNotFoundException
from syft_scan import syft_helper


# Global Constants
LOG_THROTTLE = 10
COMPONENT_THROTTLE = 999
MAX_RETRY_COUNT = 2
CG_MAX_RETRY_COUNT = 3
CORONA_HOST_NAME = "https://corona.cisco.com"
CORONA_HOST_NAME_EXTERNAL = "https://apix.cisco.com/api/corona"
CORONA_LOCATION = "/auto/sto-corona/zerobyte.bin"
SIGN_IN_ENDPOINT = "/api/auth/sign_in"
API_V3_ENDPOINT = "/api/v3/"
EMAIL_REGEX = r"^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$"


def get_api_credentials(user, pwd):
    if user is None or pwd is None:
        sys.exit("Error: Corona API Credentials not set - check Env variables")
    return {"user": user, "pwd": pwd}


def get_external_api_credentials():
    http_headers = {"Content-Type": "application/x-www-form-urlencoded"}
    payload = {
        "grant_type": "client_credentials",
        "client_id": os.environ["CORONA_API_GW_CLIENT_ID"],
        "client_secret": os.environ["CORONA_API_GW_CLIENT_SECRET"],
    }
    uri = "https://id.cisco.com/oauth2/default/v1/token"
    resp = requests.post(url=uri, headers=http_headers, params=payload)
    bearer_token = resp.json()["access_token"]
    return bearer_token


def get_auth_token(user, pwd, bearer_token):
    count = 0
    http_headers = {"Content-Type": "application/json"}
    while count <= MAX_RETRY_COUNT:
        try:
            # if count > 1:
            #     global CORONA_HOST_NAME
            #     CORONA_HOST_NAME = CORONA_HOST_NAME_EXTERNAL

            if CORONA_HOST_NAME == CORONA_HOST_NAME_EXTERNAL:
                if os.getenv("CORONA_API_GW_CLIENT_ID") and os.getenv(
                    "CORONA_API_GW_CLIENT_SECRET"
                ):
                    pass
                else:
                    sys.exit("Client Id or Client Secret not present in env")
                bearer_token = get_external_api_credentials()
            login_url = "".join([CORONA_HOST_NAME, SIGN_IN_ENDPOINT])
            if bearer_token:
                http_headers["Authorization"] = f"Bearer {bearer_token}"
            api_creds = get_api_credentials(user, pwd)
            payload = {
                "user": {
                    "username": api_creds["user"],
                    "password": api_creds["pwd"],
                }
            }
            payload_json = json.dumps(payload)
            resp = requests.post(
                url=login_url, headers=http_headers, data=payload_json
            )
            user_token = resp.json()["token"]
            user = resp.json()["user"]

            http_headers["X-User-Username"] = user
            http_headers["X-User-Token"] = user_token
            break
        except json.JSONDecodeError:
            if count == 0:
                print(
                    "Failed to process API call, retrying, count:", count + 1
                )
            elif count == 1:
                print(
                    "Failed to process API call, retrying with external API, count:",
                    count + 1,
                )
            count += 1
        except KeyError as e:
            if "token" in str(e):
                sys.exit(
                    "Error: Could not authenticate user with Corona - check credentials"
                )

    del payload

    return http_headers


def get_images_for_release(http_headers, release_id, retry):
    images_url = "".join(
        [CORONA_HOST_NAME, "/api/v2/images.json?release_id=", str(release_id)]
    )

    resp = requests.get(url=images_url, headers=http_headers)
    image_list = resp.json()["data"]
    images_dict = {}
    if (
        len(image_list) > 0
    ):  # no Images created hence we create new Release in Corona
        for image in image_list:  # creating a tuple (immutable)
            print(
                colored(
                    f"BOM last updated for Image ID {image['id']} at: {image['updated_at']}",
                    color="cyan",
                )
            )
            images_dict[image["name"]] = (image["id"], image["updated_at"])

    return images_dict


def delete_image(http_headers, image_id):
    try:
        """Delete the image from Corona"""

        delete_component_group_url = "".join(
            [CORONA_HOST_NAME, f"/api/v2/images/{image_id}.json"]
        )
        resp = requests.delete(
            url=delete_component_group_url,
            headers=http_headers,
        )
        return resp.json()
    except Exception as e:
        return None


def create_image(http_headers, params, image_name, release_id):
    """Return the json with details of newly created component group"""

    component_group_json = {
        "image": {
            "name": image_name,
            "engineering_contact": params["engineering_contact"],
            "discovery_tool": "manifest",
            "security_contact": params["security_contact"],
            "release_id": release_id,
            "product_id": params["prod_id"],
            "tags_attributes": [],
        }
    }

    create_component_group_url = "".join(
        [CORONA_HOST_NAME, "/api/v2/images.json"]
    )
    resp = requests.post(
        url=create_component_group_url,
        headers=http_headers,
        json=component_group_json,
    )
    return resp.json()


def get_release_id(http_headers, params):
    releases_product_url = "".join(
        [
            CORONA_HOST_NAME,
            "/api/v2/releases.json?product_id=",
            params["prod_id"],
        ]
    )
    resp = requests.get(url=releases_product_url, headers=http_headers)
    releases_list = resp.json()["data"]
    release_id = None

    for release in releases_list:
        if params["release_id"]:
            if str(release["id"]) == str(params["release_id"]):
                release_id = str(params["release_id"])
            else:
                if not release_id:
                    if release["version"].lower() == "production":
                        release_id = release["id"]
        else:
            if release["version"].lower() == "production":
                release_id = release["id"]
    if not release_id:
        release_id = create_release(http_headers, params)

    return release_id


def create_release(http_headers, params):
    create_release_url = "".join([CORONA_HOST_NAME, "/api/v1/releases.json"])
    create_release_json = {
        "release": {
            "product_id": params["prod_id"],
            "version": "Production",  # note: we always create Production release
            "security_contact": params["security_contact"],
            "engineering_contact": params["engineering_contact"],
            "csdl_identifier": params["csdl_identifier"],
        }
    }

    resp = requests.post(
        url=create_release_url, headers=http_headers, json=create_release_json
    )
    try:
        if resp.json()["errors"]:
            sys.exit(
                f"Error: Could not create Release for: {params['prod_id']}"
            )
    except KeyError:
        pass

    return resp.json()["id"]


def create_component_from_syft_output(syft_output, image_id):
    syft_objects = syft_helper.parse_syft_output(syft_output)
    components = {
        "image_id": image_id,
        "overwrite": (f"{arg.overwrite}"),
        "discovery_tool": "anchore",
        "data": [],
    }
    component_count = 0
    hash_object = hashlib.sha256()

    for syft_object in syft_objects:
        hash_object.update(str(syft_object).encode())
        component_count += 1
        prepped_component = {
            "name": syft_object.name,
            "version": syft_object.version,
            "supplier": syft_object.metadata.source,
            "license": syft_object.licenses,
            "codetype": syft_object.language,
            "repo_url": syft_object.metadata.resolved,
            "supporting_files": [],
        }
        supporting_files = {}
        for location in syft_object.locations:
            supporting_files["path"] = location.path
            supporting_files["cpes"] = syft_object.cpes
        prepped_component["supporting_files"].append(supporting_files)
        components["data"].append(prepped_component)
        if len(components["data"]) > COMPONENT_THROTTLE:
            print("--" * 35)
            print(
                colored(
                    f"Prepping {len(components['data'])} components",
                    color="cyan",
                )
            )
            yield components
            components["data"] = []

    components["image_sha256"] = hash_object.hexdigest()
    print("--" * 35)
    print(
        colored(f"Prepping {len(components['data'])} components", color="cyan")
    )
    yield components


def create_component_json_from_txt(input_file_path, image_id):
    component_json = {
        "image_id": image_id,
        "overwrite": arg.overwrite,
        "discovery_tool": "dpkg+pip-freeze",
        "data": [],
    }
    # Define a more encompassing regex pattern
    # This pattern matches package names followed by various version delimiters and the version numbers
    # It captures the package name and version into two groups for easier extraction
    # It now includes support for a wider range of version specifiers and package naming conventions
    pattern = re.compile(
        r"^(?P<name>[^,=:]+)(?P<delim>[,=:]|==)(?P<version>.+)$"
    )

    hash_object = hashlib.sha256()
    COMPONENT_THROTTLE = 100  # Example threshold, adjust as needed
    try:
        with open(input_file_path, "r") as input_file:
            for line in input_file:
                hash_object.update(line.encode())
                line = line.strip()
                match = pattern.match(line)
                if match:
                    pkg_name = match.group("name")
                    pkg_ver = match.group("version").lstrip(
                        "="
                    )  # Remove leading '=' if present
                    component_json["data"].append(
                        {"name": pkg_name, "version": pkg_ver}
                    )
                    print(
                        f"Added component: {pkg_name}=={pkg_ver} with overwite={arg.overwrite}"
                    )
                if len(component_json["data"]) > COMPONENT_THROTTLE:
                    print("--" * 35)
                    print(
                        colored(
                            f"Prepping {len(component_json['data'])} components",
                            color="cyan",
                        )
                    )
                    yield component_json
                    component_json["data"] = []
        # Yield remaining components if any
        if component_json["data"]:
            yield component_json
    except IOError as e:
        print(f"Error opening file {input_file_path}: {e}")
        yield None


def create_images(http_headers, params, images_dict, release_id):
    """Returns the count of images created in Corona for new input files"""

    images_created = 0
    folder_path = os.path.join(os.getcwd(), params["folder_name"])
    try:
        image_names = [  # for new input files
            os.path.splitext(file_name)[0]
            for file_name in os.listdir(folder_path)
            if file_name.endswith(".txt") or file_name.endswith(".json")
        ]
    except FileNotFoundError:
        print("** Folder not found: ", folder_path, end="\n")
        print("** Please check the folder name and try again", end="\n")
        exit()
    for image_name in image_names:
        try:
            # KeyError -> if file in not in image_dict (i.e. file not in Corona)
            image = images_dict[image_name]
            delete_image(http_headers, image[0])
            raise KeyError
        except KeyError:
            try:
                image_details = create_image(
                    http_headers, params, image_name, release_id
                )
                images_dict[image_name] = (  # creating a tuple (immutable)
                    image_details["id"],
                    image_details["updated_at"],
                )
                images_created += 1
                print(
                    colored(
                        f" Created image: {image_details['name']} with id: {image_details['id']} \n",
                        color="green",
                    )
                )
            except KeyError:
                print(
                    "** Failed to create image:[",
                    image_name,
                    "] in Corona",
                    end="\n",
                )
            except ImageNotFoundException as e:
                raise e

    return images_created


def wait_for_corona(count):
    """Wait for Corona to complete queued requests (async processing)"""
    # Corona queues new requests to create resources (async processing)
    # Therefore there is a delay for calculating SHA, Image Metadata mapping etc
    sleep_secs = count * 1
    print(
        colored(
            f"Wait {sleep_secs} secs for Corona to process queued requests",
            color="cyan",
        )
    )
    time.sleep(sleep_secs)


def post_component_json(http_headers, image_id, component_dict):
    """Post component json to Corona"""
    component_url = "".join(
        [
            CORONA_HOST_NAME,
            API_V3_ENDPOINT,
            "/images/",
            str(image_id),
            "/bom_report",
        ]
    )
    component_json = json.dumps(component_dict)
    resp = requests.post(
        url=component_url, headers=http_headers, data=component_json
    )
    if resp.status_code == 200 or resp.status_code == 201:
        print("--" * 35)
        print(
            colored(f"Component post success for image_id {image_id}", "green")
        )
    else:
        print("--" * 35)
        print(
            colored(
                f"Error: Component post failed for image_id {image_id} with error code: {resp.status_code} - {resp.text}",
                "red",
            )
        )


def get_comp_updated_date(http_headers, release_id, image_id, retry=None):
    """Returns date that the component was last updated"""

    image_comp_url = "".join(
        [
            f"{CORONA_HOST_NAME}/api/v2",
            "/releases/",
            str(release_id),
            "/images/",
            str(image_id),
            "/bom_report.json",
        ]
    )
    resp = requests.get(url=image_comp_url, headers=http_headers)
    component_list = resp.json()
    if not retry:
        print(
            colored(
                f"BOM last updated for Image ID {image_id} at: {component_list['updated_at']}",
                color="cyan",
            )
        )
    return component_list["updated_at"]


def generate_and_post_component(
    http_headers, params, images_dict, file_extensions=(".txt", ".json")
):
    """Generate component json from input file and post it to Corona"""
    folder_path = os.path.join(os.getcwd(), params["folder_name"])
    input_files = [  # for new input files
        file_name
        for file_name in os.listdir(folder_path)
        if file_name.endswith(file_extensions)
    ]
    for file_name in input_files:
        try:
            process_file(file_name, folder_path, http_headers, images_dict)
        except Exception as e:
            print(f"Error processing file {file_name}: {e}")


def process_file(file_name, folder_path, http_headers, images_dict):
    file_path = os.path.join(folder_path, file_name)
    image_name = os.path.splitext(file_name)[0]
    if file_name.endswith(".json"):
        process_file_type(
            file_path,
            image_name,
            http_headers,
            images_dict,
            create_component_from_syft_output,
        )
    elif file_name.endswith(".txt"):
        process_file_type(
            file_path,
            image_name,
            http_headers,
            images_dict,
            create_component_json_from_txt,
        )


def process_file_type(
    file_path, image_name, http_headers, images_dict, processing_function
):
    for component_set in processing_function(
        file_path, images_dict[image_name]
    ):
        if component_set:
            post_component_json(
                http_headers, images_dict[image_name][0], component_set
            )


def process_input_files(http_headers, params, images_dict, release_id):
    """Process each of the input files"""
    try:
        images_count = create_images(
            http_headers, params, images_dict, release_id
        )
        wait_for_corona(images_count)  # wait for completion of queued requests
        generate_and_post_component(http_headers, params, images_dict)
    except ImageNotFoundException as e:
        raise e


def sign_out(http_headers):
    """Invalidate the auth_token by signing out of Corona"""

    sign_out_url = "".join([CORONA_HOST_NAME, "/api/auth/sign_out"])
    requests.delete(url=sign_out_url, headers=http_headers)
    print(colored("signed out", color="cyan"))


def start_processing(http_headers, params_dict, retry=None):
    prod_release_id = get_release_id(http_headers, params_dict)
    images_dict = get_images_for_release(http_headers, prod_release_id, retry)
    print("--" * 35)
    try:
        process_input_files(
            http_headers, params_dict, images_dict, prod_release_id
        )
    except ImageNotFoundException as e:
        print(
            colored(
                f"Trying to create new image:[{e.image_name}] component group",
                color="yellow",
            )
        )
        count = 0
        while count < CG_MAX_RETRY_COUNT:
            count += 1
            create_component_group_json = create_image(
                http_headers, params_dict, e.image_name, prod_release_id
            )
            if "success" in create_component_group_json:
                print(
                    colored(
                        f"{create_component_group_json['success']}",
                        color="green",
                    ),
                    colored(
                        f"[{create_component_group_json['component_group']['name']}]",
                        color="cyan",
                    ),
                )
                time.sleep(5)
                start_processing(http_headers, params_dict, retry=True)
                break


def validate_args(args):
    """Validates command line arguments"""
    if len(sys.argv) < 5:
        sys.exit("Script needs 4 arguments - see docs")

    try:
        prod_id = int(args.product_id)
        if not prod_id or len(str(prod_id)) < 3:
            sys.exit("Missing/incorrect Corona Product Id as script param")

        if not re.match(EMAIL_REGEX, args.eng_contact):
            sys.exit("Missing/incorrect Engineering Contact as script param")

        csdl_id = int(args.csdl_id)
        if not csdl_id or len(str(csdl_id)) < 3:
            sys.exit("Missing/incorrect CSDL Identifier as script param")

        release_id = int(args.release_id) if args.release_id else None
        if release_id and len(str(release_id)) < 3:
            sys.exit("Incorrect Release Id as script param")

        if not args.image_file_path:
            sys.exit("AWS S3 bucket name not supplied as script param")

        if args.external_link == "True":
            global CORONA_HOST_NAME
            CORONA_HOST_NAME = CORONA_HOST_NAME_EXTERNAL

        return {
            "prod_id": str(prod_id),
            "engineering_contact": args.eng_contact,
            "security_contact": "umbrella-security-triage@cisco.com",
            "csdl_identifier": str(csdl_id),
            "release_id": str(release_id) if release_id else None,
            "folder_name": args.image_file_path,
        }

    except ValueError:
        sys.exit(
            "Invalid input. Make sure all integers are not entered as strings"
        )


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    print(colored(config.logo, color="cyan"))

    def str2bool(v):
        if isinstance(v, bool):
            return v
        if v.lower() in ("yes", "true", "t", "y", "1"):
            return True
        elif v.lower() in ("no", "false", "f", "n", "0"):
            return False
        else:
            raise argparse.ArgumentTypeError("Boolean value expected.")

    parser = argparse.ArgumentParser()

    parser.add_argument(
        "-o",
        "--overwrite",
        help="Overwrite existing components",
        type=str2bool,
        required=False,
        default=True,
    )

    parser.add_argument(
        "-u", "--username", help="Corona username", required=False
    )
    parser.add_argument(
        "-pa", "--password", help="Corona password", required=False
    )
    parser.add_argument(
        "-p", "--product_id", help="Corona product ID", required=True
    )
    parser.add_argument(
        "-e", "--eng_contact", help="Engineering contact email", required=True
    )
    parser.add_argument("-c", "--csdl_id", help="CSDL ID", required=True)
    parser.add_argument(
        "-r", "--release_id", help="Release Id", required=False
    )
    parser.add_argument(
        "-l", "--external_link", help="Use External Link", required=False
    )
    parser.add_argument(
        "-f", "--image_file_path", help="Image file path", required=True
    )

    args = parser.parse_args()
    params_dict = validate_args(args)
    BEARER_TOKEN = None  # nosec B105
    USERNAME = None
    PASSWORD = None
    arg = parser.parse_args()
    if os.getenv("CORONAUSER") and os.getenv("CORONAPASSWORD"):
        USERNAME = os.getenv("CORONAUSER")
        PASSWORD = os.getenv("CORONAPASSWORD")
    elif arg.username and arg.password:
        print(colored("Reading credentials from input args", color="green"))

        USERNAME = arg.username
        PASSWORD = arg.password
    else:
        print(colored("Reading credentials from user input", color="green"))
        USERNAME = input("Enter your corona generic username: ")
        PASSWORD = getpass.getpass("Enter your corona password: ")
    print("-" * 35)
    print(
        colored("Product ID: ", color="yellow"),
        colored(arg.product_id, color="green"),
    )
    print(
        colored("CSDL ID: ", color="yellow"),
        colored(arg.csdl_id, color="green"),
    )
    print(
        colored("IMAGE PATH: ", color="yellow"),
        colored(arg.image_file_path, color="green"),
    )
    print(
        colored("RELEASE: ", color="yellow"),
        colored(
            "Production" if arg.release_id is None else arg.release_id,
            color="green",
        ),
    )
    print(
        colored("OVERWRITE: ", color="yellow"),
        colored(arg.overwrite, color="green"),
    )
    print(
        colored("Use External Link: ", color="yellow"),
        colored(
            "True" if arg.external_link == "True" else "False", color="green"
        ),
    )

    print("-" * 35)
    http_headers = get_auth_token(
        user=(USERNAME if USERNAME else None),
        pwd=(PASSWORD if PASSWORD else None),
        bearer_token=BEARER_TOKEN,
    )
    start_processing(http_headers, params_dict)
    sign_out(http_headers)
    del USERNAME, PASSWORD
