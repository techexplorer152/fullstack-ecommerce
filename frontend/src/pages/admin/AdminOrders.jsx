import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API_URL from "../../apiConfig";
import "./AdminOrders.css";

function AdminOrders() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("authToken");

    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${API_URL}/admin/orders`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) throw new Error("Failed to fetch orders");

            const data = await res.json();
            setOrders(data);
        } catch (err) {
            console.error(err);
            setError("Could not load orders");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) fetchOrders();
    }, [token]);

    const handleStatusChange = async (id, status) => {
        try {
            const res = await fetch(`${API_URL}/admin/orders/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) throw new Error("Failed to update order");

            fetchOrders();
        } catch (err) {
            console.error(err);
            alert("Error updating order");
        }
    };

    if (loading) return <p>Loading orders...</p>;
    if (error) return <p>{error}</p>;

    return (
        <AdminLayout>
            <div className="admin-orders">
                <h2>Manage Orders</h2>

                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>User</th>
                        <th>Total</th>
                        <th>Status</th>
                    </tr>
                    </thead>

                    <tbody>
                    {orders.map((order) => (
                        <tr key={order.id}>
                            <td>{order.id}</td>
                            <td>{order.user_email}</td>
                            <td>${Number(order.total).toFixed(2)}</td>
                            <td>
                                <select
                                    value={order.status}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            order.id,
                                            e.target.value
                                        )
                                    }
                                >
                                    <option value="pending">pending</option>
                                    <option value="processing">processing</option>
                                    <option value="completed">completed</option>
                                    <option value="cancelled">cancelled</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default AdminOrders;