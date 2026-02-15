"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Code2, Loader2, Play, Sparkles, Languages, MessageSquareCode } from "lucide-react";

import { CodeInput } from "@/components/CodeInput";
import { LanguageSelector } from "@/components/LanguageSelector";
import { ReviewDisplay } from "@/components/ReviewDisplay";
import { ExampleLoader } from "@/components/ExampleLoader";
import { CodeTranslator } from "@/components/CodeTranslator";
import { cn } from "@/lib/utils";
import Image from "next/image";

export default function Home() {
  const [appMode, setAppMode] = useState<"review" | "translate">("review");
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [apiKey, setApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [review, setReview] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem("openai_api_key");
    if (savedKey) setApiKey(savedKey);
  }, []);

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    localStorage.setItem("openai_api_key", value);
  };

  const handleLoadExample = (exampleCode: string, exampleLanguage: string) => {
    setCode(exampleCode);
    setLanguage(exampleLanguage);
  };

  const handleReview = async () => {
    if (!code.trim()) return;
    if (!apiKey) {
      setError("Please enter your OpenAI API Key.");
      return;
    }

    setLoading(true);
    setError(null);
    setReview(null);

    try {
      const response = await fetch("/api/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, language, apiKey }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch review");
      }

      const feedback = typeof data === "string" ? JSON.parse(data) : data;
      setReview(feedback);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-200 p-4 sm:p-6 lg:p-12 font-sans selection:bg-blue-500/30 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">

        {/* Header */}
        <div className="flex flex-col items-center text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 sm:gap-3"
          >
            <Image src="/icon.png" alt="Logo" width={40} height={40} className="sm:w-12 sm:h-12" />
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              CodeBuddy
            </h1>
          </motion.div>
          <p className="text-neutral-600 dark:text-neutral-400 max-w-lg text-base sm:text-lg">
            Your AI-powered daily coding companion.
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex justify-center">
          <div className="flex w-full max-w-md items-stretch sm:items-center sm:w-auto p-1 bg-neutral-200 dark:bg-neutral-900 rounded-lg gap-1 sm:gap-0">
            <button
              onClick={() => setAppMode("review")}
              className={cn(
                "flex-1 sm:flex-initial justify-center flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                appMode === "review"
                  ? "bg-white dark:bg-neutral-800 text-blue-600 dark:text-blue-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
            >
              <MessageSquareCode className="w-4 h-4" />
              Code Review
            </button>
            <button
              onClick={() => setAppMode("translate")}
              className={cn(
                "flex-1 sm:flex-initial justify-center flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                appMode === "translate"
                  ? "bg-white dark:bg-neutral-800 text-purple-600 dark:text-purple-400 shadow-sm"
                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
              )}
            >
              <Languages className="w-4 h-4" />
              Code Translator
            </button>
          </div>
        </div>

        {/* API Key Input (Common) */}
        <div className="flex justify-center">
          <div className="flex flex-col items-center gap-2 w-full max-w-sm">
            <label className="text-xs font-semibold uppercase tracking-wider text-neutral-500">OpenAI API Key</label>
            <input
              type="password"
              placeholder="sk-..."
              value={apiKey}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors font-mono"
            />
          </div>
        </div>


        {/* MAIN CONTENT AREA */}
        <AnimatePresence mode="wait">
          {appMode === "review" ? (
            <motion.div
              key="review"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 min-h-0 lg:min-h-[560px]"
            >

              {/* Input Section */}
              <div className="flex flex-col gap-4 h-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400 min-w-0">
                    <Code2 className="w-5 h-5" />
                    <span className="font-medium text-sm sm:text-base">Source Code</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <ExampleLoader onLoad={handleLoadExample} />
                    <LanguageSelector value={language} onChange={setLanguage} className="w-[140px] sm:w-[200px]" />
                  </div>
                </div>

                <div className="relative flex-1 min-h-[320px] lg:min-h-0 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/50 shadow-sm overflow-hidden group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
                  <CodeInput
                    value={code}
                    onChange={setCode}
                    language={language}
                    placeholder="// Paste your code here..."
                    className="w-full h-full bg-transparent border-none focus:ring-0 resize-none font-mono leading-relaxed text-neutral-900 dark:text-neutral-200 placeholder:text-neutral-400 dark:placeholder:text-neutral-600"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={handleReview}
                    disabled={loading || !code.trim()}
                    className={cn(
                      "w-full sm:w-auto justify-center flex items-center gap-2 px-5 sm:px-6 py-3 rounded-full font-semibold transition-all shadow-lg active:scale-95",
                      loading || !code.trim()
                        ? "bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-500 cursor-not-allowed"
                        : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Review Code
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Results Section */}
              <div className="flex flex-col gap-4 h-full overflow-hidden">
                <div className="flex items-center gap-2 text-neutral-600 dark:text-neutral-400">
                  <Play className="w-5 h-5" />
                  <span className="font-medium">AI Feedback</span>
                </div>

                <div className="flex-1 min-h-[320px] lg:min-h-0 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white/30 dark:bg-neutral-900/30 overflow-y-auto custom-scrollbar">
                  <AnimatePresence mode="wait">
                    {loading ? (
                      <motion.div
                        key="loading"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="h-full flex flex-col items-center justify-center text-neutral-500 gap-4"
                      >
                        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
                        <p className="animate-pulse">Analyzing logic...</p>
                      </motion.div>
                    ) : review ? (
                      <ReviewDisplay review={review} language={language} />
                    ) : error ? (
                      <motion.div
                        key="error"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-red-500 dark:text-red-400 gap-4 p-8 text-center"
                      >
                        <div className="p-3 bg-red-500/10 rounded-full">
                          <Loader2 className="w-8 h-8" />
                        </div>
                        <p>{error}</p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="empty"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="h-full flex flex-col items-center justify-center text-neutral-400 dark:text-neutral-600 gap-4 p-8 text-center"
                      >
                        <div className="w-16 h-16 rounded-2xl bg-neutral-200/50 dark:bg-neutral-800/50 flex items-center justify-center">
                          <Code2 className="w-8 h-8 opacity-50" />
                        </div>
                        <p>Results will appear here</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>

          ) : (
            <motion.div
              key="translate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="min-h-0 lg:min-h-[560px]"
            >
              <CodeTranslator apiKey={apiKey} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </main>
  );
}
