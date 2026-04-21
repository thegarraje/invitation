import type { ConfirmSubmissionRecord } from "@/types/submission";

interface EmailResult {
  status: "sent" | "skipped" | "failed";
  error?: string;
}

function buildHtml(record: ConfirmSubmissionRecord) {
  const safe = (value: string) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  return `
  <div style="font-family: Arial, sans-serif; color:#111; line-height:1.45;">
    <h2 style="margin:0 0 12px;">New ABG Meeting Confirmation</h2>
    <p style="margin:0 0 16px;">A new NDA confirmation was submitted.</p>
    <table cellpadding="6" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr><td><strong>ID</strong></td><td>${safe(record.id)}</td></tr>
      <tr><td><strong>Submitted</strong></td><td>${safe(record.createdAt)}</td></tr>
      <tr><td><strong>Name</strong></td><td>${safe(record.firstName)} ${safe(record.lastName)}</td></tr>
      <tr><td><strong>Email</strong></td><td>${safe(record.email)}</td></tr>
      <tr><td><strong>Phone</strong></td><td>${safe(record.phone)}</td></tr>
      <tr><td><strong>Clinic</strong></td><td>${safe(record.clinicName)}</td></tr>
      <tr><td><strong>City/State</strong></td><td>${safe(record.city)}, ${safe(record.state)}</td></tr>
      <tr><td><strong>Specialty</strong></td><td>${safe(record.specialty)}</td></tr>
      <tr><td><strong>Attendance Mode</strong></td><td>${safe(record.attendanceMode)}</td></tr>
      <tr><td><strong>Attendance Confirmation</strong></td><td>${safe(record.attendanceConfirmation)}</td></tr>
      <tr><td><strong>NDA Version</strong></td><td>${safe(record.ndaVersion)}</td></tr>
      <tr><td><strong>Signature Mode</strong></td><td>${safe(record.signatureMode)}</td></tr>
      <tr><td><strong>Signature Label</strong></td><td>${safe(record.signatureLabel)}</td></tr>
    </table>
  </div>`;
}

export async function sendSubmissionEmail(record: ConfirmSubmissionRecord): Promise<EmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = "info@garraje.com";
  const from = process.env.RESEND_FROM_EMAIL || "ABG Meeting <noreply@garraje.com>";

  if (!apiKey) {
    return { status: "skipped", error: "RESEND_API_KEY is not configured" };
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        from,
        to,
        subject: `ABG Meeting Confirmation - ${record.firstName} ${record.lastName}`,
        html: buildHtml(record)
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        status: "failed",
        error: `Resend error (${response.status}): ${errorText}`
      };
    }

    return { status: "sent" };
  } catch (error) {
    return {
      status: "failed",
      error: error instanceof Error ? error.message : "Unknown email error"
    };
  }
}
