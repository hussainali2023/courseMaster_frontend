import { Link, NavLink, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { getToken, clearToken } from "../../utils/auth";
import { getMe } from "../../services/auth.api";
import { User, LayoutDashboard, LogOut, Sparkles } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const token = getToken();
    const [me, setMe] = useState(null);

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "text-[#006FF9] font-bold bg-[#006FF9]/10 dark:bg-[#006FF9]/20 rounded-full px-4 py-2 transition-all"
            : "text-[#677489] hover:text-[#111729] dark:text-slate-300 dark:hover:text-white font-medium px-4 py-2 rounded-full transition-colors";

    const handleLogout = () => {
        clearToken();
        setMe(null);
        navigate("/");
        window.location.reload();
    };

    useEffect(() => {
        const loadMe = async () => {
            if (!token) return setMe(null);
            try {
                const res = await getMe();
                setMe(res.data);
            } catch {
                clearToken();
                setMe(null);
            }
        };
        loadMe();
    }, [token]);

    const initials = me?.name
        ? me.name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase()
        : null;

    return (
        <header className="sticky top-0 z-50 bg-base-100/90 backdrop-blur-md border-b border-base-300 transition-colors">
            <div className="navbar max-w-6xl mx-auto px-4 py-3">

                {/* LEFT: Logo */}
                <div className="navbar-start">
                    <Logo />
                </div>

                {/* CENTER: Desktop menu */}
                <div className="navbar-center hidden md:flex">
                    <ul className="flex items-center gap-1.5 p-1 rounded-full bg-base-200/60 border border-base-300/60">
                        <li><NavLink className={navLinkClass} to="/">Home</NavLink></li>
                        <li><NavLink className={navLinkClass} to="/courses">Courses</NavLink></li>

                        {/* Dashboard when logged in */}
                        {token && me && (
                            <li>
                                <NavLink
                                    className={navLinkClass}
                                    to={me.role === "admin" ? "/admin" : "/student"}
                                >
                                    Dashboard
                                </NavLink>
                            </li>
                        )}
                    </ul>
                </div>

                {/* RIGHT: Actions, Theme Toggle, Profile */}
                <div className="navbar-end flex items-center gap-2.5">
                    {/* Theme Toggle (Dark Mode Icon) */}
                    <ThemeToggle />

                    {/* When NOT logged in: Show Profile Icon + Auth Buttons */}
                    {!token && (
                        <div className="flex items-center gap-2">
                            <Link 
                                to="/login" 
                                title="Sign in to your profile"
                                className="w-9 h-9 rounded-full flex items-center justify-center border border-base-300 bg-base-100 hover:bg-base-200 text-[#111729] dark:text-white transition-all shadow-xs"
                                aria-label="Profile Account"
                            >
                                <User className="w-4 h-4 text-[#006FF9]" />
                            </Link>

                            <div className="hidden sm:flex items-center gap-2">
                                <Link to="/login" className="btn btn-sm btn-ghost text-[#111729] dark:text-white font-semibold">
                                    Sign In
                                </Link>
                                <Link to="/register" className="btn btn-sm btn-primary px-5 shadow-sm font-bold">
                                    Enroll Now
                                </Link>
                            </div>
                        </div>
                    )}

                    {/* When logged in: High-Visibility Profile Avatar & Dropdown */}
                    {token && (
                        <div className="dropdown dropdown-end">
                            <label 
                                tabIndex={0} 
                                className="cursor-pointer flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-tr from-[#006FF9] to-[#2D62FF] text-white font-black text-xs shadow-md shadow-[#006FF9]/25 border-2 border-white dark:border-[#1E293B] hover:scale-105 transition-transform"
                                title="Open Profile Menu"
                                aria-label="User Profile"
                            >
                                {initials ? initials : <User className="w-4 h-4 text-white" />}
                            </label>

                            <ul
                                tabIndex={0}
                                className="dropdown-content mt-3 p-4 shadow-2xl bg-base-100 rounded-3xl w-64 border border-base-300 space-y-1.5 z-50"
                            >
                                <div className="px-2 pb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006FF9] to-[#2D62FF] text-white flex items-center justify-center font-bold text-xs shrink-0">
                                            {initials || <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-[#111729] dark:text-white leading-tight truncate">
                                                {me?.name || "My Account"}
                                            </p>
                                            <p className="text-xs text-[#677489] truncate mt-0.5">
                                                {me?.email || "Signed in"}
                                            </p>
                                        </div>
                                    </div>
                                    <span className="badge badge-primary text-[10px] mt-2 capitalize font-bold">
                                        {me?.role || "User"} Account
                                    </span>
                                </div>

                                <div className="my-1 border-t border-base-300" />

                                <li>
                                    <Link 
                                        to={me?.role === "admin" ? "/admin" : "/student"} 
                                        className="flex items-center gap-2.5 font-medium hover:text-[#006FF9] py-2 px-3 rounded-xl hover:bg-base-200 transition-colors"
                                    >
                                        <LayoutDashboard className="w-4 h-4 text-[#006FF9]" />
                                        <span>Dashboard</span>
                                    </Link>
                                </li>
                                <li>
                                    <Link 
                                        to="/profile" 
                                        className="flex items-center gap-2.5 font-medium hover:text-[#006FF9] py-2 px-3 rounded-xl hover:bg-base-200 transition-colors"
                                    >
                                        <User className="w-4 h-4 text-[#006FF9]" />
                                        <span>My Profile</span>
                                    </Link>
                                </li>
                                <div className="my-1 border-t border-base-300" />
                                <li>
                                    <button 
                                        onClick={handleLogout} 
                                        className="flex items-center gap-2.5 text-red-500 font-semibold py-2 px-3 rounded-xl hover:bg-red-500/10 w-full transition-colors text-left"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        <span>Sign Out</span>
                                    </button>
                                </li>
                            </ul>
                        </div>
                    )}

                    {/* Mobile hamburger menu */}
                    <div className="dropdown dropdown-end md:hidden">
                        <label tabIndex={0} className="w-9 h-9 rounded-full flex items-center justify-center border border-base-300 bg-base-100 hover:bg-base-200 text-base-content cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                                viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                    d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </label>

                        <ul
                            tabIndex={0}
                            className="menu dropdown-content mt-3 p-4 shadow-2xl bg-base-100 rounded-3xl w-64 border border-base-300 space-y-1.5 z-50"
                        >
                            <li><NavLink className={navLinkClass} to="/">Home</NavLink></li>
                            <li><NavLink className={navLinkClass} to="/courses">Courses</NavLink></li>

                            {token && me && (
                                <li>
                                    <NavLink
                                        className={navLinkClass}
                                        to={me.role === "admin" ? "/admin" : "/student"}
                                    >
                                        Dashboard
                                    </NavLink>
                                </li>
                            )}

                            <div className="my-2 border-t border-base-300" />

                            {!token ? (
                                <div className="space-y-2 pt-1">
                                    <Link to="/login" className="btn btn-ghost btn-sm w-full font-semibold flex items-center justify-center gap-2">
                                        <User className="w-4 h-4 text-[#006FF9]" />
                                        <span>Sign In</span>
                                    </Link>
                                    <Link to="/register" className="btn btn-primary btn-sm w-full font-bold">
                                        Enroll Now
                                    </Link>
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2.5 p-2 rounded-xl bg-base-200">
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#006FF9] to-[#2D62FF] text-white flex items-center justify-center font-bold text-xs">
                                            {initials || <User className="w-3.5 h-3.5" />}
                                        </div>
                                        <div className="truncate">
                                            <p className="font-bold text-xs truncate">{me?.name}</p>
                                            <p className="text-[10px] text-[#677489] truncate">{me?.email}</p>
                                        </div>
                                    </div>
                                    <li>
                                        <Link to="/profile" className="flex items-center gap-2 py-2">
                                            <User className="w-4 h-4 text-[#006FF9]" />
                                            <span>My Profile</span>
                                        </Link>
                                    </li>
                                    <li>
                                        <button onClick={handleLogout} className="text-red-500 font-semibold flex items-center gap-2 py-2">
                                            <LogOut className="w-4 h-4" />
                                            <span>Sign Out</span>
                                        </button>
                                    </li>
                                </div>
                            )}
                        </ul>
                    </div>

                </div>
            </div>
        </header>
    );
}
