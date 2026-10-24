import { useState } from "react";
import { registerUser } from "../../services/auth.api";
import { Link, useNavigate } from "react-router-dom";
import { User, Mail, Lock, Key, UserPlus, Sparkles } from "lucide-react";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ name: "", email: "", password: "", adminKey: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showAdminKey, setShowAdminKey] = useState(false);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const payload = {
                name: form.name,
                email: form.email,
                password: form.password,
            };
            if (form.adminKey.trim()) {
                payload.adminKey = form.adminKey.trim();
            }

            await registerUser(payload);
            navigate("/login");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto px-4 py-8 sm:py-12">
            <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl relative overflow-hidden">
                {/* Decorative background glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-[#006FF9]/15 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-[#2D62FF]/15 rounded-full blur-3xl pointer-events-none"></div>

                <div className="card-body p-6 sm:p-9 relative z-10 space-y-5">
                    <div className="text-center space-y-2">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006FF9]/10 text-[#006FF9] text-xs font-bold border border-[#006FF9]/20">
                            <Sparkles className="w-3.5 h-3.5" /> Start Learning
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                            Create Account
                        </h1>
                        <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-400">
                            Join thousands of builders mastering tech and product skills
                        </p>
                    </div>

                    {error && (
                        <div className="alert alert-error text-xs p-3 rounded-2xl shadow-xs">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                                <User className="w-3.5 h-3.5 text-[#006FF9]" /> Full Name
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Alex Morgan"
                                className="input w-full rounded-full border-base-300 focus:border-[#006FF9] text-sm px-4"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                                <Mail className="w-3.5 h-3.5 text-[#006FF9]" /> Email Address
                            </label>
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleChange}
                                placeholder="name@example.com"
                                className="input w-full rounded-full border-base-300 focus:border-[#006FF9] text-sm px-4"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-[#006FF9]" /> Password
                            </label>
                            <input
                                name="password"
                                type="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="••••••••"
                                className="input w-full rounded-full border-base-300 focus:border-[#006FF9] text-sm px-4"
                                required
                            />
                        </div>

                        {/* Admin Registration Key (Optional) */}
                        <div className="pt-2">
                            <div className="flex items-center justify-between mb-1.5">
                                <span className="text-xs text-[#677489] flex items-center gap-1">
                                    <Key className="w-3 h-3 text-[#006FF9]" /> Admin Registration (Optional)
                                </span>
                                <button
                                    type="button"
                                    onClick={() => setShowAdminKey(!showAdminKey)}
                                    className="btn btn-xs btn-ghost text-xs text-[#006FF9] font-bold"
                                >
                                    {showAdminKey ? "Hide" : "Show"}
                                </button>
                            </div>
                            {showAdminKey && (
                                <div className="space-y-1">
                                    <input
                                        name="adminKey"
                                        type="password"
                                        value={form.adminKey}
                                        onChange={handleChange}
                                        placeholder="Secret admin registration key"
                                        className="input input-sm w-full rounded-full border-base-300 focus:border-[#006FF9] text-xs px-4"
                                    />
                                    <p className="text-[10px] text-[#677489] pl-2">
                                        Only required if creating an administrative staff account.
                                    </p>
                                </div>
                            )}
                        </div>

                        <button
                            disabled={loading}
                            className="btn btn-primary w-full py-3 rounded-full shadow-md font-bold text-sm gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span>Creating account...</span>
                                </>
                            ) : (
                                <>
                                    <UserPlus className="w-4 h-4" /> <span>Create Account</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-3 border-t border-base-300">
                        <p className="text-xs text-[#677489] dark:text-slate-400">
                            Already have an account?{" "}
                            <Link className="font-bold text-[#006FF9] hover:underline ml-1" to="/login">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
