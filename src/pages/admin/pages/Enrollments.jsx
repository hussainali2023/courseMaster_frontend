import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchEnrollments } from "../../../store/slices/adminSlice";
import { fetchCourses } from "../../../store/slices/coursesSlice";
import { Search, Filter, Users, Calendar, CheckCircle, GraduationCap } from "lucide-react";

export default function Enrollments() {
    const dispatch = useDispatch();
    const { enrollments, loading } = useSelector((state) => state.admin);
    const { courses } = useSelector((state) => state.courses);
    const [selectedCourse, setSelectedCourse] = useState("");
    const [searchStudent, setSearchStudent] = useState("");

    useEffect(() => {
        dispatch(fetchEnrollments());
        dispatch(fetchCourses({ page: 1, limit: 100 }));
    }, [dispatch]);

    // Filter enrollments by selected course and student name
    const filteredEnrollments = enrollments.filter((enr) => {
        const matchCourse = !selectedCourse || enr.course?._id === selectedCourse;
        const matchStudent = !searchStudent || enr.student?.name?.toLowerCase().includes(searchStudent.toLowerCase());
        return matchCourse && matchStudent;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                    <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#111729] dark:text-white">
                        Enrollment Management
                    </h1>
                    <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-300">
                        View enrolled students, cohorts, and active course access
                    </p>
                </div>
                <div className="badge bg-[#006FF9]/10 text-[#006FF9] border border-[#006FF9]/25 font-bold px-3.5 py-1.5 text-xs">
                    <Users className="w-3.5 h-3.5 mr-1.5" />
                    <span>{filteredEnrollments.length} Active Records</span>
                </div>
            </div>

            {/* Filters - Generous padding so text is never cut */}
            <div className="card bg-base-100 border border-base-300 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                            <Filter className="w-3.5 h-3.5 text-[#006FF9]" />
                            <span>Filter by Course</span>
                        </label>
                        <select
                            value={selectedCourse}
                            onChange={(e) => setSelectedCourse(e.target.value)}
                            className="select w-full rounded-xl border border-base-300 bg-base-100 text-xs sm:text-sm font-medium px-4 py-2"
                        >
                            <option value="">All Courses ({courses.length} available)</option>
                            {courses.map((course) => (
                                <option key={course._id} value={course._id}>
                                    {course.title}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#111729] dark:text-white flex items-center gap-1.5">
                            <Search className="w-3.5 h-3.5 text-[#006FF9]" />
                            <span>Search Student</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search by student name or email..."
                                value={searchStudent}
                                onChange={(e) => setSearchStudent(e.target.value)}
                                className="input w-full rounded-xl border border-base-300 bg-base-100 text-xs sm:text-sm px-4 py-2"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Results */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-16 space-y-2">
                    <span className="loading loading-spinner loading-md text-[#006FF9]"></span>
                    <p className="text-xs text-[#677489] dark:text-slate-400">Loading enrollment records...</p>
                </div>
            ) : filteredEnrollments.length === 0 ? (
                <div className="card bg-base-100 border border-base-300 rounded-2xl p-8 text-center text-xs text-[#677489] dark:text-slate-400">
                    <span>No enrollments match the selected filters</span>
                </div>
            ) : (
                <>
                    {/* Table view for md+ screens with safe cell insets so rounded edges NEVER cut text */}
                    <div className="hidden md:block overflow-x-auto border border-base-300 rounded-2xl bg-base-100 shadow-xs">
                        <table className="table table-sm w-full">
                            <thead className="border-b border-base-300 bg-base-200/50 text-xs text-[#677489] dark:text-slate-400">
                                <tr>
                                    <th className="py-3.5 pl-6 font-bold text-left">Student</th>
                                    <th className="py-3.5 px-4 font-bold text-left">Email Address</th>
                                    <th className="py-3.5 px-4 font-bold text-left">Course Enrolled</th>
                                    <th className="py-3.5 px-4 font-bold text-left">Enrollment Date</th>
                                    <th className="py-3.5 pr-6 font-bold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-base-300 text-xs">
                                {filteredEnrollments.map((enr) => (
                                    <tr key={enr._id} className="hover:bg-base-200/40 transition-colors">
                                        <td className="py-4 pl-6 font-bold text-[#111729] dark:text-white">
                                            {enr.student?.name || "Student"}
                                        </td>
                                        <td className="py-4 px-4 text-[#677489] dark:text-slate-300">
                                            {enr.student?.email || "No email"}
                                        </td>
                                        <td className="py-4 px-4 font-medium text-[#111729] dark:text-white max-w-xs truncate">
                                            {enr.course?.title || "Course"}
                                        </td>
                                        <td className="py-4 px-4 text-[#677489] dark:text-slate-300">
                                            {new Date(enr.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="py-4 pr-6 text-right">
                                            <span className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold px-3 py-1 text-xs whitespace-nowrap">
                                                Active
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Card view for small screens with safe padding so no text is cut */}
                    <div className="md:hidden space-y-3">
                        {filteredEnrollments.map((enr) => (
                            <div 
                                key={enr._id} 
                                className="card bg-base-100 border border-base-300 rounded-2xl p-5 shadow-xs space-y-2.5"
                            >
                                <div className="flex justify-between items-start gap-2">
                                    <div className="space-y-0.5">
                                        <h3 className="font-bold text-base text-[#111729] dark:text-white">
                                            {enr.student?.name || "Student"}
                                        </h3>
                                        <p className="text-xs text-[#677489] dark:text-slate-300">
                                            {enr.student?.email}
                                        </p>
                                    </div>
                                    <span className="badge bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 font-bold px-2.5 py-1 text-xs shrink-0">
                                        Active
                                    </span>
                                </div>
                                <div className="pt-2 border-t border-base-300 flex justify-between items-center text-xs">
                                    <span className="font-semibold text-[#111729] dark:text-white truncate max-w-[200px]">
                                        {enr.course?.title}
                                    </span>
                                    <span className="text-[#677489] dark:text-slate-400 text-[11px] shrink-0">
                                        {new Date(enr.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-center text-xs text-[#677489] dark:text-slate-400 pt-2">
                        Displaying {filteredEnrollments.length} total enrollment record{filteredEnrollments.length === 1 ? "" : "s"}
                    </div>
                </>
            )}
        </div>
    );
}
