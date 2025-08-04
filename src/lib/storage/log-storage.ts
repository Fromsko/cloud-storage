import { promises as fs } from 'fs';
import path from 'path';
import { UploadLog } from './types';

const logsFilePath = path.join(process.cwd(), 'uploads', 'logs.json');

async function ensureLogFileExists() {
  try {
    await fs.access(logsFilePath);
  } catch {
    await fs.writeFile(logsFilePath, JSON.stringify([]));
  }
}

export async function readLogs(): Promise<UploadLog[]> {
  await ensureLogFileExists();
  const data = await fs.readFile(logsFilePath, 'utf-8');
  return JSON.parse(data) as UploadLog[];
}

export async function writeLogs(logs: UploadLog[]): Promise<void> {
  await ensureLogFileExists();
  await fs.writeFile(logsFilePath, JSON.stringify(logs, null, 2));
}