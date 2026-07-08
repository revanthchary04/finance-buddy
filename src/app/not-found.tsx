import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground overflow-hidden relative">
      {/* Background animated elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[20%] left-[20%] text-9xl font-black text-muted/10 transform -rotate-12 animate-[float_8s_ease-in-out_infinite]">
          4
        </div>
        <div className="absolute top-[40%] right-[20%] text-9xl font-black text-muted/10 transform rotate-12 animate-[float_10s_ease-in-out_infinite_reverse]">
          0
        </div>
        <div className="absolute bottom-[20%] left-[40%] text-9xl font-black text-muted/10 transform rotate-6 animate-[float_9s_ease-in-out_infinite]">
          4
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center space-y-6 px-4">
        {/* Branding */}
        <div className="flex items-center gap-2 mb-8 animate-fade-in">
          <Image src="/logo.png" alt="Finance Buddy Logo" width={40} height={40} className="object-contain" />
          <span className="text-xl font-bold tracking-tight">Finance Buddy</span>
        </div>

        {/* 404 Hero */}
        <h1 className="text-8xl md:text-9xl font-black tracking-tighter bg-gradient-to-br from-primary via-primary/80 to-primary/30 bg-clip-text text-transparent animate-in zoom-in duration-500">
          404
        </h1>
        
        <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
          <h2 className="text-2xl md:text-3xl font-semibold tracking-tight">
            Page Not Found
          </h2>
          <p className="text-muted-foreground text-lg max-w-[500px]">
            Looks like this page went off-budget. Let's get you back on track.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300 fill-mode-both">
          <Button asChild size="lg" className="w-full sm:w-auto px-8">
            <Link href="/dashboard">
              Go to Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto px-8 bg-background">
            <Link href="/">
              Go Home
            </Link>
          </Button>
        </div>
      </div>
      
      {/* Inline styles for the float animation */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes float {
            0% { transform: translateY(0px) rotate(var(--tw-rotate)); }
            50% { transform: translateY(-20px) rotate(calc(var(--tw-rotate) + 5deg)); }
            100% { transform: translateY(0px) rotate(var(--tw-rotate)); }
          }
        `
      }} />
    </div>
  );
}
