import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendFundedEmail({
  toEmail,
  requesterName,
  requestTitle,
  approvedBy,
  couponCode,
}: {
  toEmail: string;
  requesterName: string;
  requestTitle: string;
  approvedBy: string;
  couponCode: string;
}) {
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "NutraGive <onboarding@resend.dev>",
    to: toEmail,
    subject: "Your NutraGive request has been funded!",
    html: `
      <div style="font-family: Georgia, serif; max-width: 520px; margin: 0 auto; padding: 40px 24px; color: #1f2e1a;">
        <h1 style="font-size: 28px; font-weight: 600; color: #166534; margin-bottom: 8px;">Great news, ${requesterName}!</h1>
        <p style="font-size: 16px; color: #57534e; margin-bottom: 24px; line-height: 1.6;">
          Your request <strong style="color: #1f2e1a;">"${requestTitle}"</strong> has been fully funded by <strong style="color: #1f2e1a;">${approvedBy}</strong>.
        </p>

        <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 16px; padding: 24px; text-align: center; margin-bottom: 24px;">
          <p style="font-size: 13px; color: #166534; font-family: sans-serif; margin: 0 0 8px 0; text-transform: uppercase; letter-spacing: 0.08em;">Your coupon code</p>
          <p style="font-size: 28px; font-weight: 700; font-family: monospace; color: #15803d; letter-spacing: 0.1em; margin: 0;">${couponCode}</p>
        </div>

        <p style="font-size: 14px; color: #78716c; line-height: 1.6;">
          Redeem this code at checkout to receive your grocery credits. If you have any trouble, reply to this email and we will help.
        </p>

        <hr style="border: none; border-top: 1px solid #e7e5e4; margin: 32px 0;" />
        <p style="font-size: 12px; color: #a8a29e; text-align: center;">NutraGive — nourishing communities, one meal at a time.</p>
      </div>
    `,
  });
}
