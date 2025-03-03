export const examples = (
  <pre style={{ fontSize: '12px' }}>{`import requests

# Set API key and base URL
api_key = "KEY"
url_base = "http://<STRELKA_UI_ADDRESS>:<STRELKA_UI_PORT/api/strelka"

# Define headers
headers = {"X-API-KEY": api_key,
           "Content-Type": "application/json",
           "Accept": "application/json"
           }

# GET: Get list of scans from the Strelka UI API
url_route = "/scans?page=1&per_page=10"
response = requests.get(url_base + url_route, headers=headers)

# Check response status code
if response.status_code == 200:
    # Print response data
    print(response.text)
else:
    # Print error message
    print(f"Error: {response.status_code} - {response.text}")


# POST: Upload File to Strelka UI API
url_route = "/upload"
filename = "test_file.txt"
description = "This is a test file"

headers = {"X-API-KEY": api_key,
           }

with open(filename, "rb") as f:
    file_data = f.read()

files = [("file", (filename, file_data))]
data = {"description": description, "password": ""}

response = requests.post(url_base + url_route, files=files, data=data, headers=headers)

# Check response status code
if response.status_code == 200:
    # Print response data
    print(response.text)
else:
    # Print error message
    print(f"Error: {response.status_code} - {response.text}")
`}</pre>
)
