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
                o.created_at
            FROM orders o
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

export const createOrder = async ({ userId, items, totalAmount, shippingAddress }) => {
    const client = await pool.connect();
    try {
        await client.query('BEGIN');

        const orderResult = await client.query(
            `INSERT INTO orders (user_id, total, status, shipping_address) 
             VALUES ($1, $2, 'pending', $3) 
             RETURNING *`,
            [userId, totalAmount, shippingAddress]
        );

        const newOrder = orderResult.rows[0];
        const orderId = newOrder.id;

        for (const item of items) {
            await client.query(
                `INSERT INTO order_items (order_id, product_id, quantity, price) 
                 VALUES ($1, $2, $3, $4)`,
                [orderId, item.id, item.quantity, item.price]
            );
        }

        await client.query('COMMIT');
        return newOrder;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};