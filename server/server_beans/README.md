# Coffee Beans API Server

A simple Express.js REST API server for the Coffee Beans Shop application.

## Features

- ✅ **RESTful API** - Standard HTTP methods for CRUD operations
- ✅ **Search functionality** - Search beans by name, country, or roast type
- ✅ **CORS enabled** - Works with React frontend
- ✅ **JSON file storage** - Easy to modify and backup
- ✅ **Error handling** - Proper HTTP status codes and error messages

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the server:**
   ```bash
   npm start
   ```

   For development with auto-restart:
   ```bash
   npm run dev
   ```

3. **Server will run on:** `http://localhost:3001`

## API Endpoints

### Beans Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/beans` | Get all coffee beans |
| GET | `/api/beans/botd` | Get beans of the day (featured) |
| GET | `/api/beans/search?q=searchterm` | Search beans by name, country, or roast |
| GET | `/api/beans/:id` | Get single bean by ID |
| POST | `/api/beans` | Add new bean |
| PUT | `/api/beans/:id` | Update existing bean |
| DELETE | `/api/beans/:id` | Delete bean |

### Utility Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Example API Calls

```bash
# Get all beans
curl http://localhost:3001/api/beans

# Search for Vietnamese beans
curl "http://localhost:3001/api/beans/search?q=vietnam"

# Get beans of the day
curl http://localhost:3001/api/beans/botd

# Get specific bean
curl http://localhost:3001/api/beans/66a374591a995a2b48761408

# Add new bean
curl -X POST http://localhost:3001/api/beans \
  -H "Content-Type: application/json" \
  -d '{"Name":"New Bean","Cost":25.99,"Country":"Ethiopia"}'
```

## Data Structure

Each bean object contains:
```json
{
  "_id": "unique-identifier",
  "index": 0,
  "isBOTD": false,
  "Cost": 39.26,
  "Image": "https://image-url.com",
  "colour": "dark roast",
  "Name": "BEAN NAME",
  "Description": "Bean description...",
  "Country": "Origin Country"
}
```

## Development

- **Data file:** `beans.json` - Contains all coffee bean data
- **Server file:** `server.js` - Express server with all routes
- **Hot reload:** Use `npm run dev` for development

## Integration with React

The server is designed to work seamlessly with the React frontend:

1. **CORS enabled** - Accepts requests from React dev server
2. **JSON responses** - Easy to consume in React components
3. **Error handling** - Returns proper HTTP status codes
4. **Search optimized** - Efficient text search across multiple fields

## Next Steps

Once you're comfortable with this basic API, you can upgrade to:

1. **Database integration** (PostgreSQL, MongoDB)
2. **Authentication** (JWT, sessions)
3. **File uploads** (bean images)
4. **Caching** (Redis)
5. **Rate limiting** (API protection)
6. **Docker deployment**

## Troubleshooting

- **Port already in use:** Change `PORT` in `server.js`
- **CORS errors:** Check if React is running on different port
- **Data not updating:** Make sure to restart server after `beans.json` changes
- **Search not working:** Check query parameter format

---

**Happy coding! ☕**