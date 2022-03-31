#!/bin/bash

# inform the user that more space is required to install something
clearSpace() {
    UNIT=$1                 # unit of space we're looking at ("-m", "-k", "-g")
    REQUIRED=$2             # amount of space that needs to be free in the unit given
    READABLE="${UNIT:1:1}B" # take the unit and force human readable format
    # get amount of clear space in the disk
    SPACE=`df $UNIT | sed -n '2 p' | awk '{print $4}'`
    # loop until the user has cleared enough space to install whatever we're installing
    while [[ $REQUIRED -ge $SPACE ]]; do
        read -n 1 -s -r -p "Please clear approximately $REQUIRED $UNIT of space, then press any key to continue | "; echo
        SPACE=`df $UNIT | sed -n '2 p' | awk '{print $4}'`
    done
}

# let user install python if not already there
cd /Applications
while [[ !(-e "Python 3.9") ]]; do
    # user needs to clear 115 MB of space
    clearSpace "-m" 115
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
    clearSpace "-k" 11407.931
    pip3 --disable-pip-version-check install selenium >> installation.log
fi
if [[ ! "$(pip3 list | grep undetected-chromedriver)" =~ "undetected-chromedriver" ]]; then
    cleaSpace "-k" 16646.847
    pip3 --disable-pip-version-check install undetected_chromedriver >> installation.log
fi
if [[ ! "$(pip3 list | grep ibmcloudant)" =~ "ibmcloudant" ]]; then
    clearSpace "-k" 1400.356
    pip3 --disable-pip-version-check install ibmcloudant >> installation.log
fi
if [[ ! "$(pip3 list | grep python-dotenv)" =~ "python-dotenv" ]]; then
    clearSpace "-k" 79.236
    pip3 --disable-pip-version-check install python-dotenv >> installation.log
fi

# curl the zip, unzip to a folder
curl -s https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/app.zip -o studyapp-00.zip
unzip studyapp-00.zip
cd studyapp-00

# run the file
python3 process.py

# delete all the files we've downloaded / created
cd ../
rm -r studyapp-00
rm studyapp-00.zip
rm -r __MACOSX
rm installation.log