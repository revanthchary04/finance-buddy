"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding } from "@/features/auth/actions/onboarding.actions";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { ChevronRight, ChevronLeft, Upload } from "lucide-react";

export function OnboardingModal({ 
  profile, 
  user 
}: { 
  profile: any; 
  user: any; 
}) {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(true);

  const [formData, setFormData] = useState({
    full_name: profile?.full_name || "",
    phone_number: profile?.phone_number || "",
    designation: profile?.designation || "",
    company: profile?.company || "",
    avatar: null as File | null
  });
  
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNext = () => setStep(s => Math.min(s + 1, totalSteps));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));

  const handleFinish = () => {
    startTransition(async () => {
      const data = new FormData();
      data.append("full_name", formData.full_name);
      data.append("phone_number", formData.phone_number);
      data.append("designation", formData.designation);
      data.append("company", formData.company);
      if (formData.avatar) {
        data.append("avatar", formData.avatar);
      }

      const result = await completeOnboarding(data);
      if (result.error) {
        toast.error(result.error);
        return;
      }

      setIsOpen(false);
      toast.success("Welcome to Finance Buddy! 🎉", { duration: 3000 });

      // Fire confetti
      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#26ccff', '#a25afd', '#ff5e7e', '#88ff5a', '#fcff42', '#ffa62d', '#ff36ff']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, avatar: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/90 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg rounded-2xl border bg-card p-0 shadow-2xl relative overflow-hidden flex flex-col min-h-[400px]">
        {/* Background gradient hint */}
        <div className="absolute top-0 right-0 -mt-16 -mr-16 h-40 w-40 rounded-full bg-primary/10 blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-16 -ml-16 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none"></div>

        {/* Progress Bar */}
        <div className="h-1.5 w-full bg-muted">
          <div 
            className="h-full bg-primary transition-all duration-500 ease-in-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        <div className="flex-1 p-8 flex flex-col relative z-10">
          <div className="text-sm font-medium text-muted-foreground mb-6">
            Step {step} of {totalSteps}
          </div>

          <div className="flex-1 flex flex-col justify-center">
            {/* Step 1 */}
            {step === 1 && (
              <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mx-auto h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl">👋</span>
                </div>
                <h2 className="text-3xl font-extrabold tracking-tight">
                  Welcome to Finance Buddy! 🎉
                </h2>
                <p className="text-muted-foreground text-lg max-w-sm mx-auto">
                  Let&apos;s set up your profile in a few quick steps to get you ready.
                </p>
                <div className="pt-4">
                  <Button size="lg" onClick={handleNext} className="w-full md:w-auto">
                    Get Started <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">What&apos;s your full name?</h2>
                  <p className="text-muted-foreground">This is how we will address you.</p>
                </div>
                <div className="space-y-4">
                  <Input 
                    autoFocus
                    value={formData.full_name}
                    onChange={e => setFormData({...formData, full_name: e.target.value})}
                    placeholder="e.g. John Doe"
                    className="text-lg py-6"
                  />
                </div>
                <div className="flex justify-between pt-8">
                  <Button variant="ghost" onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext} disabled={!formData.full_name.trim()}>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">How can we reach you?</h2>
                  <p className="text-muted-foreground">Optional, but helpful for account security.</p>
                </div>
                <div className="space-y-4">
                  <Input 
                    autoFocus
                    value={formData.phone_number}
                    onChange={e => setFormData({...formData, phone_number: e.target.value})}
                    placeholder="+1 (555) 000-0000"
                    className="text-lg py-6"
                  />
                </div>
                <div className="flex justify-between pt-8">
                  <Button variant="ghost" onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext}>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 4 */}
            {step === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Where do you work?</h2>
                  <p className="text-muted-foreground">Adding your work details helps personalize insights.</p>
                </div>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Designation</Label>
                    <Input 
                      autoFocus
                      value={formData.designation}
                      onChange={e => setFormData({...formData, designation: e.target.value})}
                      placeholder="e.g. Software Engineer"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Company</Label>
                    <Input 
                      value={formData.company}
                      onChange={e => setFormData({...formData, company: e.target.value})}
                      placeholder="e.g. Acme Corp"
                    />
                  </div>
                </div>
                <div className="flex justify-between pt-8">
                  <Button variant="ghost" onClick={handleBack}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                  <Button onClick={handleNext}>
                    Next <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}

            {/* Step 5 */}
            {step === 5 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold">Add a profile photo</h2>
                  <p className="text-muted-foreground">Make your account truly yours.</p>
                </div>
                <div className="flex flex-col items-center justify-center space-y-4 py-4">
                  <div className="relative h-32 w-32 rounded-full border-4 border-muted overflow-hidden bg-muted/50 flex items-center justify-center group">
                    {avatarPreview ? (
                      <img src={avatarPreview} alt="Avatar preview" className="h-full w-full object-cover" />
                    ) : (
                      <Upload className="h-10 w-10 text-muted-foreground" />
                    )}
                    <label className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity">
                      <span className="text-white text-sm font-medium">Change</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-4 pt-4">
                  <Button onClick={handleNext} className="w-full">
                    Upload & Continue <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="link" onClick={handleNext} className="text-muted-foreground">
                    Skip for now
                  </Button>
                </div>
                <div className="flex justify-start">
                  <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-3">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back
                  </Button>
                </div>
              </div>
            )}

            {/* Step 6 */}
            {step === 6 && (
              <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 text-center">
                <div className="mx-auto h-20 w-20 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                  <span className="text-4xl text-green-500">🚀</span>
                </div>
                <h2 className="text-3xl font-bold">You&apos;re all set!</h2>
                <div className="bg-muted/50 rounded-xl p-4 text-left max-w-xs mx-auto border space-y-2">
                  <div className="text-sm">
                    <span className="text-muted-foreground block text-xs uppercase tracking-wider">Name</span>
                    <span className="font-medium">{formData.full_name}</span>
                  </div>
                  {(formData.designation || formData.company) && (
                    <div className="text-sm">
                      <span className="text-muted-foreground block text-xs uppercase tracking-wider">Work</span>
                      <span className="font-medium">
                        {formData.designation}{formData.designation && formData.company ? ' at ' : ''}{formData.company}
                      </span>
                    </div>
                  )}
                </div>
                <div className="pt-6">
                  <Button 
                    size="lg" 
                    className="w-full md:w-auto px-8" 
                    onClick={handleFinish}
                    disabled={isPending}
                  >
                    {isPending ? "Setting up..." : "Go to Dashboard"}
                  </Button>
                </div>
                <div className="flex justify-center mt-4">
                  <Button variant="ghost" size="sm" onClick={handleBack} disabled={isPending}>
                    <ChevronLeft className="mr-2 h-4 w-4" /> Go back
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
