const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');

const apiRoutes = require('./routes');
const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');
const ApiResponse = require('./utils/apiResponse');

const app = express();

// Security Headers with permissive resource policy for media/images
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);

// Enable Cross-Origin Resource Sharing (CORS) for all clients (Flutter Web, Mobile, Desktop)
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  })
);

// Gzip Compression
app.use(compression());

// HTTP Request Logger
app.use(morgan('dev'));

// Body Parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root welcome route
app.get('/', (req, res) => {
  res.json(
    ApiResponse.success(
      {
        app: 'EduLearn REST API',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        documentation: '/api/v1/health',
        endpoints: {
          auth: '/api/v1/auth',
          courses: '/api/v1/courses',
          categories: '/api/v1/categories',
          enrollments: '/api/v1/enrollments',
          lessons: '/api/v1/lessons',
          quizzes: '/api/v1/quizzes',
          assignments: '/api/v1/assignments',
          progress: '/api/v1/progress',
          certificates: '/api/v1/certificates',
          profile: '/api/v1/profile',
          notifications: '/api/v1/notifications',
          favorites: '/api/v1/favorites',
        },
      },
      'Welcome to EduLearn Express.js & MySQL Backend API'
    )
  );
});

// Root Health check
app.get('/health', (req, res) => {
  res.json(ApiResponse.success({ status: 'UP', timestamp: new Date().toISOString() }));
});

// Mount EduLearn API v1 Routes
app.use('/api/v1', apiRoutes);

// 404 Handler for undefined routes
app.use(notFoundHandler);

// Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;
