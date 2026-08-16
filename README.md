# FleetFlow

FleetFlow is a modern fleet management and operations platform designed to help organizations monitor vehicles, manage drivers, coordinate trips, track maintenance, and analyze operational performance in one place. It brings together a responsive frontend experience with a FastAPI-powered backend to streamline fleet visibility and decision-making.

---

## 🚚 Overview

FleetFlow helps teams:

- Track and manage vehicle records
- Monitor driver activity and trip assignments
- Review maintenance schedules and service history
- Analyze fleet performance through dashboards and KPIs
- Manage trip operations and expenses from a unified interface

---

## 🧰 Tech Stack

### Frontend
- React.js
- Vite
- React Router
- Leaflet / Map visualization
- Recharts for charts and analytics
- Axios for API communication

### Backend
- Python
- FastAPI
- Uvicorn
- SQLAlchemy
- Pydantic

### Database
- SQLite for local development
- Replace with PostgreSQL / MySQL in production if needed

> If you plan to use a different database, update the connection settings in the backend configuration and add the appropriate environment variables.

---

## 📁 Folder Structure

```text
FleetFlow/
├── README.md
├── fleetflow-backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── analytics.py
│   │       ├── auth.py
│   │       ├── dashboard.py
│   │       ├── drivers.py
│   │       ├── expenses.py
│   │       ├── maintenance.py
│   │       ├── trips.py
│   │       └── vehicles.py
│   ├── pyproject.toml
│   └── README.md
├── fleetflow-frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── styles/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   ├── eslint.config.js
│   └── README.md
└── .git/
```

---

## ✅ Prerequisites

Before running the project, make sure you have the following installed:

- Git
- Node.js 18+ or newer
- npm or yarn
- Python 3.10+ (project currently targets Python 3.13-compatible tooling)
- pip
- A virtual environment tool such as `venv`
- Optional: Docker for containerized setup

---

## ⚙️ Installation & Setup

### 1) Clone the repository

```bash
git clone <your-repository-url>
cd FleetFlow
```

### 2) Set up the backend

```bash
cd fleetflow-backend
python -m venv .venv
```

Activate the virtual environment:

On Windows (PowerShell):

```powershell
.\.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

Install backend dependencies:

```bash
python -m pip install --upgrade pip
pip install -e .
```

### 3) Set up the frontend

```bash
cd ../fleetflow-frontend
npm install
```

---

## 🔐 Environment Variables

Create local environment files in both application folders:

- `fleetflow-backend/.env`
- `fleetflow-frontend/.env`

Example backend variables:

```env
DATABASE_URL=sqlite:///./fleetflow.db
SECRET_KEY=your-secret-key
```

Example frontend variables:

```env
VITE_API_BASE_URL=http://localhost:8000
```

> Adjust values based on your deployment and security requirements.

---

## ▶️ Running the Application

### Start the backend server

From the project root:

```bash
cd fleetflow-backend
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend API should be available at:

- http://localhost:8000
- Swagger docs: http://localhost:8000/docs

### Start the frontend development server

From the project root:

```bash
cd fleetflow-frontend
npm run dev
```

The frontend is typically available at:

- http://localhost:5173

---

## 🧪 Useful Development Notes

- Run the backend in development mode using `--reload` for automatic restarts.
- Use the frontend dev server for hot reloading during UI work.
- Keep both services running concurrently while developing the app.
- If needed, add Docker configurations later for consistent local and deployment environments.

---

## 📌 Project Status

This repository is structured as a monorepo with a dedicated backend API and frontend interface. It is suitable for local development, dashboard-based fleet operations, and future expansion into production deployment workflows.

---

## 🤝 Contributing

1. Create a feature branch.
2. Make your changes.
3. Test both frontend and backend behavior.
4. Open a pull request with a clear summary of the update.

---

## License

This project does not currently include a license file. Add one if you plan to distribute the code publicly or within a team.
