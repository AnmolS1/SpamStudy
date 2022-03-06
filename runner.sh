#!/bin/bash

# let user install python if not already there
if [[ ! "$(python3 -V)" =~ "Python 3" ]]; then
    # instructions available on website
    echo "Please install Python (3.9.0 or newer)"
    echo "Instructions available at https://anmols1.github.io/SpamStudy/"
    exit 1
fi

# install pip if they don't already have it
if [[ ! "$(pip3 --version)" =~ "pip 22" ]]; then
    # curl it and run via python
    # all output is piped to a log file
    curl -s https://bootstrap.pypa.io/get-pip.py -o get-pip.py > installation.log
    python3 get-pip.py >> installation.log
fi

# if they don't have selenium or undetected_chromedriver install those
# again output gets piped to a file
if [[ ! "$(pip3 list | grep selenium)" =~ "selenium" ]]; then
    pip3 install selenium >> installation.log
fi
if [[ ! "$(pip3 list | grep undetected-chromedriver)" =~ "undetected-chromedriver" ]]; then
    pip3 install undetected_chromedriver >> installation.log
fi

python3 process.py