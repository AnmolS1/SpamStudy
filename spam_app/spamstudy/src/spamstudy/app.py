"""
Analyze spam email in your inbox
"""
import toga, time, smtplib, ssl, sys
from toga.style import Pack
from toga.fonts import SANS_SERIF
from toga.style.pack import COLUMN, ROW
import undetected_chromedriver as uc
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from selenium.webdriver.common.by import By

def sleep(n):
    time.sleep(n)

# send an email with the final information we get
def send_email (participant, user_filtered, gmail_filtered):
    # set port, username, and password
    port = 465
    username = 'spamstudyinformation@gmail.com'
    password = 'SpamStudyInformation_;)'
    
    # create message metadata
    message = MIMEMultipart('alternative')
    message['Subject'] = 'Information For SpamStudy'
    message['From'] = username
    message['To'] = username
    
    # make the main body of the message
    text = participant[:participant.find("@")] + '\n' + str(user_filtered) + '\n' + str(gmail_filtered)
    message.attach(MIMEText(text, 'plain'))
    
    # send the message
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL('smtp.gmail.com', port, context=context) as server:
        server.login(username, password)
        server.sendmail(username, username, message.as_string())

class SpamStudy(toga.App):
    def run_process(self, widget):
        # get username and password from user input
        username = self.username.value
        password = self.password.value
        
        # chrome option list, basically disable all the security stuff
        chrome_options = uc.ChromeOptions()
        chrome_options.add_argument("--disable-extensions")
        chrome_options.add_argument("--disable-popup-blocking")
        chrome_options.add_argument("--profile-directory=Default")
        chrome_options.add_argument("--ignore-certificate-errors")
        chrome_options.add_argument("--disable-plugins-discovery")
        chrome_options.add_argument("user_agent=DN")
        
        # driver instance in chrome
        driver = uc.Chrome(options=chrome_options,version_main=98)
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
        # boom baby we in da spam box
        driver.get("https://mail.google.com/mail/u/0/#spam")
        
        # need lots of sleeping here otherwise google puts up some bs authentication issue
        sleep (5)
        # get the 3rd table of emails (don't ask why bc i don't know) and then get the emails as a list
        email_list = driver.find_elements(By.XPATH, '//table[@role="grid"]')[1].find_elements(By.XPATH, './/tr[@role="row"]')
        # in case the user has no spam emails, we'll just send two zeros in an email and call it a day
        # it should still have some ramifications on how students interact with spam, and if not
        # we can always remove it from the database very easily
        if len(email_list) == 0:
            send_email(username, 0, 0)
            driver.delete_all_cookies()
            driver.quit()
        # sleep again
        sleep (1)
        
        # nums to keep track of categories
        user_filtered = 0
        gmail_filtered = 0
        
        # click on the first email, from here we can just click the next button all the way through
        email_list[0].click()
        # break when we hit the end
        while True:
            sleep (3)
            
            # get the label of the warning label in a spam email
            label = driver.find_element(By.XPATH, '//h2/following-sibling::p')
            
            # if the header has dangerous in it, it's the version that says "This email is dangerous"
            # and that it was filtered by google's thingy
            # otherwise, if it has the words "you reported" in it, it'll obviously be reported by the user
            if "You reported" in label.text:
                user_filtered = user_filtered + 1
            else:
                gmail_filtered = gmail_filtered + 1

            sleep (2)
            
            # get the button to the next email, if it's disabled quit out of here otherwise continue
            next_email = driver.find_elements(By.XPATH, '//div[@role="button" and @aria-label="Older"]')[1]
            if next_email.get_attribute('aria-disabled') == "true":
                break
            else:
                next_email.click()
           
        # delete the cookies, can't have our browser out here gaining weight
        driver.delete_all_cookies()
        driver.quit()
        
        # send the email
        send_email(username, user_filtered, gmail_filtered)
        
        # sleep for a few seconds and then close
        time.sleep(5)
        self.main_window.close()
    
    def startup (self):
        main_box = toga.Box(style=Pack(direction=COLUMN))
        
        user_label = toga.Label('Enter your username: ', style=Pack(padding=(0, 5)))
        self.username = toga.TextInput(style=Pack(flex=1))
        
        user_box = toga.Box(style=Pack(direction=ROW, padding_top=150, padding_left=90, padding_right=90))
        user_box.add(user_label)
        user_box.add(self.username)
        
        pass_label = toga.Label('Enter your password: ', style=Pack(padding=(0, 5)))
        self.password = toga.PasswordInput(style=Pack(flex=1))
        
        pass_box = toga.Box(style=Pack(direction=ROW, padding_top=50, padding_left=90, padding_right=90))
        pass_box.add(pass_label)
        pass_box.add(self.password)
        
        submit_B = toga.Button('Submit', on_press=self.run_process, style=Pack(padding_top=50, padding_left=265, padding_right=265))
        
        main_box.add(user_box)
        main_box.add(pass_box)
        main_box.add(submit_B)

        self.main_window = toga.MainWindow(title=self.formal_name)
        self.main_window.content = main_box
        self.main_window.show()


def main():
    return SpamStudy()
