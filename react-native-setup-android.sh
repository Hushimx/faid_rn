#!/bin/bash

# exit when any command fails
set -e

COMMAND=$1

function clean() {
    printf "🧹 Cleaning.. \n"
    rm -rf  yarn.lock node_modules
    printf "✅ Cleaning finished! \n"
}

function install_dependencies() {
    printf "👨‍💻 Installing dependencies.. \n"
    yarn
    npx pod-install
    printf "✅ All installed correctly"
}

function setup_environment() {
    clean
    install_dependencies
}

case $COMMAND in
clean) clean ;;
install) install_dependencies ;;
setup) setup_environment ;;
*) echo "❌ Command not found" ;;
esac