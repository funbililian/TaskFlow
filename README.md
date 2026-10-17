# TaskFlow

TaskFlow is a full-stack task management application for organizing daily work. Create an account, manage tasks from a personal dashboard, and keep your profile and task list in MongoDB.

## Table of contents

- [Overview](#overview)
- [Features](#features)
- [Technology stack](#technology-stack)
- [Screenshots](#screenshots)
- [Project structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation and setup](#installation-and-setup)
- [Environment variables](#environment-variables)
- [Run locally](#run-locally)
- [API documentation](#api-documentation)
- [Authentication and task data flow](#authentication-and-task-data-flow)
- [MongoDB setup](#mongodb-setup)
- [Testing with an API client](#testing-with-an-api-client)
- [Deployment overview](#deployment-overview)
- [Security considerations](#security-considerations)
- [Troubleshooting](#troubleshooting)
- [Future improvements](#future-improvements)
- [Contributing](#contributing)
- [License](#license)
- [Author](#author)

## Overview

TaskFlow provides a straightforward place to create and track personal tasks. The React frontend communicates with an Express API, which authenticates users with JSON Web Tokens (JWT) and stores user profiles and task lists in MongoDB.

The app includes a landing page, registration and login forms, a task dashboard, and a profile page. The API and frontend run as separate applications during local development.

## Features

- Register an account and log in with an email address and password.
- Hash account passwords with `bcryptjs` before saving them.
- Authenticate API requests with JWT Bearer tokens and protect profile and task endpoints.
- Fetch the signed-in user's profile and update their full name and About Me (bio).
- View a dashboard with task totals, completed tasks, and remaining tasks.
- Create tasks with a title, priority, and optional due date.
- Mark tasks complete or incomplete, delete them, and filter by All, Active, or Completed.
- Save and retrieve a separate task list for each user in MongoDB.
- Navigate between the dashboard, Home, and Profile pages.
- Log out from the Profile page; this removes the saved token from browser local storage.

## Technology stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, Vite 8, JavaScript, CSS, React Router |
| Backend | Node.js, Express.js, CommonJS |
| Database | MongoDB, Mongoose |
| Authentication | JSON Web Tokens (`jsonwebtoken`), `bcryptjs` |
| API communication | Browser Fetch API |
| Development | npm, Nodemon, VS Code |
| API testing | Thunder Client or another REST API client |
| Database inspection | MongoDB Compass |

## Screenshots

Replace these placeholder image paths with screenshots of the running application. The screenshot files are not included in the repository.

<!-- Replace the placeholder images with real screenshots before publishing. -->

![TaskFlow landing page screenshot placeholder](./screenshots/landing-page.png)

![TaskFlow dashboard screenshot placeholder](./screenshots/dashboard.png)

![TaskFlow profile page screenshot placeholder](./screenshots/profile.png)

## Project structure

This tree reflects the current repository structure; generated `node_modules` folders are omitted.

```text
taskflow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── db.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   └── authMiddleware.js
│   │   ├── models/
│   │   │   ├── TaskList.js
│   │   │   └── User.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   └── taskRoutes.js
│   │   └── server.js
│   ├── .gitignore
│   ├── package.json
│   └── package-lock.json
├── public/
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── assets/
│   │   ├── hero.png
│   │   ├── react.svg
│   │   └── vite.svg
│   ├── pages/
│   │   ├── Landing.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   └── Register.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.css
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
└── README.md
```

## Prerequisites

- Windows with PowerShell.
- Git.
- Node.js **20.19+** or **22.12+** and npm. These versions meet the installed Vite 8 requirement.
- A MongoDB database, either a local MongoDB Community Server installation or a MongoDB Atlas cluster.
- Optional: MongoDB Compass to inspect the database and Thunder Client (a VS Code extension) to send API requests.

Check your Node.js and npm versions in PowerShell:

```powershell
node --version
npm --version
```

## Installation and setup

### 1. Clone the repository

Replace the example URL with the actual GitHub repository URL:

```powershell
git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPOSITORY>.git
Set-Location .\<YOUR_REPOSITORY>
```

### 2. Install frontend dependencies

Run from the repository root:

```powershell
npm install
```

### 3. Install backend dependencies

```powershell
Set-Location .\backend
npm install
Set-Location ..
```

### 4. Configure the backend environment

Create `backend\.env` using the safe template in [Environment variables](#environment-variables). Replace the placeholder MongoDB URI and JWT secret with values for your own development environment. Do not commit `.env` files.

### 5. Start or connect to MongoDB

Start your local MongoDB service, or create a MongoDB Atlas database and use its connection string in `MONGODB_URI`. See [MongoDB setup](#mongodb-setup).

## Environment variables

The backend reads these variables from `backend\.env`:

| Variable | Purpose | Example |
| --- | --- | --- |
| `PORT` | Port used by the backend; defaults to `5000` if omitted. | `5000` |
| `MONGODB_URI` | MongoDB connection string used by Mongoose. | `mongodb://127.0.0.1:27017/taskflow` |
| `JWT_SECRET` | Secret used to sign and verify authentication tokens. Use a long, random value. | `replace-with-a-long-random-secret` |

Safe `backend\.env.example` template (placeholders only):

```dotenv
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
JWT_SECRET=replace-with-a-long-random-secret
```

The repository currently does not include a `backend\.env.example` file. You can use the template above to create `backend\.env` locally; if you add a shareable example file, keep it limited to placeholder values. The backend's `.gitignore` excludes `.env`. Never commit real secrets, database credentials, or tokens to GitHub.

The frontend currently uses the fixed API base URL `http://localhost:5000/api` in `src\services\api.js`. It does **not** currently read `VITE_API_BASE_URL`; configuring a Vite environment variable with a localhost fallback would require a code change before using a separately hosted API.

## Run locally

Run the backend and frontend in two separate PowerShell terminals. Start MongoDB first.

### Terminal 1: backend

From the repository root:

```powershell
Set-Location .\backend
npm run dev
```

The `dev` script runs `nodemon src/server.js`. The backend connects to MongoDB before listening on `http://localhost:5000`. To run without Nodemon, use `npm start` instead.

### Terminal 2: frontend

From the repository root:

```powershell
npm run dev
```

Open the local URL printed by Vite in your browser. By default, this is `http://localhost:5173`.

## API documentation

The local API base URL is `http://localhost:5000`; authentication and task routes are mounted under `/api`. Protected endpoints require this request header:

```http
Authorization: Bearer <JWT>
```

| Method | Endpoint | Authentication | Description |
| --- | --- | --- | --- |
| `GET` | `/health` | No | Returns a simple API process health response. It does not verify MongoDB health. |
| `POST` | `/api/auth/register` | No | Creates an account and returns a JWT and user profile. |
| `POST` | `/api/auth/login` | No | Verifies credentials and returns a JWT and user profile. |
| `GET` | `/api/auth/getMe` | Yes | Returns the authenticated user's profile. |
| `GET` | `/api/auth/me` | Yes | Alias for the authenticated profile endpoint. |
| `PATCH` | `/api/auth/profile` | Yes | Updates the authenticated user's full name and/or bio. |
| `GET` | `/api/tasks` | Yes | Retrieves the authenticated user's tasks. |
| `PUT` | `/api/tasks` | Yes | Replaces the authenticated user's saved task list with the provided array. |

### Register

`POST /api/auth/register`

Request body:

```json
{
  "fullName": "Alex Morgan",
  "email": "alex@example.com",
  "password": "example-password",
  "confirmPassword": "example-password"
}
```

On success, the API returns status `201` with `success`, `message`, `token`, and `user` fields. The returned `user` includes `id`, `fullName`, `email`, and `bio`.

### Log in

`POST /api/auth/login`

Request body:

```json
{
  "email": "alex@example.com",
  "password": "example-password"
}
```

On success, the API returns status `200` with `success`, `message`, `token`, and `user` fields.

### Get the current user's profile

`GET /api/auth/getMe` (or the implemented alias `GET /api/auth/me`)

Send a Bearer token. On success, the response contains `success` and `user`. The profile includes `id`, `fullName`, `email`, `bio`, and `createdAt`.

### Update the profile

`PATCH /api/auth/profile`

Send a Bearer token and one or both of the editable fields:

```json
{
  "fullName": "Alex Morgan",
  "bio": "I enjoy planning my week."
}
```

On success, the API returns status `200`, a message, and the updated user profile. The email address is not editable through this endpoint.

### Get and save tasks

`GET /api/tasks` returns `success` and a `tasks` array. A new user with no saved list receives an empty array.

`PUT /api/tasks` replaces the saved list. Send a Bearer token and a `tasks` array:

```json
{
  "tasks": [
    {
      "id": 1720000000000,
      "title": "Plan the week",
      "completed": false,
      "priority": "Medium",
      "dueDate": "2026-10-20"
    }
  ]
}
```

Task fields accepted by the current controller are a non-negative safe-integer `id`, a non-empty `title` of at most 120 characters, a boolean `completed`, a `priority` of `Low`, `Medium`, or `High` (defaults to `Medium` when omitted), and an optional `dueDate` string in `YYYY-MM-DD` format. The list is limited to 500 tasks and IDs must be unique. A successful save returns status `200` with `success`, `message`, and the saved `tasks`.

### Health check

`GET /health` returns status `200` with `success`, `message`, and `service` fields when the API process is responding.

## Authentication and task data flow

1. The registration and login forms call the API with the Fetch API.
2. The backend verifies the submitted fields, hashes new passwords with `bcryptjs`, and signs a JWT using `JWT_SECRET`. Tokens currently expire after seven days.
3. The frontend stores the returned token in browser `localStorage` under `taskflow_token`.
4. The frontend API helper adds the token as a Bearer authorization header to requests. Backend middleware verifies it and loads the corresponding user before allowing access to protected routes.
5. The dashboard retrieves the signed-in user's task list from MongoDB through `GET /api/tasks`. Changes are cached in browser local storage and sent to the backend through `PUT /api/tasks`.
6. The Profile page fetches and updates the authenticated user's profile through the profile endpoints.
7. Logging out removes the token from local storage. A protected route request without a valid token is rejected by the backend.

## MongoDB setup

### Local MongoDB

Install and start MongoDB Community Server using its Windows installer and service configuration. If you installed it as a Windows service, check its service name and status in PowerShell:

```powershell
Get-Service *Mongo*
```

If the service is named `MongoDB`, start it with:

```powershell
Start-Service MongoDB
```

Set the local connection string in `backend\.env`:

```dotenv
MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
```

You can connect MongoDB Compass to `mongodb://127.0.0.1:27017` to inspect the local database.

### MongoDB Atlas

Create a cluster and database user in MongoDB Atlas, configure the cluster's network access for your development machine, and copy the application connection string. Put it in `MONGODB_URI` in `backend\.env`, replacing the username, password, and database placeholders with your own values. Do not put the connection string in frontend code or commit it to the repository.

Mongoose connects when the backend starts. The user and task-list collections are managed through the schemas in `backend\src\models`; MongoDB creates collections as documents are first written.

## Testing with an API client

No automated test script is currently defined in either `package.json`. You can manually test the API with Thunder Client or another REST client:

1. Start MongoDB and the backend.
2. Send `POST http://localhost:5000/api/auth/register` with the registration JSON shown above, or log in with `POST http://localhost:5000/api/auth/login`.
3. Copy the returned `token`.
4. For protected requests, set the `Authorization` header to `Bearer <token>`.
5. Try `GET http://localhost:5000/api/auth/getMe`, then `PATCH http://localhost:5000/api/auth/profile`.
6. Try `GET http://localhost:5000/api/tasks` and `PUT http://localhost:5000/api/tasks` with a `tasks` array.
7. Check `GET http://localhost:5000/health` to confirm that the API process responds.

The frontend also provides these project checks from the repository root:

```powershell
npm run lint
npm run build
```

## Deployment overview

TaskFlow has not been configured with a specific deployment provider. A typical deployment requires:

1. Deploying the Vite frontend to a static hosting service.
2. Deploying the Express backend to a Node.js hosting service.
3. Using a hosted MongoDB database, such as MongoDB Atlas.
4. Setting `PORT`, `MONGODB_URI`, and a strong `JWT_SECRET` in the backend host's secret/environment settings.
5. Updating the frontend's API URL from its current hardcoded localhost address to the deployed backend URL. The current frontend does not support `VITE_API_BASE_URL` yet.
6. Configuring the backend's CORS policy for the deployed frontend origin. The current server uses unrestricted `cors()` configuration.
7. Configuring the static host to serve the SPA entry point for application routes, and testing login, profile updates, and task persistence against the deployed services.

Use HTTPS and never expose backend secrets in frontend environment variables or bundled frontend code.

## Security considerations

- Passwords are hashed with `bcryptjs`; the Mongoose user schema excludes passwords from normal query results.
- Keep `JWT_SECRET` and `MONGODB_URI` private, use strong non-placeholder values outside local examples, and rotate any secret that is accidentally exposed.
- The browser stores the JWT in `localStorage`. This is convenient for the current app, but JavaScript-accessible storage can be exposed by cross-site scripting; review the token-storage strategy before handling sensitive production data.
- The API currently enables CORS for all origins. Restrict allowed origins before deploying.
- Use HTTPS in production, apply appropriate database network access restrictions, and avoid logging tokens, passwords, or connection strings.
- The current server does not configure production-specific rate limiting, security headers, or explicit request-size policies. Review and add suitable controls before a public production deployment.
- Treat frontend validation as a usability aid; the backend must remain the authority for request validation.

## Troubleshooting

| Problem | Checks and possible fix |
| --- | --- |
| Backend exits during startup | Confirm `backend\.env` exists and has a valid `MONGODB_URI`; confirm MongoDB is running and reachable. The backend exits if its MongoDB connection fails. |
| `MONGODB_URI` or `JWT_SECRET` appears undefined | Check that the file is named `backend\.env` and that each variable is spelled exactly as shown. Restart the backend after changing environment values. |
| Browser cannot reach the API | Confirm the backend is running on port `5000` and that the frontend API URL in `src\services\api.js` matches it. |
| Browser reports a CORS error | Local development uses the backend's current permissive CORS setup. For deployment, configure CORS to permit the actual frontend origin. |
| Protected request returns an authentication error | Log in again and send `Authorization: Bearer <token>`. The current JWT expires after seven days; logging out also removes the browser's token. |
| Tasks do not appear or save | Confirm you are logged in, the API and MongoDB are available, and the browser's task sync message does not show an error. Task data is associated with the authenticated user. |
| `npm` reports missing dependencies | Run `npm install` in the repository root for the frontend and separately in `backend`. |
| Vite reports an unsupported Node.js version | Install Node.js 20.19+ or 22.12+, then reopen PowerShell and verify with `node --version`. |

## Future improvements

- Read the frontend API URL from `VITE_API_BASE_URL` with a localhost development fallback.
- Add automated frontend and backend tests.
- Restrict CORS and add production security controls such as rate limiting and security headers.
- Consider a hardened authentication-token storage approach.
- Add task editing and richer filters or sorting.
- Add deployment configuration and screenshots after choosing hosting providers.

## Contributing

Contributions are welcome. Before opening a pull request:

1. Open an issue to describe a significant change or bug fix.
2. Create a focused branch and keep changes limited to the issue.
3. Install dependencies for both frontend and backend.
4. Run `npm run lint` and `npm run build` from the repository root.
5. Do not include `.env` files, real credentials, or generated `node_modules` content.
6. Describe the change and any manual testing performed in the pull request.

## License

No project-wide license file has been selected or added. The backend package metadata currently says `ISC`, but that does not by itself establish a license for the whole repository. **Project license: [choose and add a license].** Until then, do not assume that the repository grants permission to reuse or redistribute its code.

## Author

- **Name:** Oyebadejo Oluwafunbi Lilian
- **GitHub:** https://github.com/funbililian
- **Email:** funbililian@gmail.com
