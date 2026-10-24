import { useEffect, useState } from "react";
import { getAllUsers, deleteUser, updateUserRole, toggleBanUser } from "../../../services/admin.api";
import { useSelector } from "react-redux";
import { Trash2, Shield, ShieldOff, Ban, Unlock, MoreVertical } from "lucide-react";

export default function ManageUsers() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // userId that's being acted upon
    const [showActions, setShowActions] = useState(null); // userId for which actions menu is shown

    const { user } = useSelector((state) => state.auth);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        // Get current user info
        const loadCurrentUser = async () => {
            try {
                const { getMe } = await import("../../../services/auth.api");
                const res = await getMe();
                setCurrentUser(res.data);
            } catch (err) {
                console.error("Failed to load current user:", err);
            }
        };
        loadCurrentUser();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const res = await getAllUsers();
            setUsers(res.data || []);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    // Close dropdown when clicking outside
    useEffect(() => {
        if (!showActions) return;

        const handleClickOutside = (event) => {
            const target = event.target;
            const dropdown = target.closest('.dropdown');
            const menu = target.closest('.dropdown-content');
            
            if (!dropdown && !menu) {
                setShowActions(null);
            }
        };

        // Use a small delay to allow button clicks to register
        const timeoutId = setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);

        return () => {
            clearTimeout(timeoutId);
            document.removeEventListener('click', handleClickOutside);
        };
    }, [showActions]);

    const handleDelete = async (userId, userName) => {
        if (!window.confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            setActionLoading(userId);
            setError(null);
            await deleteUser(userId);
            setSuccess(`User "${userName}" deleted successfully`);
            await fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to delete user");
        } finally {
            setActionLoading(null);
            setShowActions(null);
        }
    };

    const handleMakeAdmin = async (userId, userName) => {
        if (!window.confirm(`Make "${userName}" an admin?`)) {
            return;
        }

        try {
            setActionLoading(userId);
            setError(null);
            await updateUserRole(userId, "admin");
            setSuccess(`"${userName}" is now an admin`);
            await fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user role");
        } finally {
            setActionLoading(null);
            setShowActions(null);
        }
    };

    const handleMakeStudent = async (userId, userName) => {
        if (!window.confirm(`Remove admin privileges from "${userName}"?`)) {
            return;
        }

        try {
            setActionLoading(userId);
            setError(null);
            await updateUserRole(userId, "student");
            setSuccess(`"${userName}" is now a student`);
            await fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to update user role");
        } finally {
            setActionLoading(null);
            setShowActions(null);
        }
    };

    const handleBan = async (userId, userName, isBanned) => {
        const action = isBanned ? "unban" : "ban";
        if (!window.confirm(`${action === "ban" ? "Ban" : "Unban"} user "${userName}"?`)) {
            return;
        }

        try {
            setActionLoading(userId);
            setError(null);
            await toggleBanUser(userId);
            setSuccess(`User "${userName}" ${action === "ban" ? "banned" : "unbanned"} successfully`);
            await fetchUsers();
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            setError(err.response?.data?.message || `Failed to ${action} user`);
        } finally {
            setActionLoading(null);
            setShowActions(null);
        }
    };

    const isCurrentUser = (userId) => {
        const currentUserId = currentUser?._id || currentUser?.id || user?._id || user?.id;
        return currentUserId === userId;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-12">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    return (
        <div className="space-y-4 sm:space-y-6">
            <h1 className="page-heading">Manage Users</h1>

            {success && (
                <div className="alert alert-success shadow-lg">
                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="alert alert-error shadow-lg">
                    <span>{error}</span>
                </div>
            )}

            {users.length === 0 ? (
                <div className="alert alert-info">
                    <span>No users found</span>
                </div>
            ) : (
                <div className="card bg-base-100 border border-base-300 rounded-2xl shadow-sm overflow-hidden">
                    <div className="card-body p-0">
                        <div className="overflow-x-auto">
                            <table className="table w-full">
                                <thead className="bg-base-200/60 text-xs uppercase tracking-wider text-[#677489] dark:text-slate-400 border-b border-base-300">
                                    <tr>
                                        <th className="font-bold py-3.5 pl-6">Name</th>
                                        <th className="font-bold py-3.5 px-4">Email</th>
                                        <th className="font-bold py-3.5 px-4">Role</th>
                                        <th className="font-bold py-3.5 px-4">Status</th>
                                        <th className="font-bold py-3.5 px-4">Joined</th>
                                        <th className="font-bold py-3.5 pr-6 text-center">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-base-200">
                                    {users.map((userItem) => {
                                        const isSelf = isCurrentUser(userItem._id);
                                        const isLoading = actionLoading === userItem._id;
                                        const showMenu = showActions === userItem._id;

                                        return (
                                            <tr
                                                key={userItem._id}
                                                className={`hover:bg-base-200/40 transition-colors ${
                                                    userItem.isBanned ? "opacity-60" : ""
                                                }`}
                                            >
                                                <td className="font-semibold text-[#111729] dark:text-white pl-6 py-4">{userItem.name}</td>
                                                <td className="text-[#677489] dark:text-slate-300 px-4 py-4">{userItem.email}</td>
                                                <td className="px-4 py-4">
                                                    <span
                                                        className={`badge badge-sm font-semibold rounded-full px-3 py-1 ${
                                                            userItem.role === "admin"
                                                                ? "badge-primary"
                                                                : "badge-ghost bg-base-200 text-[#111729] dark:text-white"
                                                        }`}
                                                    >
                                                        {userItem.role?.toUpperCase()}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-4">
                                                    {userItem.isBanned ? (
                                                        <span className="badge badge-warning badge-sm font-semibold rounded-full px-3 py-1">
                                                            <Ban className="w-3 h-3 mr-1" />
                                                            BANNED
                                                        </span>
                                                    ) : (
                                                        <span className="badge badge-success badge-sm font-semibold rounded-full px-3 py-1 text-white">
                                                            <Unlock className="w-3 h-3 mr-1" />
                                                            ACTIVE
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="text-sm text-[#677489] dark:text-slate-400 px-4 py-4">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                                                <td className="pr-6 py-4">
                                                    <div className="flex justify-center">
                                                        <div className={`dropdown dropdown-end ${showMenu ? "dropdown-open" : ""}`}>
                                                            <button
                                                                type="button"
                                                                tabIndex={0}
                                                                className="btn btn-sm btn-ghost"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    e.preventDefault();
                                                                    setShowActions(showMenu ? null : userItem._id);
                                                                }}
                                                                disabled={isLoading}
                                                            >
                                                                {isLoading ? (
                                                                    <span className="loading loading-spinner loading-xs"></span>
                                                                ) : (
                                                                    <MoreVertical className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            <ul
                                                                tabIndex={0}
                                                                className="dropdown-content menu bg-base-100 rounded-box z-[100] w-52 p-2 shadow-xl border-2 border-base-300"
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                }}
                                                            >
                                                                    {/* Make Admin/Student */}
                                                                    {userItem.role === "admin" ? (
                                                                        <li>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleMakeStudent(userItem._id, userItem.name);
                                                                                }}
                                                                                disabled={isSelf || isLoading}
                                                                                className={isSelf ? "opacity-50 cursor-not-allowed" : ""}
                                                                                title={isSelf ? "Cannot change your own role" : ""}
                                                                            >
                                                                                <ShieldOff className="w-4 h-4" />
                                                                                Make Student
                                                                            </button>
                                                                        </li>
                                                                    ) : (
                                                                        <li>
                                                                            <button
                                                                                type="button"
                                                                                onClick={(e) => {
                                                                                    e.stopPropagation();
                                                                                    handleMakeAdmin(userItem._id, userItem.name);
                                                                                }}
                                                                                disabled={isSelf || isLoading}
                                                                                className={isSelf ? "opacity-50 cursor-not-allowed" : ""}
                                                                                title={isSelf ? "Cannot change your own role" : ""}
                                                                            >
                                                                                <Shield className="w-4 h-4" />
                                                                                Make Admin
                                                                            </button>
                                                                        </li>
                                                                    )}

                                                                    {/* Ban/Unban */}
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleBan(userItem._id, userItem.name, userItem.isBanned);
                                                                            }}
                                                                            disabled={isSelf || isLoading}
                                                                            className={isSelf ? "opacity-50 cursor-not-allowed" : ""}
                                                                            title={isSelf ? "Cannot ban yourself" : ""}
                                                                        >
                                                                            {userItem.isBanned ? (
                                                                                <>
                                                                                    <Unlock className="w-4 h-4" />
                                                                                    Unban User
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <Ban className="w-4 h-4" />
                                                                                    Ban User
                                                                                </>
                                                                            )}
                                                                        </button>
                                                                    </li>

                                                                    <div className="divider my-1"></div>

                                                                    {/* Delete */}
                                                                    <li>
                                                                        <button
                                                                            type="button"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleDelete(userItem._id, userItem.name);
                                                                            }}
                                                                            disabled={isSelf || isLoading}
                                                                            className={`text-error ${isSelf ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                            title={isSelf ? "Cannot delete yourself" : ""}
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                            Delete User
                                                                        </button>
                                                                    </li>
                                                                </ul>
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
