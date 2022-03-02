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
	sleep (5)
	
	# find the password input box, send the password
	driver.find_element(By.XPATH, '//input[@type="password"]').send_keys(password)
	# click on the 'next' button
	driver.find_elements(By.TAG_NAME, 'button')[1].click()
	
	# sleep for a bit again, another hot sec for loading
	sleep (7)
	
	# we gotta hit the down button because the spam tab isn't shown in the
	# upper list
	driver.find_element(By.XPATH, '//span[@role="button"]').click()
	# sleep for 2 seconds bc load time
	sleep (2)
	# boom baby we in da spam box
	spam_inbox = driver.find_element(By.LINK_TEXT, 'Spam')
	spam_inbox.click()
	
	# need lots of sleeping here otherwise google puts up some bs authentication issue
	sleep (5)
	# get the 3rd table of emails (don't ask why bc i don't know) and then get the emails as a list
	email_list = driver.find_elements(By.XPATH, '//table[@role="grid"]')[3].find_elements(By.XPATH, './/tr[@role="row"]')
	if len(email_list) == 0:
		print("FIGURE OUT WHAT TO DO HERE")
		driver.delete_all_cookies()
		driver.quit()
		# add 0s to the database
	# sleep again
	sleep (1)
	
	user_filtered = 0
	gmail_filtered = 0
	
	email_list[0].click()
	while True:
		sleep (3)

		label = driver.find_element(By.XPATH, '//h2/following-sibling::p')
		heading = driver.find_element(By.XPATH, '//p/preceding-sibling::h2')
		if "dangerous" in heading.text:
			gmail_filtered = gmail_filtered + 1
		else:
			if "You reported" in label.text:
				user_filtered = user_filtered + 1
			else:
				gmail_filtered = gmail_filtered + 1

		sleep (2)
		
		el = driver.find_elements(By.XPATH, '//div[@role="button" and @aria-label="Older"]')[2]
		if el.get_attribute('aria-disabled') == "true":
			break
		else:
			el.click()
	
	print(" user filtered: " + str(user_filtered) + " email" + ("s" if user_filtered != 1 else ""))
	print("gmail filtered: " + str(gmail_filtered) + " email" + ("s" if gmail_filtered != 1 else ""))
 
	# delete the cookies, can't have our browser out here gaining weight
	driver.delete_all_cookies()
	driver.quit()
	# temp line for testing, basically just keeps the browser open
	sleep(1000)

# still not sure what this does, but without it we get a multithreading error
if __name__ == "__main__":
	run()