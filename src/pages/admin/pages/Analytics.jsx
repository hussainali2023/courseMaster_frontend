import { useEffect, useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { getAnalytics } from "../../../services/admin.api";
import { Users, BookOpen, GraduationCap, Calendar, TrendingUp, BarChart2 } from "lucide-react";

export default function Analytics() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await getAnalytics();
                setData(res.data);
            } catch (err) {
                console.error("Failed to load analytics:", err);
                setError(err.response?.data?.message || "Failed to load analytics");
            } finally {
                setLoading(false);
            }
        };
        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <span className="loading loading-spinner loading-lg text-[#006FF9]"></span>
                <p className="text-xs font-semibold text-[#677489] dark:text-slate-400">Loading analytics metrics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="alert alert-error shadow-sm rounded-2xl">
                <span>{error}</span>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="card bg-base-100 border border-base-300 rounded-2xl p-8 text-center text-xs text-[#677489]">
                <span>No analytics data available</span>
            </div>
        );
    }

    const statCards = [
        {
            title: "Total Enrollments",
            value: data.stats?.totalEnrollments || 0,
            icon: <Users className="w-5 h-5 text-[#006FF9]" />,
            badgeBg: "bg-[#006FF9]/10",
        },
        {
            title: "Total Courses",
            value: data.stats?.totalCourses || 0,
            icon: <BookOpen className="w-5 h-5 text-[#2D62FF]" />,
            badgeBg: "bg-[#2D62FF]/10",
        },
        {
            title: "Total Students",
            value: data.stats?.totalStudents || 0,
            icon: <GraduationCap className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />,
            badgeBg: "bg-emerald-500/10",
        },
        {
            title: "Last 30 Days",
            value: data.stats?.enrollmentsLast30Days || 0,
            icon: <Calendar className="w-5 h-5 text-amber-500" />,
            badgeBg: "bg-amber-500/10",
        },
    ];

    return (
        <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                        Analytics Dashboard
                    </h1>
                    <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-300">
                        Platform metrics, course enrollment trends, and student activity
                    </p>
                </div>
                <div className="badge bg-[#006FF9]/10 text-[#006FF9] border border-[#006FF9]/25 font-bold px-3.5 py-1.5 text-xs">
                    <TrendingUp className="w-3.5 h-3.5 mr-1" /> Real-time Metrics
                </div>
            </div>

            {/* Stats Cards - High Contrast in both Light & Dark modes */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {statCards.map((stat, idx) => (
                    <div 
                        key={idx}
                        className="card bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs space-y-3"
                    >
                        <div className="flex justify-between items-center">
                            <span className="text-xs font-bold text-[#677489] dark:text-slate-400 uppercase tracking-wider">
                                {stat.title}
                            </span>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stat.badgeBg}`}>
                                {stat.icon}
                            </div>
                        </div>
                        <p className="text-3xl font-black text-[#111729] dark:text-white">
                            {stat.value}
                        </p>
                    </div>
                ))}
            </div>

            {/* Enrollments Over Time Chart */}
            <div className="card bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center">
                    <h3 className="text-base sm:text-lg font-bold text-[#111729] dark:text-white">
                        Enrollments Over Time (Last 30 Days)
                    </h3>
                </div>
                <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={data.chartData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} />
                        <XAxis
                            dataKey="displayDate"
                            tick={{ fontSize: 11, fill: "currentColor" }}
                            stroke="currentColor"
                            opacity={0.6}
                            angle={-45}
                            textAnchor="end"
                            height={60}
                        />
                        <YAxis 
                            tick={{ fontSize: 11, fill: "currentColor" }}
                            stroke="currentColor"
                            opacity={0.6}
                        />
                        <Tooltip 
                            contentStyle={{
                                backgroundColor: "var(--color-base-100)",
                                border: "1px solid var(--color-base-300)",
                                borderRadius: "12px",
                                color: "var(--color-base-content)",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                            }}
                        />
                        <Legend />
                        <Line
                            type="monotone"
                            dataKey="enrollments"
                            stroke="#006FF9"
                            strokeWidth={3}
                            name="Enrollments"
                            dot={{ r: 4, fill: "#006FF9" }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            {/* Top Courses by Enrollments */}
            {data.enrollmentsByCourse && data.enrollmentsByCourse.length > 0 && (
                <div className="card bg-base-100 border border-base-300 rounded-2xl p-6 shadow-sm space-y-4">
                    <h3 className="text-base sm:text-lg font-bold text-[#111729] dark:text-white">
                        Top Courses by Enrollments
                    </h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={data.enrollmentsByCourse} margin={{ top: 10, right: 20, left: 0, bottom: 40 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" opacity={0.08} />
                            <XAxis
                                dataKey="courseName"
                                tick={{ fontSize: 11, fill: "currentColor" }}
                                stroke="currentColor"
                                opacity={0.6}
                                angle={-30}
                                textAnchor="end"
                                height={70}
                            />
                            <YAxis 
                                tick={{ fontSize: 11, fill: "currentColor" }}
                                stroke="currentColor"
                                opacity={0.6}
                            />
                            <Tooltip 
                                contentStyle={{
                                    backgroundColor: "var(--color-base-100)",
                                    border: "1px solid var(--color-base-300)",
                                    borderRadius: "12px",
                                    color: "var(--color-base-content)",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                                }}
                            />
                            <Legend />
                            <Bar dataKey="enrollments" fill="#2D62FF" name="Enrollments" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {/* Additional Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="card bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="text-sm sm:text-base font-bold text-[#111729] dark:text-white flex items-center gap-2">
                        <BarChart2 className="w-4 h-4 text-[#006FF9]" />
                        <span>Platform Statistics</span>
                    </h3>
                    <div className="space-y-3 text-xs sm:text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-base-300">
                            <span className="text-[#677489] dark:text-slate-300">Total Instructors</span>
                            <span className="font-extrabold text-[#111729] dark:text-white">{data.stats?.totalInstructors || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-[#677489] dark:text-slate-300">Average Enrollments per Course</span>
                            <span className="font-extrabold text-[#006FF9]">
                                {data.stats?.totalCourses > 0
                                    ? Math.round(data.stats.totalEnrollments / data.stats.totalCourses)
                                    : 0}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="card bg-base-100 border border-base-300 rounded-2xl p-6 shadow-xs space-y-4">
                    <h3 className="text-sm sm:text-base font-bold text-[#111729] dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-emerald-500" />
                        <span>Growth Metrics</span>
                    </h3>
                    <div className="space-y-3 text-xs sm:text-sm">
                        <div className="flex justify-between items-center py-2 border-b border-base-300">
                            <span className="text-[#677489] dark:text-slate-300">Enrollments (Last 30 Days)</span>
                            <span className="font-extrabold text-[#006FF9]">{data.stats?.enrollmentsLast30Days || 0}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                            <span className="text-[#677489] dark:text-slate-300">Daily Average Enrollments</span>
                            <span className="font-extrabold text-emerald-600 dark:text-emerald-400">
                                {Math.round(((data.stats?.enrollmentsLast30Days || 0) / 30) * 10) / 10}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
