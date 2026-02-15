import { useEffect, useState } from "react";
import StatsGrid from "../components/StatsGrid";
import RecentOrders from "../components/RecentOrders";
import "./Dashboard.css";
import API_URL from "../apiConfig";

function Dashboard() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState("");
    const token = localStorage.getItem("authToken");

    useEffect(() => {

        if (!token) {
            setMessage("You are not logged in");
            return;
        }

        const fetchDashboard = async () => {
            try {
                const res = await fetch(`${API_URL}/api/dashboard`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (!res.ok) {
                    const errorText = await res.text();
                    throw new Error(errorText || "Failed to fetch dashboard");
                }

                const data = await res.json();

                if (data.user) setUser(data.user);
                else setMessage(data.message || "Failed to load dashboard");
            } catch (err) {
                console.error("Error fetching dashboard:", err);
                setMessage("Error fetching dashboard data");
            }
        };

        fetchDashboard();
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
                            <p>
                                Welcome, <strong>{user.username}</strong>!
                            </p>
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
                    <RecentOrders />
                </div>
            </div>
        </div>
    );
}

export default Dashboard;
