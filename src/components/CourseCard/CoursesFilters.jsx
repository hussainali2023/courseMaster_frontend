import { Search, Filter, ArrowUpDown } from "lucide-react";

export default function CoursesFilters({
    search, setSearch,
    sort, setSort,
    category, setCategory,
    tags, setTags,
    onSearchSubmit
}) {
    return (
        <div className="bg-base-100 p-5 rounded-2xl border border-base-300 shadow-xs space-y-4 mb-8">
            <div className="flex flex-col lg:flex-row gap-4 justify-between items-center">
                {/* Search Bar */}
                <form onSubmit={onSearchSubmit} className="relative w-full lg:max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#677489]" />
                    <input
                        className="input pl-11 pr-24 w-full rounded-full border-base-300 focus:border-[#006FF9] text-sm"
                        placeholder="Search courses or instructor..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button type="submit" className="btn btn-primary btn-sm absolute right-1.5 top-1/2 -translate-y-1/2 px-4 rounded-full font-bold">
                        Search
                    </button>
                </form>

                {/* Filters row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 w-full lg:w-auto">
                    {/* Sort */}
                    <div className="relative">
                        <select
                            className="select select-sm w-full rounded-full border-base-300 text-xs font-medium"
                            value={sort}
                            onChange={(e) => setSort(e.target.value)}
                        >
                            <option value="">Sort by Price</option>
                            <option value="price_asc">Price: Low to High</option>
                            <option value="price_desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Category */}
                    <input
                        className="input input-sm w-full rounded-full border-base-300 text-xs font-medium px-4"
                        placeholder="Category (e.g. web, mobile)"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    />

                    {/* Tags */}
                    <input
                        className="input input-sm w-full rounded-full border-base-300 text-xs font-medium px-4"
                        placeholder="Tags (e.g. react, node)"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                    />
                </div>
            </div>
        </div>
    );
}
