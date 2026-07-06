export const approvalEmailTemplate = (name: string, loginUrl?: string) => {
  const targetUrl = loginUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/login`;

  return `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Account Approved - Finance Buddy</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 20px;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <!-- Header Banner -->
      <div style="background-color: #10b981; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Account Approved! 🎉</h1>
      </div>
      
      <!-- Body Content -->
      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; margin-top: 0;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #4b5563;">Great news! Your <strong>Finance Buddy</strong> account request has been reviewed and approved by an administrator.</p>
        <p style="font-size: 14px; color: #4b5563;">You can now log in directly using your one-time verification link below:</p>

        <!-- Direct Login Button -->
        <div style="text-align: center; margin: 32px 0;">
          <a href="${targetUrl}" target="_blank" style="display: inline-block; padding: 14px 28px; background-color: #10b981; color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 15px; box-shadow: 0 2px 4px rgba(16, 185, 129, 0.3);">
            ⚡ Direct One-Click Login
          </a>
        </div>

        <p style="font-size: 12px; color: #9ca3af; text-align: center; margin-bottom: 0;">
          If the button above does not work, copy and paste this URL into your browser:<br/>
          <a href="${targetUrl}" style="color: #10b981;">${targetUrl}</a>
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">© ${new Date().getFullYear()} Finance Buddy. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
  `;
};

export const rejectionEmailTemplate = (name: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Account Status - Finance Buddy</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #1f2937; background-color: #f3f4f6; margin: 0; padding: 20px;">
    <div style="max-width: 520px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
      <div style="background-color: #f43f5e; padding: 24px; text-align: center;">
        <h1 style="color: #ffffff; margin: 0; font-size: 22px; font-weight: 700;">Account Status Update</h1>
      </div>
      <div style="padding: 32px 24px;">
        <p style="font-size: 16px; margin-top: 0;">Hello <strong>${name}</strong>,</p>
        <p style="font-size: 14px; color: #4b5563;">Thank you for your interest in Finance Buddy. At this time, our administrators were unable to approve your account request.</p>
        <p style="font-size: 14px; color: #4b5563;">If you believe this decision was made in error, please reach out to your system administrator.</p>
      </div>
      <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="font-size: 12px; color: #6b7280; margin: 0;">© ${new Date().getFullYear()} Finance Buddy. All rights reserved.</p>
      </div>
    </div>
  </body>
</html>
`;
