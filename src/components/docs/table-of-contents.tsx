"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Heading = {
  id: string;
  text: string;
  level: number;
};

export function TableOfContents() {
  const [headings, setHeadings] = useState<Heading[]>([]);

  useEffect(() => {
    // A simple script to find all h2s and h3s on the page and assign them IDs if they don't have one
    const elements = Array.from(document.querySelectorAll("main h2, main h3"));
    
    const parsedHeadings: Heading[] = elements.map((elem) => {
      if (!elem.id) {
        elem.id = elem.textContent?.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]/g, "") || "";
      }
      return {
        id: elem.id,
        text: elem.textContent || "",
        level: Number(elem.tagName.charAt(1)),
      };
    });

    setHeadings(parsedHeadings);
  }, []);

  if (headings.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <p className="font-medium text-foreground">On this page</p>
      <ul className="m-0 list-none space-y-2 text-muted-foreground">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={`pt-1 ${heading.level === 3 ? "pl-4" : ""}`}
          >
            <Link
              href={`#${heading.id}`}
              className="inline-block no-underline transition-colors hover:text-foreground text-xs"
              onClick={(e) => {
                e.preventDefault();
                document.querySelector(`#${heading.id}`)?.scrollIntoView({
                  behavior: "smooth",
                });
                history.pushState(null, "", `#${heading.id}`);
              }}
            >
              {heading.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
