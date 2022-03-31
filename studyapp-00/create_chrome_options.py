import undetected_chromedriver as uc

# create chrome options
def create_chrome_options():
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
	return chrome_options