# Coffee Beans Full-Stack Application

A complete coffee beans e-commerce application with React frontend and Express.js backend.

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
- **Features**: CRUD operations, search, user management

## ✨ Features

### Frontend Features
- 🫘 **Bean Catalog**: Browse coffee beans with images and details
- 🔍 **Search & Filter**: Search by name, country, or roast type
- ⭐ **Beans of the Day**: Featured coffee beans section
- 🛒 **Shopping Cart**: Add/remove items
- 💳 **Checkout**: Complete purchase flow with form validation
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🎨 **Modern UI**: Clean, intuitive interface with icons

### Backend Features
- 🔐 **User Authentication**: JWT-based login/registration
- 📊 **Database Integration**: PostgreSQL with optimized queries
- 🔍 **Advanced Search**: Multi-field text search with indexing
- 🛡️ **Security**: Password hashing, CORS, input validation
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
1. **Node.js** (v14+)
   - Download from [nodejs.org](https://nodejs.org/)

2. **PostgreSQL Database**
   - Download from [postgresql.org](https://www.postgresql.org/download/)
   - Windows: Use installer and setup wizard
   - macOS: `brew install postgresql`
   - Linux: `sudo apt install postgresql postgresql-contrib`

### Database Setup
After installing PostgreSQL:
1. Start PostgreSQL service
2. Create database: `coffee_beans_db`
3. Create user with permissions (default: `postgres`)
4. Set password for database user

## ⚙️ Environment Configuration

Create `.env` file in `server/server_beans/` directory:

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

### Final Step (Both Options)

5. **Start the full application:**
   ```bash
   cd server/server_beans
   npm run dev:full
   ```

   This starts both:
   - **Frontend**: http://localhost:3000 (React app)
   - **Backend**: http://localhost:3001 (Express API)

## 🏃 Development Workflow

### Available Scripts

**Full-stack development:**
```bash
npm run dev:full    # Start both frontend and backend
```

**Individual services:**
```bash
# Backend only
npm start           # Production server
npm run dev         # Development with auto-restart

# Frontend only
cd ../client/client_beans
npm start           # React development server
npm run build       # Production build
npm test            # Run tests
```

### Project Structure
```
coffeebeans_test/
├── client/
│   └── client_beans/          # React frontend
│       ├── public/            # Static assets
│       ├── src/
│       │   ├── components/    # React components
│       │   ├── data/          # Static data
│       │   ├── hooks/         # Custom React hooks
│       │   └── services/      # API service functions
│       └── package.json
└── server/
    └── server_beans/          # Express backend
        ├── db/                # Database utilities
        ├── init/              # Initialization scripts
        ├── server.js          # Main server file
        └── package.json
```

## 📡 API Endpoints

### Beans Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/beans` | Get all coffee beans |
| GET | `/api/beans/botd` | Get bean of the day (single featured bean) |
| GET | `/api/beans/search?q=searchterm` | Search beans by name, country, or roast |
| GET | `/api/beans/:id` | Get single bean by ID |
| POST | `/api/beans` | Add new bean (Admin only) |
| PUT | `/api/beans/:id` | Update bean (Admin only) |
| DELETE | `/api/beans/:id` | Delete bean (Admin only) |

### Utility Endpoints
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## 🔧 Frontend Components

### Core Components
- **Header**: Navigation and branding
- **BeansGrid**: Responsive grid layout for bean cards
- **BeanCard**: Individual coffee bean display with image and details
- **BeanModal**: Detailed bean information popup
- **BeansOfTheDay**: Featured beans carousel/section
- **CartModal**: Shopping cart management
- **CheckoutForm**: Purchase completion form
- **ThankYou**: Order confirmation page

### Features
- **Responsive Design**: Mobile-first approach with CSS Grid/Flexbox
- **Interactive UI**: Hover effects, animations, and smooth transitions
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Performance**: Optimized images and lazy loading

## 📊 Data Flow

### Frontend → Backend
1. User interacts with React components
2. Components call API service functions
3. HTTP requests sent to Express server
4. Server processes requests with PostgreSQL
5. JSON responses returned to frontend
6. React state updates trigger re-renders

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

## 🌐 Example API Usage

```bash
# Get all beans
curl http://localhost:3001/api/beans

# Search for Vietnamese beans
curl "http://localhost:3001/api/beans/search?q=vietnam"

# Get bean of the day (single object)
curl http://localhost:3001/api/beans/botd

# User registration
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123","name":"John Doe"}'

# User login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password123"}'

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

