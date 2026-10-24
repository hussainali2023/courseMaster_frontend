import Logo from "./Logo";
import { Link } from "react-router-dom";
import { Mail, Phone, Heart } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-base-200/60 border-t border-base-300 mt-20 transition-colors">
            <div className="max-w-6xl mx-auto px-6 py-14 grid gap-10 md:grid-cols-3">
                {/* Brand */}
                <div className="space-y-4">
                    <Logo />
                    <p className="text-sm text-[#677489] dark:text-slate-400 leading-relaxed max-w-sm">
                        Product-focused digital learning platform. Designed to build career-ready engineering, design, and product leadership skills.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h4 className="font-bold mb-4 text-base text-[#111729] dark:text-white tracking-tight">Navigation</h4>
                    <ul className="space-y-2.5 text-sm">
                        <li>
                            <Link className="text-[#677489] dark:text-slate-400 hover:text-[#006FF9] transition-colors" to="/">
                                Home
                            </Link>
                        </li>
                        <li>
                            <Link className="text-[#677489] dark:text-slate-400 hover:text-[#006FF9] transition-colors" to="/courses">
                                All Courses
                            </Link>
                        </li>
                        <li>
                            <Link className="text-[#677489] dark:text-slate-400 hover:text-[#006FF9] transition-colors" to="/student">
                                Student Portal
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h4 className="font-bold mb-4 text-base text-[#111729] dark:text-white tracking-tight">Support & Inquiries</h4>
                    <ul className="space-y-2.5 text-sm text-[#677489] dark:text-slate-400">
                        <li className="flex items-center gap-2">
                            <Mail className="w-4 h-4 text-[#006FF9]" />
                            <a href="mailto:support@coursemaster.com" className="hover:text-[#006FF9] transition-colors">
                                support@coursemaster.com
                            </a>
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-[#006FF9]" />
                            <span>+880 1700-000000</span>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="text-center text-xs py-5 bg-base-200 border-t border-base-300 text-[#677489] dark:text-slate-500">
                <div className="max-w-6xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
                    <p>© {new Date().getFullYear()} CourseMaster. All rights reserved.</p>
                    <p className="flex items-center gap-1">
                        Crafted with modern product design standards
                    </p>
                </div>
            </div>
        </footer>
    );
}
