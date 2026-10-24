import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchCourseById,
    clearCurrentCourse,
} from "../../store/slices/coursesSlice";
import { enrollCourseAsync, clearSuccess } from "../../store/slices/enrollmentSlice";
import { getMeAsync } from "../../store/slices/authSlice";
import { 
    BookOpen, 
    ArrowLeft, 
    CheckCircle2, 
    Clock, 
    Calendar, 
    Video, 
    Award, 
    Users, 
    ShieldCheck, 
    Sparkles, 
    ArrowRight,
    PlayCircle
} from "lucide-react";

export default function CourseDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { currentCourse, detailLoading, error: courseError } = useSelector((state) => state.courses);
    const { enrolling, error: enrollError, success, enrollments: myEnrollments } = useSelector((state) => state.enrollment);
    const { user, token, isAuthenticated } = useSelector((state) => state.auth);
    const [selectedBatchId, setSelectedBatchId] = useState(null);

    useEffect(() => {
        dispatch(fetchCourseById(id));
        return () => dispatch(clearCurrentCourse());
    }, [id, dispatch]);

    // Load user if token exists but user is not loaded
    useEffect(() => {
        if (token && !user) {
            dispatch(getMeAsync());
        }
    }, [token, user, dispatch]);

    const isCreator = user && currentCourse && user._id === currentCourse.instructorId;
    const isAdmin = user && user.role === "admin";
    const cannotEnroll = isAdmin || isCreator;

    const alreadyEnrolled = !!myEnrollments?.find((e) => e.course?._id === id);

    const handleEnroll = async () => {
        if (!user && token) {
            try {
                await dispatch(getMeAsync()).unwrap();
            } catch (err) {
                // ignore
            }
        }

        if (!user && !isAuthenticated) {
            navigate("/login");
            return;
        }

        if (cannotEnroll) return;

        dispatch(enrollCourseAsync({ 
            courseId: id, 
            batchId: selectedBatchId !== null ? selectedBatchId.toString() : null 
        }));
    };

    useEffect(() => {
        if (success) {
            const timer = setTimeout(() => {
                navigate("/student");
                dispatch(clearSuccess());
            }, 1500);
            return () => clearTimeout(timer);
        }
    }, [success, navigate, dispatch]);

    if (detailLoading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <span className="loading loading-spinner loading-lg text-[#006FF9]"></span>
                <p className="text-xs font-semibold text-[#677489]">Loading course details...</p>
            </div>
        );
    }

    if (courseError || !currentCourse) {
        return (
            <div className="alert alert-error shadow-sm rounded-2xl my-8">
                <span>{courseError || "Course not found"}</span>
            </div>
        );
    }

    const course = currentCourse;
    const totalLessons = course.syllabus?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0;

    return (
        <div className="py-4 sm:py-8 space-y-8">
            {/* Back navigation */}
            <Link 
                to="/courses" 
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#677489] hover:text-[#006FF9] transition-colors"
            >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Courses</span>
            </Link>

            {/* Main Course Hero & Overview Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left 2 Cols: Course Info, Description & Syllabus */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Header Card */}
                    <div className="card bg-base-100 border border-base-300 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
                        <div className="flex flex-wrap items-center gap-2">
                            {course.category && (
                                <span className="badge bg-[#006FF9]/10 text-[#006FF9] border border-[#006FF9]/25 font-bold px-3 py-1 text-xs">
                                    {course.category}
                                </span>
                            )}
                            <div className="flex items-center gap-1 text-xs font-semibold text-[#677489] dark:text-slate-400">
                                <BookOpen className="w-3.5 h-3.5 text-[#006FF9]" />
                                <span>{course.syllabus?.length || 0} Modules</span>
                                {totalLessons > 0 && <span>• {totalLessons} Lessons</span>}
                            </div>
                        </div>

                        <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111729] dark:text-white leading-tight">
                            {course.title}
                        </h1>

                        <div className="flex items-center gap-3 pt-1">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#006FF9] to-[#2D62FF] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                                {course.instructorName ? course.instructorName[0].toUpperCase() : "I"}
                            </div>
                            <div>
                                <p className="text-xs text-[#677489] dark:text-slate-400 font-medium">Instructor</p>
                                <p className="text-sm font-bold text-[#111729] dark:text-white">{course.instructorName}</p>
                            </div>
                        </div>

                        {course.tags && course.tags.length > 0 && (
                            <div className="flex flex-wrap gap-2 pt-2 border-t border-base-300">
                                {course.tags.map((tag, i) => (
                                    <span key={i} className="badge bg-base-200 text-[#677489] dark:text-slate-300 font-medium text-xs px-3 py-1 border-0">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Description Card */}
                    <div className="card bg-base-100 border border-base-300 p-6 sm:p-8 rounded-3xl shadow-sm space-y-4">
                        <h2 className="text-xl sm:text-2xl font-bold text-[#111729] dark:text-white tracking-tight flex items-center gap-2">
                            <span>Course Overview</span>
                        </h2>
                        <p className="text-sm sm:text-base text-[#677489] dark:text-slate-300 leading-relaxed whitespace-pre-line">
                            {course.description}
                        </p>
                    </div>

                    {/* Syllabus Section */}
                    <div className="card bg-base-100 border border-base-300 p-6 sm:p-8 rounded-3xl shadow-sm space-y-5">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                            <div>
                                <h2 className="text-xl sm:text-2xl font-bold text-[#111729] dark:text-white tracking-tight">
                                    Curriculum Syllabus
                                </h2>
                                <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-400 mt-1">
                                    {course.syllabus?.length || 0} modules • {totalLessons} detailed lessons
                                </p>
                            </div>
                            {isAdmin && (
                                <Link
                                    to={`/admin/courses/edit/${id}`}
                                    className="btn btn-sm btn-outline rounded-full font-bold"
                                >
                                    Edit Syllabus
                                </Link>
                            )}
                        </div>

                        {/* If enrolled or admin: display expandable syllabus */}
                        {(alreadyEnrolled || isAdmin) && course.syllabus && course.syllabus.length > 0 ? (
                            <div className="space-y-3 pt-2">
                                {course.syllabus.map((module, modIdx) => (
                                    <div 
                                        key={module._id || modIdx} 
                                        className="collapse collapse-arrow bg-base-200/60 border border-base-300 rounded-2xl"
                                    >
                                        <input type="checkbox" defaultChecked={modIdx === 0} />
                                        <div className="collapse-title font-bold text-sm sm:text-base text-[#111729] dark:text-white flex items-center gap-2 py-4">
                                            <span className="w-6 h-6 rounded-full bg-[#006FF9]/15 text-[#006FF9] text-xs font-bold flex items-center justify-center shrink-0">
                                                {modIdx + 1}
                                            </span>
                                            <span>{module.title}</span>
                                            <span className="text-xs font-normal text-[#677489] ml-auto mr-4">
                                                {module.lessons?.length || 0} lessons
                                            </span>
                                        </div>
                                        <div className="collapse-content bg-base-100 border-t border-base-300">
                                            <ul className="space-y-2.5 pt-3 pb-1">
                                                {module.lessons?.map((lesson, lesIdx) => (
                                                    <li 
                                                        key={lesson._id || lesIdx} 
                                                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl bg-base-200/40 hover:bg-base-200 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-2.5">
                                                            <PlayCircle className="w-4 h-4 text-[#006FF9] shrink-0" />
                                                            <span className="text-xs sm:text-sm font-semibold text-[#111729] dark:text-white">
                                                                {lesson.title}
                                                            </span>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            {lesson.videoUrl && (
                                                                <a 
                                                                    href={lesson.videoUrl} 
                                                                    target="_blank" 
                                                                    rel="noopener noreferrer" 
                                                                    className="btn btn-xs btn-outline rounded-full text-xs font-bold"
                                                                >
                                                                    Watch Video
                                                                </a>
                                                            )}
                                                            {lesson.liveClassLink && (
                                                                <div className="flex items-center gap-1.5">
                                                                    <span className="badge badge-error badge-xs py-2 px-2 text-[10px] font-bold">
                                                                        Live
                                                                    </span>
                                                                    {lesson.liveClassDate && (
                                                                        <span className="text-[11px] text-[#677489]">
                                                                            {new Date(lesson.liveClassDate).toLocaleDateString()}
                                                                        </span>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : !alreadyEnrolled && !isAdmin ? (
                            <div className="rounded-2xl border border-base-300 bg-base-200/50 p-6 text-center space-y-2">
                                <BookOpen className="w-8 h-8 text-[#006FF9] mx-auto opacity-70" />
                                <h4 className="font-bold text-sm text-[#111729] dark:text-white">
                                    Curriculum is available upon enrollment
                                </h4>
                                <p className="text-xs text-[#677489] dark:text-slate-400 max-w-sm mx-auto">
                                    Enroll in this course to unlock all video lessons, code repositories, assignments, and live mentor sessions.
                                </p>
                            </div>
                        ) : (
                            <div className="rounded-2xl border border-dashed border-base-300 p-6 text-center space-y-3">
                                <p className="text-xs text-[#677489]">No syllabus added yet.</p>
                                {isAdmin && (
                                    <Link to={`/admin/courses/edit/${id}`} className="btn btn-primary btn-sm rounded-full font-bold">
                                        Add Syllabus Now
                                    </Link>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Col: Enrollment & Purchase Sticky Card */}
                <div className="space-y-6">
                    <div className="card bg-base-100 border border-base-300 p-6 sm:p-7 rounded-3xl shadow-lg sticky top-24 space-y-6">
                        {/* Pricing */}
                        <div>
                            <span className="text-xs font-semibold text-[#677489] uppercase tracking-wider block">
                                Investment Fee
                            </span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <span className="text-3xl sm:text-4xl font-black text-[#111729] dark:text-white">
                                    ৳ {course.price?.toLocaleString()}
                                </span>
                                <span className="text-xs font-semibold text-[#006FF9] bg-[#006FF9]/10 px-2 py-0.5 rounded-full">
                                    Lifetime Access
                                </span>
                            </div>
                        </div>

                        {/* Batch selection */}
                        {course.batches && course.batches.length > 0 && (
                            <div className="space-y-3 pt-3 border-t border-base-300">
                                <label className="text-xs font-bold text-[#111729] dark:text-white flex items-center justify-between">
                                    <span>Select Cohort Batch</span>
                                    {selectedBatchId !== null && (
                                        <span className="text-[10px] text-[#006FF9] font-bold">Selected</span>
                                    )}
                                </label>
                                <div className="space-y-2">
                                    {course.batches.map((batch, idx) => {
                                        const isSelected = selectedBatchId === idx;
                                        return (
                                            <div
                                                key={idx}
                                                onClick={() => setSelectedBatchId(isSelected ? null : idx)}
                                                className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer border transition-all text-xs ${
                                                    isSelected
                                                        ? "bg-[#006FF9]/10 border-[#006FF9] text-[#006FF9] font-bold shadow-xs"
                                                        : "bg-base-200/60 border-base-300 hover:bg-base-200 text-[#111729] dark:text-white"
                                                }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${isSelected ? "border-[#006FF9] bg-[#006FF9]" : "border-base-300"}`}>
                                                        {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                                                    </div>
                                                    <span>{batch.name}</span>
                                                </div>
                                                <span className="text-[11px] text-[#677489]">
                                                    {batch.startDate ? `Starts ${new Date(batch.startDate).toLocaleDateString()}` : "Flexible"}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        )}

                        {/* Feedback Alerts */}
                        {success && (
                            <div className="alert alert-success text-xs p-3 rounded-2xl shadow-xs">
                                <span>{success}</span>
                            </div>
                        )}
                        {enrollError && (
                            <div className="alert alert-error text-xs p-3 rounded-2xl shadow-xs">
                                <span>{enrollError}</span>
                            </div>
                        )}
                        {cannotEnroll && !isAdmin && (
                            <div className="alert alert-info text-xs p-3 rounded-2xl">
                                <span>Course creators cannot enroll in their own courses.</span>
                            </div>
                        )}

                        {/* Primary Action Button */}
                        <div>
                            {isAdmin ? (
                                <Link
                                    to={`/admin/courses/edit/${id}`}
                                    className="btn btn-primary w-full py-3 font-bold rounded-full gap-2 shadow-md"
                                >
                                    <span>Manage Course</span>
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            ) : alreadyEnrolled ? (
                                <button
                                    onClick={() => navigate("/student")}
                                    className="btn btn-primary w-full py-3 font-bold rounded-full gap-2 shadow-md"
                                >
                                    <span>Continue Learning</span>
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            ) : (
                                <button
                                    onClick={handleEnroll}
                                    disabled={enrolling || cannotEnroll}
                                    className="btn btn-primary w-full py-3.5 font-bold rounded-full gap-2 text-base shadow-md disabled:opacity-50"
                                >
                                    {enrolling ? (
                                        <>
                                            <span className="loading loading-spinner loading-sm"></span>
                                            <span>Processing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Enroll Now</span>
                                            <ArrowRight className="w-4 h-4" />
                                        </>
                                    )}
                                </button>
                            )}
                        </div>

                        {/* Course Benefits Guarantee list */}
                        <div className="space-y-2.5 pt-4 border-t border-base-300 text-xs text-[#677489] dark:text-slate-400">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#006FF9]" />
                                <span>Complete lifetime access to all materials</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#006FF9]" />
                                <span>Interactive quizzes & auto-graded tests</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4 text-[#006FF9]" />
                                <span>Direct instructor feedback & community access</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Award className="w-4 h-4 text-[#006FF9]" />
                                <span>Verified Course Completion Certificate</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
