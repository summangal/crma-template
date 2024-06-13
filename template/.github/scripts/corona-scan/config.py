"""
        @Author: ftasha
        @email: ftasha@cisco.com
"""

# Replace these constants with your actual JUPITERONE ACCOUNT and API TOKEN
import os
import time


home = os.path.dirname(os.path.abspath(__file__))
results_output = f"{home}/output/" + "{}"

isLogExist = os.path.exists(f"{home}/log/")
isOutputExist = os.path.exists(f"{home}/output")
if not isLogExist:
    os.mkdir(f"{home}/log")

logo = """
·······························································
:  _________  ___  ____  _  _____       _____  ______  ____   :
: / ___/ __ \/ _ \/ __ \/ |/ / _ |     / _ ) \/ / __ \/ __/   :
:/ /__/ /_/ / , _/ /_/ /    / __ |    / _  |\  / /_/ /\ \     :
:\___/\____/_/|_|\____/_/|_/_/ |_|   /____/ /_/\____/___/     :
·······························································
"""
