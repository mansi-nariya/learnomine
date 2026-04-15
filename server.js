const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the current directory
app.use(express.static(__dirname));

// Initialize SQLite database
const db = new sqlite3.Database('./inquiries.db');

// Create inquiries table if it doesn't exist
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    mobile TEXT NOT NULL,
    email TEXT NOT NULL,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);
});

// API Routes

// Submit form
app.post('/api/submit-inquiry', (req, res) => {
  console.log('Received form submission:', req.body); // Debug log
  
  const { name, mobile, email } = req.body;
  
  if (!name || !mobile || !email) {
    console.log('Validation failed: Missing fields'); // Debug log
    return res.status(400).json({ success: false, message: 'All fields are required' });
  }
  
  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    console.log('Validation failed: Invalid email'); // Debug log
    return res.status(400).json({ success: false, message: 'Invalid email format' });
  }
  
  // Phone validation
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  if (!phoneRegex.test(mobile.replace(/\s/g, ''))) {
    console.log('Validation failed: Invalid mobile'); // Debug log
    return res.status(400).json({ success: false, message: 'Invalid mobile number' });
  }
  
  console.log('Inserting into database...'); // Debug log
  
  db.run(
    'INSERT INTO inquiries (name, mobile, email) VALUES (?, ?, ?)',
    [name, mobile, email],
    function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({ success: false, message: 'Database error' });
      }
      console.log('Successfully inserted inquiry with ID:', this.lastID); // Debug log
      res.json({ 
        success: true, 
        message: 'Thank you for your submission! We will contact you soon.',
        id: this.lastID 
      });
    }
  );
});

// Get all inquiries (for admin)
app.get('/api/inquiries', (req, res) => {
  db.all('SELECT * FROM inquiries ORDER BY timestamp DESC', (err, rows) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    res.json({ success: true, data: rows });
  });
});

// Delete inquiry (for admin)
app.delete('/api/inquiries/:id', (req, res) => {
  const { id } = req.params;
  
  db.run('DELETE FROM inquiries WHERE id = ?', [id], function(err) {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Database error' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Inquiry not found' });
    }
    res.json({ success: true, message: 'Inquiry deleted successfully' });
  });
});

// Admin panel route
app.get('/admin', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'admin.html'));
});

// Send the index.html for any other route
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Open http://localhost:${port} in your browser`);
  console.log(`Admin panel: http://localhost:${port}/admin`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});
