"use client";

import { useState, useTransition, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { User, Globe, Camera, Loader2 } from "lucide-react";
import { updateProfile } from "../actions/settings.actions";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";

export function SettingsForm({ profile }: { profile: any }) {
  const [isPending, startTransition] = useTransition();
  const [isUploading, setIsUploading] = useState(false);
  
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [phoneNumber, setPhoneNumber] = useState(profile?.phone_number || "");
  const [designation, setDesignation] = useState(profile?.designation || "");
  const [company, setCompany] = useState(profile?.company || "");
  const [currency, setCurrency] = useState(profile?.currency || "INR");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;

      if (file.size > 2 * 1024 * 1024) {
        toast.error("Image must be less than 2MB");
        return;
      }

      setIsUploading(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.id}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);

      // Immediately update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', profile.id);

      if (updateError) throw updateError;
      
      toast.success("Profile picture updated!");
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Error uploading image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    startTransition(async () => {
      const res = await updateProfile({
        full_name: fullName,
        phone_number: phoneNumber,
        designation,
        company,
        currency,
      });

      if (res.error) {
        toast.error(res.error);
      } else {
        toast.success("Profile updated successfully!");
      }
    });
  };

  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).join('').toUpperCase()
    : profile?.email?.substring(0, 2).toUpperCase();

  return (
    <div className="space-y-6 max-w-4xl">
      <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <User className="h-5 w-5 text-primary" /> Profile Information
          </CardTitle>
          <CardDescription>
            Manage your public personal details and contact preferences.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="space-y-6">
            
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative group">
                <Avatar className="h-24 w-24 border-2 border-border/50 shadow-sm">
                  <AvatarImage src={avatarUrl} alt={fullName} className="object-cover" />
                  <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
                </Avatar>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="absolute inset-0 flex items-center justify-center bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity rounded-full"
                >
                  {isUploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <Camera className="h-6 w-6" />}
                </button>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  accept="image/*"
                  onChange={handleAvatarUpload}
                />
              </div>
              <div>
                <h3 className="font-medium">Profile Picture</h3>
                <p className="text-sm text-muted-foreground">Click the image to upload a new avatar.</p>
                <p className="text-xs text-muted-foreground mt-1">Recommended: Square image, max 2MB.</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="fullname">Full Name</Label>
                <Input
                  id="fullname"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="bg-background/50"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  value={profile?.email || ""}
                  disabled
                  className="bg-muted/50 cursor-not-allowed text-muted-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="bg-background/50"
                  placeholder="+91 99999 99999"
                />
                <p className="text-[11px] text-muted-foreground mt-1">Please include your country dial code.</p>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="designation">Designation</Label>
                <Input
                  id="designation"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="bg-background/50"
                  placeholder="e.g. Senior Software Engineer"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="bg-background/50"
                  placeholder="e.g. Acme Corp"
                />
              </div>
            </div>

            <div className="space-y-1.5 pt-2 border-t border-border/50">
              <Label htmlFor="role">Role Permission Level</Label>
              <div className="flex items-center gap-2 mt-2">
                <Input
                  id="role"
                  value={profile?.role?.toUpperCase() || "USER"}
                  disabled
                  className="bg-muted/50 cursor-not-allowed font-semibold w-44 text-muted-foreground"
                />
                <span className="text-xs text-muted-foreground">
                  Role is managed by system administrators.
                </span>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button type="submit" disabled={isPending || isUploading} className="bg-primary hover:bg-primary/90 min-w-32">
                {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {isPending ? "Saving..." : "Save Profile"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="border-border/50 shadow-xl bg-card/60 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center gap-2">
            <Globe className="h-5 w-5 text-emerald-500" /> System Preferences
          </CardTitle>
          <CardDescription>
            Configure default currency formatting and regional options.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5 max-w-xs">
            <Label htmlFor="currency">Default Currency</Label>
            <Select value={currency} onValueChange={(v) => {
              setCurrency(v);
              // Auto-save currency when changed
              startTransition(async () => {
                await updateProfile({
                  full_name: fullName,
                  phone_number: phoneNumber,
                  designation,
                  company,
                  currency: v,
                });
                toast.success("Currency updated successfully");
              });
            }}>
              <SelectTrigger className="bg-background/50">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INR">₹ INR - Indian Rupee</SelectItem>
                <SelectItem value="USD">$ USD - US Dollar</SelectItem>
                <SelectItem value="EUR">€ EUR - Euro</SelectItem>
                <SelectItem value="GBP">£ GBP - British Pound</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
