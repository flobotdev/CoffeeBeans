# All The Beans Full-Stack Application

A prototype-level e-commerce application built with React frontend and Express.js backend. This project aims to demonstrate core full-stack development concepts including REST APIs, JWT authentication, database integration, and modern React patterns.
**Notes:**
This is a test project and not production-ready.
AllTheBeans.json had "cost" string value replaced with a float value so we can easily do sums. The £ sign was hardcoded for this instance but recommendation is to have it localized in DB.
AllTheBeans.json has "\_id" which looks like a MongoDB object id. For PostgresSQL it was used a UUID generation.

## 📝 Future Improvements

### 🔐 Security & Authentication

- Add rate limiting to prevent API abuse
- Implement token refresh endpoint for JWT rotation
- Input validation/sanitization with express-validator
- HTTPS setup for production

### 🧪 Testing

- Write unit tests for React components
- Add API endpoint tests (Jest + Supertest)
- Integration tests for full user flows
- E2E tests with Playwright or Cypress
- Set up test coverage reporting

### 🎨 Frontend Improvements

- Context API or Redux for global state management
- Persist shopping cart to localStorage
- Add loading states and skeleton screens
- Implement React error boundaries
- Pagination for bean listings
- Sorting options (price, name, rating)
- Toast notifications for user feedback
- Mobile responsive design improvements
- Accessibility (ARIA labels, keyboard navigation)

## 🏗️ Architecture

### Frontend (React)

- **Framework**: React 19 with Create React App
- **Styling**: CSS modules and custom styles
- **Features**: Bean browsing, search, shopping cart, checkout
- **Components**: Bean cards, modals, forms, responsive grid layout
- **State Management**: React hooks and local state

### Backend (Express.js)

- **Framework**: Express.js with Node.js
- **Database**: PostgreSQL with connection pooling
- **Authentication**: JWT tokens with bcrypt password hashing
- **API**: RESTful endpoints with CORS support
- **Features**: CRUD operations, search

## ✨ Features

### Frontend Features

- 🫘 **Bean Catalog**: Browse coffee beans with images and details
- 🔍 **Search & Filter**: Search by name, country, or roast type
- ⭐ **Beans of the Day**: Featured coffee beans section
- 🛒 **Shopping Cart**: Add/remove items
- 💳 **Checkout**: Complete purchase flow with form validation

### Backend Features

- 🔐 **User Authentication**: JWT-based authentication
- 📊 **Database Integration**: PostgreSQL
- 🔍 **Advanced Search**: Multi-field text search with indexing
- 🛡️ **Security**: CORS, input validation
- 📈 **Performance**: Database indexing and connection pooling
- 🧪 **Health Checks**: API status monitoring

## 🛠️ Tech Stack

### Frontend

- **React 19** - UI framework
- **React Icons** - Icon library
- **CSS Modules** - Component styling
- **Create React App** - Build tooling
- **Testing Library** - Component testing

### Backend

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT** - Authentication tokens
- **bcrypt** - Password hashing
- **pg** - PostgreSQL client

## 📋 Prerequisites

### Required Software

This was developed and tested on a Windows setup.

1. **Node.js** (v14+)

   - Download from [nodejs.org](https://nodejs.org/)

2. **PostgreSQL Database**
   - Download from [postgresql.org](https://www.postgresql.org/download/)

### Database Setup

After installing PostgreSQL:

1. Start PostgreSQL service
2. Create database: `coffee_beans_db`
3. Create user with permissions (default: `postgres`)
4. Set password for database user

## ⚙️ Environment Configuration

Create `.env` file in `server/server_beans/` directory if it doesn't exist:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=coffee_beans_db
DB_USER=postgres
DB_PASSWORD=your_actual_password
JWT_SECRET=your-super-secret-jwt-key-change-in-production
PORT=3001
```

## 🚀 Quick Start

### Option A: Automated Setup (Recommended for Windows)

1. **Run the automated setup script:**

   ```bash
   setup.bat
   ```

   This script will automatically:

   - Install all Node.js dependencies for both frontend and backend
   - Guide you through PostgreSQL database setup
   - Run database migration with sample data
   - Provide final setup instructions

### Option B: Manual Setup

1. **Clone and navigate to project:**

   ```bash
   cd coffeebeans_test
   ```

2. **Install all dependencies:**

   ```bash
   # Install server dependencies
   cd server/server_beans
   npm install

   # Install client dependencies
   cd ../../client/client_beans
   npm install

   # Return to server directory
   cd ../../server/server_beans
   ```

3. **Set up database:**

   - Ensure PostgreSQL is running
   - Create database: `coffee_beans_db`
   - Update `.env` with your database credentials

4. **Initialize sample data:**

   ```bash
   node init/migrate.js
   ```

5. **Generate bearer token for testing APIs:**
   ```bash
   node init/generateToken.js
   ```

### Final Step (Both Options)

5. **Start the full application:**

   ```bash
   cd server/server_beans
   npm run dev:full
   ```

   This starts both:

   - **Frontend**: http://localhost:3000 (React app)
   - **Backend**: http://localhost:3001 (Express API)

## 📡 API Endpoints

### Beans Endpoints

| Method | Endpoint                         | Description                                |
| ------ | -------------------------------- | ------------------------------------------ |
| GET    | `/api/beans`                     | Get all coffee beans                       |
| GET    | `/api/beans/botd`                | Get bean of the day (single featured bean) |
| GET    | `/api/beans/search?q=searchterm` | Search beans by name, country, or roast    |
| GET    | `/api/beans/:id`                 | Get single bean by ID                      |
| POST   | `/api/beans`                     | Add new bean                               |
| PUT    | `/api/beans/:id`                 | Update bean                                |
| DELETE | `/api/beans/:id`                 | Delete bean                                |

### Utility Endpoints

| Method | Endpoint      | Description  |
| ------ | ------------- | ------------ |
| GET    | `/api/health` | Health check |

### Database Schema

```sql
CREATE TABLE beans (
  id VARCHAR(50) PRIMARY KEY,
  index INTEGER,
  is_botd BOOLEAN DEFAULT FALSE,
  cost DECIMAL(10,2),
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

## 🌐 Example API Usage

```bash
# Get all beans
curl http://localhost:3001/api/beans

# Search for Vietnamese beans
curl "http://localhost:3001/api/beans/search?q=vietnam"

# Get bean of the day (single object)
curl http://localhost:3001/api/beans/botd

# Add new bean (requires admin auth)
curl -X POST http://localhost:3001/api/beans \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"Name":"New Bean","Cost":25.99,"Country":"Ethiopia","colour":"medium roast"}'
```

## 📋 Bean Data Structure

Each coffee bean object contains:

```json
{
  "id": "unique-identifier",
  "index": 0,
  "isBOTD": false,
  "Cost": 39.26,
  "Image": "https://image-url.com/bean.jpg",
  "colour": "dark roast",
  "Name": "ETHIOPIAN YIRGACHEFFE",
  "Description": "Bright and fruity with notes of blueberry and citrus...",
  "Country": "Ethiopia"
}
```

## 🐛 Troubleshooting

### Common Issues

**Database Connection Failed**

- Ensure PostgreSQL is running
- Check database credentials in `.env`
- Verify database `coffee_beans_db` exists

**CORS Errors**

- Frontend and backend must run on different ports
- Check CORS configuration in server.js
- Ensure API calls use correct base URL

**Port Already in Use**

- Change PORT in `.env` or server.js
- Kill process using the port: `npx kill-port 3001`

**Search Not Working**

- Check query parameter format: `?q=searchterm`
- Ensure database indexes are created
- Verify search term encoding

**Authentication Issues**

- Check JWT_SECRET in environment
- Verify token format in Authorization header
- Ensure user exists in database
