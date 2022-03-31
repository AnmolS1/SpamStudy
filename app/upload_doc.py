from ibmcloudant.cloudant_v1 import Document, CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

# upload to database
def upload_these(user, spam_emails, db):
	# authenticate the connection
	authenticator = IAMAuthenticator(db['KEY'])
	service = CloudantV1(authenticator=authenticator)
	service.set_service_url(db['URL'])
	
	# generate JSON based on the array we've set up in run and get counts
	content = []
	user_filtered = 0
	for email in spam_emails:
		user_filtered = user_filtered + (1 if 'user-filtered' == email[0] else 0)
		content.append({
			"category": email[0],    # category of email ('user-filtered' or 'gmail-filtered')
			"from": email[1],        # who the email was from
			"to": email[2],          # who the email is to (might seem redundant but will be useful in frontend)
			"time_stamp": email[3],  # time stamp of email
			"label": email[4],       # label associated with the email
			"content": email[5]      # html content of the email (again useful in frontend)
		})
	# life hack: subtract to get gmail number
	gmail_filtered = len(content) - user_filtered
	
	# create the document to upload
	doc = Document(
		id=user[:user.index('@')],
		user_filtered=user_filtered,
		gmail_filtered=gmail_filtered,
		spam=content)
	
	# 'post' the document to our database
	response = service.post_document(db='information', document=doc).get_result()