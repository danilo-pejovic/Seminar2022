import requests

url = "http://localhost:8000/user/user/?is_provider=true"

payload = {}
headers = {
  'Cookie': 'csrftoken=lrW0A5Us0r1MAFrIEVvUB79GaOYhgTVw'
}

response = requests.request("GET", url, headers=headers, data=payload)

print(response.json())