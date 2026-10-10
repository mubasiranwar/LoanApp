# How to test the trainer's changes

## 0. One-time setup

```bash
# backend
cd backend/LoanApp_task2
npm install
# in .env set (see .env.example):
#   FRONTEND_URL=http://localhost:3000,http://localhost:3002
#   ADMIN_USERNAME / ADMIN_EMAIL / ADMIN_PASSWORD   (8-72 chars password)
npm run db:migrate
npm run db:seed:admin          # creates the admin account (run once)
npm run dev                    # API on http://localhost:5000

# frontend (second terminal)
cd frontend/loan-management-ui
npm install
npm run dev                    # http://localhost:3000
```

> The API path changed from `/api/loan` to `/api/loans`. Update any saved Postman requests.

## 1. Automatic check of the backend (30 seconds)

With the API running:

```bash
cd backend/LoanApp_task2
npm run test:smoke
```

Expected: `28/28 checks passed`. It covers admin-only status route, users can't
choose a status, approved/rejected loans are locked, bad UUIDs / malformed JSON /
unknown routes return 4xx JSON, and CORS for both frontend ports.

## 2. Manual check in the browser

Use two browsers (or one normal + one private window): one for a user, one for the admin.

| # | Do this | Expected |
| --- | --- | --- |
| 1 | Sign up a new user, open **New Application** | No Status dropdown. |
| 2 | Create a loan | Row appears as **Pending**. Edit and Delete are enabled. |
| 3 | Edit it, then create a second one and delete it | Both work (loan is still pending). |
| 4 | Log in as the **admin** | Heading "All Loan Applications", an **Admin** badge, a "Submitted by" column, **no** New Application button. |
| 5 | Click the ✓ on the user's loan | Confirmation dialog -> Approve -> badge turns **Approved**, row shows "Decided". |
| 6 | Reject another pending loan | Badge turns **Rejected**. |
| 7 | Log back in as the user | Approved/Rejected rows: Edit and Delete are greyed out (hover shows why). |
| 8 | Navbar | No "Dashboard"/"Applications" links. |
| 9 | Run the frontend on another port: `npx next dev -p 3002` | Login still works (CORS), as long as 3002 is in `FRONTEND_URL`. |
| 10 | In DevTools > Application > Local Storage set `token` to `garbage`, reload | Redirected to /login and the token is removed. |

## 3. Manual API checks (curl)

Replace `$TOKEN` / `$ADMIN_TOKEN` with the `token` from `POST /api/auth/login`.

```bash
API=http://localhost:5000/api

# user tries to choose a status            -> 400
curl -s -X POST $API/loans -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"applicant_name":"A","amount":1000,"tenure_months":6,"purpose":"x","status":"APPROVED"}'

# user calls the admin route               -> 403
curl -s -X PATCH $API/loans/<LOAN_ID>/status -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"status":"APPROVED"}'

# admin approves                           -> 200 (a second time -> 409)
curl -s -X PATCH $API/loans/<LOAN_ID>/status -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" -d '{"status":"APPROVED"}'

# user edits / deletes an approved loan    -> 403
curl -s -X PUT $API/loans/<LOAN_ID> -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" -d '{"amount":1}'

curl -s $API/loans/abc -H "Authorization: Bearer $TOKEN"        # invalid id   -> 400
curl -s -X POST $API/auth/login -H "Content-Type: application/json" -d '{"email":'  # bad JSON -> 400
curl -s $API/nothing-here                                       # unknown route -> 404 JSON
```
