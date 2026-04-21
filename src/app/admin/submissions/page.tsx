import Link from "next/link";
import { ADMIN_PAGE_COPY } from "@/content/site-copy";
import { listConfirmSubmissions } from "@/lib/submission-store";

export const dynamic = "force-dynamic";

export default async function AdminSubmissionsPage() {
  const submissions = await listConfirmSubmissions();

  return (
    <main className="min-h-screen bg-[#ebf9fa] px-4 py-8 text-[#3a001a]">
      <div className="mx-auto w-full max-w-6xl rounded-[1.4rem] border border-black/10 bg-white p-6 shadow-xl md:p-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/55">{ADMIN_PAGE_COPY.eyebrow}</p>
            <h1 className="mt-2 text-2xl font-semibold md:text-3xl">{ADMIN_PAGE_COPY.title}</h1>
            <p className="mt-2 text-sm text-black/70">
              {ADMIN_PAGE_COPY.subtitle}
            </p>
          </div>

          <Link
            href="/confirm"
            className="rounded-full border border-black/20 px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em]"
          >
            {ADMIN_PAGE_COPY.openFormButton}
          </Link>
        </div>

        <div className="mt-6 overflow-x-auto rounded-xl border border-black/10">
          <table className="min-w-full divide-y divide-black/10 text-left text-sm">
            <thead className="bg-[#f8fbfb] text-xs uppercase tracking-[0.12em] text-black/60">
              <tr>
                <th className="px-3 py-3">Submitted</th>
                <th className="px-3 py-3">Participant</th>
                <th className="px-3 py-3">Contact</th>
                <th className="px-3 py-3">Clinic</th>
                <th className="px-3 py-3">Attendance</th>
                <th className="px-3 py-3">Signature</th>
                <th className="px-3 py-3">Email</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {submissions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-3 py-10 text-center text-black/60">
                    {ADMIN_PAGE_COPY.emptyState}
                  </td>
                </tr>
              )}

              {submissions.map((submission) => (
                <tr key={submission.id} className="align-top">
                  <td className="px-3 py-3 whitespace-nowrap">{new Date(submission.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <div className="font-semibold">
                      {submission.firstName} {submission.lastName}
                    </div>
                    <div className="text-black/60">{submission.specialty}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{submission.email}</div>
                    <div className="text-black/60">{submission.phone}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{submission.clinicName}</div>
                    <div className="text-black/60">
                      {submission.city}, {submission.state}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{submission.attendanceMode}</div>
                    <div className="text-black/60">{submission.attendanceConfirmation}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div>{submission.signatureMode}</div>
                    <div className="text-black/60">{submission.signatureLabel}</div>
                  </td>
                  <td className="px-3 py-3">
                    <div className="font-semibold">{submission.emailStatus}</div>
                    {submission.emailError ? (
                      <div className="max-w-[240px] text-xs text-red-600">{submission.emailError}</div>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}
