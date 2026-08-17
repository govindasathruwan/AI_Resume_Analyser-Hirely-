require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const sequelize = require('./config/database');

// Import models to register them
require('./models');

const authRoutes = require('./routes/auth');
const resumeRoutes = require('./routes/resumes');
const analysisRoutes = require('./routes/analyses');

const app = express();
const DEFAULT_PORT = process.env.PORT || 5050;

// Create uploads directory
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, '..', uploadDir)));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'AI Resume Analyser API is running!', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analyses', analysisRoutes);

// Serve static frontend build if it exists
const frontendDist = process.env.FRONTEND_DIST || path.join(__dirname, '..', '..', 'frontend', 'dist');
if (fs.existsSync(frontendDist)) {
  console.log(`📦 Serving static frontend from ${frontendDist}`);
  app.use(express.static(frontendDist));
}

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// Fallback to React index.html for SPA routes (if frontend dist exists)
app.use((req, res, next) => {
  if (fs.existsSync(path.join(frontendDist, 'index.html'))) {
    return res.sendFile(path.join(frontendDist, 'index.html'));
  }
  res.status(404).json({ success: false, message: `Route ${req.method} ${req.url} not found.` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  if (err.name === 'MulterError') {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, message: 'File too large. Maximum size is 10MB.' });
    }
    return res.status(400).json({ success: false, message: err.message });
  }
  if (err.message === 'Only PDF files are allowed') {
    return res.status(400).json({ success: false, message: err.message });
  }
  res.status(500).json({ success: false, message: 'Internal server error.' });
});

const { initDatabase } = require('./config/database');

// Connect to DB and start server with port fallback mechanism
const startServer = async (options = {}) => {
  const targetPort = options.port !== undefined ? options.port : DEFAULT_PORT;
  try {
    await initDatabase();

    return new Promise((resolve, reject) => {
      const server = app.listen(targetPort, () => {
        const actualPort = server.address().port;
        console.log(`🚀 Server running on http://localhost:${actualPort}`);
        resolve({ server, port: actualPort });
      });

      server.on('error', (err) => {
        if (err.code === 'EADDRINUSE' && targetPort !== 0) {
          console.warn(`⚠️ Port ${targetPort} is in use. Trying auto-assigned fallback port...`);
          const fallbackServer = app.listen(0, () => {
            const actualPort = fallbackServer.address().port;
            console.log(`🚀 Server running on fallback http://localhost:${actualPort}`);
            resolve({ server: fallbackServer, port: actualPort });
          });
          fallbackServer.on('error', reject);
        } else {
          reject(err);
        }
      });
    });
  } catch (error) {
    console.error('❌ Failed to connect to database:', error.message);
    if (!options.isElectron) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
