import time, getpass
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By

def run():
	# get username and password from terminal
	username = input("Enter Gmail username: ")
	password = getpass.getpass(prompt="Enter Gmail password: ")
	
	# chrome option list
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
	driver.find_element(By.XPATH, '//input[@type ="email"]').send_keys(username)
	# click on the 'next' button
	driver.find_element(By.XPATH, '//*[@id ="identifierNext"]').click()
	
	# sleep for a bit because login do be takin a hot sec to load
	time.sleep(10)
	
	# find the password input box, send the password
	driver.find_element(By.XPATH, '//input[@type ="password"]').send_keys(password)
	# click on the 'next' button
	driver.find_elements(By.TAG_NAME, 'button')[1].click()
	
	# sleep for a bit again, another hot sec for loading
	time.sleep(10)
	
	# we gotta hit the down button because the spam tab isn't shown in the
	# upper list
	driver.find_element(By.XPATH, '//span[@role ="button"]').click()
	# sleep for 1 second bc load time
	time.sleep(1)
	# boom baby we in da spam box
	driver.find_element(By.LINK_TEXT, 'Spam').click()
	
	
	
	# delete the cookies, can't have our browser out here gaining weight
	driver.delete_all_cookies()
	# temp line for testing, basically just keeps the browser open
	time.sleep(1000)

# still not sure what this does, but without it we get a multithreading error
if __name__ == "__main__":
	run()