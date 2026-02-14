"use client";

import { cn } from "@/lib/utils";
import * as React from "react";
import Editor from "react-simple-code-editor";
import Prism from "prismjs";
import "prismjs/components/prism-clike";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-css";
import "prismjs/components/prism-sql";
import "prismjs/components/prism-markup"; // HTML

interface CodeInputProps {
    value: string;
    onChange: (value: string) => void;
    language: string;
    label?: string;
    apiKey?: string;
    onApiKeyChange?: (value: string) => void;
    className?: string;
    placeholder?: string;
}

export function CodeInput({
    value,
    onChange,
    language,
    label,
    apiKey,
    onApiKeyChange,
    className,
    placeholder,
}: CodeInputProps) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    const highlight = (code: string) => {
        if (!mounted) return code;

        let grammar = Prism.languages[language];
        if (!grammar) {
            // Fallback or specific mapping
            if (language === 'typescript') grammar = Prism.languages.typescript;
            else if (language === 'javascript') grammar = Prism.languages.javascript;
            else if (language === 'python') grammar = Prism.languages.python;
            else if (language === 'java') grammar = Prism.languages.java;
            else if (language === 'css') grammar = Prism.languages.css;
            else if (language === 'html') grammar = Prism.languages.markup;
            else if (language === 'sql') grammar = Prism.languages.sql;
            else grammar = Prism.languages.clike; // Default
        }

        return Prism.highlight(code, grammar || Prism.languages.clike, language);
    };

    return (
        <div className="flex flex-col gap-2 w-full h-full relative">
            <div className="flex items-center justify-between z-10">
                {label && (
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
                        {label}
                    </label>
                )}
                {onApiKeyChange && (
                    <input
                        type="password"
                        placeholder="Enter OpenAI API Key"
                        value={apiKey || ""}
                        onChange={(e) => onApiKeyChange(e.target.value)}
                        className="bg-transparent border border-neutral-200 dark:border-neutral-800 rounded px-2 py-1 text-xs text-neutral-600 dark:text-neutral-400 focus:outline-none focus:border-blue-500 w-48 transition-colors"
                    />
                )}
            </div>

            <div className={cn(
                "relative flex-1 rounded-md border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden text-sm font-mono transition-colors focus-within:ring-2 focus-within:ring-blue-500",
                className
            )}>
                <Editor
                    value={value}
                    onValueChange={onChange}
                    highlight={highlight}
                    padding={12}
                    placeholder={placeholder}
                    className="font-mono min-h-full"
                    textareaClassName="focus:outline-none"
                    style={{
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                        fontSize: 14,
                        minHeight: "100%",
                        backgroundColor: "transparent",
                    }}
                />
            </div>
        </div>
    );
}
