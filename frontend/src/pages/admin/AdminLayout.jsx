import { Link } from "react-router-dom";
import "./AdminDashboard.css";

export default function AdminLayout({ children }) {
    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <h2 className="sidebar-title">Admin Panel</h2>

                <nav className="sidebar-nav">
                    <Link to="/admin" className="sidebar-link">Dashboard</Link>
                    <Link to="/admin/products" className="sidebar-link">Manage Products</Link>
                    <Link to="/admin/orders" className="sidebar-link">Manage Orders</Link>
                    <Link to="/admin/users" className="sidebar-link">Manage Users</Link>
                    <Link to="/admin/settings" className="sidebar-link">Settings</Link>
                </nav>
            </aside>

            <main className="admin-main">
                {children}
            </main>
        </div>
    );
}
