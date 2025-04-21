# HMCTS Dev Test Frontend
This will be the frontend for the brand new HMCTS case management system. As a potential candidate we are leaving
this in your hands. Please refer to the brief for the complete list of tasks! Complete as much as you can and be
as creative as you want.

To begin with, you should be able to run this by running:
1) `yarn install`
2) `yarn webpack`
3) `yarn start:dev` or navigate to package.json and run the script manually


# HMCTS Case Management System

A full-stack case management application for Her Majesty's Courts and Tribunals Service (HMCTS). This system includes a Spring Boot backend and an Express + Nunjucks frontend. It enables case listing, searching, filtering, creating, editing, and deleting with an accessible GOV.UK design system UI.

---

## Features

- View, add, edit, and delete cases
- GOV.UK Nunjucks-based frontend
- Filtering, sorting, pagination
- Dashboard analytics and metrics
- API endpoints for frontend/backend integration
- Environment variable handling
- Logging via Winston
- Docker-ready setup
- Health check and 404 handling
- Secure input/output rendering

---

## Project Structure

```
hmcts-dev-test/
├── backend/                           # Java Spring Boot backend
│   ├── build.gradle                   # Gradle build config
│   └── src/
│       ├── main/
│       │   ├── java/
│       │   │   └── uk/gov/hmcts/reform/dev/
│       │   │       ├── controllers/   # CaseController.java etc.
│       │   │       └── models/        # ExampleCase.java, Note.java
│       │   └── resources/
│       │       └── application.yml
│       └── test/                      # Backend unit tests
├── frontend/                          # Node.js Express frontend
│   ├── src/
│   │   ├── routes/                    # Express routes (home.ts, cases.ts)
│   ├── views/                         # Nunjucks templates
│   ├── public/                        # Static assets (CSS/JS/images)
│   ├── package.json
│   └── yarn.lock
├── tests/                             # Test files
│   ├── unit/
│   ├── smoke/
│   └── acceptance/
├── README.md
└── .gitignore
```

---

## API Endpoints

### Backend (Spring Boot)

| Method | Endpoint                        | Description                    |
|--------|----------------------------------|--------------------------------|
| GET    | `/get-example-case`             | List all cases                 |
| GET    | `/get-example-case/{id}`        | Get single case by ID          |
| POST   | `/get-example-case`             | Create a new case              |
| DELETE | `/get-example-case/{id}`        | Delete a case by ID            |
| GET    | `/actuator/health`              | Health check endpoint          |

### Frontend (Express)

| Route                    | Description                              |
|--------------------------|------------------------------------------|
| `/`                      | Home page                                |
| `/sign-in`               | Sign-in view                             |
| `/dashboard`             | Dashboard overview                       |
| `/cases`                 | Case list with filters/pagination        |
| `/cases/:id`             | View single case                         |
| `/cases/:id/edit`        | Edit case page (GET + POST)              |
| `/cases/:id/delete`      | Delete case                              |
| `/case-new`              | Create new case form                     |
| `/case-new/confirm`      | Submit new case (POST)                   |
| `/metrics/total-cases`   | Dashboard shortcut to case list          |

---

## Setup Instructions

### Requirements

- Node.js (18+)
- Java 21
- Docker (optional)
- Yarn 3+ (Enable Corepack: `corepack enable`)

### 1. Clone the repository

```bash
git clone https://github.com/your-org/hmcts-dev-test.git
cd hmcts-dev-test
```

### 2. Setup Backend

```bash
cd backend
./gradlew build
./gradlew bootRun
```

Backend will run at: `http://localhost:4000`

### 3. Setup Frontend

```bash
cd frontend
corepack enable
yarn install
yarn dev
```

Frontend will run at: `http://localhost:3000`

---
