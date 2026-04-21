import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { sendSubmissionEmail } from "@/lib/email-dispatch";
import { saveConfirmSubmission } from "@/lib/submission-store";
import type { ConfirmSubmissionInput, ConfirmSubmissionRecord } from "@/types/submission";

function sanitize(text: unknown) {
  return String(text ?? "").trim();
}

function parseBody(payload: unknown): ConfirmSubmissionInput | null {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  const candidate = payload as Record<string, unknown>;

  const parsed: ConfirmSubmissionInput = {
    firstName: sanitize(candidate.firstName),
    lastName: sanitize(candidate.lastName),
    email: sanitize(candidate.email),
    phone: sanitize(candidate.phone),
    clinicName: sanitize(candidate.clinicName),
    city: sanitize(candidate.city),
    state: sanitize(candidate.state),
    specialty: sanitize(candidate.specialty),
    attendanceMode: sanitize(candidate.attendanceMode) as ConfirmSubmissionInput["attendanceMode"],
    attendanceConfirmation: sanitize(candidate.attendanceConfirmation) as ConfirmSubmissionInput["attendanceConfirmation"],
    consentAccepted: Boolean(candidate.consentAccepted),
    ndaVersion: sanitize(candidate.ndaVersion || "NDA-v1-short-example"),
    signatureMode: sanitize(candidate.signatureMode) as ConfirmSubmissionInput["signatureMode"],
    signatureLabel: sanitize(candidate.signatureLabel),
    signatureValue: sanitize(candidate.signatureValue)
  };

  const required = [
    parsed.firstName,
    parsed.lastName,
    parsed.email,
    parsed.phone,
    parsed.clinicName,
    parsed.city,
    parsed.state,
    parsed.specialty,
    parsed.attendanceMode,
    parsed.attendanceConfirmation,
    parsed.signatureMode,
    parsed.signatureLabel,
    parsed.signatureValue
  ];

  if (required.some((value) => value.length === 0) || !parsed.consentAccepted) {
    return null;
  }

  return parsed;
}

export async function POST(request: Request) {
  const payload = parseBody(await request.json().catch(() => null));

  if (!payload) {
    return NextResponse.json(
      { ok: false, error: "Invalid payload. Required fields are missing." },
      { status: 400 }
    );
  }

  const ipAddress = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";

  const record: ConfirmSubmissionRecord = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    ipAddress,
    userAgent,
    emailStatus: "skipped",
    ...payload
  };

  const emailResult = await sendSubmissionEmail(record);
  record.emailStatus = emailResult.status;
  if (emailResult.error) {
    record.emailError = emailResult.error;
  }

  await saveConfirmSubmission(record);

  return NextResponse.json({
    ok: true,
    id: record.id,
    emailStatus: record.emailStatus,
    emailError: record.emailError
  });
}
