#!/bin/bash

# Immediately exit the script if any command fails
set -e

# Production deployment script for Incident Tracker
echo "Starting production deployment..."

# Install Docker if not present
if ! command -v docker &> /dev/null; then
    echo "Docker not found. Installing Docker..."

    # Detect Amazon Linux version
    if [ -f /etc/os-release ]; then
        . /etc/os-release
        if [[ $ID == "amzn" ]]; then
            if [[ $VERSION_ID == "2" ]]; then
                echo "Installing Docker on Amazon Linux 2..."
                sudo yum update -y
                sudo amazon-linux-extras install docker -y
                sudo systemctl start docker
                sudo systemctl enable docker
                sudo usermod -a -G docker ec2-user
            elif [[ $VERSION_ID == "2023" ]]; then
                echo "Installing Docker on Amazon Linux 2023..."
                sudo dnf update -y
                sudo dnf install -y docker
                sudo systemctl start docker
                sudo systemctl enable docker
                sudo usermod -a -G docker $USER
            else
                echo "Unsupported Amazon Linux version: $VERSION_ID"
                exit 1
            fi
        else
            echo "This script is designed for Amazon Linux. Please install Docker manually."
            exit 1
        fi
    else
        echo "Cannot detect OS. Please install Docker manually."
        exit 1
    fi

    echo "Docker installed successfully."
else
    echo "Docker already installed: $(docker --version)"
fi

# Install Docker Compose if not present
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    echo "Installing Docker Compose..."
    # For Amazon Linux, install via pip or download binary
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    echo "Docker Compose installed successfully."
else
    echo "Docker Compose already installed."
fi

# Install nginx if not present
if ! command -v nginx &> /dev/null; then
    echo "Installing nginx..."
    sudo yum install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
    echo "nginx installed successfully."
else
    echo "nginx already installed."
fi

# Install certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "Installing certbot..."
    sudo yum install -y certbot python3-certbot-nginx
    echo "certbot installed successfully."
else
    echo "certbot already installed."
fi

# Change to deploy directory
cd deploy

# Stop any existing containers
echo "Stopping existing containers..."
docker-compose -f prod-docker-compose.yml down || true

# Build and start containers
echo "Building and starting containers..."
docker-compose -f prod-docker-compose.yml up --build -d

# Wait for database to be ready
echo "Waiting for database to be ready..."
sleep 10

# Check if database is ready
docker-compose -f prod-docker-compose.yml exec -T postgres pg_isready -U postgres

if [ $? -eq 0 ]; then
    echo "Database is ready!"
else
    echo "Database is not ready, waiting longer..."
    sleep 20
    docker-compose -f prod-docker-compose.yml exec -T postgres pg_isready -U postgres
fi

# Check if backend is ready
echo "Checking backend health..."
sleep 5

# Configure nginx
echo "Configuring nginx..."

# Create nginx configuration
sudo tee /etc/nginx/conf.d/incident-tracker.conf > /dev/null << EOF
server {
    listen 80;
    server_name localhost;

    # Frontend
    location / {
        proxy_pass http://localhost:8080;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Backend API
    location /api {
        proxy_pass http://localhost:8000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }
}
EOF

# Test nginx configuration
sudo nginx -t

# Reload nginx
sudo systemctl reload nginx

echo "nginx configured successfully."

# Note: For SSL setup, you need to:
# 1. Update server_name with your domain
# 2. Run: sudo certbot --nginx -d yourdomain.com
# 3. Follow the prompts to configure SSL

echo "Deployment complete!"
echo "Application: http://localhost"
echo "Backend API: http://localhost/api"
echo "Database: localhost:15432"
echo ""
echo "For SSL setup:"
echo "1. Update /etc/nginx/conf.d/incident-tracker.conf with your domain"
echo "2. Run: sudo certbot --nginx -d yourdomain.com"
echo "3. Reload nginx: sudo systemctl reload nginx"
