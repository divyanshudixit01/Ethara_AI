# Team Task Manager (Admin/Member RBAC)

Production-ready full-stack task manager with JWT auth, role-based access control, project/task management, dashboard analytics, and Railway deployment support.

## Tech Stack

- Frontend: React (Vite), Tailwind CSS, React Router, Axios, React Hot Toast
- Backend: Node.js, Express, Mongoose, JWT, bcryptjs, express-validator
- Database: MongoDB Atlas (or any MongoDB instance)
- Deployment: Railway (separate frontend + backend services)

## Folder Structure

```text
Ethara_AI/
├─ backend/
│  ├─ src/
│  │  ├─ config/
│  │  │  └─ db.js
│  │  ├─ controllers/
│  │  │  ├─ authController.js
│  │  │  ├─ projectController.js
│  │  │  ├─ taskController.js
│  │  │  └─ userController.js
│  │  ├─ middlewares/
│  │  │  ├─ authMiddleware.js
│  │  │  ├─ errorHandler.js
│  │  │  └─ validateRequest.js
│  │  ├─ models/
│  │  │  ├─ Project.js
│  │  │  ├─ Task.js
│  │  │  └─ User.js
│  │  ├─ routes/
│  │  │  ├─ authRoutes.js
│  │  │  ├─ projectRoutes.js
│  │  │  ├─ taskRoutes.js
│  │  │  └─ userRoutes.js
│  │  ├─ utils/
│  │  │  └─ generateToken.js
│  │  ├─ app.js
│  │  └─ server.js
│  ├─ .env.example
│  └─ package.json
├─ frontend/
│  ├─ src/
│  │  ├─ api/
│  │  │  └─ api.js
│  │  ├─ components/
│  │  │  ├─ Loader.jsx
│  │  │  └─ ProtectedRoute.jsx
│  │  ├─ context/
│  │  │  └─ AuthContext.jsx
│  │  ├─ layouts/
│  │  │  └─ AppLayout.jsx
│  │  ├─ pages/
│  │  │  ├─ DashboardPage.jsx
│  │  │  ├─ LoginPage.jsx
│  │  │  ├─ NotFoundPage.jsx
│  │  │  ├─ ProjectsPage.jsx
│  │  │  ├─ RegisterPage.jsx
│  │  │  └─ TasksPage.jsx
│  │  ├─ App.jsx
│  │  ├─ index.css
│  │  └─ main.jsx
│  ├─ .env.example
│  ├─ vite.config.js
│  └─ package.json
└─ README.md
```

## Backend Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

### Backend Environment Variables

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/team_task_manager
JWT_SECRET=replace_with_secure_random_string
CLIENT_URL=http://localhost:5173
```

### Backend API Endpoints

- Auth:
  - `POST /api/auth/signup`
  - `POST /api/auth/login`
  - `GET /api/auth/me` (protected)
- Users:
  - `GET /api/users` (admin only)
- Projects:
  - `GET /api/projects` (admin sees all, member sees related)
  - `POST /api/projects` (admin)
  - `PUT /api/projects/:id` (admin)
  - `DELETE /api/projects/:id` (admin)
- Tasks:
  - `GET /api/tasks` (admin sees all, member sees assigned)
  - `POST /api/tasks` (admin)
  - `PUT /api/tasks/:id` (admin or assigned member)
  - `PATCH /api/tasks/:id/status` (admin or assigned member)
  - `DELETE /api/tasks/:id` (admin)

## Frontend Setup

```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```

### Frontend Environment Variables

```env
VITE_API_URL=http://localhost:5000/api
```

## Railway Deployment Steps

Deploy as **two Railway services** (recommended):

1. Push this repository to GitHub.
2. Create a new Railway project.
3. Add **Backend Service** from GitHub repo:
   - Root directory: `backend`
   - Start command: `npm start`
   - Variables:
     - `NODE_ENV=production`
     - `PORT=5000` (or Railway-provided port)
     - `MONGO_URI=<your_mongodb_uri>`
     - `JWT_SECRET=<strong_secret>`
     - `CLIENT_URL=<frontend_railway_url>`
4. Add **Frontend Service** from the same repo:
   - Root directory: `frontend`
   - Build command: `npm run build`
   - Start command: `npm run preview -- --host 0.0.0.0 --port $PORT`
   - Variable:
     - `VITE_API_URL=<backend_railway_url>/api`
5. Redeploy both services after setting variables.
6. Verify:
   - Backend health: `<backend_url>/api/health`
   - Frontend can register/login and manage tasks by role.

## Production Readiness Notes

- Passwords hashed with `bcryptjs`
- JWT auth + protected routes + role guards
- Input validation with `express-validator`
- Security middleware (`helmet`, CORS config)
- Centralized error handling
- Loading states and toast feedback in frontend
- Clean modular folder architecture for scale

