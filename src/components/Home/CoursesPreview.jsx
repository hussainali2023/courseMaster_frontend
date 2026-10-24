import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getCourses } from "../../services/courses.api";
import CoursesGrid from "../CourseCard/CoursesGrid";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";

export default function CoursesPreview() {
    const { user } = useSelector((state) => state.auth);
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCourses = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch 6 courses for preview
                const res = await getCourses({ page: 1, limit: 6 });
                setCourses(res.data.courses || []);
            } catch (err) {
                setError("Failed to load courses");
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    return (
        <section className="space-y-8 sm:space-y-10 my-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 border-b border-base-300 pb-6">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006FF9]/10 text-[#006FF9] text-xs font-bold mb-3 border border-[#006FF9]/20">
                        <Sparkles className="w-3.5 h-3.5 text-[#006FF9]" />
                        <span>Curated Programs</span>
                    </div>
                    <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                        Featured Courses
                    </h2>
                    <p className="text-[#677489] dark:text-slate-300 text-sm sm:text-base mt-2 max-w-xl">
                        Handcrafted curricula with hands-on projects, interactive quizzes, and verified certification upon completion.
                    </p>
                </div>
                <Link
                    to="/courses"
                    className="btn btn-outline btn-md gap-2 font-bold rounded-full group shrink-0"
                >
                    <span>View All Courses</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {loading && (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <span className="loading loading-spinner loading-lg text-[#006FF9]"></span>
                    <p className="text-xs font-semibold text-[#677489]">Loading curated catalog...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-error shadow-sm rounded-2xl">
                    <span>{error}</span>
                </div>
            )}

            {!loading && !error && courses.length === 0 && (
                <div className="rounded-3xl border border-base-300 bg-base-100 p-12 text-center shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-[#006FF9]/10 text-[#006FF9] flex items-center justify-center mx-auto mb-3">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-bold text-[#111729] dark:text-white">
                        No courses available at the moment
                    </h3>
                    <p className="mt-1 text-sm text-[#677489] dark:text-slate-400">
                        Check back soon for new courses launched by industry mentors.
                    </p>
                </div>
            )}

            {!loading && !error && courses.length > 0 && (
                <>
                    <CoursesGrid courses={courses} />
                    <div className="flex justify-center pt-6">
                        {user?.role === "admin" ? (
                            <Link
                                to="/admin/courses"
                                className="btn btn-primary px-8 font-bold rounded-full shadow-md"
                            >
                                Manage Courses Dashboard
                            </Link>
                        ) : (
                            <Link
                                to="/courses"
                                className="btn btn-primary px-8 font-bold rounded-full shadow-md"
                            >
                                Explore Entire Catalog ({courses.length}+ Available)
                            </Link>
                        )}
                    </div>
                </>
            )}
        </section>
    );
}
