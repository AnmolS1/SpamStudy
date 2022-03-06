#!/bin/bash

# install homebrew if it doesn't exist
if [ ! "$(command -v brew)" ]; then
    if [[ -e "homebrew" ]]; then
        rm -rf homebrew
    fi
    mkdir homebrew
    git clone https://github.com/Homebrew/brew homebrew
    eval "$(homebrew/bin/brew shellenv)" >> installation.log
    brew update --force --update >> installation.log
fi

if [ ! "$(command -v xterm)" ]; then
    brew install xterm >> installation.log
fi

# let user install python if not already there
if [[ ! "$(python3 -V)" =~ "Python 3" ]]; then
    # instructions available on website
    echo "Instructions for this installer are available at https://anmols1.github.io/SpamStudy/"
    # download file
    curl -s https://www.python.org/ftp/python/3.9.10/python-3.9.10-macos11.pkg -o python-3.9.10.pkg
    open python-3.9.10.pkg
    echo "After completing the installation, please run this file again"
    exit 1
fi

# install pip if they don't already have it
if [[ ! "$(pip3 --version)" =~ "pip 22" ]]; then
    # curl it and run via python
    # all output is piped to a log file
    curl -s https://bootstrap.pypa.io/get-pip.py -o get-pip.py > installation.log
    python3 get-pip.py >> installation.log
    # cleanup
    rm get-pip.py
fi

# if they don't have selenium or undetected_chromedriver install those
# again output gets piped to a file
if [[ ! "$(pip3 list | grep selenium)" =~ "selenium" ]]; then
    pip3 install selenium >> installation.log
fi
if [[ ! "$(pip3 list | grep undetected-chromedriver)" =~ "undetected-chromedriver" ]]; then
    pip3 install undetected_chromedriver >> installation.log
fi

curl -s https://raw.githubusercontent.com/AnmolS1/SpamStudy/main/process.py -o process.py
xterm -e "python3 process.py; rm process.py; bash"