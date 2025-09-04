# Incident Tracker

A modern full-stack incident management system built with React, FastAPI, and PostgreSQL. Streamlines incident reporting, tracking, and resolution within organizations.

## Features

- User Authentication: Secure JWT-based login/registration system
- Incident Management: Create, view, update, and delete incidents
-  Status Tracking: Monitor incident status (Open, In Progress, Resolved)
- Priority Management: Set incident priority levels (Low, Medium, High)
- Responsive UI: Modern, mobile-friendly interface
- RESTful API: Well-documented backend endpoints
- Database Integration: PostgreSQL with connection pooling

## How It Works

### User Journey

```
1. User visits app → Redirected to /login
2. User registers/logs in → JWT token set in cookie
3. Authenticated user → Redirected to /home
4. User can:
   ├── View all their incidents (paginated)
   ├── Create new incidents
   ├── Edit existing incidents
   ├── Update incident status/priority
   └── Delete incidents (soft delete)
```

### Data Flow Architecture

```
┌─────────────┐    HTTP Request     ┌─────────────┐
│   Browser   │ ─────────────────►  │  FastAPI    │
│   React     │                     │  Routes     │
└─────────────┘                     └─────────────┘
         ▲                                 │
         │                                 ▼
         │                         ┌─────────────┐
         │                         │  Services   │
         │                         │  Business   │
         │                         │  Logic      │
         │                         └─────────────┘
         │                                 │
         │                                 ▼
         │                         ┌─────────────┐
         │                         │ PostgreSQL  │
         │                         │  Database   │
         │                         └─────────────┘
         │                                 │
         │                                 ▼
         │                         ┌─────────────┐
         │                         │   Response  │
         │                         │   JSON/HTML │
         │                         └─────────────┘
         │                                 │
         └─────────────────────────────────┘
              Browser renders response
```

## Database Schema

The database schema is defined in **backend/app/service/db/base_schema.sql**. It includes:

- **users** table: User authentication and profile data
- **incident_tracker** table: Incident records with status and priority tracking
- **Performance indexes**: Optimized queries on status and creation date fields

For detailed schema information, refer to: [`backend/app/service/db/base_schema.sql`](backend/app/service/db/base_schema.sql)

## Authentication Flow
![auth ](/1.png)

```
┌─────────────┐  POST /api/login     ┌─────────────┐
│   Login     │ ──────────────────►  │  FastAPI    │
│   Form      │                      │  Backend    │
└─────────────┘                      └─────────────┘
         ▲                                 │
         │                                 ▼
         │                         ┌─────────────┐
         │                         │  Validate   │
         │                         │  Credentials│
         │                         └─────────────┘
         │                                 │
         │                                 ▼
         │                         ┌─────────────┐
         │                         │  Generate   │
         │                         │  JWT Token  │
         │                         └─────────────┘
         │                                 │
         │                                 ▼
         │                         ┌─────────────┐
         │                         │  Set Cookie │
         │                         │  Response   │
         │                         └─────────────┘
         │                                 │
         └─────────────────────────────────┘
              Redirect to /home with auth cookie
```

## Tech Stack

### Frontend
- React 18: Component-based UI framework
- React Router: Client-side routing
- Tailwind CSS: Utility-first CSS framework
- Vite: Fast build tool and dev server
- Context API: State management for incidents

### Backend
- FastAPI: Modern Python web framework
- SQLAlchemy: ORM for database operations
- PostgreSQL: Robust relational database
- JWT: JSON Web Tokens for authentication
- uv: Fast Python package manager

### DevOps
- Docker: Containerization
- Docker Compose: Multi-container orchestration
- Nginx: Reverse proxy and load balancer
- Let's Encrypt: SSL certificate automation

## API Endpoints

### Authentication
- POST /api/login - User login
- POST /api/reg - User registration
- POST /api/logout - User logout

### Incidents
- GET /api/incidents - List incidents (paginated)
- POST /api/incidents - Create new incident
- GET /api/incidents/{id} - Get specific incident
- PUT /api/incidents/{id} - Update incident
- DELETE /api/incidents/{id} - Delete incident

## Frontend Components

```
App.jsx (Main Router)
├── Login.jsx - Authentication form
├── Register.jsx - User registration
├── HomePage.jsx - Dashboard with incident list
│   ├── Header.jsx - Navigation bar
│   ├── IncidentFilters.jsx - Search/filter controls
│   ├── IncidentTable.jsx - Data table display
│   ├── Pagination.jsx - Page navigation
│   └── Footer.jsx - App footer
├── CreateIncident.jsx - Form for creating/editing incidents
└── IncidentDetails.jsx - Individual incident view
```

## Quick Start

### Development Setup


1. **Setup database:**
```bash
# Start PostgreSQL via Docker
docker run -d --name postgres -p 5432:5432 -e POSTGRES_PASSWORD=password postgres:15
```

2. **Start development servers:**
```bash
# Option 1: Start all services at once
make build-dev 

# Option 2: Start services separately in different terminals
# Terminal 1 - Backend:
make backend

# Terminal 2 - Frontend:
make frontend
```

4. **Access the application:**
-  http://localhost:8001
- API Docs: http://localhost:8001/docs

### Alternative Manual Setup

If you prefer manual setup:

1. **Setup backend:**
```bash
cd backend
uv sync
```

2. **Setup frontend:**
```bash
cd frontend
npm install
```

3. **Start services:**
```bash
# Terminal 1 - Backend
cd backend/app
uv run uvicorn main:app --reload --port 8001

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Production Deployment
- check [deploymend readme](./deployment_readme.md)

```bash
cd deploy
./bootstrap.sh
```

This single command handles the entire production setup including Docker, SSL, and nginx configuration.


## System Architecture Deep Dive

### Request-Response Cycle

```
1. User Action (Browser)
   ↓
2. React Component State Update
   ↓
3. API Call (fetch/axios)
   ↓
4. FastAPI Route Handler
   ↓
5. Authentication Middleware
   ↓
6. Business Logic Service
   ↓
7. Database Query (SQLAlchemy)
   ↓
8. PostgreSQL Execution
   ↓
9. Response Generation
   ↓
10. JSON/HTML Response
    ↓
11. React State Update
    ↓
12. UI Re-render
```

### Component Architecture

```
IncidentContext (Global State)
├── fetchIncidents() - Load incident list
├── createIncident() - Create new incident
├── updateIncident() - Modify existing incident
├── deleteIncident() - Remove incident
└── pagination - Page state management

Individual Components
├── Controlled by Context
├── Handle user interactions
├── Display data from context
└── Trigger context actions
```

## TODO:
- check [todo.md](./todo.md) for list of features I have implemented as part of the task.
- All other optional features will also be implemented in upcomming days 

---

