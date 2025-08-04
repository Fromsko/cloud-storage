import { UploadLog } from './storage/types';
import { readLogs, writeLogs } from './storage/log-storage';

class UploadLogger {
  private async getLogs(): Promise<UploadLog[]> {
    return await readLogs();
  }

  private async saveLogs(logs: UploadLog[]): Promise<void> {
    await writeLogs(logs);
  }

  async addLog(log: UploadLog): Promise<void> {
    const logs = await this.getLogs();
    logs.unshift(log);
    await this.saveLogs(logs);
  }

  async updateLog(id: string, updates: Partial<UploadLog>): Promise<void> {
    let logs = await this.getLogs();
    const index = logs.findIndex(l => l.id === id);
    if (index !== -1) {
      logs[index] = { ...logs[index], ...updates };
      await this.saveLogs(logs);
    }
  }

  async updateLogs(updatedLogs: UploadLog[]): Promise<void> {
    await this.saveLogs(updatedLogs);
  }

  async getLog(id: string): Promise<UploadLog | undefined> {
    const logs = await this.getLogs();
    return logs.find(l => l.id === id);
  }

  async getAllLogs(): Promise<UploadLog[]> {
    const logs = await this.getLogs();
    return logs.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async clearLogs(): Promise<void> {
    await this.saveLogs([]);
  }

  async removeLog(id: string): Promise<void> {
    let logs = await this.getLogs();
    logs = logs.filter(l => l.id !== id);
    await this.saveLogs(logs);
  }
}

export const uploadLogger = new UploadLogger();