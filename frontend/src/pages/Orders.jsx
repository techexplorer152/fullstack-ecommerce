import React, { useEffect, useState } from "react";
import "./Orders.css";
import PageLoader from "./PageLoader";
import API_URL from "../apiConfig";

function Orders({ onDataReady }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const token = localStorage.getItem("authToken");

                if (!token) {
                    setError("You must be logged in to view orders.");
                    setLoading(false);
                    if (onDataReady) onDataReady();
                    return;
                }

                const response = await fetch(`${API_URL}/api/orders`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.status === 403) {
                    setError("You do not have permission to view orders.");
                    return;
                }

                if (!response.ok) {
                    throw new Error(`Failed to fetch orders: ${response.status}`);
                }

                const data = await response.json();

                setOrders(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Error fetching orders:", err);
                setError("Unable to load orders. Please try again later.");
            } finally {
                setLoading(false);
                if (onDataReady) onDataReady();
            }
        };

        fetchOrders();
    }, [onDataReady]);

    if (loading) return <PageLoader />;

    if (error) {
        return (
            <div className="error-container">
                <p>{error}</p>
            </div>
        );
    }

    return (
        <div className="orders-container">
            <h2>Your Orders</h2>

            {orders.length === 0 ? (
                <p className="no-orders">You have no orders yet.</p>
            ) : (
                <ul className="orders-list">
                    {orders.map((order) => (
                        <li key={order.id} className="order-card">
                            <h3>Order #{order.id}</h3>
                            <p>Status: {order.status}</p>
                            <p>
                                Date:{" "}
                                {order.created_at
                                    ? new Date(order.created_at).toLocaleString()
                                    : "N/A"}
                            </p>

                            {Array.isArray(order.items) && order.items.length > 0 && (
                                <ul className="order-items">
                                    {order.items.map((item, i) => (
                                        <li key={i}>
                                            {item.name} × {item.quantity} (${item.price})
                                        </li>
                                    ))}
                                </ul>
                            )}

                            <p>Total: ${order.total}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default Orders;


