import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { signOut } from "@/features/auth/actions/auth.actions";

export default function PendingApprovalPage() {
  return (
    <Card className="w-full text-center">
      <CardHeader className="space-y-1">
        <div className="flex justify-center mb-4">
          <div className="flex aspect-square size-12 items-center justify-center rounded-full bg-amber-500/10 text-amber-500">
            <Clock className="size-6" />
          </div>
        </div>
        <CardTitle className="text-2xl">Pending Approval</CardTitle>
        <CardDescription>
          Your account is currently waiting for admin approval.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Thank you for verifying your email! Our administrators are reviewing your account. You will receive an email once you are approved.
        </p>
      </CardContent>
      <CardFooter className="flex justify-center">
        <form action={signOut}>
          <Button variant="outline" type="submit">
            Sign out
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
