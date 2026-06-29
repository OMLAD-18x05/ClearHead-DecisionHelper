# ClearHead - Decision Helper

ClearHead is a modern, responsive web application designed to help users make logical, data-driven decisions. By separating emotional gut feelings from objective priorities, ClearHead allows users to define custom decision matrices, assign weights to specific criteria, score choices, and visualize optimal outcomes based on weighted totals.

---
## Screenshots

| Landing Page | Dashboard |
|---|---|
| ![Landing](./Screenshots/Landing.png) | ![Dashboard](./Screenshots/dashboard.png) |

| Decision Workspace | Score Matrix & Results |
|---|---|
| ![Workspace](./screenshots/workspace.png) | ![Results](./screenshots/result.png) |



## Table of Contents

1. [Features](#features)
2. [Technology Stack](#technology-stack)
3. [System Architecture & Database Schema](#system-architecture--database-schema)
4. [Project Directory Structure](#project-directory-structure)
5. [Getting Started (Installation & Setup)](#getting-started-installation--setup)
    - [Prerequisites](#prerequisites)
    - [Backend Setup](#backend-setup)
    - [Frontend Setup](#frontend-setup)
6. [API Endpoints](#api-endpoints)
7. [State Management & Performance Optimization](#state-management--performance-optimization)

---

## Features

- **Secure Authentication**: User sign-up and log-in powered by JWT (JSON Web Tokens) and secure password hashing via bcrypt.
- **Decision Management**: Create, edit, and delete multiple independent decisions.
- **Criteria Customization**: Define what parameters matter (e.g., Cost, Time, Joy) and assign priority values to each.
- **Option Customization**: List all choices or options being evaluated for a decision.
- **Interactive Score Matrix**: A complete grid system that lets you grade each option against every defined criterion.
- **Dynamic Ranked Results**: Automatically aggregates priorities and scores to output a sorted rank list of options with detailed metrics.
- **Optimized UI Performance**: Granular local state handling to prevent unnecessary re-rendering across dashboard components during CRUD operations.

---

## Technology Stack

### Frontend
- **Framework**: React 19 (built on Vite)
- **Styling**: Tailwind CSS v4 & custom HSL/RGB palettes (Clean dark & indigo theme)
- **Routing**: React Router DOM v7
- **HTTP Client**: Axios (configured with authorization headers interceptor)
- **Icons**: Lucide React
- **Dev Tools**: ESLint

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js (v5.x)
- **Database ORM**: Prisma ORM (mapped to PostgreSQL)
- **Validation**: Zod (for request payload validation)
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) & `bcrypt`

---

## System Architecture & Database Schema

The database model is managed via Prisma under `server/data/prisma/schema.prisma`. It represents a relational model connecting Users, Decisions, Options, Criteria, and Scores:

```mermaid
erDiagram
    User ||--o{ Decision : "creates"
    Decision ||--o{ Option : "contains"
    Decision ||--o{ Criteria : "defines"
    Option ||--o{ Score : "receives"
    Criteria ||--o{ Score : "applies to"

    User {
        Int id PK
        String name
        String email UK
        String password
        DateTime createdAt
    }

    Decision {
        Int id PK
        Int user_id FK
        String title
        String description
        DateTime createdAt
    }

    Option {
        Int id PK
        Int decision_id FK
        String title
    }

    Criteria {
        Int id PK
        Int decision_id FK
        String title
        Int priority UK
    }

    Score {
        Int id PK
        Int option_id FK
        Int criteria_id FK
        Float value
    }
```

- **Unique Constraints**: 
  - `User.email` is unique.
  - `Criteria.priority` is unique.
  - `Score` has a compound unique constraint on `[option_id, criteria_id]` to prevent duplicate ratings.

---

## Project Directory Structure

```text
ClearHead-DecisionHelper/
├── frontend/                     # React Single Page Application
│   ├── src/
│   │   ├── api/                  # Axios configuration with JWT interceptors
│   │   ├── components/           # UI components, layout, and global views
│   │   ├── context/              # AuthContext (login, register, logout, session storage)
│   │   ├── features/             # Feature-specific components and hooks
│   │   │   └── dashboard/        # Dashboard panels, score matrix, results, and sidebar
│   │   │       ├── components/   # MetricCards, CriteriaPanel, OptionsPanel, ScoreMatrix, ResultsPanel...
│   │   │       └── useDashboardWorkspace.js # Custom hook managing API integrations & dashboard state
│   │   ├── pages/                # Main route pages (HomePage, Login, Signup, Dashboard)
│   │   ├── App.jsx               # App entry-point & React-Router setup
│   │   ├── index.css             # Tailwind v4 directives & root colors
│   │   └── main.jsx
│   ├── vite.config.js            # Vite configurations (dev server & API routing proxies)
│   └── package.json
│
└── server/                       # Express REST API
    ├── data/
    │   └── prisma/
    │       └── schema.prisma     # Prisma database schema
    ├── middleware/               # Auth validator, request parser, & custom error handlers
    ├── routes/                   # Router submodules
    │   ├── authentication/       # Auth routes (login, register, status check)
    │   ├── criteria/             # Criteria CRUD endpoints
    │   ├── decision/             # Decision CRUD endpoints
    │   ├── option/               # Option CRUD endpoints
    │   └── score/                # Score update/retrieval endpoints
    ├── utils/                    # Shared instances (e.g., Prisma client wrapper)
    ├── app.js                    # Server startup script
    ├── Sample.env                # Template environment variables config
    └── package.json
```

---

## Getting Started (Installation & Setup)

### Prerequisites
- Node.js (v18 or higher recommended)
- PostgreSQL database instance (local or hosted)

---

### Backend Setup

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install the backend dependencies:
   ```bash
   npm install
   ```

3. Create your `.env` configuration file from the sample:
   ```bash
   copy Sample.env .env
   # Or "cp Sample.env .env" on Linux/macOS
   ```

4. Populate the `.env` file with your details:
   - `DATABASE_URL`: Connection string to your PostgreSQL instance (e.g. `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`).
   - `JWT_SECRET`: A secure random string used to sign user authentication tokens.
   - `PORT`: Server port (default is usually `3000`).

5. Run Prisma migrations and code generation:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

6. Start the server:
   ```bash
   node app.js
   ```
   You should see `server started` once successfully connected.

---

### Frontend Setup

1. Open a new terminal and navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the `.env` configuration file:
   ```bash
   copy .env.example .env
   ```
   Ensure it targets the backend port if using custom environments:
   ```env
   axios_baseURL = 'http://localhost:3000'
   ```

4. Run the Vite development server:
   ```bash
   npm run dev
   ```
   By default, the Vite server will run at `http://localhost:5173`. Any requests to `/auth` or `/api` will be proxied to the backend server automatically as defined in `vite.config.js`.

---

## API Endpoints

### Authentication
- `POST /auth/register` - Create a new user account.
- `POST /auth/login` - Authenticate a user and receive JWT.
- `GET /auth/me` - Authenticate current user via authorization header token.

### Decisions
- `GET /api/decisions` - Retrieve all decisions for the authenticated user.
- `GET /api/decisions/:id` - Fetch details for a specific decision.
- `POST /api/decisions` - Create a new decision.
- `PUT /api/decisions/:id` - Update a decision's title or description.
- `DELETE /api/decisions/:id` - Delete a decision (cascade deletes options, criteria, and scores).

### Criteria
- `GET /api/decisions/:decisionId/criterias` - Fetch criteria list.
- `POST /api/decisions/:decisionId/criterias` - Add new criteria.
- `PUT /api/decisions/:decisionId/criterias/:id` - Edit criteria metadata or priority weight.
- `DELETE /api/decisions/:decisionId/criterias/:id` - Remove criteria.

### Options
- `GET /api/decisions/:decisionId/options` - Fetch options.
- `POST /api/decisions/:decisionId/options` - Create a new choice option.
- `DELETE /api/decisions/:decisionId/options/:id` - Delete option.

### Scores
- `GET /api/decisions/:decisionId/scores` - Fetch all scores recorded for the active decision.
- `POST /api/decisions/:decisionId/scores` - Save/Update a score value matching an option and criteria combination.

---

## State Management & Performance Optimization

To ensure smooth and fluid interactions inside the dashboard:
- The app utilizes a custom React hook `useDashboardWorkspace` which loads workspace structures (decisions, options, criteria, scores).
- Instead of triggering a full page re-render via a global refresh method whenever a single option or criteria gets added/deleted, the state updates locally (targeted React updates).
- Per-panel indicator flags (`criteriaBusy`, `optionsBusy`, `decisionBusy`) provide loading skeletons/spinners for exact modules without blocking interaction with the entire dashboard screen.
