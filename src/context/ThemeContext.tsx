import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
    const [theme, setTheme] = useState<Theme>(() => {
        // Check localStorage first
        const savedTheme = localStorage.getItem("theme") as Theme;
        if (savedTheme) return savedTheme;

        // Check system preference
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
            return "dark";
        }

        // Default to light
        return "light";
    });

    useEffect(() => {
        const root = document.documentElement;

        // For Tailwind v4, we need to ensure the class is added/removed
        if (theme === "dark") {
            root.classList.add("dark");
            root.setAttribute("data-theme", "dark");
            console.log("Added dark class to HTML", root.classList);
        } else {
            root.classList.remove("dark");
            root.setAttribute("data-theme", "light");
            console.log("Removed dark class from HTML", root.classList);
        }

        localStorage.setItem("theme", theme);

        // Force a re-render of any components that depend on theme
        // This helps with Tailwind v4's CSS cascade
        document.body.style.display = 'none';
        document.body.offsetHeight; // Trigger reflow
        document.body.style.display = '';
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prev) => {
            const newTheme = prev === "light" ? "dark" : "light";
            console.log("Toggling to:", newTheme);
            return newTheme;
        });
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) throw new Error("useTheme must be used within a ThemeProvider");
    return context;
};