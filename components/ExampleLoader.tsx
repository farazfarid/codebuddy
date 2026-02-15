"use client";

import { Lightbulb } from "lucide-react";
import * as React from "react";

import { cn } from "@/lib/utils";

interface ExampleLoaderProps {
    onLoad: (code: string, language: string) => void;
    className?: string;
}

const EXAMPLE_CODE = `// Vulnerable and Unoptimized Code Implementation
function processUserData(users) {
  let results = [];
  
  // O(n^2) loop - Performance Issue
  for (let i = 0; i < users.length; i++) {
    for (let j = 0; j < users.length; j++) {
      if (users[i].id === users[j].id) {
        console.log("Duplicate found");
      }
    }
    
    // Security Issue: Direct SQL Injection risk if input was used in query
    // const query = "SELECT * FROM data WHERE id = " + users[i].id;
    
    results.push(users[i]);
  }
  
  return results;
}`;

export function ExampleLoader({ onLoad, className }: ExampleLoaderProps) {
    return (
        <button
            onClick={() => onLoad(EXAMPLE_CODE, "javascript")}
            aria-label="Load example code"
            title="Load Example"
            className={cn(
                "flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400 hover:underline transition-colors whitespace-nowrap",
                className
            )}
        >
            <Lightbulb className="w-3 h-3" />
            <span className="hidden sm:inline">Load Example</span>
        </button>
    );
}
