import time, getpass, smtplib, ssl, re, os
from datetime import date
# used to create bot-driven instance of chrome
import undetected_chromedriver as uc
# allows us to choose how to locate elements (XPATH, Tag, etc.)
from selenium.webdriver.common.by import By
# to upload to our database
from ibmcloudant.cloudant_v1 import Document, CloudantV1
from ibm_cloud_sdk_core.authenticators import IAMAuthenticator

# retrieve environment variables
db = {}
def create_vars():
	from dotenv import load_dotenv
	import base64
	
	load_dotenv()
	
	temp_url = os.environ['DB_URL']
	temp_key = os.environ['DB_KEY']
	db['URL'] = base64.b64decode(f"{temp_url}{'=' * (4 - len(temp_url) % 4)}").decode('ascii')
	db['KEY'] = base64.b64decode(f"{temp_key}{'=' * (4 - len(temp_key) % 4)}").decode('ascii')

# sleep method, makes main code a little more readable
def sleep (n):
	time.sleep (n)

# upload to database
def upload_these(user, spam_emails):
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

def run():
	create_vars()
	# get username and password from terminal
	username = input('Enter Gmail username: ')
	password = getpass.getpass(prompt='Enter Gmail password: ')
	print('\nWhen Chrome opens, please do not click away\nAlso, Chrome may take a minute or two to open, please be patient :)')
	
	# chrome option list, basically disable all the security stuff
	# create ChromeOptions object so we can use its methods to set ChromeDriver capabilities
	chrome_options = uc.ChromeOptions()
	# make sure chrome extensions won't cause problems during program run
	chrome_options.add_argument('--disable-extensions')
	# pop-ups can interfere with the inner html of a webpage so disable them
	chrome_options.add_argument('--disable-popup-blocking')
	# use whatever default profile directory there is
	chrome_options.add_argument('--profile-directory=Default')
	# any certificate issues will cause a new tab with a warning which we don't wanna deal with
	chrome_options.add_argument('--ignore-certificate-errors')
	# plugins makes the website open to security issues, so disable it for login
	chrome_options.add_argument('--disable-plugins-discovery')
	
	# driver instance in chrome
	driver = uc.Chrome(options=chrome_options,version_main=98)
	# go to gmail's sign-in page
	driver.get('https://mail.google.com/mail/u/0/?tab=rm#inbox')
	
	# find the email input box, send the username
	driver.find_element(By.XPATH, '//input[@type="email"]').send_keys(username)
	# click on the 'next' button
	driver.find_element(By.XPATH, '//*[@id="identifierNext"]').click()
	
	# sleep for a bit because login do be takin a hot sec to load
	sleep (5)
	
	# find the password input box, send the password
	driver.find_element(By.XPATH, '//input[@type="password"]').send_keys(password)
	# click on the 'next' button
	driver.find_elements(By.TAG_NAME, 'button')[1].click()
	
	# sleep for a bit again, another hot sec for loading
	sleep (7)
	# go to spam box
	driver.get('https://mail.google.com/mail/u/0/#spam')
	
	# need lots of sleeping here otherwise google puts up some bs authentication issue
	sleep (5)
	# get the 3rd table of emails and then get the emails as a list
	email_list = driver.find_elements(By.XPATH, '//table[@role="grid"]')[1].find_elements(By.XPATH, './/tr[@role="row"]')
	# array with all emails' information
	spam_emails = []
	
	# in case the user has no spam emails, we'll just send a blank array and call it in
	# it should still have some ramifications on how students interact with spam, and if not
	# we can always remove it from the database very easily
	if len(email_list) == 0:
		upload_these(spam_emails)
		driver.delete_all_cookies()
		driver.quit()
	# sleep again
	sleep (1)
	
	# click on the first email, from here we can just click the next button all the way through
	email_list[0].click()
	# break when we hit the end
	while True:
		sleep (3)
		
		# get information from the email
		email_from = driver.find_element(By.XPATH, '//td/h3/span/span').get_attribute('email')
		email_to = username
		email_label = driver.find_element(By.XPATH, '//h2/following-sibling::p').text
		email_category = 'user-filtered' if 'You reported' in email_label or 'You have blocked' in email_label else 'gmail-filtered'
		
		# format the time for consistency
		email_time = re.sub('\(.*\)', '', driver.find_element(By.XPATH, '//table/tbody/tr/td[2]/div/span[2]').text)
		if not ',' in email_time:
			today = date.today()
			email_time = today.strftime('%a, %b %-d, ') + email_time.strip()

		# turned out a bit weird, basically uses the fact that
		# the label's position is constant in relation to the content
		email_content = driver.find_element(By.XPATH, '//h2/following-sibling::p/../../../../following-sibling::div').get_attribute('innerHTML')
		# append information about this email to the list
		spam_emails.append([email_category, email_from, email_to, email_time, email_label, email_content])

		# sleepity sleep
		sleep (2)
		
		# get the button to the next email, if it's disabled quit out of here otherwise continue
		next_email = driver.find_elements(By.XPATH, '//div[@role="button" and @aria-label="Older"]')[1]
		if next_email.get_attribute('aria-disabled') == 'true':
			break
		else:
			next_email.click()
	
	# there's a chance the browser won't let us login again if we don't do this
	driver.delete_all_cookies()
	driver.quit()
	
	# run uploader
	upload_these(username, spam_emails)

# start from a synchronous thread
if __name__ == '__main__':
	run()