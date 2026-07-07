import { notFound } from "next/navigation";
import { docsData } from "@/content/docs";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { FeedbackWidget } from "@/components/docs/feedback-widget";

export async function generateMetadata({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.join("/");
  const doc = docsData[path];
  
  if (!doc) {
    return { title: "Not Found - Finance Buddy Docs" };
  }
  
  return {
    title: `${doc.title} - Finance Buddy Docs`,
    description: doc.description,
  };
}

export default async function DocPage({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const path = slug.join("/");
  const doc = docsData[path];

  if (!doc) {
    notFound();
  }

  return (
    <div className="flex xl:gap-10">
      <div className="mx-auto w-full min-w-0">
        <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
          <Link href="/docs" className="hover:text-foreground">Docs</Link>
          <ChevronRight className="h-4 w-4" />
          {slug.map((segment, index) => (
            <div key={index} className="flex items-center space-x-1">
              <span className={index === slug.length - 1 ? "text-foreground font-medium" : "hover:text-foreground capitalize"}>
                {segment.replace("-", " ")}
              </span>
              {index < slug.length - 1 && <ChevronRight className="h-4 w-4" />}
            </div>
          ))}
        </div>
        
        <div className="space-y-4 mb-10 pb-6 border-b border-border/50">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-foreground">
            {doc.title}
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            {doc.description}
          </p>
          <div className="text-sm text-muted-foreground pt-2 font-medium">
            Last updated July 8, 2026
          </div>
        </div>

        <div className="pb-12 text-base leading-7">
          {doc.content}
        </div>

        {doc.relatedTopics && doc.relatedTopics.length > 0 && (
          <div className="py-10 border-t border-border/50">
            <h2 className="text-xl font-bold mb-6">Related Topics</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              {doc.relatedTopics.map((topic, i) => (
                <Link
                  key={i}
                  href={topic.href}
                  className="group relative rounded-xl border border-border/60 bg-card p-6 shadow-sm hover:shadow-md hover:border-primary/40 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <h3 className="font-semibold text-foreground flex items-center justify-between">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-3 flex items-center text-primary/80 group-hover:text-primary font-medium transition-colors">
                    Read more <span className="ml-1 group-hover:translate-x-1 transition-transform">→</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <FeedbackWidget />
        
        <div className="py-8 mt-4 border-t border-border/50 text-sm text-muted-foreground flex justify-between">
          <span>&copy; {new Date().getFullYear()} OriginLabs.</span>
          <a href="https://github.com/your-repo/edit/main/docs" target="_blank" rel="noreferrer" className="hover:underline">
            Edit this page on GitHub
          </a>
        </div>
      </div>
      
      <div className="hidden xl:block text-sm">
        <div className="sticky top-20 -mt-10 pt-4 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <TableOfContents />
        </div>
      </div>
    </div>
  );
}
