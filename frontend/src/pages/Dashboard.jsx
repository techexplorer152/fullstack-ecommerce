import { useEffect, useState } from "react";
import StatsGrid from "../components/StatsGrid";
import RecentOrders from "../components/RecentOrders";
import "./Dashboard.css";
import API_URL from "../apiConfig";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoadingOrders, setIsLoadingOrders] = useState(true);
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("authToken");

    useEffect(() => {
        if (!token) {
            setMessage("You are not logged in");
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const userRes = await fetch(`${API_URL}/api/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userRes.ok) {
                    const userData = await userRes.json();
                    if (userData.user) setUser(userData.user);
                }

                const ordersRes = await fetch(`${API_URL}/api/orders`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (ordersRes.ok) {
                    const ordersData = await ordersRes.json();
                    setOrders(ordersData);
                }
            } catch (err) {
                console.error(err);
                setMessage("Error fetching dashboard data");
            } finally {
                setIsLoadingOrders(false);
            }
        };

        fetchDashboardData();
    }, [token]);

    const handleLogout = () => {
        localStorage.removeItem("authToken");
        window.location.href = "/login";
    };

    return (
        <div className="dashboard">
            <div className="dashboard-content">
                <div className="welcome-card">
                    <h2 className="dash-title">Dashboard</h2>
                    {user ? (
                        <div className="user-info">
                            <p>Welcome, <strong>{user.username}</strong>!</p>
                            <p>Email: {user.email}</p>
                            <button onClick={handleLogout}>Logout</button>
                        </div>
                    ) : (
                        <p>{message}</p>
                    )}
                </div>

                <div className="main-content">
                    <h1>Welcome to your Dashboard</h1>
                    <p className="subtitle">Here’s a quick overview of your activity.</p>
                    <StatsGrid />
                    <RecentOrders orders={orders} isLoading={isLoadingOrders} />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;