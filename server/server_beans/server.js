const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Middleware
app.use(cors()); // Enable CORS for React app
app.use(express.json()); // Parse JSON bodies

// Path to data files
const BEANS_FILE = path.join(__dirname, 'beans.json');
const USERS_FILE = path.join(__dirname, 'users.json');

// Helper function to read data
async function readData(filePath) {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error reading ${filePath}:`, error);
    return [];
  }
}

// Helper function to write data
async function writeData(filePath, data) {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error writing ${filePath}:`, error);
    throw error;
  }
}

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
}

// Admin-only middleware
function requireAdmin(req, res, next) {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

// Routes

// Authentication Routes

// POST /api/auth/register - Register new user
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and name are required' });
    }

    const users = await readData(USERS_FILE);
    const existingUser = users.find(user => user.email === email);

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      password: hashedPassword,
      role: 'customer',
      createdAt: new Date().toISOString()
    };

    users.push(newUser);
    await writeData(USERS_FILE, users);

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser.id, email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userResponse } = newUser;
    res.status(201).json({ token, user: userResponse });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /api/auth/login - Login user
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const users = await readData(USERS_FILE);
    const user = users.find(u => u.email === email);

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data (without password)
    const { password: _, ...userResponse } = user;
    res.json({ token, user: userResponse });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// GET /api/auth/profile - Get current user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const users = await readData(USERS_FILE);
    const user = users.find(u => u.id === req.user.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const { password: _, ...userResponse } = user;
    res.json({ user: userResponse });

  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// POST /api/auth/logout - Logout (client-side token removal)
app.post('/api/auth/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});

// Beans Routes
app.get('/api/beans', async (req, res) => {
  try {
    const beans = await readData(BEANS_FILE);
    res.json(beans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beans' });
  }
});

// GET /api/beans/botd - Get beans of the day
app.get('/api/beans/botd', async (req, res) => {
  try {
    const beans = await readData(BEANS_FILE);
    const botdBeans = beans.filter(bean => bean.isBOTD);
    res.json(botdBeans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beans of the day' });
  }
});

// GET /api/beans/search - Search beans
app.get('/api/beans/search', async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const beans = await readData(BEANS_FILE);
    const searchTerm = q.toLowerCase();

    const filteredBeans = beans.filter(bean =>
      bean.Name.toLowerCase().includes(searchTerm) ||
      bean.Country.toLowerCase().includes(searchTerm) ||
      bean.colour.toLowerCase().includes(searchTerm) ||
      bean.Description.toLowerCase().includes(searchTerm)
    );

    res.json(filteredBeans);
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
});

// GET /api/beans/:id - Get single bean by ID
app.get('/api/beans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const beans = await readData(BEANS_FILE);
    const bean = beans.find(b => b._id === id);

    if (!bean) {
      return res.status(404).json({ error: 'Bean not found' });
    }

    res.json(bean);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bean' });
  }
});

// POST /api/beans - Add new bean (Admin only)
app.post('/api/beans', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const newBean = req.body;
    const beans = await readData(BEANS_FILE);

    // Generate new ID
    newBean._id = Date.now().toString();
    newBean.index = beans.length;

    beans.push(newBean);
    await writeData(BEANS_FILE, beans);
    res.status(201).json(newBean);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bean' });
  }
});

// PUT /api/beans/:id - Update bean (Admin only)
app.put('/api/beans/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const beans = await readData(BEANS_FILE);

    const beanIndex = beans.findIndex(b => b._id === id);
    if (beanIndex === -1) {
      return res.status(404).json({ error: 'Bean not found' });
    }

    beans[beanIndex] = { ...beans[beanIndex], ...updateData };
    await writeData(BEANS_FILE, beans);

    res.json(beans[beanIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bean' });
  }
});

// DELETE /api/beans/:id - Delete bean (Admin only)
app.delete('/api/beans/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const beans = await readData(BEANS_FILE);

    const filteredBeans = beans.filter(b => b._id !== id);
    if (filteredBeans.length === beans.length) {
      return res.status(404).json({ error: 'Bean not found' });
    }

    await writeData(BEANS_FILE, filteredBeans);
    res.json({ message: 'Bean deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete bean' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Coffee Beans API is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Coffee Beans API server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation:`);
  console.log(`   Authentication:`);
  console.log(`   POST /api/auth/register  - Register new user`);
  console.log(`   POST /api/auth/login     - Login user`);
  console.log(`   GET  /api/auth/profile   - Get user profile`);
  console.log(`   POST /api/auth/logout    - Logout user`);
  console.log(`   Beans:`);
  console.log(`   GET  /api/beans           - Get all beans`);
  console.log(`   GET  /api/beans/botd      - Get beans of the day`);
  console.log(`   GET  /api/beans/search?q= - Search beans`);
  console.log(`   GET  /api/beans/:id       - Get single bean`);
  console.log(`   POST /api/beans          - Add new bean (Admin only)`);
  console.log(`   PUT  /api/beans/:id      - Update bean (Admin only)`);
  console.log(`   DELETE /api/beans/:id    - Delete bean (Admin only)`);
  console.log(`   GET  /api/health         - Health check`);
});