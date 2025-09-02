.PHONY: build dev frontend backend clean

# Build React app and start backend
build:
	cd ./frontend && npm run build
	cd ./backend/app && uv run uvicorn main:app --reload --port 8001

# Development mode - separate servers
dev:
	@echo "Starting development servers..."
	@echo "Frontend: http://localhost:5173/"
	@echo "Backend: http://localhost:8001/"
	@echo "Press Ctrl+C to stop all servers"


# Start frontend development server
frontend:
	cd ./frontend && npm run dev

# Start backend development server
backend:
	cd ./backend/app && uv run uvicorn main:app --reload --port 8001

# Clean build artifacts
clean:
	rm -rf ./frontend/dist
	rm -rf ./backend/app/__pycache__
	rm -rf ./backend/app/**/*.pyc

# Setup development environment
setup:
	cd ./frontend && npm install
	cd ./backend && uv sync

# Full development workflow
full-dev:
	@echo "Setting up development environment..."
	make setup
	@echo "Starting all services..."
	make dev