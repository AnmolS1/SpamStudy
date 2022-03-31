import os, sys

# system notification, works on all devices (untested on unix)
def notification(message):
	if sys.platform == "darwin":
		os.system('osascript -e \' display notification "' + message + '" with title "SpamStudy" sound name "Submarine"\'')
	elif sys.platform == "win32":
		call(['notify-send', 'SpamStudy', message])