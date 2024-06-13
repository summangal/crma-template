import json


# Define the directories to exclude
exclude_dirs = {  # type: ignore
    # '/tmp', '/var/tmp', '/proc', '/sys', '/dev', '/run',
    # '/mnt', '/media', '/home', '/root', '/var/log', '/var/cache',
    # '/boot', '/lost+found'  # Add more as needed
}


# Define classes to represent the structure of syft output
class Artifact:
    def __init__(self, artifact_data):
        self.id = artifact_data.get("id")
        self.name = artifact_data.get("name")
        self.version = artifact_data.get("version")
        self.type = artifact_data.get("type")
        self.found_by = artifact_data.get("foundBy")
        self.licenses = [
            license["value"]
            for license in artifact_data.get("licenses", [])
            if license
        ]
        self.language = artifact_data.get("language")
        self.cpes = artifact_data.get("cpes", [])
        self.purl = artifact_data.get("purl")
        self.locations = [
            Location(loc)
            for loc in artifact_data.get("locations", [])
            if not any(
                loc.get("path").startswith(ex_dir) for ex_dir in exclude_dirs
            )
        ]
        self.metadata = Metadata(artifact_data.get("metadata", {}))


class Location:
    def __init__(self, location_data):
        self.path = location_data.get("path")
        self.access_path = location_data.get("accessPath")
        self.annotations = location_data.get("annotations", {})


class Metadata:
    def __init__(self, metadata_data):
        self.resolved = metadata_data.get("resolved", "")
        self.integrity = metadata_data.get("integrity", "")
        self.source = metadata_data.get("source", "")
        self.package = metadata_data.get("package", "")


# Function to parse syft output json file and return list of Artifact objects
def parse_syft_output(file_path):
    with open(file_path, "r") as json_file:
        data = json.load(json_file)
        artifacts = [
            Artifact(artifact)
            for artifact in data.get("artifacts", [])
            if artifact.get("locations")
        ]
        # Filter out artifacts with no locations left after excluding paths
        artifacts = [artifact for artifact in artifacts if artifact.locations]
        return artifacts
