# LoanFlow

LoanFlow is a loan application management system with a Next.js dashboard, an
Express REST API, and PostgreSQL persistence. The dashboard reads loan
applications from the API and supports creating, editing, and deleting them.

This README explains the repository layout, how to run each part locally, how a
request travels through the application, and where to look when extending it.

## Contents

- [Architecture at a glance](#architecture-at-a-glance)
- [Repository layout](#repository-layout)
- [Requirements](#requirements)
- [Local setup](#local-setup)
- [Database setup](#database-setup)
- [Run the application](#run-the-application)
- [How the application works](#how-the-application-works)
- [Loan API](#loan-api)
- [Loan data model](#loan-data-model)
- [Authentication and user access](#authentication-and-user-access)
- [Troubleshooting](#troubleshooting)
- [Useful commands](#useful-commands)

## Architecture at a glance

```text
Browser
  |
  | Next.js page and React components
  | TanStack Query manages server state
  | Axios sends HTTP requests
  v
Express API (http://localhost:5000/api)
  |
  | Routes -> validation middleware -> controller -> service
  | Sequelize maps model operations to SQL
  v
PostgreSQL (localhost:5432, database: loan_management)
```

The frontend and backend run as two separate Node.js applications:

| Part | Local URL | Directory |
| --- | --- | --- |
| Next.js frontend | `http://localhost:3000` | `frontend/loan-management-ui` |
| Express backend | `http://localhost:5000` | `backend/LoanApp_task2` |
| PostgreSQL | `localhost:5432` | configured on your machine |

The backend serves its REST API below `/api`. For example, the loan collection
endpoint is `http://localhost:5000/api/loans`.

## Repository layout

```text
LoanApp/
├── README.md
├── backend/
│   └── LoanApp_task2/
│       ├── app.js                    # Express app and middleware registration
│       ├── server.js                 # DB authentication and HTTP startup
│       ├── .env.example              # Backend configuration template
│       ├── .sequelizerc              # Sequelize CLI paths
│       ├── scripts/                  # Smoke test and DB connection check
│       └── src/
│           ├── config/               # Runtime and Sequelize CLI configuration
│           ├── controllers/          # HTTP handlers
│           ├── database/             # Sequelize instance, models, migrations, seed data
│           ├── enums/                # LOAN_STATUS, USER_ROLE, HTTP_STATUS
│           ├── errors/               # Application error classes
│           ├── middleware/           # Request validation and error responses
│           ├── routes/               # API route definitions
│           ├── schemas/              # Joi validation schemas
│           └── services/             # Loan business logic and database calls
└── frontend/
    └── loan-management-ui/
        ├── .env.local                # Frontend API URL (local, not committed)
        ├── package.json
        └── src/
            ├── app/
            │   ├── globals.css       # Tailwind and global design tokens
            │   ├── layout.js         # Root layout and providers
            │   ├── login/page.js     # Login page
            │   ├── page.js           # Loan dashboard and action orchestration
            │   ├── signup/page.js    # Registration page
            │   └── providers.js      # Auth and TanStack Query providers
            ├── components/
            │   ├── AuthForm.jsx
            │   ├── DeleteModal.jsx
            │   ├── LoanModal.jsx
            │   ├── LoanTable.jsx
            │   ├── Navbar.jsx
            │   └── SummaryCards.jsx
            ├── context/
            │   └── AuthContext.js    # Client-side token/session state
            ├── hooks/
            │   └── useLoans.js       # Loan queries and mutations
            └── services/
                └── api.js            # Shared Axios client and interceptors
```

## Requirements

- Node.js and npm
- PostgreSQL running locally or reachable over the network
- A PostgreSQL database and user with permission to create tables and records

The frontend uses Next.js, React, Tailwind CSS, Axios, TanStack Query, and
Lucide icons. The backend uses Express, Joi, Sequelize, and the PostgreSQL
driver.

## Local setup

Open separate terminals for the following commands. Commands below use
PowerShell-compatible paths on Windows; change the paths if your checkout is
elsewhere.

### 1. Install backend dependencies

```powershell
cd D:\BackendDev\LoanApp\backend\LoanApp_task2
npm install
```

### 2. Configure the backend

Copy the example environment file and set values that match your PostgreSQL
installation:

```powershell
Copy-Item .env.example .env
```

The backend `.env` file should contain values in this shape:

```dotenv
PORT=5000
FRONTEND_URL=http://localhost:3000

DB_HOST=localhost
DB_PORT=5432
DB_NAME=loan_management
DB_USER=postgres
DB_PASSWORD=your_local_postgres_password
DB_DIALECT=postgres
JWT_SECRET=replace_with_a_long_random_secret

ADMIN_USERNAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

Replace the example password with your own local database password. Do not
commit `.env` or put real credentials in source control.
Generate a high-entropy value for `JWT_SECRET` (for example, with Node's
`crypto.randomBytes(48).toString("base64url")`). The API refuses to start if
this secret is missing. Keep it private and use the same secret across all
instances that need to verify each other's tokens.

The application reads `PORT` and `FRONTEND_URL` in `src/config/index.js`.
`FRONTEND_URL` is the browser origin allowed by the backend's CORS middleware.
It accepts comma-separated browser origins, each including its scheme and port
and without a trailing slash. The API allows `GET`, `POST`, `PUT`, `PATCH`,
`DELETE`, and preflight `OPTIONS` requests from those origins.
The database configuration is consumed by Sequelize in
`src/database/index.js` and by the Sequelize CLI in `src/config/database.js`.
The `ADMIN_*` values are required to seed the admin account; they are not
needed just to start the API.

### 3. Install frontend dependencies

```powershell
cd D:\BackendDev\LoanApp\frontend\loan-management-ui
npm install
```

The local frontend API configuration is in `.env.local`:

```dotenv
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

Next.js exposes variables prefixed with `NEXT_PUBLIC_` to browser code. Do not
put secrets in this file. If the backend runs at a different address, update
both `NEXT_PUBLIC_API_URL` and the backend's `FRONTEND_URL` as appropriate.
Restart the Next.js development server after changing `.env.local`.

## Database setup

The backend does not automatically create the database or tables at startup.
It authenticates the database connection before listening. From the backend
directory, create the configured database and apply its migrations:

```powershell
npm run db:create
npm run db:migrate
```

Before seeding, set all three admin variables in the backend `.env`:

```dotenv
ADMIN_USERNAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

Create the admin first, then optionally seed sample loans owned by that admin:

```powershell
npm run db:seed:admin
npm run db:seed:loans
```

Do not use `npx sequelize-cli db:seed:all`: the admin seeder requires
`ADMIN_USERNAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD`, and the sample-loan
seeder requires the configured admin to exist. Each seeder inserts records;
avoid rerunning it unless you intend to add duplicate seed data.

For a fresh database, apply all migrations before seeding as shown above. When
upgrading a database that already contains loans without an owner, apply
migrations through the ownership-column migration, seed the admin, and then
apply the remaining migration. This allows existing unassigned loans to be
associated with that admin before `user_id` becomes required:

```powershell
npx sequelize-cli db:migrate --to 20261006001000-add-user-id-to-loans.js
npm run db:seed:admin
npm run db:migrate
```

The admin seeder intentionally fails if an account with `ADMIN_EMAIL` already
exists. Verify that account's role rather than seeding it again.

To undo the most recent migration:

```powershell
npx sequelize-cli db:migrate:undo
```

Database credentials are read from the backend `.env` file. If the database
does not exist, credentials are incorrect, or PostgreSQL is not running, the
migration and API database requests will fail.

## Run the application

Start the backend in one terminal:

```powershell
cd D:\BackendDev\LoanApp\backend\LoanApp_task2
npm start
```

Expected startup output:

```text
Server running on http://localhost:5000
```

Start the frontend in another terminal:

```powershell
cd D:\BackendDev\LoanApp\frontend\loan-management-ui
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The dashboard requests
loans from the backend and displays the saved applications.

The port settings are intentionally separate: Next.js uses port `3000`, while
the backend defaults to port `5000`. If Next.js reports that port `3000` is
already occupied and starts on another port, change `FRONTEND_URL` in the
backend `.env` to match that new browser origin, then restart the backend.

Helmet adds security-related response headers. Signup and login are each
limited to 10 requests per IP per 15-minute window.

## How the application works

### Initial dashboard load

1. Next.js renders the root layout from `src/app/layout.js`.
2. `src/app/providers.js` creates a TanStack Query client and wraps the app with
   `QueryClientProvider` and `AuthProvider`.
3. `AuthProvider` restores the token and validates it with `GET /api/auth/me`.
   If no valid session exists, the dashboard redirects to `/login`.
4. `src/app/page.js` calls `useLoans()` and renders the navbar, summary cards,
   and loan table.
5. `useLoans()` calls `GET /loans` through the shared Axios client in
   `src/services/api.js`. The client attaches the bearer token, and the
   configured API URL resolves this to `GET http://localhost:5000/api/loans`.
6. Express authenticates the token, attaches its user ID to the request, and
   the controller passes the user to the loan service. Sequelize returns that
   user's loans, or all loans when the authenticated user is an admin.
7. The response's paginated `data` array becomes that user's TanStack Query
   cache. The table renders the current page, while summary cards use the
   response's full result totals.

During the request, the table displays loading skeletons. If the request fails,
the dashboard shows an error and a retry action instead of presenting a failed
request as an empty database.

### Creating an application

1. The dashboard opens `LoanModal`.
2. The modal validates required text, positive amount, and positive whole-number
   tenure before submitting.
3. `useCreateLoan()` sends `POST /api/loans`.
4. Express validates the request body with the create Joi schema.
5. The controller delegates to the service, which creates a Sequelize model
   record.
6. On success the mutation invalidates the `["loans"]` query, so TanStack Query
   fetches the current list and updates the table and summary counts.

### Editing an application

1. The table's Edit action opens `LoanModal` with the selected application.
2. The modal submits the changed fields to `useUpdateLoan()`.
3. The hook sends `PUT /api/loans/:id`.
4. The backend validates the body and updates the matching database record.
5. Successful updates invalidate `["loans"]`, refreshing the rendered data.

### Deleting an application

1. The table's Delete action opens `DeleteModal` for the selected record.
2. Confirming calls `useDeleteLoan()`, which sends `DELETE /api/loans/:id`.
3. The backend deletes the record and returns HTTP `204 No Content`.
4. Successful deletion invalidates `["loans"]`, removing the record from the
   table and recalculating summary counts.

### Shared Axios client and auth token handling

`src/services/api.js` centralizes the API base URL and HTTP interceptors:

- Before requests, it checks browser `localStorage` for `token` and then
  `auth_token`. If found, the token is sent as a Bearer authorization header.
- For HTTP 401 responses, it clears both token keys and dispatches the
  `auth:unauthorized` browser event.

The auth provider loads the saved token on refresh and verifies it by calling
`GET /api/auth/me`. It provides the current user and login/logout actions. Loan
query keys are partitioned by user ID, and logout clears the query cache to
avoid showing one account's data after switching accounts.

## Loan API

Loan endpoints are under `/api/loans` and require an
`Authorization: Bearer <token>` header. All operations are scoped to the
authenticated owner.

| Method | Path | Purpose | Success |
| --- | --- | --- | --- |
| `GET` | `/api/loans?page=1&limit=10` | List a page of loans, newest first | `200 OK`, `{ success, data, pagination, summary }` |
| `POST` | `/api/loans` | Create a loan | `201 Created`, `{ success, message, data }` |
| `GET` | `/api/loans/:id` | Get one loan by UUID | `200 OK`, `{ success, data }` |
| `PUT` | `/api/loans/:id` | Update one loan | `200 OK`, `{ success, message, data }` |
| `DELETE` | `/api/loans/:id` | Delete one loan | `204 No Content` |
| `PATCH` | `/api/loans/:id/status` | Admin approves or rejects a pending loan | `200 OK`, `{ success, message, data }` |

Create request example:

```json
{
  "applicant_name": "Jordan Lee",
  "amount": 25000,
  "tenure_months": 36,
  "purpose": "Home renovation"
}
```

The required create fields are `applicant_name`, `amount`, `tenure_months`, and
`purpose`. Clients cannot include `status`; all newly created loans start as
`PENDING`. Admins can change a pending loan to `APPROVED` or `REJECTED` through
the status endpoint.

Typical list response:

```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "applicant_name": "Jordan Lee",
      "amount": "25000.00",
      "tenure_months": 36,
      "purpose": "Home renovation",
      "status": "PENDING",
      "created_at": "2026-10-06T08:00:00.000Z",
      "updated_at": "2026-10-06T08:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  },
  "summary": {
    "total": 1,
    "pending": 1,
    "approved": 0,
    "rejected": 0
  }
}
```

Loan lists accept `page` and `limit` query parameters. Defaults are page `1`
and 10 records; `limit` must be between 1 and 100. For example,
`GET /api/loans?page=2&limit=25` returns the second page. The `pagination`
object reports the current page, page size, total matching records, and total
pages. The `summary` counts cover every loan visible to the authenticated
user (or every loan for an admin), not only the current page.

The database `DECIMAL` amount may be serialized as a string. The frontend
converts it to a number for display.

Validation and application errors are returned as JSON with a `message`, for
example:

```json
{
  "success": false,
  "message": "Loan amount must be greater than zero"
}
```

Validation errors use HTTP 400, missing loans use HTTP 404, and unexpected
server/database errors use HTTP 500. Missing or another user's loan both
return HTTP 404. Attempting to change a loan that is no longer pending returns
HTTP 409 Conflict.

## Authentication and user access

The `users` table contains:

| Field | Type / rule | Meaning |
| --- | --- | --- |
| `id` | UUID primary key | User identity used in tokens and ownership |
| `username` | String, 2-100 characters | Display name |
| `email` | Unique string, max 254 | Normalized sign-in address |
| `password_hash` | String | bcrypt password hash; never returned by the API |
| `role` | `USER` or `ADMIN` | Access marker; public signup always creates `USER` |
| `created_at`, `updated_at` | Timestamps | Account lifecycle timestamps |

The API supports email/password registration and login. Passwords are hashed
with bcrypt before storage. Successful registration and login return a signed,
eight-hour JWT and a public user profile (the password hash is never returned).
Public signup always assigns the `USER` role; clients cannot choose their role.

The frontend stores the bearer token in browser `localStorage`, sends it with
API requests, and checks the signed-in profile through `GET /api/auth/me` after
a page reload. Logging out clears the local token and cached loan data; JWTs
are not server-side sessions and cannot be individually revoked before expiry.
For higher-security deployments, consider an HTTP-only secure cookie, token
rotation/revocation, TLS, and account recovery controls.

All `/api/loans` endpoints require a valid bearer token. Loan list, read, update,
and delete operations are scoped to the authenticated user's ID, except admins
can list every loan and read any loan by UUID. Admin list results include each
loan submitter's public profile. A user cannot read or change another user's
loan by guessing its UUID; the API responds as though that loan does not exist.

Authentication endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/signup` | Create a user account and return a token |
| `POST` | `/api/auth/login` | Verify credentials and return a token |
| `GET` | `/api/auth/me` | Return the profile for the current bearer token |

Signup request:

```json
{
  "username": "Jordan Lee",
  "email": "jordan@example.com",
  "password": "your-secure-password"
}
```

Login accepts `email` and `password`. Passwords must contain at least eight
characters and no more than 72 UTF-8 bytes (the bcrypt input limit). Email
addresses are trimmed and normalized to lowercase. Duplicate registration
emails return HTTP 409. Invalid login credentials return a generic HTTP 401
response.

The frontend has separate `/signup` and `/login` pages. After successful
authentication it saves the returned token, navigates to the dashboard, and
shows errors returned by the API directly in the form. Unauthenticated users
are redirected from the dashboard to `/login`.

## Loan data model

The `loans` table has these fields:

| Field | Type / rule | Meaning |
| --- | --- | --- |
| `id` | UUID primary key | Generated loan identifier |
| `applicant_name` | String, max 100, required | Applicant's name |
| `amount` | Decimal(15, 2), required | Requested loan amount |
| `tenure_months` | Positive integer, required | Repayment term in months |
| `purpose` | String, max 255, required | Reason for the loan |
| `status` | Enum, required | `PENDING`, `APPROVED`, or `REJECTED` |
| `user_id` | Required UUID foreign key | Owner of the application |
| `created_at` | Timestamp | Creation time |
| `updated_at` | Timestamp | Last update time |

The model and migration are maintained separately:

- Sequelize model: `backend/LoanApp_task2/src/database/models/loan.model.js`
- Database migration: `backend/LoanApp_task2/src/database/migrations/`
- Sample data: `backend/LoanApp_task2/src/database/seeders/`

Keep the model, validation schema, and migration aligned when changing the
database fields.

## Roles, loan status and admin setup

There are two roles (`src/enums/user-role.enum.js`):

| Role | Can do |
| --- | --- |
| `USER` | Create loan applications; see, edit and delete **their own** applications **while they are `PENDING`**. |
| `ADMIN` | See **every** application and approve or reject pending ones. Admins do not create applications. |

Rules enforced by the backend (the frontend only mirrors them):

- A new loan is always `PENDING`. `status` is rejected (`400`) in create/update bodies.
- Only `PATCH /api/loans/:id/status` (admin only) changes the status, and only to `APPROVED` or `REJECTED`.
- A decision is final: deciding an already decided loan returns `409`.
- `APPROVED` / `REJECTED` loans cannot be edited or deleted by the applicant (`409` conflict).

| Method | Path | Who | Notes |
| --- | --- | --- | --- |
| `GET` | `/api/loans` | any logged-in user | admin: all loans (with `user`), user: own loans |
| `POST` | `/api/loans` | `USER` | always created as `PENDING` |
| `GET` | `/api/loans/:id` | owner or admin | `:id` must be a UUID, otherwise `400` |
| `PUT` | `/api/loans/:id` | owner | only while `PENDING` |
| `DELETE` | `/api/loans/:id` | owner | only while `PENDING` |
| `PATCH` | `/api/loans/:id/status` | `ADMIN` | body `{ "status": "APPROVED" \| "REJECTED" }` |

### Creating the first admin

Put the admin details in `backend/LoanApp_task2/.env` (never commit them):

```text
ADMIN_USERNAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=choose-a-strong-password
```

then run once: `npm run db:seed:admin`. It requires all three `ADMIN_*`
variables and creates an `ADMIN` account. To seed example loans owned by that
admin, run `npm run db:seed:loans` afterward.

### Allowing several frontend URLs (CORS)

`FRONTEND_URL` accepts a comma-separated list:

```text
FRONTEND_URL=http://localhost:3000,http://localhost:3002
```

Include each frontend's exact origin (scheme and port, no trailing slash).
The backend allows `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, and preflight
`OPTIONS` requests from those origins.

## Troubleshooting

### The dashboard says it cannot load applications

- Confirm the backend is running and prints `http://localhost:5000`.
- Open `http://localhost:5000/` to check the API process is responding.
- Open `http://localhost:5000/api/loans` to check the loan endpoint and database.
- Check that `.env.local` in the frontend contains
  `NEXT_PUBLIC_API_URL=http://localhost:5000/api`.
- Restart Next.js after changing `.env.local`.
- Check the backend terminal for PostgreSQL or Sequelize errors.

### The backend cannot connect to PostgreSQL

- Confirm PostgreSQL is running and accepting connections on `DB_HOST` and
  `DB_PORT`.
- Confirm the `DB_NAME` database exists.
- Check `DB_USER` and `DB_PASSWORD` in the backend `.env`.
- Check the backend startup output; it authenticates its database connection
  before listening.
- Apply migrations with `npm run db:migrate`.

### Browser reports a CORS error

- Set backend `FRONTEND_URL` to the exact frontend origin, including protocol
  and port (for example, `http://localhost:3000`).
- Restart the backend after changing its `.env`.
- If Next.js chose another port, set `FRONTEND_URL` to that port.

### Port already in use

Use separate ports for the Next.js development server and API. The backend
defaults to `5000`, and the frontend development server usually uses `3000`.
Change `PORT` or stop the other process if a required port is occupied. When
changing the frontend port, also adjust `FRONTEND_URL`.

## Useful commands

Run these from the corresponding project directory:

```powershell
# Frontend: start development server
npm run dev

# Frontend: lint
npm run lint

# Frontend: production build
npm run build

# Backend: start API
npm start

# Backend: run database migrations
npm run db:migrate

# Backend: create configured database (PostgreSQL user needs CREATEDB privilege)
npm run db:create

# Backend: create configured admin (requires ADMIN_* values in .env)
npm run db:seed:admin

# Backend: seed sample loans
npm run db:seed:loans

# Backend: verify database connection
npm run db:test
```
