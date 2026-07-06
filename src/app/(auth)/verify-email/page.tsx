import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MailCheck } from "lucide-react";

export default function VerifyEmailPage() {
  return (
    <Card className="w-full text-center">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MailCheck className="size-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Check your email</CardTitle>
        <CardDescription>
          We've sent a verification link to your email address.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Please click the link in that email to verify your account. Once verified, your account will be placed in a queue for admin approval.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <Button variant="outline" asChild>
          <Link href="/login">Return to login</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
