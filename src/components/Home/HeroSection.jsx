import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Users, Award, Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";

export default function HeroSection() {
    const { isAuthenticated } = useSelector((state) => state.auth);

    return (
        <div className="relative overflow-hidden rounded-[32px] bg-gradient-to-b from-[#006FF9]/5 via-base-100 to-base-200/50 border border-base-300 p-6 sm:p-12 md:p-16 mb-12 shadow-sm">
            {/* Ambient Lighting Orbs */}
            <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#006FF9]/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#2D62FF]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="relative z-10 max-w-4xl mx-auto text-center space-y-7">
                {/* Trust Signal / Category Pill */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white dark:bg-[#111729] border border-[#006FF9]/25 text-[#006FF9] text-xs sm:text-sm font-bold shadow-xs">
                    <Sparkles className="w-4 h-4 text-[#006FF9]" />
                    <span>The Premier Digital Product & Tech Learning Experience</span>
                </div>

                {/* Main Headline */}
                <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-[#111729] dark:text-white leading-[1.15]">
                    Build High-Impact Digital Skills with{" "}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#006FF9] to-[#2D62FF]">
                        CourseMaster
                    </span>
                </h1>

                {/* Persuasive, Benefit-Driven Subtext */}
                <p className="text-base sm:text-lg md:text-xl text-[#677489] dark:text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
                    Industry-crafted curricula designed for developers, designers, and tech leaders. Master real-world projects with interactive quizzes and personal feedback.
                </p>

                {/* Clear Path to Action */}
                <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2">
                    <Link
                        to="/courses"
                        className="btn btn-primary btn-lg px-8 text-base font-bold gap-2 group w-full sm:w-auto rounded-full"
                    >
                        <BookOpen className="w-5 h-5" />
                        <span>Explore All Courses</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    {!isAuthenticated && (
                        <Link
                            to="/register"
                            className="btn btn-outline btn-lg px-8 text-base font-bold w-full sm:w-auto rounded-full"
                        >
                            Get Started Free
                        </Link>
                    )}
                </div>

                {/* Trust Signals & Social Proof Bar */}
                <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#677489] dark:text-slate-400 font-medium">
                    <div className="flex items-center gap-1.5">
                        <ShieldCheck className="w-4 h-4 text-[#006FF9]" />
                        <span>Verified 2026 Curricula</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="flex text-amber-500">
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                            <Star className="w-3.5 h-3.5 fill-amber-500" />
                        </div>
                        <span className="font-bold text-[#111729] dark:text-white">4.9/5 Rating</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Users className="w-4 h-4 text-[#006FF9]" />
                        <span>10,000+ Enrolled Learners</span>
                    </div>
                </div>

                {/* Trust Signals Grid Cards */}
                <div className="pt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-base-300 text-left">
                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#111729] border border-base-300 shadow-xs">
                        <div className="w-10 h-10 rounded-full bg-[#006FF9]/10 text-[#006FF9] flex items-center justify-center shrink-0">
                            <BookOpen className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-[#111729] dark:text-white">Product-Focused</p>
                            <p className="text-xs text-[#677489] dark:text-slate-400">Practical modules & code</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#111729] border border-base-300 shadow-xs">
                        <div className="w-10 h-10 rounded-full bg-[#2D62FF]/10 text-[#2D62FF] flex items-center justify-center shrink-0">
                            <Users className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-[#111729] dark:text-white">Expert Mentors</p>
                            <p className="text-xs text-[#677489] dark:text-slate-400">Direct instructor guidance</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white dark:bg-[#111729] border border-base-300 shadow-xs">
                        <div className="w-10 h-10 rounded-full bg-[#006FF9]/10 text-[#006FF9] flex items-center justify-center shrink-0">
                            <Award className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-[#111729] dark:text-white">Verified Certificate</p>
                            <p className="text-xs text-[#677489] dark:text-slate-400">Showcase on your resume</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
