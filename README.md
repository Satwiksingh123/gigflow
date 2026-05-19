# GigFlow – Smart Leads Dashboard

A production-grade MERN stack lead management dashboard built with React, TypeScript, TailwindCSS, Node.js, Express, MongoDB, and Mongoose.

> **Note:** The actual project lives in the `gigflow/` directory.
> The root-level `src/` folder is an unrelated scaffold and is not part of this submission.

---

## Tech Stack

**Frontend:** React 18, TypeScript, Vite, TailwindCSS, React Router v6, Zustand, Axios, React Hook Form, Zod, Sonner

**Backend:** Node.js, Express, TypeScript, MongoDB, Mongoose, JWT, bcrypt, Zod, Helmet, CORS, Morgan

---

## Features

- JWT authentication with bcrypt password hashing
- Role-Based Access Control (Admin can delete leads; Sales reps see only their own)
- Lead CRUD with server-side filtering (status, source, full-text search), sorting, and pagination
- Debounced search input (400 ms)
- Single-query dashboard stats via MongoDB `$group` aggregation (replaces N+1 pattern)
- CSV export of current filtered results
- Skeleton loading states for table and stat cards
- Toast notifications (sonner)
- Dark mode with `localStorage` persistence
- Mobile-responsive layout with hamburger drawer navigation
- Centralized error handling and Zod validation on both frontend and backend
- Graceful SIGTERM / SIGINT shutdown (closes HTTP server, then disconnects MongoDB)
- Env var validation at startup with Zod (fails fast with structured errors)

---

## Architecture

```
gigflow/
├── server/                 Express + TypeScript + Mongoose API
│   └── src/
│       ├── config/         Env validation (Zod) + DB connection
│       ├── controllers/    HTTP handlers (thin — delegates to services)
│       ├── services/       Business logic + MongoDB queries
│       ├── models/         Mongoose schemas (derive enums from types/)
│       ├── routes/         Express routers
│       ├── middleware/     requireAuth, requireRole, validate, errorHandler
│       ├── validators/     Zod schemas (derive enums from types/)
│       ├── utils/          AppError, asyncHandler, jwt
│       └── types/          Shared types + const enum arrays
└── client/                 React 18 + TypeScript + Tailwind SPA
    └── src/
        ├── api/            Axios instance + interceptors
        ├── services/       Typed API call functions
        ├── store/          Zustand auth store (with persist + partialize)
        ├── hooks/          useLeads, useDebounce, useDarkMode
        ├── layouts/        DashboardLayout
        ├── components/
        │   ├── layout/     Sidebar (desktop + mobile drawer), Topbar
        │   ├── leads/      LeadTable, LeadTableSkeleton, LeadForm, LeadFilters
        │   └── ui/         Button, Input, Select, Modal, Badge, Pagination, EmptyState, Spinner
        ├── pages/          Dashboard, Leads, Login, Register, NotFound
        ├── routes/         ProtectedRoute, RoleRoute
        ├── types/          Shared types + const enum arrays
        ├── constants.ts    Centralised magic values
        └── utils/          cn, csv helpers
```

---

## Setup

### 1. Backend

```bash
cd gigflow/server
cp .env.example .env       # Set MONGO_URI and JWT_SECRET (min 16 chars)
npm install
npm run dev                # http://localhost:5000
```

**Required env vars:**

| Variable | Description | Default |
|---|---|---|
| `MONGO_URI` | MongoDB connection string | — (required) |
| `JWT_SECRET` | JWT signing secret (≥16 chars) | — (required) |
| `PORT` | Server port | `5000` |
| `NODE_ENV` | `development` \| `production` \| `test` | `development` |
| `JWT_EXPIRES_IN` | Token expiry | `7d` |
| `CLIENT_ORIGIN` | CORS allowed origin | `http://localhost:5173` |

### 2. Frontend

```bash
cd gigflow/client
cp .env.example .env       # Set VITE_API_URL=http://localhost:5000/api
npm install
npm run dev                # http://localhost:5173
```

### 3. First admin user

Register via the UI, then promote in MongoDB:

```js
db.users.updateOne({ email: "you@example.com" }, { $set: { role: "admin" } })
```

---

## API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | public | Register user |
| `POST` | `/api/auth/login` | public | Login, returns JWT |
| `GET` | `/api/auth/me` | user | Current user profile |
| `GET` | `/api/leads/stats` | user | Aggregated pipeline counts |
| `GET` | `/api/leads` | user | List with filters + pagination |
| `POST` | `/api/leads` | user | Create lead |
| `GET` | `/api/leads/:id` | user | Get single lead |
| `PATCH` | `/api/leads/:id` | user (owner or admin) | Update lead |
| `DELETE` | `/api/leads/:id` | **admin** | Delete lead |

### `GET /api/leads` query params

| Param | Type | Description |
|---|---|---|
| `status` | `New \| Contacted \| Qualified \| Lost` | Filter by status |
| `source` | `Website \| Instagram \| Referral` | Filter by source |
| `search` | `string` | Full-text search on name + email |
| `sort` | `latest \| oldest` | Sort order (default: `latest`) |
| `page` | `number` | Page number (default: `1`) |
| `limit` | `number` | Page size, max 100 (default: `10`) |

### RBAC Behaviour

| Action | Admin | Sales |
|---|---|---|
| Create lead | ✅ | ✅ |
| List/view leads | All leads | Own leads only |
| Update lead | Any lead | Own leads only |
| Delete lead | ✅ | ❌ |

---

## License

MIT