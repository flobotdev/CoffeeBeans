# All The Beans Full-Stack Application

A prototype-level e-commerce application built with React frontend and your choice of backend:

- **Node.js + Express** backend
- **.NET Core** backend

**Notes:**
This is a test project and not production-ready.

---

## Choose Your Backend

This project supports two backend implementations with identical APIs:

### 📘 Node.js + Express Backend

→ **See [README_nodejs.md](README_nodejs.md) for full setup and documentation**

- Lightweight JavaScript backend
- Express.js framework
- Direct PostgreSQL queries with pg client
- Simple setup and development

### 📗 .NET Core Backend

→ **See [README_dotnet.md](README_dotnet.md) for full setup and documentation**

- Enterprise-grade C# backend
- ASP.NET Core Web API
- Entity Framework Core with ORM
- Type-safe and strongly-typed
- Automatic database initialization

---

## Quick Setup

### For Node.js Backend:

```bash
setup_nodejs.bat
```

### For .NET Backend:

```bash
setup_net.bat
```

---

## Project Structure

```
coffeebeans_test/
├── client/
│   └── client_beans/          # React frontend (shared)
├── server/
│   ├── server_nodejs/         # Node.js + Express backend
│   └── server_net/            # .NET Core backend
│       └── AllTheBeans/
├── setup_nodejs.bat           # Automated Node.js setup
├── setup_net.bat              # Automated .NET setup
├── README.md                  # This file
├── README_nodejs.md           # Node.js documentation
└── README_dotnet.md           # .NET documentation
```

---

## API Endpoints

Both backends implement the same REST API:

### Beans Endpoints

- `GET /api/beans` - Get all coffee beans
- `GET /api/beans/botd` - Get bean of the day
- `GET /api/beans/search?q=term` - Search beans
- `GET /api/beans/:id` - Get single bean
- `POST /api/beans` - Add new bean (auth required)
- `PUT /api/beans/:id` - Update bean (auth required)
- `DELETE /api/beans/:id` - Delete bean (auth required)

### Authentication

- `POST /api/auth/token` - Get bearer token

### Utility

- `GET /api/health` - Health check

---

## Technology Stack Comparison

| Feature              | Node.js Backend  | .NET Backend                |
| -------------------- | ---------------- | --------------------------- |
| **Language**         | JavaScript       | C#                          |
| **Framework**        | Express.js       | ASP.NET Core                |
| **Database Access**  | pg (direct SQL)  | Entity Framework Core (ORM) |
| **Type Safety**      | Runtime          | Compile-time                |
| **Setup Complexity** | Simple           | Moderate                    |
| **Performance**      | Good             | Excellent                   |
| **Auto DB Init**     | Manual migration | Automatic                   |

---

## Frontend Configuration

The React frontend is shared between both backends. Update `client/client_beans/.env` to switch:

```env
# For Node.js backend
REACT_APP_API_BASE_URL=http://localhost:3001/api

# For .NET backend
REACT_APP_API_BASE_URL=http://localhost:5036/api
```

---

## Running URLs

### Node.js Backend

- Frontend: http://localhost:3000
- Backend: http://localhost:3001

### .NET Backend

- Frontend: http://localhost:3000
- Backend: http://localhost:5036

---

For detailed setup instructions, troubleshooting, and usage examples:

- **Node.js Backend**: See [README_nodejs.md](README_nodejs.md)
- **.NET Backend**: See [README_dotnet.md](README_dotnet.md)
