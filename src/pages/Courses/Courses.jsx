import CoursesSection from "../../components/CourseCard/CoursesSection";
import { Sparkles, BookOpen } from "lucide-react";

export default function Courses() {
    return (
        <div className="py-4 sm:py-8 space-y-6">
            {/* Header Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#006FF9]/10 via-base-100 to-[#2D62FF]/10 border border-base-300 p-6 sm:p-10 shadow-xs relative overflow-hidden">
                <div className="relative z-10 max-w-2xl space-y-2">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-100 border border-[#006FF9]/25 text-[#006FF9] text-xs font-bold shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>All Verified Programs</span>
                    </div>
                    <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                        Explore Courses
                    </h1>
                    <p className="text-sm sm:text-base text-[#677489] dark:text-slate-300 font-normal leading-relaxed pt-1">
                        Find the ideal program to upskill your career in engineering, design, and digital product building.
                    </p>
                </div>
            </div>

            <CoursesSection />
        </div>
    );
}
