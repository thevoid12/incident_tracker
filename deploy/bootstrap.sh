#!/bin/bash
set -euo pipefail

echo "=== Starting production deployment ==="

EMAILID="thisisvoiddd1@gmail.com"
DOMAIN="inctra.thisisvoid.in"
NGINX_CONF_PATH="/etc/nginx/nginx.conf"

# Figure out script directory (so relative paths always work)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

# --- Set up prod config ---
echo "Setting up prod config..."
cp "$SCRIPT_DIR/.env.prod" "$PROJECT_ROOT/.env"

# --- Install Docker if not present ---
if ! command -v docker &> /dev/null; then
    echo "Installing Docker..."
    sudo apt-get update -y
    sudo apt-get install -y ca-certificates curl gnupg lsb-release

    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
      https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" \
      | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -y
    sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    sudo systemctl enable --now docker
fi
echo "Docker version: $(docker --version)"

# --- Install Docker Compose standalone if missing ---
if ! command -v docker-compose &> /dev/null; then
    echo "Installing Docker Compose standalone..."
    sudo curl -SL "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
        -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi
echo "Docker Compose version: $(docker-compose version --short || docker compose version --short)"

# --- Start application stack ---
echo "Starting docker-compose services..."
sudo docker compose -f "$SCRIPT_DIR/prod-docker-compose.yml" up -d --build

# --- Install nginx if not present ---
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo apt-get install -y nginx
fi

# --- Install certbot ---
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo apt-get install -y certbot python3-certbot-nginx
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
