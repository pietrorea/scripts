## Updated for Ubuntu 24.04 LTS

## Usage:
## sudo bash -c "$(curl -sS https://raw.githubusercontent.com/pietrorea/scripts/master/ubuntu/setup.sh)"

#!/bin/bash
set -e

if [[ "$EUID" -ne 0 ]]; then
  echo "Error: Please run as root with sudo."
  exit
fi

echo "HOSTNAME:"
read HOSTNAME
echo

echo "Admin SSH public key:"
read SSH_PUBLIC_KEY
echo

echo "Admin username:"
read ADMIN_USERNAME
echo

echo "Admin group name:"
read ADMIN_GROUP_NAME
echo

echo "Project name (used for sudoers.d file):"
read PROJECT_NAME
echo


# Validate PROJECT_NAME so sudoers.d parsing can succeed
if [[ "$PROJECT_NAME" =~ [^a-zA-Z0-9_-] ]]; then
  echo "Error: Project name can only contain letters, numbers, hyphens (-), and underscores (_)."
  echo "Avoid periods (.), slashes (/), spaces, and other special characters."
  exit 1
fi
echo

echo "$HOSTNAME" > /etc/hostname
hostname -F /etc/hostname

# Add admin user (no password access)

useradd -s /bin/bash -m $ADMIN_USERNAME
cd /home/$ADMIN_USERNAME
mkdir -p .ssh
cat > .ssh/authorized_keys <<EOF
$SSH_PUBLIC_KEY
EOF

chmod 700 .ssh
chmod 600 .ssh/authorized_keys
chown -R $ADMIN_USERNAME:$ADMIN_USERNAME .ssh

# Create admin group

groupadd $ADMIN_GROUP_NAME --system -f
usermod -aG $ADMIN_GROUP_NAME $ADMIN_USERNAME

cat > /etc/sudoers.d/$PROJECT_NAME <<EOF
%$ADMIN_GROUP_NAME ALL=(ALL) NOPASSWD:ALL
EOF

chmod 0440 /etc/sudoers.d/$PROJECT_NAME
visudo -c

# SSH setup

cat > /etc/ssh/sshd_config <<EOF
#	$OpenBSD: sshd_config,v 1.103 2018/04/09 20:41:22 tj Exp $
# This is the sshd server system-wide configuration file.
Include /etc/ssh/sshd_config.d/*.conf
PasswordAuthentication no
ChallengeResponseAuthentication no
UsePAM yes
X11Forwarding no
PrintMotd no
AcceptEnv LANG LC_*
Subsystem	sftp	/usr/lib/openssh/sftp-server
TrustedUserCAKeys /etc/ssh/lightsail_instance_ca.pub
CASignatureAlgorithms +ssh-rsa
EOF

## Ubuntu updates and deps

apt-get update
apt-get -y upgrade
apt-get -y autoremove
