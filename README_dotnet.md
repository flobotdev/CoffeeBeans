# All The Beans - .NET Core Backend

A prototype-level e-commerce application built with React frontend and ASP.NET Core backend.

**Notes:**
This is a test project and not production-ready.

AllTheBeans.json had "cost" string value replaced with a float value so we can easily do sums. The £ sign was hardcoded for this instance but recommendation is to have it localized in DB.

AllTheBeans.json has "\_id" which looks like a MongoDB object id. For PostgresSQL it was used a UUID generation.

## Why ASP.NET Core + Entity Framework Core?

React is a modern framework which is heavily used across the industry. I opted for basic CSS rather than UI libraries as it's simpler for the scope of this test and it lines up better with my current knowledge.

For the .NET backend: I chose to use ASP.NET Core Web API with Entity Framework Core and PostgreSQL. Entity Framework makes it easy to make queries without SQL knowledge having robust ORM capabilities with LINQ queries, and it works across different database providers. It also reduces risk of SQL injection because of its strong typed objects.

PostgreSQL is the only relational database I could find with easy setup.

JWT authentication is a simple and straightfoward token based auth for this level of application.

In general, I opted in for easiest setup and least reliance on third-party systems.

## Future Improvements

### Security & Authentication

- Add rate limiting to prevent API abuse
- Implement token refresh endpoint for JWT rotation
- Input validation with Data Annotations or FluentValidation
- HTTPS setup for production

### Testing

- Write unit tests for React components
- Add unit tests

### Frontend Improvements

- Usage of UI libraries for more uniform styling (instead of basic css)
- Global state management
- Persist shopping cart to localStorage
- Add loading states and skeleton screens
- Implement React error boundaries
- Pagination for bean listings
- Sorting options (price, name, rating)
- Toast notifications for user feedback
- Mobile responsive design improvements
- Accessibility (ARIA labels, keyboard navigation)

## Architecture

### Frontend (React)

- **Framework**: React 19 with Create React App
- **Styling**: CSS modules and custom styles

### Backend (ASP.NET Core)

- **Framework**: ASP.NET Core Web API
- **Database**: PostgreSQL with Entity Framework Core
- **Authentication**: JWT tokens with built-in authentication
- **API**: RESTful endpoints with CORS support
- **Features**: CRUD operations, search, bean of the day, automatic database initialization

## Tech Stack

### Frontend

- **React 19** - UI framework
- **React Icons** - Icon library
- **CSS Modules** - Component styling
- **Create React App** - Build tooling

### Backend

- **.NET 10.0** - Runtime environment
- **ASP.NET Core** - Web framework
- **Entity Framework Core** - ORM
- **Npgsql** - PostgreSQL provider
- **PostgreSQL** - Database
- **JWT Bearer Authentication** - Token-based auth

## Prerequisites

### Required Software

This was developed and tested on a Windows setup.

1. **Node.js** (v14+) - For React frontend

   - Download from [nodejs.org](https://nodejs.org/)

2. **.NET SDK** (10.0)

   - Download from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)

3. **PostgreSQL Database**
   - Download from [postgresql.org](https://www.postgresql.org/download/)

### Database Setup

After installing PostgreSQL:

1. Start PostgreSQL service
2. Create database: `coffee_beans_db`
3. Create user with permissions (default: `postgres`)
4. Set password for database user

**Note:** The .NET application will automatically initialize the database schema and seed sample data on first run.

## Environment Configuration

### Backend Configuration

Update `appsettings.Development.json` in `server/server_net/AllTheBeans/` directory:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Host=localhost;Port=5432;Database=coffee_beans_db;Username=postgres;Password=your_password"
  },
  "Jwt": {
    "Secret": "your-super-secret-jwt-key-change-in-production-min-32-chars",
    "Issuer": "AllTheBeansAPI",
    "Audience": "AllTheBeansClient",
    "ExpiresInHours": "24"
  }
}
```

### Frontend Configuration

Update `client/client_beans/.env` to point to .NET backend:

```env
# For .NET backend
REACT_APP_API_BASE_URL=http://localhost:5036/api
```

## Quick Start

### Automated Setup (Recommended for Windows)

**Run the automated setup script:**

```bash
setup_net.bat
```

This script will:

- Install all frontend dependencies
- Check for .NET SDK installation
- Restore .NET dependencies
- Guide you through PostgreSQL database setup
- Automatically start both frontend and backend in new terminals

### Manual Setup

1. **Install dependencies:**

   ```bash
   # Install client dependencies
   cd client/client_beans
   npm install

   # Restore .NET dependencies
   cd ../../server/server_net/AllTheBeans
   dotnet restore
   ```

2. **Set up database:**

   - Ensure PostgreSQL is running
   - Create database: `coffee_beans_db`
   - Update `appsettings.Development.json` with your credentials
   - Note: Database will auto-initialize on first run

3. **Update frontend configuration:**

   - Edit `client/client_beans/.env`
   - Set the .NET backend URL:
     ```env
     REACT_APP_API_BASE_URL=http://localhost:5036/api
     ```

4. **Start the application:**

   ```bash
   # Terminal 1: Start .NET backend
   cd server/server_net/AllTheBeans
   dotnet run

   # Terminal 2: Start frontend
   cd client/client_beans
   npm start
   ```

   - **Frontend**: http://localhost:3000
   - **Backend**: https://localhost:7177 or http://localhost:5036

## API Endpoints

### Beans Endpoints

| Method | Endpoint                         | Description                                |
| ------ | -------------------------------- | ------------------------------------------ |
| GET    | `/api/beans`                     | Get all coffee beans                       |
| GET    | `/api/beans/botd`                | Get bean of the day (single featured bean) |
| GET    | `/api/beans/search?q=searchterm` | Search beans by name, country, or roast    |
| GET    | `/api/beans/:id`                 | Get single bean by ID                      |
| POST   | `/api/beans`                     | Add new bean (requires authentication)     |
| PUT    | `/api/beans/:id`                 | Update bean (requires authentication)      |
| DELETE | `/api/beans/:id`                 | Delete bean (requires authentication)      |

### Authentication Endpoints

| Method | Endpoint          | Description        |
| ------ | ----------------- | ------------------ |
| POST   | `/api/auth/token` | Get a bearer token |

### Utility Endpoints

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | `/api/health` | Health check |

## Database Schema

Entity Framework Core automatically creates and maintains the database schema. The main entities are:

**Bean Entity:**

```csharp
public class Bean
{
    public string Id { get; set; }
    public int Index { get; set; }
    public decimal Cost { get; set; }
    public string Image { get; set; }
    public string Colour { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public string Country { get; set; }
}
```

**BeanOfTheDay Entity:**

```csharp
public class BeanOfTheDay
{
    public int Id { get; set; }
    public string BeanId { get; set; }
    public DateTime SelectedDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public Bean Bean { get; set; }
}
```

Equivalent SQL schema:

```sql
CREATE TABLE beans (
  id VARCHAR(50) PRIMARY KEY,
  index INTEGER,
  cost NUMERIC(10,2),
  image VARCHAR(500),
  colour VARCHAR(100),
  name VARCHAR(255),
  description TEXT,
  country VARCHAR(100)
);
```

```sql
CREATE TABLE bean_of_the_day (
    id SERIAL PRIMARY KEY,
    bean_id VARCHAR(50) NOT NULL REFERENCES beans(id) ON DELETE CASCADE,
    selected_date DATE NOT NULL DEFAULT CURRENT_DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(selected_date)
  );
```

## Example API Usage

```bash
# Get all beans
curl http://localhost:5036/api/beans

# Search for Vietnamese beans
curl "http://localhost:5036/api/beans/search?q=vietnam"

# Get bean of the day
curl http://localhost:5036/api/beans/botd

# Generate bearer token
curl -X POST http://localhost:5036/api/auth/token

# Add new bean (requires authentication)
curl -X POST http://localhost:5036/api/beans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"Name":"New Bean","Cost":25.99,"Country":"Ethiopia","colour":"medium roast"}'
```

## Bean Data Structure

Each coffee bean object contains:

```json
{
  "id": "unique-identifier",
  "index": 0,
  "isBOTD": false,
  "cost": 39.26,
  "image": "https://image-url.com/bean.jpg",
  "colour": "dark roast",
  "name": "ETHIOPIAN YIRGACHEFFE",
  "description": "Bright and fruity with notes of blueberry and citrus...",
  "country": "Ethiopia"
}
```

## Troubleshooting

### Common Issues

**Database Connection Failed**

- Ensure PostgreSQL is running
- Check connection string in `appsettings.Development.json`
- Verify database `coffee_beans_db` exists
- Test connection manually with psql or pgAdmin

**.NET SDK Not Found**

- Install .NET 10.0 SDK or higher from [dotnet.microsoft.com](https://dotnet.microsoft.com/download)
- Verify installation: `dotnet --version`

**CORS Errors**

- Frontend and backend must run on different ports
- Check CORS configuration in Program.cs
- Ensure API calls use correct base URL
- Verify frontend URL is allowed in CORS policy

**Port Already in Use**

- Change port in `Properties/launchSettings.json`
- Or use: `dotnet run --urls "http://localhost:5037"`
- Kill process using the port

**Entity Framework Issues**

- Clear EF Core cache: `dotnet ef database drop` (warning: deletes data)
- Recreate database: Application will auto-initialize on next run
- Check migration status: `dotnet ef migrations list`

**Authentication Issues**

- Check JWT configuration in `appsettings.Development.json`
- Verify token format in Authorization header: `Bearer <token>`
- Ensure JWT secret is at least 32 characters
- Token generated via `/api/auth/token` endpoint

**Frontend Can't Connect to Backend**

- Check `.env` file has correct API URL
- Restart React dev server after changing `.env`
- Verify backend is running and responding
- Check browser console for CORS or network errors
