import {
    getAllProducts as getAllProductsService,
    getProductById as getProductByIdService,
    createProduct as createProductService,
    updateProduct as updateProductService,
    deleteProduct as deleteProductService,
} from "../services/productService.js";

// ----------------------
// GET ALL PRODUCTS
// ----------------------
export const getAllProducts = async (req, res) => {
    try {
        const products = await getAllProductsService();
        res.json(products);
    } catch (err) {
        console.error("Error fetching products:", err);
        res.status(500).json({ message: "Server error" });
    }
};

// ----------------------
// GET SINGLE PRODUCT
// ----------------------
export const getProductById = async (req, res) => {
    try {
        const product = await getProductByIdService(req.params.id);
        res.json(product);
    } catch (err) {
        console.error("Error fetching product:", err);
        res.status(err.message === "Product not found" ? 404 : 500).json({ message: err.message });
    }
};

// ----------------------
// CREATE PRODUCT (Updated for Cloudinary)
// ----------------------
export const createProduct = async (req, res) => {
    try {

        const images = req.files
            ? req.files.map(file => file.path)
            : [];

        const newProduct = await createProductService({
            ...req.body,
            images,
        });

        res.status(201).json(newProduct);
    } catch (err) {
        console.error("🔥 CREATE PRODUCT ERROR:", err);
        res.status(500).json({
            message: err.message
        });
    }
};

// ----------------------
// UPDATE PRODUCT (Updated for Cloudinary)
// ----------------------
export const updateProduct = async (req, res) => {
    try {
        // If new files are uploaded, use the new Cloudinary URLs
        const images = req.files && req.files.length > 0
            ? req.files.map(file => file.path)
            : undefined;

        const updatedProduct = await updateProductService(req.params.id, {
            ...req.body,
            ...(images && { images }),
        });

        res.json(updatedProduct);
    } catch (err) {
        console.error("Error updating product:", err);
        res.status(err.message === "Product not found" ? 404 : 500).json({ message: err.message });
    }
};

// ----------------------
// DELETE PRODUCT
// ----------------------
export const deleteProduct = async (req, res) => {
    try {
        const result = await deleteProductService(req.params.id);
        res.json(result);
    } catch (err) {
        console.error("Error deleting product:", err);
        res.status(err.message === "Product not found" ? 404 : 500).json({ message: err.message });
    }
};