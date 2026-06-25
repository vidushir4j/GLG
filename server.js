const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const CONTACTS_FILE = path.join(__dirname, 'contacts.json');

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static assets from 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// API Endpoint to receive contact form submissions
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;

  // Basic validation
  if (!name || !email || !subject || !message) {
    return res.status(400).json({ 
      success: false, 
      message: "Please fill out all required fields: name, email, subject, and message." 
    });
  }

  // Simple Email Regex check
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: "Please enter a valid email address." 
    });
  }

  const newMessage = {
    id: Date.now().toString(36) + Math.random().toString(36).substr(2, 5),
    name,
    email,
    subject,
    message,
    timestamp: new Date().toISOString()
  };

  // Read existing and append
  fs.readFile(CONTACTS_FILE, 'utf8', (err, data) => {
    let contacts = [];
    if (!err && data) {
      try {
        contacts = JSON.parse(data);
      } catch (e) {
        contacts = [];
      }
    }

    contacts.push(newMessage);

    fs.writeFile(CONTACTS_FILE, JSON.stringify(contacts, null, 2), 'utf8', (writeErr) => {
      if (writeErr) {
        console.error("Error writing message to file:", writeErr);
        return res.status(500).json({ 
          success: false, 
          message: "Could not save message. Galaxy communications error!" 
        });
      }

      console.log(`[Contact Form Received] From: ${name} | Topic: ${subject}`);
      return res.status(200).json({ 
        success: true, 
        message: "Message sent! We'll get back to you at lightspeed." 
      });
    });
  });
});

// Fallback routing for nice page URLs without extensions
app.get('/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'about.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// Start the server
app.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`🚀 GALACTICLEGENDS GAMES Server running successfully!`);
  console.log(`📡 Local Access: http://localhost:${PORT}`);
  console.log(`======================================================\n`);
});
