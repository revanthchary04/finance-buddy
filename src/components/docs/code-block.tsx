"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";

export function CodeBlock({ children }: { children: React.ReactNode }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    // Extract text content from children if possible, or just copy the raw string if passed directly
    let textToCopy = "";
    if (typeof children === "string") {
      textToCopy = children;
    } else if (Array.isArray(children)) {
      textToCopy = children.map(c => typeof c === 'string' ? c : '').join('');
    } else if (children && typeof children === 'object' && 'props' in children) {
      // @ts-ignore
      textToCopy = children.props.children || "";
    }

    // Fallback if extracting fails, we'll try to use a ref in a real implementation, 
    // but for the static strings we pass in data.tsx, extracting text works well enough.
    // If it's a complex node, we just fallback to the text inside the div.
    
    // We can also extract directly from the DOM using an event target if needed, but since we control data.tsx,
    // we'll make sure to pass plain strings to CodeBlock.
    
    navigator.clipboard.writeText(textToCopy.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group rounded-lg bg-[#0d1117] border border-border overflow-hidden my-6 shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-border/50">
        <span className="text-xs text-muted-foreground font-mono">Formula</span>
        <button
          onClick={handleCopy}
          className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md hover:bg-white/10"
          aria-label="Copy code"
        >
          {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        </button>
      </div>
      <div className="p-4 overflow-x-auto">
        <pre className="text-sm font-mono text-gray-300 leading-relaxed">
          <code>{children}</code>
        </pre>
      </div>
    </div>
  );
}
