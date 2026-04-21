import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { ConfirmSubmissionRecord } from "@/types/submission";

const SUBMISSION_FILE = "confirm-submissions.json";

function getDataDirectory() {
  if (process.env.VERCEL) {
    return "/tmp/panton-rebuild";
  }

  return path.join(process.cwd(), ".data");
}

async function getSubmissionFilePath() {
  const dataDir = getDataDirectory();
  await mkdir(dataDir, { recursive: true });
  return path.join(dataDir, SUBMISSION_FILE);
}

export async function listConfirmSubmissions(): Promise<ConfirmSubmissionRecord[]> {
  const filePath = await getSubmissionFilePath();

  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as ConfirmSubmissionRecord[];
    return parsed.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt));
  } catch {
    return [];
  }
}

export async function saveConfirmSubmission(record: ConfirmSubmissionRecord) {
  const filePath = await getSubmissionFilePath();
  const current = await listConfirmSubmissions();
  const next = [record, ...current];
  await writeFile(filePath, JSON.stringify(next, null, 2), "utf8");
}
