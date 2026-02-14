"use client";

import { useState } from "react";
import { ArrowRight, Languages, Loader2, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { CodeInput } from "@/components/CodeInput";
import { LanguageSelector } from "@/components/LanguageSelector";
import { cn } from "@/lib/utils";

interface CodeTranslatorProps {
    apiKey: string;
}

export function CodeTranslator({ apiKey }: CodeTranslatorProps) {
    const [sourceCode, setSourceCode] = useState("");
    const [sourceLanguage, setSourceLanguage] = useState("javascript");
    const [targetLanguage, setTargetLanguage] = useState("python");
    const [translatedCode, setTranslatedCode] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleTranslate = async () => {
        if (!sourceCode.trim()) return;
        if (!apiKey) {
            setError("Please enter your OpenAI API Key above.");
            return;
        }

        setLoading(true);
        setError(null);
        setTranslatedCode("");

        try {
            const response = await fetch("/api/translate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    code: sourceCode,
                    sourceLanguage,
                    targetLanguage,
                    apiKey,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Failed to translate code");
            }

            setTranslatedCode(data.translatedCode);
        } catch (err: any) {
            setError(err.message || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col gap-6 h-full">
            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white/50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <LanguageSelector value={sourceLanguage} onChange={setSourceLanguage} />
                    <ArrowRight className="w-5 h-5 text-neutral-400" />
                    <LanguageSelector value={targetLanguage} onChange={setTargetLanguage} />
                </div>

                <button
                    onClick={handleTranslate}
                    disabled={loading || !sourceCode.trim()}
                    className={cn(
                        "flex items-center gap-2 px-6 py-2 rounded-lg font-semibold transition-all shadow-md active:scale-95 w-full md:w-auto justify-center",
                        loading || !sourceCode.trim()
                            ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                    )}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            Translating...
                        </>
                    ) : (
                        <>
                            <Languages className="w-4 h-4" />
                            Translate
                        </>
                    )}
                </button>
            </div>

            {/* ERROR MESSAGE */}
            {error && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm border border-red-200 dark:border-red-800"
                >
                    {error}
                </motion.div>
            )}

            {/* Editors Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
                {/* Source Input */}
                <div className="flex flex-col gap-2 h-full">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 pl-1">
                        Source Code ({sourceLanguage})
                    </label>
                    <div className="relative flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                        <CodeInput
                            value={sourceCode}
                            onChange={setSourceCode}
                            language={sourceLanguage}
                            placeholder={`// Paste your ${sourceLanguage} code here...`}
                            className="w-full h-full bg-transparent border-none focus:ring-0 resize-none font-mono leading-relaxed text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                        />
                    </div>
                </div>

                {/* Target Output */}
                <div className="flex flex-col gap-2 h-full">
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 pl-1">
                        Translated Code ({targetLanguage})
                    </label>
                    <div className="relative flex-1 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 shadow-sm overflow-hidden transition-all">
                        {loading ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/50 dark:bg-neutral-900/50 backdrop-blur-sm z-10 gap-4">
                                <Loader2 className="w-12 h-12 text-blue-500 animate-spin" />
                                <span className="text-sm font-medium text-neutral-500 animate-pulse">
                                    AI is translating...
                                </span>
                            </div>
                        ) : null}

                        <CodeInput
                            value={translatedCode}
                            onChange={() => { }} // Read-only effectively
                            language={targetLanguage}
                            placeholder={loading ? "" : "// Translation will appear here..."}
                            className="w-full h-full bg-transparent border-none focus:ring-0 resize-none font-mono leading-relaxed text-neutral-900 dark:text-neutral-200"
                        />

                        {!translatedCode && !loading && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <div className="text-neutral-300 dark:text-neutral-700 flex flex-col items-center gap-2">
                                    <Sparkles className="w-12 h-12 opacity-20" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
