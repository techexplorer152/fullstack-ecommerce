import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./NavBar.css";
import ShopLogo from './img/hihi.png'

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("authToken");
    let isAdmin = false;

    if (token) {
        try {
            const decoded = jwtDecode(token);
            isAdmin = decoded?.is_admin === true;
        } catch (err) {
            console.error("Invalid token", err);
            localStorage.removeItem("authToken");
        }
    }


    useEffect(() => {
        setMenuOpen(false);
    }, [location]);

    const handleLogout = () => {
        setMenuOpen(false);
        localStorage.removeItem("authToken");
        navigate("/login");
    };

    const isActive = (path) => location.pathname === path ? "active-link" : "";

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-brand">
                    <Link to="/dashboard" className="brand-logo">
                        <img src={ShopLogo} alt="Shop Logo" />
                    </Link>
                </div>


                <button
                    className={`menu-toggle ${menuOpen ? "is-active" : ""}`}
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle navigation"
                >
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                    <span className="hamburger-bar"></span>
                </button>

                <ul className={`navbar-list ${menuOpen ? "open" : ""}`}>
                    <li>
                        <Link to="/dashboard" className={isActive("/dashboard")}>
                            Dashboard
                        </Link>
                    </li>
                    <li>
                        <Link to="/products" className={isActive("/products")}>
                            Products
                        </Link>
                    </li>
                    <li>
                        <Link to="/cart" className={isActive("/cart")}>
                            Cart
                        </Link>
                    </li>
                    <li>
                        <Link to="/orders" className={isActive("/orders")}>
                            Orders
                        </Link>
                    </li>

                    {isAdmin && (
                        <li>
                            <Link to="/admin" className={`admin-link ${isActive("/admin")}`}>
                                Admin Panel
                            </Link>
                        </li>
                    )}

                    <li className="logout-item">
                        <button className="logout-btn" onClick={handleLogout}>Logout</button>
                    </li>
                </ul>
            </div>
        </nav>
    );
}

export default NavBar;