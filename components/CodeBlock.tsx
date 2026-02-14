"use client";

import { useTheme } from "next-themes";
import { Highlight, themes, type Language } from "prism-react-renderer";
import * as React from "react";

import { cn } from "@/lib/utils";

interface CodeBlockProps {
    code: string;
    language: string;
    className?: string;
}

export function CodeBlock({ code, language, className }: CodeBlockProps) {
    const { theme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className={cn("p-4 rounded-md overflow-x-auto text-sm font-mono bg-neutral-100 dark:bg-neutral-900", className)} />;
    }

    return (
        <Highlight
            theme={theme === "light" ? themes.vsLight : themes.vsDark}
            code={code}
            language={language as Language}
        >
            {({ className: _className, style, tokens, getLineProps, getTokenProps }) => (
                <pre
                    className={cn("p-4 rounded-md overflow-x-auto text-sm font-mono", className)}
                    style={style}
                >
                    {tokens.map((line, i) => (
                        <div key={i} {...getLineProps({ line })}>
                            <span className="inline-block w-8 text-neutral-400 dark:text-neutral-600 select-none mr-4 text-right">
                                {i + 1}
                            </span>
                            {line.map((token, key) => (
                                <span key={key} {...getTokenProps({ token })} />
                            ))}
                        </div>
                    ))}
                </pre>
            )}
        </Highlight>
    );
}
