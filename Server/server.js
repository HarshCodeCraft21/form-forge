const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const formRoutes = require('./routes/formRoutes');
const publicRoutes = require('./routes/publicRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const responseRoutes = require('./routes/responseRoutes');

// Load environment variables
dotenv.config();

// Connect to Database
connectDB();

const app = express();

// Middlewares
app.use(cors({
  origin: true, // Allow requests from any origin or specifically client's port
  credentials: true
}));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/forms', formRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/responses', responseRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'FormForge Server is active' });
});

// Port configuration
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running in production mode on port ${PORT}`);
});
