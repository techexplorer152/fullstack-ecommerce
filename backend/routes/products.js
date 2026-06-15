import express from 'express';
import { authenticateToken } from '../utils/authMiddleware.js';
import adminMiddleware from '../utils/adminMiddleware.js';
import {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from '../controllers/productController.js';

import { uploadProductImage, globalUploadLimiter } from '../utils/uploadMiddleware.js';

const router = express.Router();

const handleUploadMiddleware = (req, res, next) => {
    uploadProductImage.array('images', 5)(req, res, (err) => {
        if (err) {
            console.error("🔴 Live Route Multer Crash Log:", err.stack || err);
            return res.status(500).json({
                message: "Image upload engine failed execution",
                error: err.message
            });
        }
        next();
    });
};

// Public Routes
router.get('/', getAllProducts);
router.get('/:id', getProductById);

// Admin Routes

// POST: Create Product
router.post(
    '/',
    globalUploadLimiter,
    handleUploadMiddleware,
    authenticateToken,
    adminMiddleware,
    createProduct
);

// PUT: Update Product
router.put(
    '/:id',
    handleUploadMiddleware,
    authenticateToken,
    adminMiddleware,
    updateProduct
);

// DELETE: Delete Product
router.delete(
    '/:id',
    authenticateToken,
    adminMiddleware,
    deleteProduct
);

export default router;