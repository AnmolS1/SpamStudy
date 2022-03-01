import time, getpass
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By

def sleep(n):
    time.sleep(n)

def run():
	# get username and password from terminal
	username = input("Enter Gmail username: ")
	password = getpass.getpass(prompt="Enter Gmail password: ")
	
	# chrome option list, basically disable all the security stuff
	chrome_options = uc.ChromeOptions()
	chrome_options.add_argument("--disable-extensions")
	chrome_options.add_argument("--disable-popup-blocking")
	chrome_options.add_argument("--profile-directory=Default")
	chrome_options.add_argument("--ignore-certificate-errors")
	chrome_options.add_argument("--disable-plugins-discovery")
	chrome_options.add_argument("user_agent=DN")
	
	# driver instance in chrome
	driver = uc.Chrome(options=chrome_options)
	# go to gmail's sign-in page
	driver.get("https://mail.google.com/mail/u/0/?tab=rm#inbox")
	
	# find the email input box, send the username
	driver.find_element(By.XPATH, '//input[@type="email"]').send_keys(username)
	# click on the 'next' button
	driver.find_element(By.XPATH, '//*[@id="identifierNext"]').click()
	
	# sleep for a bit because login do be takin a hot sec to load
	sleep(5)
	
	# find the password input box, send the password
	driver.find_element(By.XPATH, '//input[@type="password"]').send_keys(password)
	# click on the 'next' button
	driver.find_elements(By.TAG_NAME, 'button')[1].click()
	
	# sleep for a bit again, another hot sec for loading
	sleep(7)
	
	# we gotta hit the down button because the spam tab isn't shown in the
	# upper list
	driver.find_element(By.XPATH, '//span[@role="button"]').click()
	# sleep for 2 seconds bc load time
	sleep(2)
	# boom baby we in da spam box
	spam_inbox = driver.find_element(By.LINK_TEXT, 'Spam')
	spam_inbox.click()
	
	# need lots of sleeping here otherwise google puts up some bs authentication issue
	sleep(5)
	# get the 3rd table of emails (don't ask why bc i don't know) and then get the emails as a list
	email_list = driver.find_elements(By.XPATH, '//table[@role="grid"]')[3].find_elements(By.XPATH, './/tr[@role="row"]')
	# sleep again
	sleep(1)
	
	
	# TEMPORARY CODE, TESTING USAGE IMPLEMENTATION
	# just some stuff to keep track once we get to that step
	user_filtered = 0
	gmail_filtered = 0
	
	# click on the first email, we're just testing here
	email_list[0].click()
	# sleep, even if we're testing, we don't wanna run into any authentication problems
	sleep(1)
	
	# get the list of the headers of each label as well as the list of the paragraphs following those labels
	label_list = driver.find_elements(By.XPATH, '//h2/following-sibling::p')
	heading_list = driver.find_elements(By.XPATH, '//p/preceding-sibling::h2')
	
	# categorization will happen here
	
	
	# sleep another second
	sleep(1)
	# head back to the spam inbox and restart the process
	spam_inbox.click()
 
	
	
	# delete the cookies, can't have our browser out here gaining weight
	driver.delete_all_cookies()
	# temp line for testing, basically just keeps the browser open
	sleep(1000)

# still not sure what this does, but without it we get a multithreading error
if __name__ == "__main__":
	run()