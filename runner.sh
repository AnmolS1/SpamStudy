#!/bin/bash

# let user install python if not already there
cd /Applications
while [[ !(-e "Python 3.9") ]]
do
    # instructions available on website
    echo "Please install Python"
    echo "Instructions for the python installer are available at https://anmols1.github.io/SpamStudy/"
    # download file
    curl -s https://www.python.org/ftp/python/3.9.10/python-3.9.10-macos11.pkg -o python-3.9.10.pkg
    open python-3.9.10.pkg
    
    read -n 1 -s -r -p "After completing the installation, press any key to continue | "; echo
done

# install certificates for python
cd /Applications
cd "Python 3.9"
bash "Install Certificates.command" > /dev/null 2>&1 1>/dev/null
cd ~

# install pip even if the user already has it bc we want to avoid
# any warning messages that come with the weird version check that pip does
# curl the get-pip file and run via python, all output is piped to a log file
curl -s https://bootstrap.pypa.io/get-pip.py -o get-pip.py >> installation.log
python3 get-pip.py >> installation.log
# cleanup
rm get-pip.py

# if they don't have the required packages install them
# again output gets piped to a file
if [[ ! "$(pip3 list | grep selenium)" =~ "selenium" ]]; then
    pip3 --disable-pip-version-check install selenium >> installation.log
fi
if [[ ! "$(pip3 list | grep undetected-chromedriver)" =~ "undetected-chromedriver" ]]; then
    pip3 --disable-pip-version-check install undetected_chromedriver >> installation.log
fi
if [[ ! "$(pip3 list | grep ibmcloudant)" =~ "ibmcloudant" ]]; then
    pip3 --disable-pip-version-check install ibmcloudant >> installation.log
fi
if [[ ! "$(pip3 list | grep python-dotenv)" =~ "python-dotenv" ]]; then
    pip3 --disable-pip-version-check install python-dotenv >> installation.log
fi

# curl the file so that we download in the home directory
# .command files run from the home directory so this is the only way
# to ensure that we have the file in the right place
curl -s https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/process.py -o process.py
curl -s https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/.env -o .env
# run the file
python3 process.py
# get rid of the process file
rm process.py
rm .env
rm installation.log