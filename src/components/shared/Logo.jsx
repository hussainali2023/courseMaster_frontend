import { Link } from "react-router-dom";
import { GraduationCap } from "lucide-react";

export default function Logo() {
    return (
        <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#006FF9] to-[#2D62FF] text-white flex items-center justify-center shadow-md shadow-[#006FF9]/25 group-hover:scale-105 transition-transform duration-300">
                <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-[#111729] dark:text-white">
                Course<span className="text-[#006FF9]">Master</span>
            </span>
        </Link>
    );
}
