import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './db.js';

import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import ordersRoutes from './routes/orders.js';
import adminRoutes from './routes/admin.js';
import dashboardRoutes from './routes/dashboard.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origin.endsWith('.vercel.app') || origin === 'http://localhost:5173') {
            callback(null, true);
        } else {
            callback(new Error('CORS blocked: This origin is not allowed'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/admin', adminRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({
            status: 'success',
            message: 'Backend is running!',
            db_time: result.rows[0].now
        });
    } catch (err) {
        res.status(500).json({ error: 'Database unreachable' });
    }
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

