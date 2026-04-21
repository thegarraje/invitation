export type AttendanceMode = "IN_PERSON" | "VIRTUAL";
export type AttendanceConfirmation = "YES" | "NO" | "MAYBE";
export type SignatureMode = "DRAW" | "TYPE" | "UPLOAD";

export interface ConfirmSubmissionInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  clinicName: string;
  city: string;
  state: string;
  specialty: string;
  attendanceMode: AttendanceMode;
  attendanceConfirmation: AttendanceConfirmation;
  consentAccepted: boolean;
  ndaVersion: string;
  signatureMode: SignatureMode;
  signatureLabel: string;
  signatureValue: string;
}

export interface ConfirmSubmissionRecord extends ConfirmSubmissionInput {
  id: string;
  createdAt: string;
  ipAddress: string;
  userAgent: string;
  emailStatus: "sent" | "skipped" | "failed";
  emailError?: string;
}
