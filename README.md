# ⬡ Agentic E-Commerce

A FastAPI + Angular 18 + PostgreSQL e-commerce platform.

---

## Project Structure

```
agentic-ecom/
├── backend/          # Python FastAPI
└── frontend/         # Angular 18
```

---

## Prerequisites

- Python 3.11+
- Node.js 20+
- PostgreSQL 15+

---

## Backend Setup

```bash
cd backend

# 1. Create virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# 2. Install dependencies
pip install -r requirements.txt

# 3. Create the database in PostgreSQL
psql -U postgres -c "CREATE DATABASE agentic_ecom;"

# 4. Configure environment (edit .env if needed)
# Default: postgresql+asyncpg://postgres:postgres@localhost:5432/agentic_ecom

# 5. Start the server (tables auto-created on startup)
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

API docs available at: http://localhost:8000/docs

---

## Frontend Setup

```bash
cd frontend

# 1. Install dependencies
npm install

# 2. Start dev server
npm start
```

App available at: http://localhost:4200

---

## Features

| Feature | Details |
|---|---|
| Auth | JWT login/register with bcrypt passwords |
| Products | Full CRUD with category, stock, image URL |
| Orders | Create orders from cart, view history |
| AI Assistant | Placeholder endpoint (POST /api/ai/ask) |
| UI | Glassmorphism sci-fi theme with Orbitron font |

---

## Intentional Security Flaws (Pentesting Targets)

| Flaw | Location | Description |
|---|---|---|
| **JWT No-Expiry** | `backend/app/middleware/auth.py` | Tokens never expire — `verify_exp: False` |
| **IDOR** | `backend/app/routes/products.py` (PUT/DELETE) | Any authenticated user can edit/delete any product |
| **No Input Sanitization** | Product name/description fields | Accepts raw HTML/script tags (XSS) |

---

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login, returns JWT

### Products
- `GET /api/products` — List all products (public)
- `GET /api/products/{id}` — Get one product (public)
- `POST /api/products` — Create product (auth required)
- `PUT /api/products/{id}` — Update product (auth, **IDOR**)
- `DELETE /api/products/{id}` — Delete product (auth, **IDOR**)

### Orders
- `POST /api/orders` — Create order (auth required)
- `GET /api/orders/me` — My orders (auth required)

### AI
- `POST /api/ai/ask` — Ask AI (auth required) — returns placeholder

---

## Frontend Routes

| Route | Component | Protected |
|---|---|---|
| `/home` | Product grid | No |
| `/product/:id` | Product detail + Add to Cart | No |
| `/login` | Login form | No |
| `/register` | Register form | No |
| `/dashboard` | Orders + Cart checkout | Yes |
| `/admin` | Product CRUD admin | Yes |
