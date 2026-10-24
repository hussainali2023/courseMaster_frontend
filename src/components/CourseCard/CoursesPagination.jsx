import { ChevronLeft, ChevronRight } from "lucide-react";

export default function CoursesPagination({ page, totalPages, setPage }) {
    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-center gap-3 pt-6">
            <button
                className="btn btn-sm btn-outline rounded-full px-4 gap-1 font-semibold disabled:opacity-40"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                aria-label="Previous Page"
            >
                <ChevronLeft className="w-4 h-4" />
                <span>Previous</span>
            </button>

            <span className="px-4 py-1.5 rounded-full bg-base-200 border border-base-300 text-xs font-bold text-[#111729] dark:text-white">
                Page {page} of {totalPages}
            </span>

            <button
                className="btn btn-sm btn-outline rounded-full px-4 gap-1 font-semibold disabled:opacity-40"
                disabled={page === totalPages}
                onClick={() => setPage(page + 1)}
                aria-label="Next Page"
            >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </div>
    );
}
