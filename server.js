// Trading Queen Backend Server
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Serve static files
app.use(express.static(path.join(__dirname, '../')));

// Import routes
const authRoutes = require('./routes/auth');
const marketRoutes = require('./routes/market');
const newsRoutes = require('./routes/news');
const servicesRoutes = require('./routes/services');
const contactRoutes = require('./routes/contact');
const institutionalRoutes = require('./routes/institutional');

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/news', newsRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/institutional', institutionalRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
    res.json({
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development'
    });
});

// Serve frontend pages
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

app.get('/market-update', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/market-update.html'));
});

app.get('/services', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/services.html'));
});

app.get('/news-blogs', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/news-blogs.html'));
});

app.get('/about', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/about.html'));
});

app.get('/contact', (req, res) => {
    res.sendFile(path.join(__dirname, '../pages/contact.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Something went wrong!',
        message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        error: 'Route not found',
        path: req.originalUrl
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`🚀 Trading Queen Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🌐 Access at: http://localhost:${PORT}`);
});

module.exports = app;
