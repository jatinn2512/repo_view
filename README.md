# Repo View Monorepo

React with TypeScript powers the frontend, FastAPI powers the backend, and all runnable project code now lives inside `repo_view/`.

## Stack

- Frontend: Vite, React, TypeScript, React Router, Tailwind CSS
- Backend: FastAPI, Uvicorn
- Workspace orchestration: npm workspaces and `concurrently`

## Folder Structure

```text
workshop/
├── README.md
└── repo_view/
    ├── backend/
    │   ├── app/
    │   │   ├── api/
    │   │   │   └── routes/
    │   │   │       ├── __init__.py
    │   │   │       └── auth.py
    │   │   ├── schemas/
    │   │   │   ├── __init__.py
    │   │   │   └── auth.py
    │   │   ├── __init__.py
    │   │   └── main.py
    │   └── requirements.txt
    ├── frontend/
    │   ├── src/
    │   │   ├── components/
    │   │   ├── contexts/
    │   │   ├── layouts/
    │   │   ├── pages/
    │   │   ├── router/
    │   │   ├── types/
    │   │   ├── App.tsx
    │   │   ├── index.css
    │   │   └── main.tsx
    │   ├── .env.example
    │   ├── index.html
    │   ├── package.json
    │   ├── postcss.config.cjs
    │   ├── tailwind.config.cjs
    │   ├── tsconfig.json
    │   └── vite.config.ts
    ├── .gitignore
    └── package.json
```

The older static prototype files inside `repo_view/` were removed. `repo_view/` is now the actual application workspace.

## First-Time Setup

### 1. Move into the application workspace

```powershell
cd repo_view
```

### 2. Install Node dependencies

```powershell
npm install
```

This installs:

- workspace tooling such as `concurrently`
- frontend dependencies inside `frontend/`

### 3. Create a Python virtual environment

```powershell
python -m venv backend/.venv
```

If your machine uses the Python launcher instead of `python`, use:

```powershell
py -m venv backend/.venv
```

### 4. Install backend dependencies

```powershell
backend/.venv/Scripts/python.exe -m pip install -r backend/requirements.txt
```

You do not need to activate the virtual environment before running `npm run dev`. The workspace npm scripts call `backend/.venv/Scripts/python.exe` directly.

### 5. Optional frontend environment file

The Vite dev server already proxies `/api` requests to FastAPI, so an environment file is optional for local development. If you want an explicit API base URL:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

## Run Both Servers

After the virtual environment is created and dependencies are installed, start both apps from inside `repo_view/`:

```powershell
npm run dev
```

This runs:

- React frontend at `http://127.0.0.1:5173`
- FastAPI backend at `http://127.0.0.1:8000`
- FastAPI docs at `http://127.0.0.1:8000/docs`

## Available Scripts

From inside `repo_view/`:

```powershell
npm run dev
npm run dev:frontend
npm run dev:backend
npm run build
```

## Authentication Demo

Use either of these identifiers:

- `demo`
- `demo@repoview.dev`

Password:

- `Password123!`

The frontend stores the mock session in local storage and protects internal routes with React Context plus route guards.

## Frontend Behavior

The frontend includes:

- `LoginPage` as a public route
- `DashboardHome` as a protected route
- `ViewRepo` as a protected route
- `History` as a protected route
- `Settings` as a protected route
- `Account` as a protected route
- a persistent left sidebar with top and bottom navigation groups
- nested route rendering through the dashboard layout and `<Outlet />`

## Backend Behavior

The backend includes:

- CORS configured for `http://localhost:5173` and `http://127.0.0.1:5173`
- `GET /api/health`
- `POST /api/login`

Sample login request:

```json
{
  "identifier": "demo@repoview.dev",
  "password": "Password123!"
}
```

Sample success response:

```json
{
  "access_token": "demo-access-token",
  "token_type": "bearer",
  "user": {
    "id": "demo-user-001",
    "name": "Demo User",
    "email": "demo@repoview.dev",
    "role": "Administrator"
  }
}
```

## Recommended Next Steps

- Replace the mock login handler with real JWT issuance and password verification.
- Add a backend router for repository analysis results.
- Connect the `ViewRepo` page to live FastAPI endpoints.
- Add API tests and frontend route tests after dependencies are installed.
