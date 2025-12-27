const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Enable CORS for React app
app.use(express.json()); // Parse JSON bodies

// Path to beans data
const BEANS_FILE = path.join(__dirname, 'beans.json');

// Helper function to read beans data
async function readBeansData() {
  try {
    const data = await fs.readFile(BEANS_FILE, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading beans data:', error);
    throw error;
  }
}

// Routes

// GET /api/beans - Get all beans
app.get('/api/beans', async (req, res) => {
  try {
    const beans = await readBeansData();
    res.json(beans);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch beans' });
  }
});

// GET /api/beans/botd - Get beans of the day
app.get('/api/beans/botd', async (req, res) => {
  try {
    const beans = await readBeansData();
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

    const beans = await readBeansData();
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
    const beans = await readBeansData();
    const bean = beans.find(b => b._id === id);

    if (!bean) {
      return res.status(404).json({ error: 'Bean not found' });
    }

    res.json(bean);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch bean' });
  }
});

// POST /api/beans - Add new bean (for future admin features)
app.post('/api/beans', async (req, res) => {
  try {
    const newBean = req.body;
    const beans = await readBeansData();

    // Generate new ID (simple approach)
    newBean._id = Date.now().toString();
    newBean.index = beans.length;

    beans.push(newBean);

    await fs.writeFile(BEANS_FILE, JSON.stringify(beans, null, 2));
    res.status(201).json(newBean);
  } catch (error) {
    res.status(500).json({ error: 'Failed to add bean' });
  }
});

// PUT /api/beans/:id - Update bean
app.put('/api/beans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const beans = await readBeansData();

    const beanIndex = beans.findIndex(b => b._id === id);
    if (beanIndex === -1) {
      return res.status(404).json({ error: 'Bean not found' });
    }

    beans[beanIndex] = { ...beans[beanIndex], ...updateData };
    await fs.writeFile(BEANS_FILE, JSON.stringify(beans, null, 2));

    res.json(beans[beanIndex]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update bean' });
  }
});

// DELETE /api/beans/:id - Delete bean
app.delete('/api/beans/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const beans = await readBeansData();

    const filteredBeans = beans.filter(b => b._id !== id);
    if (filteredBeans.length === beans.length) {
      return res.status(404).json({ error: 'Bean not found' });
    }

    await fs.writeFile(BEANS_FILE, JSON.stringify(filteredBeans, null, 2));
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
  console.log(`   GET  /api/beans           - Get all beans`);
  console.log(`   GET  /api/beans/botd      - Get beans of the day`);
  console.log(`   GET  /api/beans/search?q= - Search beans`);
  console.log(`   GET  /api/beans/:id       - Get single bean`);
  console.log(`   POST /api/beans          - Add new bean`);
  console.log(`   PUT  /api/beans/:id      - Update bean`);
  console.log(`   DELETE /api/beans/:id    - Delete bean`);
  console.log(`   GET  /api/health         - Health check`);
});