import { Resend } from 'resend';

const apiKey = process.env.RESEND_API_KEY;
let resendInstance: Resend | null = null;

if (apiKey) {
  resendInstance = new Resend(apiKey);
}

export async function sendEmail(to: string, subject: string, body: string, from?: string) {
  if (!resendInstance) {
    console.warn('Resend not configured — email not sent. Set RESEND_API_KEY env var.');
    return { success: false, error: 'Email not configured' };
  }

  try {
    const sender = from || 'onboarding@resend.dev';
    const { data, error } = await resendInstance.emails.send({
      from: `OnboardFlow <${sender}>`,
      to: [to],
      subject,
      html: body,
    });

    if (error) {
      console.error('Resend error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, id: data?.id };
  } catch (err: any) {
    console.error('Failed to send email:', err);
    return { success: false, error: err.message };
  }
}
