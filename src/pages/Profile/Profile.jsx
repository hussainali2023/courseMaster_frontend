import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { getMe } from "../../services/auth.api";
import { fetchMyEnrollments } from "../../store/slices/enrollmentSlice";
import { clearToken } from "../../utils/auth";
import { 
    User, 
    Mail, 
    Shield, 
    Calendar, 
    BookOpen, 
    GraduationCap, 
    LogOut, 
    ArrowRight, 
    Sparkles,
    CheckCircle2
} from "lucide-react";

export default function Profile() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user: authUser } = useSelector((state) => state.auth);
    const { enrollments } = useSelector((state) => state.enrollment);

    const [user, setUser] = useState(authUser);
    const [loading, setLoading] = useState(!authUser);

    useEffect(() => {
        const loadProfile = async () => {
            try {
                const res = await getMe();
                setUser(res.data);
            } catch (err) {
                console.error("Failed to load user profile:", err);
            } finally {
                setLoading(false);
            }
        };

        loadProfile();
        dispatch(fetchMyEnrollments());
    }, [dispatch]);

    const handleLogout = () => {
        clearToken();
        navigate("/login");
        window.location.reload();
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-3">
                <span className="loading loading-spinner loading-lg text-[#006FF9]"></span>
                <p className="text-xs font-semibold text-[#677489]">Loading profile...</p>
            </div>
        );
    }

    const initials = user?.name
        ? user.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()
        : "U";

    const memberSince = user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
          })
        : "Recent Member";

    const isAdmin = user?.role === "admin";
    const userEnrollments = Array.isArray(enrollments) ? enrollments : [];

    return (
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-4 sm:py-8">
            {/* Header Profile Card */}
            <div className="card bg-base-100 border border-base-300 shadow-lg rounded-3xl overflow-hidden relative">
                {/* Banner Gradient */}
                <div className="h-36 sm:h-44 bg-gradient-to-r from-[#006FF9]/20 via-[#2D62FF]/15 to-transparent relative">
                    <div className="absolute top-4 right-4">
                        <span className="badge bg-base-100/90 text-[#006FF9] border border-[#006FF9]/25 gap-1.5 font-bold shadow-xs px-3.5 py-1 text-xs">
                            {isAdmin ? <Shield className="w-3.5 h-3.5" /> : <GraduationCap className="w-3.5 h-3.5" />}
                            {isAdmin ? "Administrator" : "Student"}
                        </span>
                    </div>
                </div>

                <div className="card-body px-6 sm:px-10 pb-8 pt-0 relative">
                    {/* Avatar and Top Info */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-tr from-[#006FF9] to-[#2D62FF] text-white flex items-center justify-center font-black text-3xl sm:text-4xl shadow-xl border-4 border-base-100">
                                {initials}
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111729] dark:text-white flex items-center gap-2">
                                    {user?.name}
                                    <Sparkles className="w-5 h-5 text-[#006FF9]" />
                                </h1>
                                <p className="text-xs sm:text-sm text-[#677489] dark:text-slate-400 flex items-center gap-1.5 font-medium">
                                    <Mail className="w-4 h-4 text-[#006FF9]" />
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2.5 pt-2 sm:pt-0">
                            <Link
                                to={isAdmin ? "/admin" : "/student"}
                                className="btn btn-primary btn-sm rounded-full px-5 gap-2 font-bold shadow-sm"
                            >
                                <BookOpen className="w-4 h-4" />
                                <span>Go to Dashboard</span>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline btn-sm rounded-full px-4 gap-1.5 text-red-500 hover:bg-red-500/10 border-red-500/30"
                            >
                                <LogOut className="w-3.5 h-3.5" />
                                <span>Sign Out</span>
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-base-300">
                        <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                            <span className="text-xs font-semibold text-[#677489] uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-[#006FF9]" /> Member Since
                            </span>
                            <p className="text-base sm:text-lg font-bold text-[#111729] dark:text-white mt-1">
                                {memberSince}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                            <span className="text-xs font-semibold text-[#677489] uppercase tracking-wider flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-[#006FF9]" /> Account Status
                            </span>
                            <p className="text-base sm:text-lg font-bold text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> Active
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-base-200/50 border border-base-300">
                            <span className="text-xs font-semibold text-[#677489] uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-[#006FF9]" />
                                {isAdmin ? "Platform Role" : "Enrolled Courses"}
                            </span>
                            <p className="text-base sm:text-lg font-bold text-[#006FF9] mt-1">
                                {isAdmin ? "Full Access Admin" : `${userEnrollments.length} Course${userEnrollments.length === 1 ? "" : "s"}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Information Details */}
            <div className="card bg-base-100 border border-base-300 shadow-sm rounded-3xl p-6 sm:p-8 space-y-5">
                <h2 className="text-lg sm:text-xl font-bold text-[#111729] dark:text-white flex items-center gap-2">
                    <User className="w-5 h-5 text-[#006FF9]" />
                    <span>Account Details</span>
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#677489]">Full Name</label>
                        <input
                            type="text"
                            value={user?.name || ""}
                            readOnly
                            className="input w-full rounded-full border-base-300 bg-base-200/40 cursor-default text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#677489]">Email Address</label>
                        <input
                            type="email"
                            value={user?.email || ""}
                            readOnly
                            className="input w-full rounded-full border-base-300 bg-base-200/40 cursor-default text-sm"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#677489]">User Role</label>
                        <input
                            type="text"
                            value={user?.role?.toUpperCase() || "STUDENT"}
                            readOnly
                            className="input w-full rounded-full border-base-300 bg-base-200/40 cursor-default text-sm font-bold text-[#006FF9]"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-[#677489]">Account Identifier</label>
                        <input
                            type="text"
                            value={user?._id || user?.id || ""}
                            readOnly
                            className="input w-full rounded-full border-base-300 bg-base-200/40 font-mono text-xs cursor-default text-[#677489]"
                        />
                    </div>
                </div>
            </div>

            {/* If Student: Recent Courses Preview */}
            {!isAdmin && (
                <div className="card bg-base-100 border border-base-300 shadow-sm rounded-3xl p-6 sm:p-8 space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-lg sm:text-xl font-bold text-[#111729] dark:text-white flex items-center gap-2">
                            <GraduationCap className="w-5 h-5 text-[#006FF9]" />
                            <span>My Enrolled Courses</span>
                        </h2>
                        <Link to="/student" className="text-xs font-bold text-[#006FF9] hover:underline flex items-center gap-1">
                            <span>View All in Dashboard</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                    </div>

                    {userEnrollments.length === 0 ? (
                        <div className="text-center py-8 rounded-2xl bg-base-200/40 p-6 space-y-3">
                            <p className="text-[#677489] text-xs">You haven't enrolled in any courses yet.</p>
                            <Link to="/courses" className="btn btn-primary btn-sm rounded-full font-bold px-6">
                                Browse Catalog
                            </Link>
                        </div>
                    ) : (
                        <div className="divide-y divide-base-300">
                            {userEnrollments.slice(0, 3).map((enr) => (
                                <div key={enr._id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-sm sm:text-base text-[#111729] dark:text-white">
                                            {enr.course?.title || "Enrolled Course"}
                                        </h3>
                                        <p className="text-xs text-[#677489]">
                                            Instructor: {enr.course?.instructorName || "CourseMaster"}
                                        </p>
                                        <div className="flex items-center gap-2 pt-1">
                                            <progress
                                                className="progress progress-primary w-28 sm:w-36 h-2"
                                                value={enr.progress?.percent || 0}
                                                max="100"
                                            ></progress>
                                            <span className="text-xs font-bold text-[#006FF9]">
                                                {enr.progress?.percent || 0}%
                                            </span>
                                        </div>
                                    </div>
                                    <Link
                                        to={`/courses/${enr.course?._id}/player`}
                                        className="btn btn-sm btn-outline rounded-full font-bold px-4 gap-1 shrink-0"
                                    >
                                        <span>Continue Learning</span>
                                        <ArrowRight className="w-3.5 h-3.5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
