import json
import subprocess

# Load JSON file
with open('data.json') as f:
    data = json.load(f)

# Extract required fields
refresh_token = data['refreshToken']

# Fill in the curl command
curl_command = f'curl -X POST -H "Content-Type: application/json" -d \'{{"refreshToken": "{refresh_token}"}}\' -H "Authorization: {data["accessToken"]}" http://localhost:8080/api/auth/refreshtoken'

# Print the result
print(curl_command)