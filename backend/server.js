require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./utils/errorHandler');


const requiredEnvVars = ['MONGO_URI', 'JWT_SECRET', 'STRIPE_SECRET_KEY'];
requiredEnvVars.forEach(key => {
  if (!process.env[key]) {
    console.error(` CRITICAL: Missing environment variable: ${key}`);
    process.exit(1);
  }
});


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const carRoutes = require('./routes/carRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const stripeRoutes = require('./routes/stripeRoutes');

connectDB();



const app = express();

app.set('trust proxy', 1);

app.use(compression({
  level: 6,
  threshold: 1024, 
  filter: (req, res) => {
    if (req.headers['x-no-compression']) return false;
    return compression.filter(req, res);
  }
}));



app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } })); 
app.use(mongoSanitize()); 


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { message: 'Trop de requêtes, veuillez réessayer dans 15 minutes' }
});
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20, 
  message: { message: 'Trop de tentatives de connexion, réessayez dans 15 minutes' }
});



const allowedOrigins = ['http://localhost:3000', 'https://location-voiture.vercel.app'];
if (process.env.CLIENT_URL) {
  allowedOrigins.push(...process.env.CLIENT_URL.split(','));
}

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    
    const normalizedOrigin = origin.endsWith('/') ? origin.slice(0, -1) : origin;
    const isLocal = normalizedOrigin.startsWith('http://localhost') || normalizedOrigin.startsWith('http://127.0.0.1');

    if (isLocal || allowedOrigins.includes(normalizedOrigin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

const { handleStripeWebhook } = require('./controllers/stripeController');
app.post('/api/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

app.use(express.json());


const staticCacheOptions = {
  maxAge: process.env.NODE_ENV === 'production' ? '7d' : '0',
  etag: true,
  lastModified: true,
};

app.use('/uploads', express.static(path.join(__dirname, 'uploads'), staticCacheOptions));
app.use('/images', express.static(path.join(__dirname, '..', 'public', 'images'), staticCacheOptions));


app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

app.use('/api', apiLimiter);

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/stripe', stripeRoutes);


app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    uptime: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});


app.get('/', (req, res) => {
  res.json({ message: 'API LocaFès is running...' });
});


app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
