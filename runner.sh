#!/bin/bash

# change this to not before pushing
if [[ "$(python3 -V)" =~ "Python 3" ]]; then
    cd ~
    if [[ -e "homebrew" ]]; then
        rm -rf homebrew
    fi
    mkdir homebrew
    git clone https://github.com/Homebrew/brew homebrew
    eval "$(homebrew/bin/brew shellenv)"
    brew update --force --quiet
fi