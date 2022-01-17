#!/bin/bash
set -e

# Usage
# ./ssl.sh $HOSTNAME
# e.g. ./ssl.sh mydomain.com
#
# LetsEncrypt will get SSL cert for $HOSTNAME
# LetsEncryypt will also modify the nginx config

HOSTNAME=$1

if [[ "$EUID" -ne 0 ]]; then
  echo "Error: Please run as root with sudo."
  exit
fi

if [ -z "$HOSTNAME" ]; then
  echo "Error: Pass in the hostname as the first parameter."
  exit
fi

snap install core
snap refresh core
apt-get remove certbot
snap install --classic certbot
ln -s /snap/bin/certbot /usr/bin/certbot
certbot certonly --nginx -d $HOSTNAME