import { useState } from "react";
import { NavLink } from "react-router-dom";
import {
    LayoutDashboard,
    PlusCircle,
    Users,
    ClipboardList,
    BarChart3,
    Video,
    Menu,
    X,
    Shield
} from "lucide-react";

export default function AdminSidebar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const Item = ({ to, label, Icon, end = true, onClick, showLabel = true }) => {
        const linkClass = ({ isActive }) => {
            const baseClasses = "flex items-center gap-3 px-4 py-2.5 rounded-full transition-all duration-200 text-xs sm:text-sm font-semibold";
            if (isActive) {
                return `${baseClasses} bg-gradient-to-r from-[#006FF9] to-[#2D62FF] text-white shadow-sm`;
            }
            return `${baseClasses} text-[#677489] hover:text-[#111729] dark:hover:text-white hover:bg-base-200`;
        };

        return (
            <NavLink
                to={to}
                end={end}
                onClick={onClick}
                className={linkClass}
            >
                <Icon className="w-4 h-4 shrink-0" />
                {showLabel && <span>{label}</span>}
            </NavLink>
        );
    };

    const menuItems = [
        { to: "/admin", label: "Overview", Icon: LayoutDashboard, end: true },
        { to: "/admin/courses/create", label: "Add Course", Icon: PlusCircle, end: true },
        { to: "/admin/video-classes", label: "Video Classes", Icon: Video, end: true },
        { to: "/admin/enrollments", label: "Enrollments", Icon: Users, end: true },
        { to: "/admin/assignments", label: "Assignments", Icon: ClipboardList, end: true },
        { to: "/admin/analytics", label: "Analytics", Icon: BarChart3, end: true },
        { to: "/admin/users", label: "Manage Users", Icon: Users, end: true },
    ];

    return (
        <>
            {/* Mobile menu trigger */}
            <div className="lg:hidden mb-4 bg-base-100 border border-base-300 p-2.5 rounded-2xl shadow-xs flex items-center justify-between">
                <div className="flex items-center gap-2 px-2">
                    <Shield className="w-4 h-4 text-[#006FF9]" />
                    <span className="font-bold text-xs text-[#111729] dark:text-white">Admin Management</span>
                </div>
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="btn btn-xs btn-outline rounded-full"
                >
                    {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
                    <span className="ml-1 font-semibold">Menu</span>
                </button>
            </div>

            {/* Mobile drawer */}
            {mobileMenuOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    <aside
                        className="bg-base-100 border-r border-base-300 w-64 h-full p-5 space-y-2 overflow-y-auto shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4 pb-2 border-b border-base-300">
                            <span className="font-extrabold text-sm text-[#111729] dark:text-white flex items-center gap-1.5">
                                <Shield className="w-4 h-4 text-[#006FF9]" /> Admin Portal
                            </span>
                            <button
                                onClick={() => setMobileMenuOpen(false)}
                                className="btn btn-xs btn-circle btn-ghost"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                        {menuItems.map((item) => (
                            <Item
                                key={item.to}
                                to={item.to}
                                label={item.label}
                                Icon={item.Icon}
                                end={item.end}
                                onClick={() => setMobileMenuOpen(false)}
                                showLabel={true}
                            />
                        ))}
                    </aside>
                </div>
            )}

            {/* Desktop sidebar */}
            <aside className="hidden lg:block bg-base-100 border border-base-300 rounded-3xl min-h-[600px] w-60 p-4 space-y-1.5 shadow-sm">
                <div className="px-3 py-2 mb-2 border-b border-base-300">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#677489]">Administration</p>
                </div>
                {menuItems.map((item) => (
                    <Item
                        key={item.to}
                        to={item.to}
                        label={item.label}
                        Icon={item.Icon}
                        end={item.end}
                    />
                ))}
            </aside>
        </>
    );
}
