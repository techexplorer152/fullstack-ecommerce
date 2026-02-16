import pool from "../db.js";

export const getAllOrders = async () => {
    const result = await pool.query(`
        SELECT o.id, o.user_id, o.total, o.status, o.created_at,
               u.email AS user_email
        FROM orders o
        JOIN users u ON o.user_id = u.id
        ORDER BY o.created_at DESC
    `);

    return result.rows;
};



export const getOrdersByUserId = async (userId) => {
    const result = await pool.query(
        `
            SELECT
                o.id,
                o.total,
                o.status,
                o.created_at,
                p.name AS product_name
            FROM orders o
                     LEFT JOIN products p ON o.product_id = p.id
            WHERE o.user_id = $1
            ORDER BY o.created_at DESC
        `,
        [userId]
    );

    return result.rows;
};

export const updateOrderStatus = async (id, status) => {
    const result = await pool.query(
        `
            UPDATE orders
            SET status = $1
            WHERE id = $2
                RETURNING *
        `,
        [status, id]
    );

    if (result.rowCount === 0) return null;
    return result.rows[0];
};

export const deleteOrder = async (id) => {
    const result = await pool.query(
        `
            DELETE FROM orders
            WHERE id = $1
                RETURNING id
        `,
        [id]
    );

    if (result.rowCount === 0) return false;
    return true;
};