## This script assumes you already set up your SSH access, firewall, etc. 
## If not, run /ubuntu/setup.sh script first.
##
## Usage:
## sudo bash -c "$(curl -sS https://raw.githubusercontent.com/pietrorea/scripts/master/ubuntu/install-wordpress.sh)"
##

#!/bin/bash
set -e

if [[ "$EUID" -ne 0 ]]; then
  echo "Error: Please run as root with sudo."
  exit
fi

WP_DB_NAME=wordpress
WP_DB_ADMIN_USER=wpadmin

echo "HOSTNAME:"
read HOSTNAME
echo

echo "MySQL password for root user:"
echo "> 8 chars, including numeric, mixed case, and special characters"
read -s MYSQL_ROOT_PASSWORD
echo

echo "MySQL password for wpadmin user:"
echo "> 8 chars, including numeric, mixed case, and special characters"
read -s MYSQL_WP_ADMIN_USER_PASSWORD
echo

## Ubuntu updates and dependencies

apt-get update
apt-get -y upgrade
apt-get -y autoremove

## Wordpress dependencies (LEMP stack)

apt-get install -y \
nginx \
mysql-server \
php-curl \
php-mysql \
php-gd \
php-intl \
php-mbstring \
php-soap \
php-xml \
php-xmlrpc \
php-zip \
php-fpm

# nginx setup

cat > /etc/nginx/sites-available/$HOSTNAME <<EOF
resolver 8.8.8.8 8.8.4.4;
server {
  listen 80;
  root /var/www/html/wordpress/blog;
  index  index.php index.html index.htm;
  server_name $HOSTNAME;
  error_log /var/log/nginx/error.log;
  access_log /var/log/nginx/access.log;
  client_max_body_size 100M;
  location / {
    try_files \$uri \$uri/ /index.php?\$args;
  }
  location ~ \.php$ {
    include snippets/fastcgi-php.conf;
    fastcgi_pass unix:/run/php/php7.4-fpm.sock;
    fastcgi_param   SCRIPT_FILENAME \$document_root\$fastcgi_script_name;
  }
}
EOF

rm -f /etc/nginx/sites-enabled/default
ln -sf /etc/nginx/sites-available/$HOSTNAME /etc/nginx/sites-enabled/
service nginx reload

## MySQL setup

mysql -u root <<EOF
SET PASSWORD FOR root@localhost = '${ROOT_PASSWORD}';
FLUSH PRIVILEGES;
EOF

mysql_secure_installation -u root --password="${MYSQL_ROOT_PASSWORD}" --use-default

mysql -u root --password="${MYSQL_ROOT_PASSWORD}" <<EOF
CREATE DATABASE IF NOT EXISTS ${WP_DB_NAME};
CREATE USER '${WP_DB_ADMIN_USER}'@'localhost' IDENTIFIED BY '${MYSQL_WP_ADMIN_USER_PASSWORD}';
GRANT ALL ON ${WP_DB_NAME}.* TO '${WP_DB_ADMIN_USER}'@'localhost'
EOF

## Install wordpress

sudo mkdir -p /var/www/html/wordpress/src
sudo mkdir -p /var/www/html/wordpress/blog
cd /var/www/html/wordpress/src
sudo wget https://wordpress.org/latest.tar.gz
sudo tar -xvf latest.tar.gz
sudo mv latest.tar.gz wordpress-`date "+%Y-%m-%d"`.tar.gz
sudo mv wordpress/* ../blog/
sudo chown -R www-data:www-data /var/www/html/wordpress/blog

## Set up wp-config.php (current as of Wordpress 5.8)

WP_SECURE_SALTS="$(curl -s https://api.wordpress.org/secret-key/1.1/salt/)"

WP_CONFIG_FILE=/var/www/html/wordpress/blog/wp-config.php
cat > '${WP_CONFIG_FILE}' <<EOF
<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', '${WP_DB_NAME}' );

/** MySQL database username */
define( 'DB_USER', '${WP_DB_ADMIN_USER}' );

/** MySQL database password */
define( 'DB_PASSWORD', '${MYSQL_WP_ADMIN_USER_PASSWORD}' );

/** MySQL hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
${WP_SECURE_SALTS}

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
EOF

sudo chown -R www-data:www-data '${WP_CONFIG_FILE}'