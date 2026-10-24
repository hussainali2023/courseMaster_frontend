import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyEnrollments } from "../../store/slices/enrollmentSlice";
import { Link } from "react-router-dom";
import { getQuizStats } from "../../services/quiz.api";
import { getAssignmentStats } from "../../services/assignment.api";
import { getCourseById } from "../../services/courses.api";
import { 
    GraduationCap, 
    BookOpen, 
    ArrowRight, 
    Award, 
    CheckCircle2, 
    FileText, 
    RotateCcw, 
    Play, 
    ChevronDown, 
    ChevronUp,
    Sparkles
} from "lucide-react";

export default function StudentDashboard() {
    const dispatch = useDispatch();
    const { enrollments, loading, error } = useSelector((state) => state.enrollment);
    const { currentCourse } = useSelector((state) => state.courses);

    const [expandedCourse, setExpandedCourse] = useState(null);
    const [courseStats, setCourseStats] = useState({}); // { courseId: { quizStats, assignmentStats, courseData, lessonMap } }
    const [loadingStats, setLoadingStats] = useState({});

    // Cache for lesson title lookups to avoid repeated loops
    const lessonTitleCache = useRef({});

    useEffect(() => {
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    // Create lesson title lookup map from course data
    const createLessonMap = (courseData) => {
        if (!courseData?.syllabus) return {};
        const map = {};
        courseData.syllabus.forEach(module => {
            if (module.lessons) {
                module.lessons.forEach(lesson => {
                    map[String(lesson._id)] = lesson.title;
                });
            }
        });
        return map;
    };

    // Helper function to find lesson title from lessonId
    const getLessonTitle = (courseId, lessonId) => {
        const cacheKey = `${courseId}_${lessonId}`;
        if (lessonTitleCache.current[cacheKey]) {
            return lessonTitleCache.current[cacheKey];
        }

        const stats = courseStats[courseId];
        if (stats?.lessonMap) {
            const title = stats.lessonMap[String(lessonId)] || "Lesson";
            lessonTitleCache.current[cacheKey] = title;
            return title;
        }
        return "Lesson";
    };

    // Fetch stats for a specific course
    const loadCourseStats = async (courseId, forceRefresh = false) => {
        if (courseStats[courseId] && !forceRefresh) return;
        if (loadingStats[courseId]) return;

        setLoadingStats(prev => ({ ...prev, [courseId]: true }));

        try {
            let courseData = courseStats[courseId]?.courseData;

            if (!courseData || forceRefresh) {
                try {
                    if (currentCourse?._id === courseId) {
                        courseData = currentCourse;
                    } else {
                        const res = await getCourseById(courseId);
                        courseData = res.data;
                    }
                } catch (err) {
                    console.error("Failed to fetch course:", err);
                    if (!courseData) {
                        courseData = null;
                    }
                }
            }

            const [quizRes, assignmentRes] = await Promise.all([
                getQuizStats(courseId).catch(err => {
                    console.error("Quiz stats error:", err);
                    return { data: { average: 0, totalQuizzes: 0, submissions: [] } };
                }),
                getAssignmentStats(courseId).catch(err => {
                    console.error("Assignment stats error:", err);
                    return { data: { average: 0, totalAssignments: 0, reviewedCount: 0, submissions: [] } };
                }),
            ]);

            const lessonMap = courseData ? createLessonMap(courseData) : {};

            setCourseStats(prev => ({
                ...prev,
                [courseId]: {
                    quizStats: quizRes.data,
                    assignmentStats: assignmentRes.data,
                    courseData: courseData,
                    lessonMap: lessonMap,
                },
            }));
        } catch (err) {
            console.error("Failed to load course stats:", err);
        } finally {
            setLoadingStats(prev => ({ ...prev, [courseId]: false }));
        }
    };

    const handleExpandCourse = (courseId) => {
        if (expandedCourse === courseId) {
            setExpandedCourse(null);
        } else {
            setExpandedCourse(courseId);
            loadCourseStats(courseId, false);
        }
    };

    const handleRefreshStats = (courseId) => {
        Object.keys(lessonTitleCache.current).forEach(key => {
            if (key.startsWith(`${courseId}_`)) {
                delete lessonTitleCache.current[key];
            }
        });
        setCourseStats(prev => {
            const newStats = { ...prev };
            delete newStats[courseId];
            return newStats;
        });
        loadCourseStats(courseId, true);
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <span className="loading loading-spinner loading-lg text-[#006FF9]"></span>
                <p className="text-xs font-semibold text-[#677489]">Loading student portal...</p>
            </div>
        );
    }

    return (
        <div className="py-4 sm:py-8 space-y-6 sm:space-y-8">
            {/* Header Banner */}
            <div className="rounded-3xl bg-gradient-to-r from-[#006FF9]/10 via-base-100 to-[#2D62FF]/10 border border-base-300 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-base-100 border border-[#006FF9]/25 text-[#006FF9] text-xs font-bold shadow-xs">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Student Portal</span>
                    </div>
                    <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                        My Enrolled Courses
                    </h1>
                    <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-300">
                        Track your lesson progress, review quiz submissions, and check mentor feedback
                    </p>
                </div>
                <Link 
                    to="/courses" 
                    className="btn btn-outline btn-sm sm:btn-md rounded-full px-6 gap-2 font-bold shrink-0"
                >
                    <BookOpen className="w-4 h-4" />
                    <span>Browse Catalog</span>
                </Link>
            </div>

            {error && (
                <div className="alert alert-error shadow-sm rounded-2xl">
                    <span>{error}</span>
                </div>
            )}

            {enrollments.length === 0 ? (
                <div className="card bg-base-100 border border-base-300 rounded-3xl p-12 text-center shadow-sm space-y-4">
                    <div className="w-14 h-14 rounded-full bg-[#006FF9]/10 text-[#006FF9] flex items-center justify-center mx-auto">
                        <GraduationCap className="w-7 h-7" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-[#111729] dark:text-white">No courses enrolled yet</h2>
                        <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-400 mt-1 max-w-sm mx-auto">
                            Start your learning journey today by exploring our industry-crafted courses.
                        </p>
                    </div>
                    <Link to="/courses" className="btn btn-primary rounded-full px-8 font-bold mx-auto">
                        Explore Courses
                    </Link>
                </div>
            ) : (
                <div className="space-y-5">
                    {enrollments.map((enrollment) => {
                        const courseId = enrollment.course?._id;
                        const isExpanded = expandedCourse === courseId;
                        const stats = courseStats[courseId];
                        const isLoading = loadingStats[courseId];

                        const completedCount = enrollment.progress?.completedLessons?.length || 0;
                        const courseData = stats?.courseData;
                        let totalLessons = 0;

                        if (courseData?.syllabus) {
                            courseData.syllabus.forEach(module => {
                                if (module.lessons) {
                                    totalLessons += module.lessons.length;
                                }
                            });
                        }

                        return (
                            <div
                                key={enrollment._id}
                                className="card bg-base-100 shadow-sm hover:shadow-md border border-base-300 rounded-3xl overflow-hidden transition-all duration-300"
                            >
                                <div className="card-body p-6 sm:p-7 space-y-5">
                                    {/* Course Header */}
                                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                        <div className="flex-1 min-w-0 space-y-1">
                                            <h2 className="text-lg sm:text-2xl font-bold text-[#111729] dark:text-white leading-snug">
                                                {enrollment.course?.title}
                                            </h2>
                                            <p className="text-xs text-[#677489] dark:text-slate-400">
                                                Instructor: <span className="font-semibold text-[#111729] dark:text-white">{enrollment.course?.instructorName}</span>
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2.5 w-full sm:w-auto">
                                            <button
                                                onClick={() => handleExpandCourse(courseId)}
                                                className="btn btn-sm btn-outline rounded-full px-4 gap-1.5 font-bold flex-1 sm:flex-none text-xs"
                                            >
                                                <span>{isExpanded ? "Hide Details" : "View Performance"}</span>
                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                            </button>
                                            <Link
                                                to={`/courses/${courseId}/player`}
                                                className="btn btn-sm btn-primary rounded-full px-5 gap-1.5 font-bold flex-1 sm:flex-none text-xs shadow-xs"
                                            >
                                                <Play className="w-3 h-3 fill-white" />
                                                <span>Continue</span>
                                            </Link>
                                        </div>
                                    </div>

                                    {/* Progress Bar Container */}
                                    <div className="p-4 sm:p-5 bg-base-200/50 rounded-2xl border border-base-300 space-y-2.5">
                                        <div className="flex justify-between items-center text-xs">
                                            <div>
                                                <span className="font-bold text-[#111729] dark:text-white">Curriculum Progress</span>
                                                {totalLessons > 0 ? (
                                                    <span className="text-[#677489] ml-2 font-medium">
                                                        ({completedCount} of {totalLessons} lessons completed)
                                                    </span>
                                                ) : completedCount > 0 ? (
                                                    <span className="text-[#677489] ml-2 font-medium">
                                                        ({completedCount} completed)
                                                    </span>
                                                ) : null}
                                            </div>
                                            <span className="text-base sm:text-lg font-black text-[#006FF9]">
                                                {enrollment.progress?.percent || 0}%
                                            </span>
                                        </div>

                                        <progress
                                            className="progress progress-primary w-full h-2.5"
                                            value={enrollment.progress?.percent || 0}
                                            max="100"
                                        ></progress>
                                    </div>

                                    {/* Expanded Performance & Statistics */}
                                    {isExpanded && (
                                        <div className="pt-4 border-t border-base-300 space-y-6">
                                            {isLoading ? (
                                                <div className="flex flex-col items-center justify-center py-8 space-y-2">
                                                    <span className="loading loading-spinner loading-md text-[#006FF9]"></span>
                                                    <p className="text-xs text-[#677489]">Loading performance statistics...</p>
                                                </div>
                                            ) : stats ? (
                                                <>
                                                    <div className="flex justify-between items-center">
                                                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#677489]">
                                                            Performance Overview
                                                        </h3>
                                                        <button
                                                            onClick={() => handleRefreshStats(courseId)}
                                                            disabled={isLoading}
                                                            className="btn btn-xs btn-ghost rounded-full gap-1 text-[#677489] hover:text-[#006FF9]"
                                                            title="Refresh Stats"
                                                        >
                                                            <RotateCcw className="w-3 h-3" />
                                                            <span>Refresh</span>
                                                        </button>
                                                    </div>

                                                    {/* Statistics Cards */}
                                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                                                        {/* Quiz Average */}
                                                        <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-1">
                                                            <span className="text-xs font-bold text-[#677489] dark:text-slate-400 uppercase">Quiz Average</span>
                                                            <p className="text-2xl sm:text-3xl font-black text-[#006FF9]">
                                                                {stats.quizStats?.average || 0}%
                                                            </p>
                                                            <p className="text-[11px] text-[#677489] dark:text-slate-400">
                                                                {stats.quizStats?.totalQuizzes || 0} quizzes completed
                                                            </p>
                                                        </div>

                                                        {/* Assignment Average */}
                                                        <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-1">
                                                            <span className="text-xs font-bold text-[#677489] dark:text-slate-400 uppercase">Assignment Average</span>
                                                            <p className="text-2xl sm:text-3xl font-black text-[#2D62FF]">
                                                                {stats.assignmentStats?.average || 0}%
                                                            </p>
                                                            <p className="text-[11px] text-[#677489] dark:text-slate-400">
                                                                {stats.assignmentStats?.reviewedCount || 0} of {stats.assignmentStats?.totalAssignments || 0} evaluated
                                                            </p>
                                                        </div>

                                                        {/* Overall Grade */}
                                                        <div className="p-4 rounded-2xl bg-base-200/60 border border-base-300 space-y-1">
                                                            <span className="text-xs font-bold text-[#677489] dark:text-slate-400 uppercase">Overall Grade</span>
                                                            <p className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                                                                {(() => {
                                                                    const quizAvg = stats.quizStats?.average || 0;
                                                                    const assignAvg = stats.assignmentStats?.average || 0;
                                                                    const quizCount = stats.quizStats?.totalQuizzes || 0;
                                                                    const assignCount = stats.assignmentStats?.reviewedCount || 0;
                                                                    const total = quizCount + assignCount;
                                                                    if (total === 0) return "N/A";
                                                                    return `${Math.round((quizAvg * quizCount + assignAvg * assignCount) / total)}%`;
                                                                })()}
                                                            </p>
                                                            <p className="text-[11px] text-[#677489] dark:text-slate-400">Weighted mastery score</p>
                                                        </div>
                                                    </div>

                                                    {/* Quiz Submissions List */}
                                                    {stats.quizStats?.submissions && stats.quizStats.submissions.length > 0 ? (
                                                        <div className="space-y-3 pt-2">
                                                            <h4 className="text-sm font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                                                                <span>Quiz Submissions</span>
                                                                <span className="badge badge-primary text-[10px] font-bold">
                                                                    {stats.quizStats.submissions.length}
                                                                </span>
                                                            </h4>
                                                            <div className="space-y-2">
                                                                {stats.quizStats.submissions.map((quiz, idx) => {
                                                                    const lessonTitle = getLessonTitle(courseId, quiz.lessonId);
                                                                    return (
                                                                        <div 
                                                                            key={quiz._id || idx} 
                                                                            className="flex items-center justify-between p-3.5 rounded-2xl bg-base-200/40 border border-base-300 text-xs"
                                                                        >
                                                                            <div>
                                                                                <p className="font-bold text-[#111729] dark:text-white">{lessonTitle}</p>
                                                                                <p className="text-[#677489] mt-0.5">
                                                                                    {quiz.score} / {quiz.total} correct
                                                                                </p>
                                                                            </div>
                                                                            <span className={`font-black text-base ${quiz.percent >= 70 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-500'}`}>
                                                                                {quiz.percent}%
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 text-xs text-[#677489] text-center">
                                                            No quizzes submitted yet. Quizzes unlock as you progress through lessons.
                                                        </div>
                                                    )}

                                                    {/* Assignment Submissions List */}
                                                    {stats.assignmentStats?.submissions && stats.assignmentStats.submissions.length > 0 ? (
                                                        <div className="space-y-3 pt-2">
                                                            <h4 className="text-sm font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                                                                <span>Assignments & Mentor Feedback</span>
                                                                <span className="badge badge-primary text-[10px] font-bold">
                                                                    {stats.assignmentStats.submissions.length}
                                                                </span>
                                                            </h4>
                                                            <div className="space-y-2.5">
                                                                {stats.assignmentStats.submissions.map((assignment, idx) => {
                                                                    const lessonTitle = getLessonTitle(courseId, assignment.lessonId);
                                                                    return (
                                                                        <div 
                                                                            key={assignment._id || idx} 
                                                                            className="p-4 rounded-2xl bg-base-200/40 border border-base-300 text-xs space-y-2"
                                                                        >
                                                                            <div className="flex justify-between items-start gap-2">
                                                                                <div>
                                                                                    <p className="font-bold text-[#111729] dark:text-white text-sm">{lessonTitle}</p>
                                                                                    <p className="text-[#677489] mt-0.5">
                                                                                        Submitted {assignment.submittedAt ? new Date(assignment.submittedAt).toLocaleDateString() : ""}
                                                                                    </p>
                                                                                </div>
                                                                                <span className={`badge badge-sm font-bold ${assignment.status === "reviewed" ? "badge-success text-white" : "badge-warning"}`}>
                                                                                    {assignment.status === "reviewed" ? "Evaluated" : "Pending Review"}
                                                                                </span>
                                                                            </div>

                                                                            {assignment.reviewNotes && (
                                                                                <div className="p-3 rounded-xl bg-base-100 border border-base-300 text-xs space-y-1">
                                                                                    <p className="font-bold text-[#006FF9]">
                                                                                        Mentor Feedback ({assignment.reviewer?.name || "Instructor"}):
                                                                                    </p>
                                                                                    <p className="text-[#111729] dark:text-slate-200 leading-relaxed">
                                                                                        {assignment.reviewNotes}
                                                                                    </p>
                                                                                </div>
                                                                            )}
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <div className="p-4 rounded-2xl bg-base-200/40 border border-base-300 text-xs text-[#677489] text-center">
                                                            No assignments submitted yet. Complete project tasks in the course player.
                                                        </div>
                                                    )}
                                                </>
                                            ) : null}
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
