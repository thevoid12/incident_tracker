#!/bin/bash
set -euo pipefail

echo "=== Starting production deployment ==="

EMAILID="thisisvoiddd1@gmail.com"
DOMAIN="inctra.thisisvoid.in"
NGINX_CONF_PATH="/etc/nginx/nginx.conf"

# Figure out script directory (so relative paths always work)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# setting up prod config
echo "setting up prod config"
cp env.prod ../.env

# --- Install Docker if not present ---
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    if grep -q "Amazon Linux release 2" /etc/system-release; then
        # Amazon Linux 2
        sudo yum update -y
        sudo amazon-linux-extras install docker -y
    else
        # Amazon Linux 2023
        sudo dnf update -y
        sudo dnf install -y docker
    fi
    sudo systemctl enable --now docker
fi
echo "Docker version: $(docker --version)"

# --- Install Docker Compose standalone binary if missing ---
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose..."
    sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi
echo "Docker Compose version: $(docker-compose version --short)"

# --- Start application stack ---
echo "Starting docker-compose services..."
sudo docker-compose -f "$SCRIPT_DIR/prod-docker-compose.yml" up -d --build

# --- Install nginx if not present ---
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    if grep -q "Amazon Linux release 2" /etc/system-release; then
        sudo amazon-linux-extras enable nginx1 -y || true
        sudo yum install -y nginx
    else
        sudo dnf install -y nginx
    fi
fi

# --- Install certbot from system repos (no snap) ---
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    if grep -q "Amazon Linux release 2" /etc/system-release; then
        sudo yum install -y certbot python2-certbot-nginx
    else
        sudo dnf install -y certbot python3-certbot-nginx
    fi
fi

# --- Issue/renew certificates ---
if [[ ! -d "/etc/letsencrypt/live/$DOMAIN" ]]; then
    echo "Obtaining SSL certificate for $DOMAIN ..."
    sudo certbot --nginx -d "$DOMAIN" --non-interactive --agree-tos --email "$EMAILID"
else
    echo "Certificate already exists for $DOMAIN – attempting renewal..."
    sudo certbot renew --quiet || true
fi

# --- Deploy production nginx.conf ---
echo "Deploying nginx.conf..."
sudo cp "$SCRIPT_DIR/nginx.conf" "$NGINX_CONF_PATH"
sudo nginx -t
sudo systemctl enable --now nginx
sudo systemctl reload nginx

echo "=== Deployment complete ==="
