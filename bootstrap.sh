#!/bin/bash

# Bootstrap script for Incident Tracker
echo "Setting up Incident Tracker..."

# Navigate to frontend directory
cd app/frontend

# Install dependencies
echo "Installing dependencies..."
npm install

# Install Tailwind CSS and its dependencies
echo "Installing Tailwind CSS..."
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# Create Tailwind config
echo "Creating Tailwind configuration..."
npx tailwindcss init -p

echo "Setup complete! You can now run 'npm run dev' to start the development server."