import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

// Route imports
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';

// Load environment variables
dotenv.config({ path: './.env' });

// --- ES MODULE COMPATIBILITY ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- GLOBAL MIDDLEWARE ---
app.use(cors());
app.use(express.json()); // Parses JSON bodies
app.use(express.urlencoded({ extended: true })); // Parses Form-encoded bodies

// --- STATIC FILES =
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- API ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

// --- DATABASE CONNECTION TEST ---
app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'success',
            message: 'Backend is running!',
            db_time: result.rows[0].now
        });
    } catch (err) {
        console.error("Database connection error:", err.message);
        res.status(500).json({ error: 'Server error: Database unreachable' });
    }
});

// --- SERVER START ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`-----------------------------------------`);
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📁 Static files served from: ${path.join(__dirname, 'uploads')}`);
    console.log(`-----------------------------------------`);
});