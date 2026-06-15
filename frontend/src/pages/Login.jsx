import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "./Login.module.css";
import API_URL from "../apiConfig";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage("");
        setIsLoading(true);

        try {
            const res = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem("authToken", data.token);
                navigate("/dashboard");
            } else {
                setMessage(data?.message || "Invalid credentials. Please try again.");
            }
        } catch (err) {
            setMessage("Server unreachable. Please check your connection.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.demoCredentialsBox}>
                <h4>🔑 Portfolio Tester Access</h4>
                <p>To test the admin features and product management panel without creating an account, use these credentials:</p>
                <div className={styles.credentialRow}>
                    <strong>Email:</strong> <span>admin@demo.com</span>
                </div>
                <div className={styles.credentialRow}>
                    <strong>Password:</strong> <span>demo1234</span>
                </div>
            </div>

            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <h2>Welcome Back</h2>
                    <p>Enter your details to access your account</p>
                </div>

                {message && <div className={styles.errorBanner}>{message}</div>}

                <form onSubmit={handleSubmit} className={styles.loginForm}>
                    <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <div className={styles.inputWrapper}>
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.labelRow}>
                            <label>Password</label>
                        </div>
                        <div className={styles.inputWrapper}>
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                className={styles.togglePassword}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button type="submit" className={styles.loginBtn} disabled={isLoading}>
                        {isLoading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <p className={styles.footerText}>
                    New here? <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;