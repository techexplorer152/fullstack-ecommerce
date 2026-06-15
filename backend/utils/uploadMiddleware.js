import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import dotenv from 'dotenv';
import pool from './db.js'; //

dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: 'products',
            format: 'jpeg',
            transformation: [{ width: 800, height: 800, crop: 'limit' }]
        };
    },
});

const fileFilter = (req, file, cb) => {
    if (!file || !file.mimetype || !file.mimetype.startsWith("image/")) {
        return cb(new Error("Only images allowed"), false);
    }
    cb(null, true);
};

export const uploadProductImage = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const globalUploadLimiter = async (req, res, next) => {
    try {
        const result = await pool.query(
            `SELECT COUNT(*) FROM global_upload_logs 
             WHERE uploaded_at > NOW() - INTERVAL '1 hour'`
        );

        const uploadCount = parseInt(result.rows[0].count);


        if (uploadCount >= 3) {
            return res.status(429).json({
                success: false,
                message: "Demo upload limit reached! Only 3 total images can be uploaded per hour across this entire app to prevent spam. Please try again later."
            });
        }


        next();
    } catch (error) {
        console.error("❌ Rate limiter database query crash:", error);
        res.status(500).json({ message: "Internal server error validating demo limits." });
    }
};