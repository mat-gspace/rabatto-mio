const express = require('express');
const cors = require('cors');
const https = require('https');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ─────────────────────────────────────────────
// PRODUCT AUTOCOMPLETE — Amazon.de Suggestions
// ─────────────────────────────────────────────
// Fetches live product name suggestions from Amazon.de
// These are the same suggestions shown in Amazon's own search bar
app.get('/api/suggestions', (req, res) => {
  const query = req.query.q;
  if (!query || query.length < 2) {
    return res.json({ suggestions: [] });
  }

  const url = `https://completion.amazon.de/api/2017/suggestions`
    + `?mid=A1PA6795UKMFR9`   // Amazon.de marketplace ID
    + `&alias=aps`              // "all product search"
    + `&prefix=${encodeURIComponent(query)}`
    + `&event=onKeyPress`
    + `&limit=12`
    + `&suggestion-type=KEYWORD`
    + `&page-type=Gateway`
    + `&lop=de_DE`
    + `&site-variant=desktop`
    + `&client-info=amazon-search-ui`
    + `&fb=1`
    + `&session-id=000-0000000-0000000`;

  https.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
      'Accept': 'application/json',
      'Accept-Language': 'de-DE,de;q=0.9'
    }
  }, (apiRes) => {
    let data = '';
    apiRes.on('data', chunk => data += chunk);
    apiRes.on('end', () => {
      try {
        const parsed = JSON.parse(data);
        const suggestions = (parsed.suggestions || []).map(s => ({
          name: s.value,
          type: s.type || 'KEYWORD'
        }));
        res.json({ suggestions });
      } catch (e) {
        console.error('Parse error:', e.message);
        res.json({ suggestions: [] });
      }
    });
  }).on('error', (e) => {
    console.error('Amazon API error:', e.message);
    res.json({ suggestions: [] });
  });
});

// ─────────────────────────────────────────────
// PRODUCT SEARCH — Amazon.de via Rainforest / PA-API
// ─────────────────────────────────────────────
// This endpoint is ready for when you connect the
// Amazon Product Advertising API or a service like
// Rainforest API for full product details + affiliate links.
//
// For now it returns a helpful placeholder.
app.get('/api/search', (req, res) => {
  const query = req.query.q;
  if (!query) return res.json({ products: [] });

  // TODO: Connect your Amazon PA-API or Rainforest API here
  // Example with PA-API:
  //
  // const amazonPaapi = require('amazon-paapi');
  // const result = await amazonPaapi.SearchItems({
  //   PartnerTag: 'YOUR-AFFILIATE-TAG',
  //   Keywords: query,
  //   SearchIndex: 'All',
  //   Resources: ['ItemInfo.Title', 'Offers.Listings.Price', 'Images.Primary.Large']
  // });

  res.json({
    products: [],
    message: 'Verbinde die Amazon PA-API fuer echte Produktdaten + Affiliate-Links'
  });
});

// ─────────────────────────────────────────────
// SUBSCRIBER REGISTRATION
// ─────────────────────────────────────────────
// Stores email + product wish. In production, connect
// this to a database (e.g. SQLite, PostgreSQL, or a
// service like Mailchimp/ConvertKit).
const subscribers = [];

app.post('/api/subscribe', (req, res) => {
  const { email, product } = req.body;

  if (!email || !product) {
    return res.status(400).json({ error: 'E-Mail und Produkt sind erforderlich.' });
  }

  // Simple email validation
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Bitte gib eine gueltige E-Mail-Adresse ein.' });
  }

  const subscriber = {
    email,
    product,
    createdAt: new Date().toISOString(),
    id: subscribers.length + 1
  };

  subscribers.push(subscriber);
  console.log(`Neuer Subscriber: ${email} moechte ${product}`);

  res.json({
    success: true,
    message: `Deal-Alarm fuer "${product}" ist aktiv!`
  });
});

// Admin: view all subscribers (protect this in production!)
app.get('/api/subscribers', (req, res) => {
  res.json({ count: subscribers.length, subscribers });
});

// Serve the main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Health check for Render
app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Rabatto Mio Server laeuft auf Port ${PORT}`);
});
