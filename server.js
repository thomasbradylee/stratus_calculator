require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.ANTHROPIC_API_KEY || '';

if (!API_KEY) {
  console.error('ERROR: ANTHROPIC_API_KEY environment variable is not set.');
  process.exit(1);
}

app.use(cors());
app.use(express.json({ limit: '2mb' }));

// Serve the calculator
app.get('/calculator', (req, res) => {
  res.sendFile(path.join(__dirname, 'stratus_calculator.html'));
});

// Health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'Stratus Anthropic Proxy' });
});

// Anthropic proxy
app.post('/api/generate', async (req, res) => {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify(req.body)
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).json({ error: 'Proxy request failed', detail: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`Stratus proxy running on port ${PORT}`);
  console.log(`Calculator available at http://localhost:${PORT}/calculator`);
});
