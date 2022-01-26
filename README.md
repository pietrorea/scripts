# scripts
Personal scripts

## ubuntu

### setup.sh

- Configures a new VPS running Ubuntu 20.04.
- Usage: `sudo bash -c "$(curl -sS https://raw.githubusercontent.com/pietrorea/scripts/master/ubuntu/setup.sh)"`

- Top-level description of steps:
  - Sets the hostname based on input from the terminal
  - Sets up a password-less admin user. Also sets up an admin group for it.
  - Sets up SSH access for the admin user using your SSH key-pair. There's a few lines of config here related to AWS Lightsail that might not be relevant to you.
  - Updates Ubuntu deps.

### install-wordpress.sh (tested with Wordpress 5.8)

- Installs Wordpress on a LEMP stack.
- Usage: `sudo bash -c "$(curl -sS https://raw.githubusercontent.com/pietrorea/scripts/master/ubuntu/install-wordpress.sh)"`

- Top-level description of steps:
  - Downloads & installs nginx, mysql, php
  - Configures nginx to serve Wordpress over HTTP/port 80.
  - Sets up the Wordpress database, the Wordpress admin db user, runs `mysql_secure_installation`.
  - Downloads and installs the latest Wordpress
  - Sets up `wp-config.php` with the credentials form previous steps. Requests and saves salts from `https://api.wordpress.org/secret-key/1.1/salt/`.

## letsencrypt

- Runs LetsEncrypt's `certbot` and requests an SSL certificate using a $HOSTNAME that you pass in.
## xcode
- Remove the Derived Data folder.