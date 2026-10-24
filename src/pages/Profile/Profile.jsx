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
            <div className="flex justify-center items-center min-h-[60vh]">
                <span className="loading loading-spinner loading-lg text-primary"></span>
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
        <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8 py-4 sm:py-6">
            {/* Header Profile Card */}
            <div className="card bg-base-100 border border-base-300 shadow-xl overflow-hidden relative">
                {/* Banner Gradient */}
                <div className="h-36 sm:h-44 bg-gradient-to-r from-primary/30 via-secondary/25 to-accent/20 relative">
                    <div className="absolute top-4 right-4">
                        <span className={`badge badge-lg gap-1.5 font-bold shadow-md ${isAdmin ? "badge-secondary" : "badge-primary"}`}>
                            {isAdmin ? <Shield className="w-4 h-4" /> : <GraduationCap className="w-4 h-4" />}
                            {isAdmin ? "Administrator" : "Student"}
                        </span>
                    </div>
                </div>

                <div className="card-body px-6 sm:px-10 pb-8 pt-0 relative">
                    {/* Avatar and Top Info */}
                    <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-20 gap-4 mb-6">
                        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
                            <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-3xl bg-gradient-to-br from-primary to-secondary text-primary-content flex items-center justify-center font-black text-3xl sm:text-4xl shadow-2xl border-4 border-base-100 ring-2 ring-primary/20">
                                {initials}
                            </div>
                            <div className="space-y-1">
                                <h1 className="text-2xl sm:text-3xl font-black text-base-content flex items-center gap-2">
                                    {user?.name}
                                    <Sparkles className="w-5 h-5 text-primary" />
                                </h1>
                                <p className="text-sm sm:text-base text-base-content/70 flex items-center gap-1.5">
                                    <Mail className="w-4 h-4 text-primary" />
                                    {user?.email}
                                </p>
                            </div>
                        </div>

                        {/* Action buttons */}
                        <div className="flex flex-wrap gap-2 pt-2 sm:pt-0">
                            <Link
                                to={isAdmin ? "/admin" : "/student"}
                                className="btn btn-primary btn-sm sm:btn-md gap-2 font-bold shadow-md"
                            >
                                <BookOpen className="w-4 h-4" />
                                Go to Dashboard
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="btn btn-outline btn-error btn-sm sm:btn-md gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Quick Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-4 border-t border-base-300">
                        <div className="p-4 rounded-2xl bg-base-200/70 border border-base-300/60">
                            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-primary" /> Member Since
                            </span>
                            <p className="text-base sm:text-lg font-bold text-base-content mt-1">
                                {memberSince}
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-base-200/70 border border-base-300/60">
                            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider flex items-center gap-1.5">
                                <Shield className="w-3.5 h-3.5 text-primary" /> Account Status
                            </span>
                            <p className="text-base sm:text-lg font-bold text-success mt-1 flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4" /> Active
                            </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-base-200/70 border border-base-300/60">
                            <span className="text-xs font-semibold text-base-content/60 uppercase tracking-wider flex items-center gap-1.5">
                                <BookOpen className="w-3.5 h-3.5 text-primary" />
                                {isAdmin ? "Platform Role" : "Enrolled Courses"}
                            </span>
                            <p className="text-base sm:text-lg font-bold text-primary mt-1">
                                {isAdmin ? "Full Access Admin" : `${userEnrollments.length} Course${userEnrollments.length === 1 ? "" : "s"}`}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Information Details */}
            <div className="card bg-base-100 border border-base-300 shadow-md">
                <div className="card-body p-6 sm:p-8">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <User className="w-5 h-5 text-primary" />
                        Account Details
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/70">Full Name</span>
                            </label>
                            <input
                                type="text"
                                value={user?.name || ""}
                                readOnly
                                className="input input-bordered bg-base-200/50 cursor-default"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/70">Email Address</span>
                            </label>
                            <input
                                type="email"
                                value={user?.email || ""}
                                readOnly
                                className="input input-bordered bg-base-200/50 cursor-default"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/70">User Role</span>
                            </label>
                            <input
                                type="text"
                                value={user?.role?.toUpperCase() || "STUDENT"}
                                readOnly
                                className="input input-bordered bg-base-200/50 cursor-default font-semibold text-primary"
                            />
                        </div>

                        <div className="form-control">
                            <label className="label">
                                <span className="label-text font-semibold text-base-content/70">Account ID</span>
                            </label>
                            <input
                                type="text"
                                value={user?._id || user?.id || ""}
                                readOnly
                                className="input input-bordered bg-base-200/50 font-mono text-xs cursor-default text-base-content/60"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* If Student: Recent Courses Preview */}
            {!isAdmin && (
                <div className="card bg-base-100 border border-base-300 shadow-md">
                    <div className="card-body p-6 sm:p-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <GraduationCap className="w-5 h-5 text-primary" />
                                My Enrolled Courses
                            </h2>
                            <Link to="/student" className="link link-primary text-sm font-semibold flex items-center gap-1">
                                View Dashboard <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>

                        {userEnrollments.length === 0 ? (
                            <div className="text-center py-8 rounded-2xl bg-base-200/60 p-6">
                                <p className="text-base-content/70 text-sm">You haven't enrolled in any courses yet.</p>
                                <Link to="/courses" className="btn btn-primary btn-sm mt-3 gap-2">
                                    Browse Courses
                                </Link>
                            </div>
                        ) : (
                            <div className="divide-y divide-base-300">
                                {userEnrollments.slice(0, 3).map((enr) => (
                                    <div key={enr._id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                        <div>
                                            <h3 className="font-bold text-base text-base-content">
                                                {enr.course?.title || "Enrolled Course"}
                                            </h3>
                                            <p className="text-xs text-base-content/60 mt-0.5">
                                                Instructor: {enr.course?.instructorName || "CourseMaster Instructor"}
                                            </p>
                                            <div className="flex items-center gap-2 mt-2">
                                                <progress
                                                    className="progress progress-primary w-28 sm:w-36 h-2"
                                                    value={enr.progress?.percent || 0}
                                                    max="100"
                                                ></progress>
                                                <span className="text-xs font-bold text-primary">
                                                    {enr.progress?.percent || 0}%
                                                </span>
                                            </div>
                                        </div>
                                        <Link
                                            to={`/courses/${enr.course?._id}/player`}
                                            className="btn btn-sm btn-outline btn-primary gap-1 shrink-0"
                                        >
                                            Continue Learning <ArrowRight className="w-3.5 h-3.5" />
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
