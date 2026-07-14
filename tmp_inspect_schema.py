import json, urllib.request
with urllib.request.urlopen('http://localhost:8000/openapi.json', timeout=10) as r:
    spec = json.load(r)
for name in ['HealthResponse','UploadResponse','StatusResponse','ResultResponse']:
    print(f'=== {name} ===')
    print(json.dumps(spec['components']['schemas'].get(name), indent=2))
    print()
