import pool from "../db.js";

export const getAllProducts = async () => {
    const result = await pool.query(
        "SELECT * FROM products ORDER BY id DESC"
    );
    return result.rows;
};

export const getProductById = async (id) => {
    const result = await pool.query(
        "SELECT * FROM products WHERE id = $1",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];
};

export const createProduct = async (data) => {
    const { name, description, price, stock, images } = data;

    if (!name || price === undefined) {
        throw new Error("Name and price are required");
    }

    const parsedPrice = Number(price);
    if (isNaN(parsedPrice)) {
        throw new Error("Invalid price");
    }

    const parsedStock = Number(stock || 0);
    if (isNaN(parsedStock)) {
        throw new Error("Invalid stock");
    }

    const result = await pool.query(
        `
        INSERT INTO products (name, description, price, stock, images)
        VALUES ($1, $2, $3, $4, $5::text[])
        RETURNING *
        `,
        [
            name.trim(),
            description || "",
            parsedPrice,
            parsedStock,
            images && images.length > 0 ? images : null
        ]
    );

    return result.rows[0];
};

export const updateProduct = async (id, data) => {
    const { name, description, price, stock, images } = data;

    const parsedPrice = price !== undefined ? Number(price) : null;
    if (price !== undefined && isNaN(parsedPrice)) {
        throw new Error("Invalid price");
    }

    const parsedStock = stock !== undefined ? Number(stock) : null;
    if (stock !== undefined && isNaN(parsedStock)) {
        throw new Error("Invalid stock");
    }

    const result = await pool.query(
        `
        UPDATE products
        SET
            name = COALESCE($1, name),
            description = COALESCE($2, description),
            price = COALESCE($3, price),
            stock = COALESCE($4, stock),
            images = COALESCE($5::text[], images)
        WHERE id = $6
        RETURNING *
        `,
        [
            name?.trim() ?? null,
            description ?? null,
            parsedPrice,
            parsedStock,
            images && images.length > 0 ? images : null,
            id
        ]
    );

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return result.rows[0];
};

export const deleteProduct = async (id) => {
    const result = await pool.query(
        "DELETE FROM products WHERE id = $1 RETURNING id",
        [id]
    );

    if (result.rows.length === 0) {
        throw new Error("Product not found");
    }

    return { message: "Product deleted" };
};
