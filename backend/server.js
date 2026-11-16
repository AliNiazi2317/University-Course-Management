
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ===============================
// FRONTEND FILES
// ===============================
const frontendPath = path.join(__dirname, '../frontend');

app.use(express.static(frontendPath));

// ===============================
// API ROUTES
// ===============================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/courses', require('./routes/courseRoutes'));

// ===============================
// HOME PAGE
// ===============================
app.get('/', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
});

// ===============================
// HEALTH CHECK
// ===============================
app.get('/api/health', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'University Course Management API is running!'
    });
});

// ===============================
// 404 HANDLER
// ===============================
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// ===============================
// START SERVER
// ===============================
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log('====================================');
    console.log(' UNIVERSITY COURSE MANAGEMENT');
    console.log('====================================');
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Frontend: http://localhost:${PORT}`);
    console.log(`API Health: http://localhost:${PORT}/api/health`);
});
