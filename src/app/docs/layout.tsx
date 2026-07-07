import { DocsSidebar } from "@/components/docs/sidebar";
import { DocsHeader } from "@/components/docs/header";

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <DocsHeader />
      <div className="flex flex-1 mx-auto w-full max-w-[1440px]">
        <aside className="sticky top-14 z-30 hidden h-[calc(100vh-3.5rem)] w-72 shrink-0 overflow-y-auto border-r md:block">
          <DocsSidebar />
        </aside>
        <main className="flex-1 overflow-hidden px-6 md:px-12 py-10 w-full flex justify-center">
          <div className="w-full max-w-[720px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
