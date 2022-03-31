from dotenv import load_dotenv
import base64, os

def create_vars():
	db = {}
	
	load_dotenv()
	
	temp_url = os.environ['DB_URL']
	temp_key = os.environ['DB_KEY']
	db['URL'] = base64.b64decode(f"{temp_url}{'=' * (4 - len(temp_url) % 4)}").decode('ascii')
	db['KEY'] = base64.b64decode(f"{temp_key}{'=' * (4 - len(temp_key) % 4)}").decode('ascii')
	
	return db