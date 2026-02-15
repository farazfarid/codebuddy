"use client";

import { ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";

const languages = [
    { value: "javascript", label: "JavaScript" },
    { value: "typescript", label: "TypeScript" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
    { value: "cpp", label: "C++" },
    { value: "go", label: "Go" },
    { value: "rust", label: "Rust" },
    { value: "sql", label: "SQL" },
    { value: "html", label: "HTML" },
    { value: "css", label: "CSS" },
];

interface LanguageSelectorProps {
    value: string;
    onChange: (value: string) => void;
    className?: string;
}

export function LanguageSelector({ value, onChange, className }: LanguageSelectorProps) {
    return (
        <div className="relative w-full sm:w-auto">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={cn(
                    "w-full min-w-0 appearance-none bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-neutral-200 rounded-md px-3 sm:px-4 py-2 pr-8 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors",
                    className
                )}
            >
                {languages.map((language) => (
                    <option key={language.value} value={language.value}>
                        {language.label}
                    </option>
                ))}
            </select>
            <ChevronsUpDown className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-500 pointer-events-none" />
        </div>
    );
}
