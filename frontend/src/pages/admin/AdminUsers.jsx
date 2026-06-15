import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import API_URL from "../../apiConfig";

function AdminUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("authToken");

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError("");

            const res = await fetch(`${API_URL}/admin/users`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to fetch users");
            }

            const data = await res.json();
            setUsers(data);
        } catch (err) {
            setError("Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const toggleAdmin = async (user) => {
        setSubmitting(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/admin/users/${user.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    is_admin: !user.is_admin,
                }),
            });

            if (!res.ok) {
                throw new Error("Failed to update user");
            }

            setMessage("User role updated successfully");
            await fetchUsers();
        } catch (err) {
            setError("Failed to update user role");
        } finally {
            setSubmitting(false);
        }
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;

        setSubmitting(true);
        setError("");
        setMessage("");

        try {
            const res = await fetch(`${API_URL}/admin/users/${id}`, {
                method: "DELETE",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                throw new Error("Failed to delete user");
            }

            setMessage("User deleted successfully");
            await fetchUsers();
        } catch (err) {
            setError("Failed to delete user");
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <AdminLayout>
                <p>Loading users...</p>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="admin-users">
                <h2>Admin – Manage Users</h2>

                {message && <p className="admin-success">{message}</p>}
                {error && <p className="admin-error">{error}</p>}

                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Admin</th>
                        <th>Actions</th>
                    </tr>
                    </thead>

                    <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.is_admin ? "Yes" : "No"}</td>
                            <td>
                                <button
                                    onClick={() => toggleAdmin(user)}
                                    disabled={submitting}
                                >
                                    {user.is_admin ? "Revoke Admin" : "Make Admin"}
                                </button>

                                <button
                                    onClick={() => deleteUser(user.id)}
                                    disabled={submitting}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}

export default AdminUsers;