.PHONY: build dev frontend backend clean db-migrate

# Build React app and start backend
build-dev:
	cp ./deploy/.env.dev ./.env
	cd ./frontend && npm run build
	cd ./backend/app && uv run uvicorn main:app --reload --port 8001 &
	cd ./frontend && npx serve dist -p 8081 -s

build-prod:
	cp ./deploy/.env.prod ./.env
	chmod +x ./deploy/bootstrap.sh
	./deploy/bootstrap.sh


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

# Setup development environment
setup:
	cd ./frontend && npm install
	cd ./backend && uv sync

# Run database migration
db-migrate:
	@echo "Running database migration..."
	docker cp backend/app/service/db/migration/v1_0_0--v1_0_1.sql inctra_pgsql:/tmp/migration.sql
	docker exec inctra_pgsql psql -U postgres -d postgres -f /tmp/migration.sql
	@echo "Migration completed successfully!"

