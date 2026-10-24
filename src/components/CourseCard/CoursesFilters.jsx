import { Search, SlidersHorizontal, RotateCcw } from "lucide-react";

export default function CoursesFilters({
    search, setSearch,
    sort, setSort,
    category, setCategory,
    tags, setTags,
    onSearchSubmit
}) {
    const hasActiveFilters = Boolean(search || sort || category || tags);

    const handleReset = () => {
        setSearch("");
        setSort("");
        setCategory("");
        setTags("");
    };

    return (
        <div className="bg-base-100 p-4 sm:p-5 rounded-3xl border border-base-300 shadow-xs space-y-4 mb-8 transition-colors">
            <div className="flex flex-col lg:flex-row gap-3.5 justify-between items-center">
                {/* Search Bar */}
                <form onSubmit={onSearchSubmit} className="relative w-full lg:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#677489]" />
                    <input
                        className="input pl-11 pr-24 w-full rounded-full border-base-300 focus:border-[#006FF9] text-sm bg-base-100 placeholder:text-[#677489]"
                        placeholder="Search courses or instructor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button 
                        type="submit" 
                        className="btn btn-primary btn-sm absolute right-1.5 top-1/2 -translate-y-1/2 px-4 rounded-full font-bold shadow-xs"
                    >
                        Search
                    </button>
                </form>

                {/* Filters row */}
                <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 w-full lg:w-auto">
                    {/* Sort */}
                    <div className="w-full sm:w-auto">
                        <select
                            className="select select-sm w-full sm:w-44 rounded-full border-base-300 text-xs font-semibold bg-base-100"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="">Sort by Price</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Category */}
                    <div className="w-full sm:w-auto">
                        <input
                            className="input input-sm w-full sm:w-40 rounded-full border-base-300 text-xs font-medium px-4 bg-base-100 placeholder:text-[#677489]"
                            placeholder="Category..."
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        />
                    </div>

                    {/* Tags */}
                    <div className="w-full sm:w-auto">
                        <input
                            className="input input-sm w-full sm:w-36 rounded-full border-base-300 text-xs font-medium px-4 bg-base-100 placeholder:text-[#677489]"
                            placeholder="Tag..."
                            value={tags}
                            onChange={(e) => setTags(e.target.value)}
                        />
                    </div>

                    {hasActiveFilters && (
                        <button
                            type="button"
                            onClick={handleReset}
                            title="Reset all filters"
                            className="btn btn-ghost btn-sm rounded-full px-3 text-[#677489] hover:text-[#006FF9] gap-1 text-xs shrink-0"
                        >
                            <RotateCcw className="w-3.5 h-3.5" />
                            <span className="hidden sm:inline">Reset</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
