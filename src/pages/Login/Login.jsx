import { useState } from "react";
import { loginUser } from "../../services/auth.api";
import { saveToken } from "../../utils/auth";
import { Link, useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, LogIn, Sparkles, ShieldCheck, UserCheck } from "lucide-react";

export default function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleQuickLogin = (email, password) => {
        setForm({ email, password });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const res = await loginUser(form);
            saveToken(res.data.token);

            if (res.data.user?.role === "admin") {
                navigate("/admin");
            } else {
                navigate("/");
            }
            window.location.reload();
        } catch (err) {
            setError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
                            <Sparkles className="w-3.5 h-3.5" /> Welcome Back
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                            Sign In to CourseMaster
                        </h1>
                        <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-400">
                            Enter your credentials to access your courses & dashboard
                        </p>
                    </div>

                    {/* Quick Demo Credentials Assistant */}
                    <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-2.5">
                        <div className="flex justify-between items-center">
                            <p className="text-xs font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                                <Sparkles className="w-3.5 h-3.5 text-[#006FF9]" /> Demo Credentials:
                            </p>
                            <span className="badge badge-xs bg-base-100 text-[#677489] text-[10px] border border-base-300">
                                Quick Fill
                            </span>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("admin@coursemaster.com", "admin123")}
                                className="btn btn-xs btn-outline rounded-full gap-1 font-semibold text-xs"
                            >
                                <ShieldCheck className="w-3 h-3 text-[#006FF9]" /> Admin Fill
                            </button>
                            <button
                                type="button"
                                onClick={() => handleQuickLogin("student@coursemaster.com", "student123")}
                                className="btn btn-xs btn-outline rounded-full gap-1 font-semibold text-xs"
                            >
                                <UserCheck className="w-3 h-3 text-[#2D62FF]" /> Student Fill
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-error text-xs p-3 rounded-2xl shadow-xs">
                            <span>{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
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
                            <div className="relative flex items-center">
                                <input
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    value={form.password}
                                    onChange={handleChange}
                                    placeholder="••••••••"
                                    className="input w-full rounded-full border-base-300 focus:border-[#006FF9] text-sm pl-4 pr-11"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 text-[#677489] hover:text-[#111729] dark:hover:text-white"
                                    aria-label="Toggle password visibility"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button
                            disabled={loading}
                            type="submit"
                            className="btn btn-primary w-full py-3 rounded-full shadow-md font-bold text-sm gap-2 mt-2"
                        >
                            {loading ? (
                                <>
                                    <span className="loading loading-spinner loading-sm"></span>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <LogIn className="w-4 h-4" /> <span>Sign In</span>
                                </>
                            )}
                        </button>
                    </form>

                    <div className="text-center pt-3 border-t border-base-300">
                        <p className="text-xs text-[#677489] dark:text-slate-400">
                            Don't have an account?{" "}
                            <Link className="font-bold text-[#006FF9] hover:underline ml-1" to="/register">
                                Create an account
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
