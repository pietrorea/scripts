#!/bin/bash

# Fist, run `setup.sh` as the root user.
# This sets up SSH access for the  admin user and git user.
# Then run this script as the git user.

REPO_NAME=REPO_NAME
REPO_PATH=~/git/"${REPO_NAME}".git

mkdir -p "${REPO_PATH}"
cd "${REPO_PATH}"
git init --bare