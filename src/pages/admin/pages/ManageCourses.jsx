import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCourses, setPage } from "../../../store/slices/coursesSlice";
import { deleteCourseAsync, clearSuccess } from "../../../store/slices/adminSlice";
import { Link } from "react-router-dom";
import { Plus, Edit2, Trash2, BookOpen, Layers } from "lucide-react";

// Helper function to calculate syllabus statistics
const getSyllabusStats = (course) => {
    if (!course.syllabus || course.syllabus.length === 0) {
        return { modules: 0, lessons: 0, quizzes: 0, assignments: 0 };
    }

    let lessons = 0;
    let quizzes = 0;
    let assignments = 0;

    course.syllabus.forEach((module) => {
        if (module.lessons && module.lessons.length > 0) {
            lessons += module.lessons.length;
            module.lessons.forEach((lesson) => {
                if (lesson.quiz && lesson.quiz.length > 0) {
                    quizzes += lesson.quiz.length;
                }
                if (lesson.assignmentPrompt) {
                    assignments += 1;
                }
            });
        }
    });

    return {
        modules: course.syllabus.length,
        lessons,
        quizzes,
        assignments,
    };
};

export default function ManageCourses() {
    const dispatch = useDispatch();
    const { courses, totalPages, page, loading } = useSelector((state) => state.courses);
    const { success, error } = useSelector((state) => state.admin);

    useEffect(() => {
        dispatch(fetchCourses({ page, limit: 10 }));
    }, [dispatch, page]);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this course?")) {
            dispatch(deleteCourseAsync(id));
        }
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                dispatch(clearSuccess());
                dispatch(fetchCourses({ page, limit: 10 }));
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [success, dispatch, page]);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                        Manage Courses
                    </h1>
                    <p className="text-xs sm:text-sm text-[#677489]">
                        Create, modify, and manage your courses, syllabi, and cohort batches
                    </p>
                </div>
                <Link to="/admin/courses/create" className="btn btn-primary btn-sm rounded-full px-5 gap-1.5 font-bold shadow-xs">
                    <Plus className="w-4 h-4" />
                    <span>Create Course</span>
                </Link>
            </div>

            {success && (
                <div className="alert alert-success text-xs p-3 rounded-2xl shadow-xs">
                    <span>{success}</span>
                </div>
            )}

            {error && (
                <div className="alert alert-error text-xs p-3 rounded-2xl shadow-xs">
                    <span>{error}</span>
                </div>
            )}

            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-2">
                    <span className="loading loading-spinner loading-md text-[#006FF9]"></span>
                    <p className="text-xs text-[#677489]">Loading course records...</p>
                </div>
            ) : courses.length === 0 ? (
                <div className="card bg-base-100 border border-base-300 rounded-3xl p-8 text-center text-xs text-[#677489]">
                    No courses found in database
                </div>
            ) : (
                <>
                    {/* Table for md+ screens */}
                    <div className="hidden md:block overflow-x-auto border border-base-300 rounded-3xl bg-base-100 shadow-sm">
                        <table className="table table-sm w-full">
                            <thead className="border-b border-base-300 text-xs text-[#677489]">
                                <tr>
                                    <th className="py-3 pl-4">Title</th>
                                    <th>Instructor</th>
                                    <th>Price</th>
                                    <th>Category</th>
                                    <th>Syllabus Scope</th>
                                    <th className="text-right pr-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-base-300 text-xs">
                                {courses.map((course) => {
                                    const stats = getSyllabusStats(course);
                                    return (
                                        <tr key={course._id} className="hover:bg-base-200/50">
                                            <td className="max-w-xs truncate font-bold text-[#111729] dark:text-white py-3 pl-4">
                                                {course.title}
                                            </td>
                                            <td className="text-[#677489]">{course.instructorName}</td>
                                            <td className="font-extrabold text-[#111729] dark:text-white">৳ {course.price?.toLocaleString()}</td>
                                            <td>
                                                <span className="badge bg-base-200 text-[#677489] text-[11px] font-semibold">
                                                    {course.category || "General"}
                                                </span>
                                            </td>
                                            <td>
                                                {stats.modules === 0 ? (
                                                    <span className="text-[11px] text-[#677489]">No syllabus</span>
                                                ) : (
                                                    <div className="text-[11px] text-[#677489] flex items-center gap-2">
                                                        <span>{stats.modules} Mod</span>
                                                        <span>•</span>
                                                        <span>{stats.lessons} Lessons</span>
                                                    </div>
                                                )}
                                            </td>
                                            <td className="text-right pr-4 space-x-2">
                                                <Link 
                                                    to={`/admin/courses/edit/${course._id}`} 
                                                    className="btn btn-xs btn-outline rounded-full px-3 font-bold"
                                                >
                                                    <Edit2 className="w-3 h-3" />
                                                    <span>Edit</span>
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(course._id)} 
                                                    className="btn btn-xs btn-outline btn-error rounded-full px-3 font-bold"
                                                >
                                                    <Trash2 className="w-3 h-3" />
                                                    <span>Delete</span>
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {/* Cards for small screens */}
                    <div className="md:hidden space-y-3">
                        {courses.map((course) => {
                            const stats = getSyllabusStats(course);
                            return (
                                <div key={course._id} className="card bg-base-100 shadow-sm border border-base-300 rounded-2xl p-4 space-y-3">
                                    <div className="flex justify-between items-start gap-2">
                                        <div>
                                            <div className="font-bold text-sm text-[#111729] dark:text-white">{course.title}</div>
                                            <div className="text-xs text-[#677489] mt-0.5">{course.instructorName}</div>
                                        </div>
                                        <div className="font-black text-sm text-[#006FF9]">৳ {course.price?.toLocaleString()}</div>
                                    </div>
                                    <div className="flex justify-between items-center text-xs pt-2 border-t border-base-300">
                                        <span className="text-[#677489]">{stats.modules} Modules</span>
                                        <div className="flex gap-2">
                                            <Link to={`/admin/courses/edit/${course._id}`} className="btn btn-xs btn-outline rounded-full">
                                                Edit
                                            </Link>
                                            <button onClick={() => handleDelete(course._id)} className="btn btn-xs btn-error btn-outline rounded-full">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                                <button
                                    key={pageNum}
                                    onClick={() => dispatch(setPage(pageNum))}
                                    className={`btn btn-xs sm:btn-sm rounded-full px-3.5 font-bold ${page === pageNum ? "btn-primary shadow-xs" : "btn-outline"}`}
                                >
                                    {pageNum}
                                </button>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
