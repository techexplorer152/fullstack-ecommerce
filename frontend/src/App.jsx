import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useMemo ,useEffect} from "react";

import Login from "./pages/Login";
import RegisterPage from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Checkout from "./pages/Checkout";

import AdminDashboard from "./pages/AdminDashboard";
import AdminProducts from "./pages/AdminProducts";
import AdminOrders from "./pages/AdminOrders";
import AdminUsers from "./pages/AdminUsers";

import MainLayout from "./components/MainLayout";
import PrivateRoute from "./components/PrivateRoute";
import RouteTransition from "./components/RouteTransition";

function App() {
    const isAuthenticated = useMemo(
        () => !!localStorage.getItem("authToken"),
        []
    );
    useEffect(() => {
        console.log("API URL:", import.meta.env.VITE_API_URL);
    }, []);


    return (
        <Router>
            <Routes>

                {/* ROOT */}
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={isAuthenticated ? "/dashboard" : "/login"}
                            replace
                        />
                    }
                />

                {/* AUTH */}
                <Route
                    path="/login"
                    element={
                        isAuthenticated
                            ? <Navigate to="/dashboard" replace />
                            : <Login />
                    }
                />

                <Route
                    path="/register"
                    element={
                        isAuthenticated
                            ? <Navigate to="/dashboard" replace />
                            : <RegisterPage />
                    }
                />

                {/* USER AREA */}
                <Route
                    element={
                        <PrivateRoute>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route
                        path="/dashboard"
                        element={
                            <RouteTransition>
                                <Dashboard />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/products"
                        element={
                            <RouteTransition>
                                <Products />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/product/:id"
                        element={
                            <RouteTransition>
                                <ProductDetail />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/cart"
                        element={
                            <RouteTransition>
                                <Cart />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/orders"
                        element={
                            <RouteTransition>
                                <Orders />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/checkout"
                        element={
                            <RouteTransition>
                                <Checkout />
                            </RouteTransition>
                        }
                    />
                </Route>

                {/* ADMIN AREA */}
                <Route
                    element={
                        <PrivateRoute adminOnly={true}>
                            <MainLayout />
                        </PrivateRoute>
                    }
                >
                    <Route
                        path="/admin"
                        element={
                            <RouteTransition>
                                <AdminDashboard />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/admin/products"
                        element={
                            <RouteTransition>
                                <AdminProducts />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/admin/orders"
                        element={
                            <RouteTransition>
                                <AdminOrders />
                            </RouteTransition>
                        }
                    />

                    <Route
                        path="/admin/users"
                        element={
                            <RouteTransition>
                                <AdminUsers />
                            </RouteTransition>
                        }
                    />
                </Route>

                {/* FALLBACK */}
                <Route path="*" element={<Navigate to="/" replace />} />

            </Routes>
        </Router>
    );
}

export default App;
