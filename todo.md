# Task: Incident Tracker Application

## Problem Statement
-  Design and implement a Full-Stack Incident Tracker that allows users to log, view, and update incidents reported within a company.

## Frontend (React)
-  Build a single-page React application with the following pages:

     - [x] Incident List Page
    - [x] Shows all incidents with pagination.
    - [x] Filtering by status (`Open`, `In Progress`, `Resolved`).
    - [x] Sorting by creation date.

     - [x] Incident Detail Page
    - [x] Displays all fields of an incident.
    - [x] Allows editing of incident details.

     - [x] Create Incident Page
    - [x] Form to add a new incident.
    - [x] Validate required fields before submission.

    - [x] Use state management (React Context or Redux) for handling filters and session state.
   - [x] Implement a responsive layout (desktop & mobile).

---

## Backend (Python API)
  Use FastAPI or Flask to build a REST API with the following endpoints:

  - [x] `POST /incidents` → create a new incident
  - [x] `GET /incidents` → list incidents with filtering & pagination support
  - [x] `GET /incidents/{id}` → fetch details of a single incident
  - [x] `PUT /incidents/{id}` → update an existing incident
  - [x] `DELETE /incidents/{id}` → delete an incident (soft delete)

- [x] Add basic authentication (username/password) for API access.
- [x] Include error handling and proper HTTP status codes.
- [x] Write at least one unit test for the backend API.

---

## Database (PostgreSQL)
- [x] Design a table `incidents` with at least these fields:
    `id SERIAL PRIMARY KEY`

    `title VARCHAR(200) NOT NULL`

    `description TEXT`

    `status VARCHAR(50) CHECK (status IN ('Open', 'In Progress', 'Resolved')) DEFAULT 'Open'`

    `priority VARCHAR(50) CHECK (priority IN ('Low', 'Medium', 'High')) DEFAULT 'Medium'`

    `created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP`
    `updated_at TIMESTAMP`

- [x] Ensure indexes for `status` and `created_at` to optimize queries.

---

## Bonus Points (Optional)
- [ ] Add role-based access control:
  - [ ] Admin: can create, update, delete incidents.
  - [ ] User: can only create and view.

- [ ] Add a search box on the frontend to filter incidents by keyword in title/description.
- [x] Containerize with Docker (frontend, backend, DB).
- [x] Write a short README with setup instructions.

---

## Additional features:
- [ ] Excel or CSV upload of incidents
- [ ] Enhance logging to change the log level during run time without service restart
- [ ] Allow options for users to add comments on incidents and accept responses for the comments
- [ ] Capture audit for user actions