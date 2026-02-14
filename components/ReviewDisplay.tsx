"use client";

import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { CodeBlock } from "@/components/CodeBlock";
import { cn } from "@/lib/utils";

interface Issue {
    line: number;
    message: string;
    severity: "low" | "medium" | "high";
}

interface ReviewData {
    issues: Issue[];
    refactoredCode: string;
    explanation: string;
}

interface ReviewDisplayProps {
    review: ReviewData;
    language: string;
}

export function ReviewDisplay({ review, language }: ReviewDisplayProps) {
    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case "high":
                return <XCircle className="w-5 h-5 text-red-500" />;
            case "medium":
                return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
            case "low":
                return <Info className="w-5 h-5 text-blue-500" />;
            default:
                return <CheckCircle className="w-5 h-5 text-green-500" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case "high":
                return "border-red-200 dark:border-red-500/50 bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-200";
            case "medium":
                return "border-yellow-200 dark:border-yellow-500/50 bg-yellow-50 dark:bg-yellow-500/10 text-yellow-700 dark:text-yellow-200";
            case "low":
                return "border-blue-200 dark:border-blue-500/50 bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-200";
            default:
                return "border-green-200 dark:border-green-500/50 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-200";
        }
    };

    return (
        <div className="flex flex-col gap-8 w-full max-w-5xl mx-auto p-4 transition-colors">
            {/* Issues Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-4"
            >
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Analysis Results</h2>
                <div className="space-y-3">
                    {review.issues.map((issue, index) => (
                        <div
                            key={index}
                            className={cn(
                                "flex items-start gap-4 p-4 rounded-lg border transition-colors",
                                getSeverityColor(issue.severity)
                            )}
                        >
                            {getSeverityIcon(issue.severity)}
                            <div>
                                <span className="font-mono text-xs font-bold uppercase tracking-wider opacity-70">
                                    Line {issue.line} • {issue.severity} Priority
                                </span>
                                <p className="mt-1 text-sm font-medium">{issue.message}</p>
                            </div>
                        </div>
                    ))}
                    {review.issues.length === 0 && (
                        <div className="flex items-center gap-4 p-4 rounded-lg border border-green-200 dark:border-green-500/50 bg-green-50 dark:bg-green-500/10 text-green-700 dark:text-green-200 transition-colors">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <p className="font-medium">No issues found! Great job.</p>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Explanation Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="space-y-2"
            >
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Overview</h3>
                <div className="p-4 rounded-lg bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 leading-relaxed transition-colors">
                    {review.explanation}
                </div>
            </motion.div>

            {/* Refactored Code Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="space-y-2"
            >
                <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-200">Suggested Improvements</h3>
                <div className="border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden transition-colors">
                    <CodeBlock code={review.refactoredCode} language={language} className="bg-white dark:bg-neutral-950" />
                </div>
            </motion.div>
        </div>
    );
}
