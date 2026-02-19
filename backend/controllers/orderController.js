import {
    getAllOrders,
    updateOrderStatus,
    deleteOrder,
    createOrder
} from "../services/orderService.js";

export const fetchOrders = async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: "Admins only." });
        }

        const orders = await getAllOrders();
        res.json(orders);
    } catch (err) {
        console.error("Fetch orders error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const updateOrder = async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: "Admins only." });
        }

        const { id } = req.params;
        const { status } = req.body;

        const updated = await updateOrderStatus(id, status);

        if (!updated) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order updated", order: updated });
    } catch (err) {
        console.error("Update order error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const removeOrder = async (req, res) => {
    try {
        if (!req.user.is_admin) {
            return res.status(403).json({ message: "Admins only." });
        }

        const { id } = req.params;

        const deleted = await deleteOrder(id);

        if (!deleted) {
            return res.status(404).json({ message: "Order not found" });
        }

        res.json({ message: "Order deleted" });
    } catch (err) {
        console.error("Delete order error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

export const createNewOrder = async (req, res) => {
    try {
        const userId = req.user.id;
        const { items, totalAmount, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        const newOrder = await createOrder({
            userId,
            items,
            totalAmount,
            shippingAddress
        });

        res.status(201).json({
            message: "Order placed successfully!",
            order: newOrder
        });
    } catch (err) {
        console.error("Create order error:", err);
        res.status(500).json({ message: "Failed to place order" });
    }
};