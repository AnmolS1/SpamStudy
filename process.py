import time, getpass, smtplib, ssl, re
from datetime import date
# used to create bot-driven instance of chrome
import undetected_chromedriver as uc
# allows us to choose how to locate elements (XPATH, Tag, etc.)
from selenium.webdriver.common.by import By
# used for rich-text emails
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

# sleep method, makes main code a little more readable
def sleep (n):
	time.sleep (n)

# send an email with the final information we get
def send_email (participant, labels, time_stamps):
	# set port, username, and password
	# 465 is the outgoing SMTP SSL port, allows for safe mailing
	port = 465
	# user/pass for the account to send data to
	username = 'aristohxrl@gmail.com'
	password = '$16qm9NM$c04G'
	
	# 'alternative' allows message to be viewed either in html or plain text
	message = MIMEMultipart('alternative')
	# set up the metadata
	message['Subject'] = 'Information For SpamStudy'
	message['From'] = username
	message['To'] = username
	
	# make the main body of the message
	text = participant[:participant.find("@")] + '\n'
	for i in range(len(labels)):
		text = text + labels[i] + ' || ' + time_stamps[i] + '\n'
	
	message.attach(MIMEText(text, 'plain'))
	
	# send the message
	context = ssl.create_default_context()
	with smtplib.SMTP_SSL('smtp.gmail.com', port, context=context) as server:
		server.login(username, password)
		server.sendmail(username, username, message.as_string())

def run():
	# get username and password from terminal
	username = input('Enter Gmail username: ')
	password = getpass.getpass(prompt='Enter Gmail password: ')
	print('Chrome may take a minute or two to open, please be patient :)')
	
	# chrome option list, basically disable all the security stuff
	# create ChromeOptions object so we can use its methods to set ChromeDriver capabilities
	chrome_options = uc.ChromeOptions()
	# make sure chrome extensions won't cause problems during program run
	chrome_options.add_argument('--disable-extensions')
	# pop-ups can interfere with the inner html of a webpage so disable them
	chrome_options.add_argument('--disable-popup-blocking')
	# use whatever default profile directory there is
	chrome_options.add_argument('--profile-directory=Default')
	# any certificate issues will cause a new tab with a warning which we don't wanan deal with
	chrome_options.add_argument('--ignore-certificate-errors')
	# plugins makes the website open to security issues, so disable it for login
	chrome_options.add_argument('--disable-plugins-discovery')
	# user agent: a computer program representing a person. Ex. browser in a Web
	# DN: 
	chrome_options.add_argument('user_agent=DN')
	
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
	# boom baby we in da spam box
	driver.get('https://mail.google.com/mail/u/0/#spam')
	
	# need lots of sleeping here otherwise google puts up an authentication issue
	sleep (5)
	# get the 3rd table of emails (don't ask why bc i don't know) and then get the emails as a list
	email_list = driver.find_elements(By.XPATH, '//table[@role="grid"]')[1].find_elements(By.XPATH, './/tr[@role="row"]')
	# arrays with all emails' information
	labels = []
	time_stamps = []
	
	# in case the user has no spam emails, we'll just send the blank array in an email and call it in
	# it should still have some ramifications on how students interact with spam, and if not
	# we can always remove it from the spreadsheet very easily
	if len(email_list) == 0:
		send_email(username, labels, time_stamps)
		driver.delete_all_cookies()
		driver.quit()
	# sleep again
	sleep (1)
	
	# click on the first email, from here we can just click the next button all the way through
	email_list[0].click()
	# break when we hit the end
	while True:
		sleep (3)
		
  		# get the label and time stamp of the email
		labels.append(driver.find_element(By.XPATH, '//h2/following-sibling::p').text)
		# we had to be incredibly specific here with XPATH b/c google doesn't
		# make the time stamp stand out all that much
		time_stamp = re.sub('\(.*\)', '', driver.find_element(By.XPATH, '//table/tbody/tr/td[2]/div/span[2]').text)
		
  		# reformat dates for spam emails that were sent in the last 24 hours
		if not ',' in time_stamp:
			today = date.today()
			time_stamp = today.strftime('%a, %b %-d, ') + time_stamp.strip()
		time_stamps.append(time_stamp)
		
  		# sleepity sleep
		sleep (2)
		
		# get the button to the next email, if it's disabled quit out of here otherwise continue
		next_email = driver.find_elements(By.XPATH, '//div[@role="button" and @aria-label="Older"]')[1]
		if next_email.get_attribute('aria-disabled') == 'true':
			break
		else:
			next_email.click()
	
	# delete the cookies, there's a chance the browser won't let us login again otherwise
	driver.delete_all_cookies()
	driver.quit()
	
	send_email(username, labels, time_stamps)
 
# not sure what this does, but without it we get a multithreading error
if __name__ == '__main__':
	run()
