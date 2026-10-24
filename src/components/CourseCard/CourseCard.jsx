import { Link } from "react-router-dom";
import { BookOpen, ArrowRight, Star } from "lucide-react";

export default function CourseCard({ course }) {
    const totalLessons = course.syllabus?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

    return (
        <div className="card bg-base-100 border border-base-300 hover:border-[#006FF9]/50 shadow-sm hover:shadow-xl hover:shadow-[#006FF9]/15 transition-all duration-300 group rounded-[24px] overflow-hidden flex flex-col h-full hover:-translate-y-1.5">
            {/* Visual Top Header Banner */}
            <div className="h-32 bg-gradient-to-br from-[#006FF9]/15 via-[#2D62FF]/10 to-transparent p-5 relative flex flex-col justify-between overflow-hidden border-b border-base-300/50">
                <div className="absolute -right-6 -bottom-6 w-28 h-28 bg-[#006FF9]/15 rounded-full blur-2xl pointer-events-none"></div>

                <div className="flex justify-between items-start relative z-10">
                    {course.category ? (
                        <span className="badge bg-base-100 text-[#006FF9] border border-[#006FF9]/25 font-bold px-3 py-1 text-xs shadow-xs">
                            {course.category}
                        </span>
                    ) : (
                        <div></div>
                    )}
                    <div className="flex items-center gap-1 bg-base-100 px-2.5 py-1 rounded-full text-xs font-bold text-amber-500 shadow-xs border border-amber-500/20">
                        <Star className="w-3.5 h-3.5 fill-amber-500" /> 4.9
                    </div>
                </div>

                <div className="flex items-center gap-2 text-xs font-semibold text-[#677489] dark:text-slate-300 relative z-10">
                    <BookOpen className="w-3.5 h-3.5 text-[#006FF9]" />
                    <span>{course.syllabus?.length || 0} Modules</span>
                    {totalLessons > 0 && <span>• {totalLessons} Lessons</span>}
                </div>
            </div>

            <div className="card-body p-6 flex flex-col flex-1 justify-between space-y-4">
                <div>
                    <h2 className="card-title text-lg sm:text-xl font-bold leading-snug text-[#111729] dark:text-white group-hover:text-[#006FF9] transition-colors line-clamp-2">
                        {course.title}
                    </h2>

                    <div className="text-sm text-[#677489] mt-3 flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-[#006FF9]/15 text-[#006FF9] font-bold flex items-center justify-center text-xs">
                            {course.instructorName ? course.instructorName[0].toUpperCase() : "I"}
                        </div>
                        <span className="font-medium text-xs text-[#677489] dark:text-slate-400">By {course.instructorName}</span>
                    </div>
                </div>

                {course.tags && course.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {course.tags.slice(0, 3).map((t, i) => (
                            <span key={i} className="badge bg-base-200 text-[#677489] dark:text-slate-300 text-xs font-medium border-0 px-2.5 py-0.5">
                                #{t}
                            </span>
                        ))}
                    </div>
                )}

                <div className="pt-4 border-t border-base-300 flex items-center justify-between mt-auto">
                    <div>
                        <span className="text-xs text-[#677489] font-medium block">Course Fee</span>
                        <p className="font-extrabold text-xl text-[#111729] dark:text-white">৳ {course.price?.toLocaleString()}</p>
                    </div>
                    <Link
                        to={`/courses/${course._id}`}
                        className="btn btn-primary btn-sm px-5 py-2 font-bold gap-1.5 rounded-full"
                    >
                        <span>Details</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                </div>
            </div>
        </div>
    );
}
