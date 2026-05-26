export type EmailNotificationPayload = {
  toUserId: string;
  title: string;
  body: string | null;
  metadata?: Record<string, unknown>;
};

export async function sendNotificationEmail(_notification: EmailNotificationPayload): Promise<void> {
  // TODO: Plug provider (Resend/SES/Postmark) in production.
  void _notification;
  return;
}
