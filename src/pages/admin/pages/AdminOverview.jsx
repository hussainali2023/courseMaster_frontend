import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { fetchEnrollments, fetchAssignments } from "../../../store/slices/adminSlice";
import { getAnalytics } from "../../../services/admin.api";
import {
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    Plus,
    BookOpen,
    FileText,
    Users,
    BarChart3,
    Video,
    TrendingUp,
    Shield,
    Sparkles
} from "lucide-react";

export default function AdminOverview() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { enrollments, assignments } = useSelector((state) => state.admin);
    const [analytics, setAnalytics] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        dispatch(fetchEnrollments());
        dispatch(fetchAssignments());
        loadAnalytics();
    }, [dispatch]);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            const res = await getAnalytics();
            setAnalytics(res.data);
        } catch (err) {
            console.error("Failed to load analytics:", err);
        } finally {
            setLoading(false);
        }
    };

    const stats = [
        {
            title: "Total Enrollments",
            value: enrollments.length,
            icon: <Users className="w-5 h-5 text-[#006FF9]" />,
            trend: "+12% this month",
            bgClass: "bg-[#006FF9]/10 text-[#006FF9]",
        },
        {
            title: "Pending Evaluations",
            value: assignments.filter((a) => a.status === "submitted").length,
            icon: <FileText className="w-5 h-5 text-amber-500" />,
            trend: "Requires review",
            bgClass: "bg-amber-500/10 text-amber-500",
        },
        {
            title: "Reviewed Projects",
            value: assignments.filter((a) => a.status === "reviewed").length,
            icon: <FileText className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            trend: "Completed",
            bgClass: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
        },
    ];

    const quickActions = [
        {
            label: "Add Course",
            icon: <Plus className="w-4 h-4" />,
            path: "/admin/courses/create",
        },
        {
            label: "Manage Courses",
            icon: <BookOpen className="w-4 h-4" />,
            path: "/admin/courses",
        },
        {
            label: "Review Assignments",
            icon: <FileText className="w-4 h-4" />,
            path: "/admin/assignments",
        },
        {
            label: "Video Classes",
            icon: <Video className="w-4 h-4" />,
            path: "/admin/video-classes",
        },
        {
            label: "Manage Users",
            icon: <Users className="w-4 h-4" />,
            path: "/admin/users",
        },
        {
            label: "Analytics",
            icon: <BarChart3 className="w-4 h-4" />,
            path: "/admin/analytics",
        },
    ];

    const enrollmentChartData = analytics?.chartData || [];
    
    const assignmentStatusData = [
        {
            name: "Reviewed",
            value: assignments.filter((a) => a.status === "reviewed").length,
            color: "#006FF9",
        },
        {
            name: "Pending",
            value: assignments.filter((a) => a.status === "submitted").length,
            color: "#F59E0B",
        },
    ];

    const courseEnrollmentData = (analytics?.topCourses || analytics?.enrollmentsByCourse || [])
        .slice(0, 5)
        .map((course) => ({
            name: (course.courseTitle || course.courseName || "Course").substring(0, 15),
            enrollments: course.count || course.enrollments || 0,
        }));

    return (
        <div className="space-y-6 sm:space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#006FF9]/10 text-[#006FF9] text-xs font-bold border border-[#006FF9]/20">
                        <Shield className="w-3.5 h-3.5" />
                        <span>Platform Administration</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                        Overview & Metrics
                    </h1>
                </div>
                <div className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold px-4 py-2 text-xs">
                    <TrendingUp className="w-3.5 h-3.5 mr-1.5" />
                    Live System Synchronized
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {stats.map((stat, idx) => (
                    <div 
                        key={idx} 
                        className="card bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm hover:shadow-md transition-all space-y-3"
                    >
                        <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-[#677489] uppercase tracking-wider">
                                {stat.title}
                            </span>
                            <div className={`w-9 h-9 rounded-full flex items-center justify-center ${stat.bgClass}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-black text-[#111729] dark:text-white">
                            {stat.value}
                        </h2>
                        <p className="text-xs font-medium text-[#677489]">
                            {stat.trend}
                        </p>
                    </div>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="card bg-base-100 border border-base-300 p-6 sm:p-7 rounded-3xl shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#111729] dark:text-white">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                    {quickActions.map((action, idx) => (
                        <button
                            key={idx}
                            onClick={() => navigate(action.path)}
                            className="btn btn-outline btn-sm rounded-full gap-2 font-bold py-2.5 h-auto text-xs"
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Enrollment Trend Chart */}
                <div className="card bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-[#111729] dark:text-white">
                        Enrollment Trends (Last 30 Days)
                    </h2>
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner text-[#006FF9]"></span>
                        </div>
                    ) : enrollmentChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <BarChart data={enrollmentChartData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} />
                                <XAxis
                                    dataKey="displayDate"
                                    tick={{ fontSize: 11 }}
                                    angle={-45}
                                    textAnchor="end"
                                    height={80}
                                />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--color-base-100)",
                                        border: "1px solid var(--color-base-300)",
                                        borderRadius: "16px",
                                    }}
                                />
                                <Bar dataKey="enrollments" fill="#006FF9" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex justify-center items-center h-64 text-xs text-[#677489]">
                            No enrollment data available yet
                        </div>
                    )}
                </div>

                {/* Assignment Status Pie Chart */}
                <div className="card bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-4">
                    <h2 className="text-base font-bold text-[#111729] dark:text-white">
                        Assignment Evaluation Ratio
                    </h2>
                    {assignmentStatusData.some((d) => d.value > 0) ? (
                        <ResponsiveContainer width="100%" height={250}>
                            <PieChart>
                                <Pie
                                    data={assignmentStatusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    dataKey="value"
                                >
                                    {assignmentStatusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: "var(--color-base-100)",
                                        border: "1px solid var(--color-base-300)",
                                        borderRadius: "16px",
                                    }}
                                />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <div className="flex justify-center items-center h-64 text-xs text-[#677489]">
                            No assignment submissions evaluated yet
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Enrollments */}
            <div className="card bg-base-100 border border-base-300 p-6 rounded-3xl shadow-sm space-y-4">
                <h2 className="text-lg font-bold text-[#111729] dark:text-white">Recent Enrollments</h2>
                {enrollments.length === 0 ? (
                    <p className="text-xs text-[#677489]">No enrollments recorded yet</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="table table-sm">
                            <thead>
                                <tr className="border-b border-base-300 text-xs text-[#677489]">
                                    <th>Student</th>
                                    <th>Course</th>
                                    <th>Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-base-300 text-xs">
                                {enrollments.slice(0, 10).map((enroll) => (
                                    <tr key={enroll._id} className="hover:bg-base-200/50">
                                        <td className="font-bold text-[#111729] dark:text-white py-3">
                                            {enroll.student?.name || "Student"}
                                        </td>
                                        <td className="text-[#677489]">
                                            {enroll.course?.title || "Course"}
                                        </td>
                                        <td className="text-[#677489]">
                                            {new Date(enroll.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
