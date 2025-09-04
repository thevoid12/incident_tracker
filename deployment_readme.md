# Incident Tracker Production Deployment Guide

## Overview

This guide documents the production deployment setup for the Incident Tracker application. The system consists of a React frontend, FastAPI backend, and PostgreSQL database, all containerized and orchestrated using Docker Compose.

## Architecture Overview

The production setup uses the following components:

- **Frontend**: React SPA served by Nginx
- **Backend**: FastAPI application with PostgreSQL database
- **Reverse Proxy**: Nginx with SSL termination
- **SSL**: Let's Encrypt certificates via Certbot
- **Container Orchestration**: Docker Compose

### System Architecture Diagram

```
┌─────────────────┐     HTTPS:443      ┌─────────────────┐
│   Client        │ ─────────────────► │   Nginx         │
│   Browser       │                    │   Reverse Proxy │
└─────────────────┘                    └─────────────────┘
                                              │
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │   Application   │
                                     │    Layer        │
                                     └─────────────────┘
                                              │
                                              │
                    ┌─────────────────────────┼─────────────────────────┐
                    │                         │                         │
                    ▼                         ▼                         ▼
         ┌─────────────────┐       ┌─────────────────┐       ┌─────────────────┐
         │   Frontend      │       │   Backend       │       │   PostgreSQL    │
         │   Container     │       │   Container     │       │   Container     │
         │   Port: 8080    │       │   Port: 8000    │       │   Port: 5432    │
         │                 │       │                 │       │                 │
         │ • Nginx SPA     │       │ • FastAPI + uv  │       │ • Database      │
         │ • Static Files  │       │ • API Routes    │       │ • Persistent    │
         │ • Gzip/Cache    │       │ • JWT Auth      │       │ • Schema Init   │
         └─────────────────┘       └─────────────────┘       └─────────────────┘
                                              │
                                              │
                                              ▼
                                     ┌─────────────────┐
                                     │ Infrastructure  │
                                     │                 │
                                     │ • Docker Network│
                                     │ • SSL Certs     │
                                     │ • Volumes       │
                                     └─────────────────┘
```

### Detailed Data Flow

```
1. Client Request Flow:
   Browser → HTTPS:443 → Nginx (SSL Termination) → Route based on path

2. API Requests (/api/*):
   Nginx → Backend Container:8000 → FastAPI → SQLAlchemy → PostgreSQL:5432

3. Frontend Requests (/):
   Nginx → Frontend Container:8080 → Nginx SPA → Static Files

4. Database Operations:
   Backend → PostgreSQL Connection Pool → Database Queries → Persistent Volume
```

### Component Architecture Details

```
Frontend Container (Dockerfile.frontend):
├── Build Stage (Node.js)
│   ├── package.json dependencies
│   ├── npm run build
│   └── Output: dist/ folder
└── Serve Stage (Nginx)
    ├── Copy dist/ to /usr/share/nginx/html
    ├── nginx-frontend.conf
    ├── SPA routing (try_files $uri /index.html)
    └── Port: 80 (internal)

Backend Container (Dockerfile.backend):
├── Python 3.11 slim base
├── System dependencies (gcc, libpq-dev)
├── uv package manager
├── Copy backend/ source code
├── PYTHONPATH=/app/app
├── Health check: depends on postgres
└── CMD: uvicorn main:app --host 0.0.0.0 --port 8000

Database Container (postgres:15):
├── PostgreSQL 15 image
├── Environment from .env.prod
├── Port: 5432 (internal)
├── Health check: pg_isready
├── Volume: postgres_data
└── Init: base_schema.sql

Nginx Reverse Proxy:
├── SSL Termination (Port 443)
├── Certificate: /etc/letsencrypt/live/inctra.thisisvoid.in/
├── Security Headers (HSTS, X-Frame-Options, etc.)
├── API Proxy: /api/* → backend:8000
├── Frontend Proxy: / → frontend:8080
└── HTTP Redirect: Port 80 → HTTPS:443
```

## Pre Setup
- Ubuntu/Debian-based Linux distribution
- Root or sudo access
- Domain name pointing to server IP (inctra.thisisvoid.in in this setup) 'A' record
- Open ports: 80, 443, 15432 (PostgreSQL), 8000 (Backend), 8080 (Frontend)

## Deployment Steps

The entire deployment process is automated by the **bootstrap.sh** script. Simply run:

```bash
cd deploy
./bootstrap.sh
```

### What the Bootstrap Script Does

1. **Configuration Setup**
   - Copies `.env.prod` to project root as `.env`

2. **Docker Installation**
   - Installs Docker CE and Docker Compose if not present
   - Enables and starts Docker service

3. **Application Deployment**
   - Builds and starts all containers using **prod-docker-compose.yml**
   - Services: PostgreSQL, Backend, Frontend

4. **Nginx Setup**
   - Installs Nginx web server
   - Configures SSL with Let's Encrypt
   - Deploys production Nginx configuration

5. **SSL Certificate Management**
   - Obtains SSL certificate for the domain
   - Sets up automatic renewal

### Deployment Flow Diagram

```
┌─────────────────┐
│ Run bootstrap.sh│
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Setup .env.prod │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Install Docker  │
│ & Docker Compose│
└─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Start Services  │ ──► │ PostgreSQL      │
│ (Docker Compose)│     └─────────────────┘
└─────────────────┘     ┌─────────────────┐
         │              │ Backend         │
         ▼              └─────────────────┘
┌─────────────────┐     ┌─────────────────┐
│ Install Nginx   │     │ Frontend        │
└─────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Setup SSL Cert  │
│ (Let's Encrypt) │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Deploy Nginx    │
│ Configuration   │
└─────────────────┘
         │
         ▼
┌─────────────────┐
│ Deployment      │
│ Complete        │
└─────────────────┘
```

## Configuration Details

### Environment Variables (.env.prod)

```bash
# Database Configuration
POSTGRES_DB=postgres
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=postgres
POSTGRES_PORT=5432
DATABASE_URL=postgresql://postgres:password@postgres:5432/postgres

# Database Connection Pool
DB_ECHO=false
DB_POOL_SIZE=20
DB_MAX_OVERFLOW=30
DB_POOL_TIMEOUT=60
DB_POOL_RECYCLE=1800
DB_POOL_PRE_PING=true

# Authentication
JWT_SECRET=<secret>
COOKIE_NAME=auth_token
COOKIE_AGE=600
COOKIE_SECURE=true
```

### Docker Compose Services

- **PostgreSQL**: Database service with persistent volume
- **Backend**: FastAPI application built from **Dockerfile.backend**
- **Frontend**: React SPA built from **Dockerfile.frontend** and served by Nginx

### Nginx Configuration

- **Main Config** (**nginx.conf**): SSL termination and routing
- **Frontend Config** (**nginx-frontend.conf**): SPA serving with fallback to index.html
- **SSL**: TLS 1.2/1.3 with security headers
- **Proxy**: HTTP/1.1 with keep-alive for backend communication

## Container Details

### Backend Container
- **Base Image**: Python 3.11 slim
- **Package Manager**: uv
- **Port**: 8000
- **Health Check**: Depends on PostgreSQL health

### Frontend Container
- **Build Process**: Multi-stage (Node.js build + Nginx serve)
- **Port**: 80 (internal), mapped to 8080
- **Static Assets**: Served with gzip compression and caching

### Database Container
- **Image**: PostgreSQL 15
- **Port**: 5432 (internal), mapped to 15432
- **Persistence**: Named volume postgres_data
- **Initialization**: Schema loaded from base_schema.sql

## Monitoring and Logs

### Application Logs
- Backend logs: Available in container logs and mounted volume `/app/app/logs`
- Nginx logs: System journal (`journalctl -u nginx`)

### Container Logs
```bash
# View all container logs
docker compose -f deploy/prod-docker-compose.yml logs

# View specific service logs
docker compose -f deploy/prod-docker-compose.yml logs backend
docker compose -f deploy/prod-docker-compose.yml logs frontend
docker compose -f deploy/prod-docker-compose.yml logs postgres
```

### Health Checks
- PostgreSQL: Built-in health check using `pg_isready`
- Services: Manual verification via exposed ports

## Troubleshooting

### Common Issues

1. **SSL Certificate Issues**
   - Ensure domain DNS points to server IP
   - Check firewall allows ports 80/443
   - Verify certbot installation: `certbot --version`

2. **Container Startup Failures**
   - Check Docker service: `sudo systemctl status docker`
   - Verify environment file: `cat .env`
   - Review container logs: `docker compose logs`

3. **Database Connection Issues**
   - Verify PostgreSQL container is healthy
   - Check DATABASE_URL in .env
   - Ensure backend waits for database: `depends_on` with `condition: service_healthy`

4. **Nginx Configuration Errors**
   - Test config: `sudo nginx -t`
   - Check syntax in `nginx.conf`
   - Verify proxy_pass URLs match container ports

## Security Considerations

- SSL/TLS encryption for all traffic
- Security headers (HSTS, X-Frame-Options, etc.)
- Database connection pooling to prevent exhaustion
- JWT-based authentication with secure cookies
- Container isolation via Docker networking

## Backup and Recovery

### Database Backup
```bash
# Backup PostgreSQL data
docker exec inctra_pgsql_prod pg_dump -U postgres postgres > backup.sql

# Restore from backup
docker exec -i inctra_pgsql_prod psql -U postgres postgres < backup.sql
```

### Volume Backup
- PostgreSQL data: `postgres_data` volume
- Use Docker volume commands for backup/restore

---

**Note**: This deployment is configured for the domain `inctra.thisisvoid.in`. Update domain references in `nginx.conf`, `bootstrap.sh`, and DNS configuration for different domains.