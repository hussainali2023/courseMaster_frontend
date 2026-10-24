import { useTheme } from "../../contexts/ThemeContext";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center border border-base-300 bg-base-100 hover:bg-base-200 text-base-content transition-all shadow-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#006FF9]"
            aria-label="Toggle theme"
            title={theme === "light" ? "Switch to dark mode" : "Switch to light mode"}
            type="button"
        >
            {theme === "light" ? (
                <Moon className="w-4 h-4 text-[#111729] hover:text-[#006FF9] transition-colors" />
            ) : (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400/20 hover:text-amber-300 transition-colors" />
            )}
        </button>
    );
}
