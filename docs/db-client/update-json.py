import base64, json, os
from dotenv import load_dotenv
from ibmcloudant.cloudant_v1 import Document, CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

load_dotenv()

db = {}
temp_url = os.environ['DB_URL']
temp_key = os.environ['DB_KEY']
db['URL'] = base64.b64decode(f"{temp_url}{'=' * (4 - len(temp_url) % 4)}").decode('ascii')
db['KEY'] = base64.b64decode(f"{temp_key}{'=' * (4 - len(temp_key) % 4)}").decode('ascii')

authenticator = IAMAuthenticator(db['KEY'])
service = CloudantV1(authenticator=authenticator)
service.set_service_url(db['URL'])

docs = service.post_all_docs(db='information', include_docs=True).get_result()['rows']

data = []
for i in range(len(docs)):
    data.append(docs[i]['doc'])
data = json.dumps(data, indent=4)

with open('data.json', 'w') as json_file:
    json_file.write(data)
    json_file.close()