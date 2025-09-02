#!/bin/bash

# Bootstrap script for Incident Tracker
echo "Setting up Incident Tracker..."

# Install uv if not present
if ! command -v uv &> /dev/null; then
    echo "Installing uv..."
    curl -LsSf https://astral.sh/uv/install.sh | sh
    export PATH="$HOME/.cargo/bin:$PATH"
fi

# Setup Python backend
echo "Setting up Python backend..."
cd backend
echo "Installing Python dependencies with uv..."
uv sync

# Setup frontend
echo "Setting up frontend..."
cd ../frontend

# Install dependencies
echo "Installing Node.js dependencies..."
npm install

# Install Tailwind CSS and its dependencies
echo "Installing Tailwind CSS..."
npm install -D tailwindcss@^3.4.0 postcss autoprefixer

# Create Tailwind config
echo "Creating Tailwind configuration..."
npx tailwindcss init -p

echo "Setup complete!"
echo "To start the backend: cd backend && uv run uvicorn app.main:app --reload --port 8001"
echo "To start the frontend: cd frontend && npm run dev"
echo "Or use: make build (to build and run both)"