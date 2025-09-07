# Incident Tracker

A modern full-stack incident management system built with React, FastAPI, and PostgreSQL. Streamlines incident reporting, tracking, and resolution within organizations.

## Features

### Core Features
- **User Authentication**: Secure JWT-based login/registration system
- **Incident Management**: Create, view, update, and delete incidents
- **Status Tracking**: Monitor incident status (Open, In Progress, Resolved)
- **Priority Management**: Set incident priority levels (Low, Medium, High)
- **Responsive UI**: Modern, mobile-friendly interface with desktop table and mobile card views
- **RESTful API**: Well-documented backend endpoints
- **Database Integration**: PostgreSQL with connection pooling

### Advanced Features
- **File Upload**: Bulk import incidents from CSV/Excel files
- **Chat System**: Add comments and responses to incidents
- **Audit Trail**: Complete logging of user actions and system events
- **Role-Based Access Control (RBAC)**: Admin and user role permissions
- **User Management**: Admin panel for user administration
- **Advanced Filtering**: Filter by status, priority, date, and search text
- **Bulk Operations**: Mass incident creation and management
- **Action Menus**: Quick access to view, edit, and delete actions

## How It Works

### User Journey

```
1. User visits app → Redirected to /login
2. User registers/logs in → JWT token set in cookie
3. Authenticated user → Redirected to /home
4. User can:
   ├── View all their incidents (paginated, filtered)
   ├── Create new incidents (single or bulk upload)
   ├── Edit existing incidents
   ├── Update incident status/priority
   ├── Add chat messages to incidents
   ├── View audit trail of actions
   └── Delete incidents (soft delete)
5. Admin users can:
   ├── Manage all users
   ├── View system-wide audit logs
   └── Access advanced permissions
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

- **users** table: User authentication, profile data, and role management
- **incident_tracker** table: Incident records with status, priority, and chat history
- **audit_trail** table: Complete audit logging of user actions
- **Performance indexes**: Optimized queries on status, creation date, and user fields

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

## Role-Based Access Control (RBAC)

The application implements a comprehensive RBAC system using bitmask-based permissions for fine-grained access control. This system ensures that users can only perform actions they're authorized to do, with different permission levels for different user roles.

### Permission System

The RBAC system is built around individual permissions that control specific actions in the application. Each permission represents a specific capability, such as creating incidents, viewing data, or managing users. These permissions are organized using a bitmask system where each permission occupies a specific bit position, allowing for efficient storage and checking.

### Role Definitions

The system currently supports two main user roles with distinct permission sets:

- **Admin Role**: Has complete access to all system features and data
  - Full incident management (create, view, update, delete)
  - Access to all incidents across the system
  - Complete audit trail visibility
  - User management capabilities
  - System-wide permissions for administrative tasks

- **User Role**: Has limited access focused on personal incident management
  - Can create and manage their own incidents
  - Can view and update incidents they created
  - Limited to their own audit trail entries
  - Cannot access other users' data or perform administrative actions

### How RBAC Works

#### Permission Assignment Process
When a user logs in, their role is retrieved from the database. The system then calculates a permission bitmask based on their role definition. This bitmask is encoded and stored within their JWT token, eliminating the need for database lookups during permission checks.

#### Permission Verification
Every protected operation in the system goes through permission verification. The system checks whether the user's permission bitmask contains the required permission bit for the specific action they're attempting. If the permission is missing, the operation is denied with an appropriate error message.

#### Multi-Layer Protection
The RBAC system operates at three distinct layers:

**API Layer Protection**: Every API endpoint that requires authorization uses dependency injection to extract and validate the user's permissions from their JWT token before processing the request.

**Business Logic Layer**: Each service method performs its own permission validation, ensuring that even if an API endpoint is somehow bypassed, the business logic will still enforce proper authorization rules.

**Presentation Layer**: The frontend middleware checks user authentication status and redirects unauthorized users to the login page, preventing access to protected pages entirely.

### Permission Bitmask Implementation

The system uses an efficient bitmask approach where each permission is represented by a specific bit position. This allows the system to:
- Store multiple permissions in a compact format
- Perform lightning-fast permission checks using bitwise operations
- Scale to support many permissions without performance degradation
- Maintain backward compatibility when adding new permissions

### System Extensibility

The RBAC system is designed to be easily extensible:

**Adding New Permissions**: New permissions can be introduced by defining them in the permission enum and updating the relevant role mappings. The bitmask system automatically accommodates new permissions without requiring changes to existing code.

**Creating New Roles**: Additional user roles can be defined by specifying their permission sets in the role configuration. The system supports any number of roles with custom permission combinations.

**Dynamic Permission Updates**: User permissions are refreshed on login, allowing for immediate application of role changes without requiring system restarts.


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
- GET /api/incidents - List incidents (paginated, filtered)
- POST /api/incidents - Create new incident
- GET /api/incidents/{id} - Get specific incident
- PUT /api/incidents/{id} - Update incident
- DELETE /api/incidents/{id} - Delete incident (soft delete)
- POST /api/incidents/upload - Bulk upload from CSV/Excel
- POST /api/incidents/{id}/chat - Add chat message to incident
- GET /api/incidents/config - Get upload configuration

### Users (Admin)
- GET /api/users - List users
- POST /api/users - Create user
- GET /api/users/{id} - Get user details
- PUT /api/users/{id} - Update user
- DELETE /api/users/{id} - Delete user

### Audit Trail
- GET /api/audittrail - Get audit logs
- GET /api/audittrail/{id} - Get specific audit entry

## Frontend Components

```
App.jsx (Main Router)
├── Login.jsx - Authentication form
├── Register.jsx - User registration
├── HomePage.jsx - Dashboard with incident list
│   ├── Header.jsx - Navigation bar
│   ├── IncidentFilters.jsx - Search/filter controls
│   ├── IncidentTable.jsx - Responsive data table with action menus
│   ├── Pagination.jsx - Page navigation
│   └── Footer.jsx - App footer
├── CreateIncident.jsx - Form for creating/editing incidents
├── IncidentDetails.jsx - Individual incident view with chat
├── UploadIncidentsModal.jsx - Bulk file upload interface
├── ActionMenu.jsx - Dropdown menu for incident actions
├── AuditTrail.jsx - Audit log viewer
└── Chat.jsx - Real-time chat component
```

## Quick Start

### Prerequisites

Before setting up the project, ensure you have the following installed:

- **Python 3.9+**: Download from [python.org](https://python.org)
- **Node.js 18+**: Download from [nodejs.org](https://nodejs.org)
- **uv**: Fast Python package manager. Install with `curl -LsSf https://astral.sh/uv/install.sh | sh`
- **Docker**: For running PostgreSQL. Download from [docker.com](https://docker.com)
- **Make**: Usually pre-installed on Linux/Mac, or install via package manager

### Development Setup

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd incident_tracker
   ```

2. **Set up environment variables:**
   ```bash
   cp deploy/.env.dev .env
   ```
   This copies the development environment configuration.

3. **Install dependencies:**
   ```bash
   make setup
   ```
   This installs frontend (npm) and backend (uv) dependencies.

4. **Start PostgreSQL database:**
   ```bash
   cd deploy
   docker-compose up -d
   cd ..
   ```
   This starts PostgreSQL on port 15432.

5. **Initialize the database:**
   The database schema will be created automatically on first run, or you can run migrations if needed:
   ```bash
   make db-migrate
   ```

6. **Start development servers:**
   ```bash
   # Option 1: Start all services at once (builds frontend and starts backend)
   make build-dev

   # Option 2: Start services separately in different terminals
   # Terminal 1 - Backend:
   make backend

   # Terminal 2 - Frontend:
   make frontend
   ```

7. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8001
   - API Docs: http://localhost:8001/docs

### Alternative Manual Setup

If you prefer manual setup without Make:

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

3. **Start PostgreSQL:**
   ```bash
   docker run -d --name postgres -p 15432:5432 -e POSTGRES_PASSWORD=password postgres:15
   ```

4. **Start services:**
   ```bash
   # Terminal 1 - Backend
   cd backend/app
   uv run uvicorn main:app --reload --port 8001

   # Terminal 2 - Frontend
   cd frontend
   npm run dev
   ```

### Running Tests

```bash
# Run all backend tests
make test-all

# Run specific RBAC tests
make test-rbac
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

---

