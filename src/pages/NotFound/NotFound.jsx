import { Link } from "react-router-dom";
import { ArrowLeft, Home, BookOpen, Compass } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-[65vh] flex items-center justify-center py-12 px-4">
            <div className="card bg-base-100 border border-base-300 shadow-xl rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-6 relative overflow-hidden">
                <div className="w-16 h-16 rounded-full bg-[#006FF9]/10 text-[#006FF9] flex items-center justify-center mx-auto shadow-xs">
                    <Compass className="w-8 h-8 animate-spin-slow" />
                </div>

                <div className="space-y-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-[#006FF9]">
                        Error 404
                    </span>
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-[#111729] dark:text-white tracking-tight">
                        Page Not Found
                    </h1>
                    <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-400 max-w-xs mx-auto">
                        The requested course or page could not be found or may have moved.
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <Link
                        to="/"
                        className="btn btn-primary rounded-full px-6 font-bold gap-2 w-full sm:w-auto"
                    >
                        <Home className="w-4 h-4" />
                        <span>Back to Home</span>
                    </Link>
                    <Link
                        to="/courses"
                        className="btn btn-outline rounded-full px-6 font-bold gap-2 w-full sm:w-auto"
                    >
                        <BookOpen className="w-4 h-4" />
                        <span>Explore Courses</span>
                    </Link>
                </div>
            </div>
        </div>
    );
}
