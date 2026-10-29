# MailGuard AI — Quickstart & Local Development Guide

This guide contains the exact commands to run both the FastAPI backend and the React Vite frontend.

---

## Prerequisites
1. **Python 3.10+** (Python 3.13 verified)
2. **Node.js 18+ & npm 9+** (Node.js 20+ verified)

---

## 🚀 Step 1: Start the Backend (FastAPI)

Open your terminal in the project root: `c:\Users\PraveenBalaji\Desktop\email spam detection`

### On Windows (PowerShell):
```powershell
# 1. Activate the virtual environment
.\backend\.venv\Scripts\Activate.ps1

# 2. Run the FastAPI backend server using Uvicorn
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

### On macOS / Linux:
```bash
# 1. Activate virtual environment
source backend/.venv/bin/activate

# 2. Run backend
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

The backend will start and display:
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Initializing MailGuard AI backend...
INFO:     Loaded ML model: v1.0 (TF-IDF + Multinomial Naive Bayes (alpha=0.1))
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

- **API Base**: `http://127.0.0.1:8000/api`
- **Interactive Swagger Docs**: `http://127.0.0.1:8000/docs`
- **Health Check**: `http://127.0.0.1:8000/api/health`

---

## 🎨 Step 2: Start the Frontend (React + Vite)

Open a **second terminal window** in the project root:

### On Windows (PowerShell):
```powershell
# If node is in local programs directory:
$env:PATH = "$env:LOCALAPPDATA\Programs\nodejs;$env:PATH"

# Navigate into frontend
cd frontend

# Launch Vite development server
npm run dev
```

### On macOS / Linux:
```bash
cd frontend
npm run dev
```

The Vite dev server will start at:
```
  VITE v5.4.21  ready in 320 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

Open `http://localhost:5173` in your web browser!

---

## 🧪 Step 3: Run the Test Suites

### Backend Tests (Pytest)
```powershell
.\backend\.venv\Scripts\python.exe -m pytest backend/tests -v
```

### Frontend Tests (Vitest)
```powershell
$env:PATH = "$env:LOCALAPPDATA\Programs\nodejs;$env:PATH"
cd frontend
npm test
```

---

## 🔁 Step 4: Retraining the Model (Optional)

If you ever wish to re-train the ML model pipeline or re-evaluate holdout metrics:
```powershell
.\backend\.venv\Scripts\python.exe backend/app/ml/train.py
```
This regenerates `backend/artifacts/spam_classifier_v1.joblib` and updates metadata in `backend/data/mailguard.db`.
