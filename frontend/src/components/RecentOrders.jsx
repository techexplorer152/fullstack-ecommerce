import "./RecentOrders.css";

function RecentOrders({ orders, isLoading }) {
    const fakeUserOrders = [
        { id: 1024, product_name: "Wireless Headphones", created_at: "2026-02-10T10:00:00Z", status: "Delivered", total: 129.99 },
        { id: 1025, product_name: "USB-C Cable", created_at: "2026-02-12T14:30:00Z", status: "Shipped", total: 15.50 },
        { id: 1028, product_name: "Smart Watch", created_at: "2026-02-15T09:15:00Z", status: "Processing", total: 199.00 },
    ];

    const dataToShow = orders && orders.length > 0 ? orders : fakeUserOrders;

    if (isLoading) {
        return <div className="recent-orders loading">Loading your orders...</div>;
    }

    if (!dataToShow || dataToShow.length === 0) {
        return (
            <div className="recent-orders empty">
                <h2>Your Recent Orders</h2>
                <p>You haven't placed any orders yet.</p>
            </div>
        );
    }

    return (
        <div className="recent-orders">
            <div className="table-header-group">
                <h2>Your Recent Orders</h2>
            </div>

            <div className="table-container">
                <table>
                    <thead>
                    <tr>
                        <th>Order ID</th>
                        <th>Item</th>
                        <th>Date</th>
                        <th>Status</th>
                        <th>Total</th>
                    </tr>
                    </thead>
                    <tbody>
                    {dataToShow.map((order) => (
                        <tr key={order.id}>
                            <td data-label="Order ID" className="font-mono">#{order.id}</td>
                            <td data-label="Item">{order.product_name || "Store Purchase"}</td>
                            <td data-label="Date">{new Date(order.created_at).toLocaleDateString()}</td>
                            <td data-label="Status">
                                    <span className={`status-badge ${order.status.toLowerCase()}`}>
                                        {order.status}
                                    </span>
                            </td>
                            <td data-label="Total" className="price-cell">${Number(order.total).toFixed(2)}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default RecentOrders;