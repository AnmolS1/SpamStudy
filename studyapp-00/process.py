import getpass, re
from datetime import date
# used to create bot-driven instance of chrome
import undetected_chromedriver as uc
# allows us to choose how to locate elements (XPATH, Tag, etc.)
from selenium.webdriver.common.by import By

# other file imports
from upload_doc import *
from create_chrome_options import *
from create_vars import *
from sleep import *
from notification import *

def run():
	db = create_vars()
	# get username and password from terminal
	username = input('Enter Gmail username: ')
	password = getpass.getpass(prompt='Enter Gmail password: ')
	notification("Please do not click off Chrome, it may take a minute to open so please be patient.")
	
	# driver instance in chrome
	driver = None
	try:
		driver = uc.Chrome(options=create_chrome_options(),version_main=100)
	except:
		driver = uc.Chrome(options=create_chrome_options(),version_main=98)
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
	
	inbox_url = driver.current_url
	displayed = False
	while 'challenge' in inbox_url:
		if not displayed:
			notification("Please resolve the authentication so we may continue")
		displayed = True
		inbox_url = driver.current_url
		sleep (5)
	
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
	upload_these(username, spam_emails, db)

# start from a synchronous thread
if __name__ == '__main__':
	run()
