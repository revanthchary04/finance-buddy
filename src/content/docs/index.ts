import * as React from "react";

export type DocPage = {
  title: string;
  description: string;
  content: React.ReactNode;
  relatedTopics: { title: string; href: string }[];
};

export { docsData } from "./data";
