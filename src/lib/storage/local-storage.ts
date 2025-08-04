import { StorageStrategy, FileItem } from './types';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export class LocalStorageStrategy implements StorageStrategy {
  private uploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    this.ensureUploadDir();
  }

  private async ensureUploadDir() {
    try {
      await fs.access(this.uploadDir);
    } catch {
      await fs.mkdir(this.uploadDir, { recursive: true });
    }
  }

  async upload(file: Buffer, fileName: string, mimeType: string): Promise<FileItem> {
    const id = uuidv4();
    const ext = path.extname(fileName);
    const safeName = `${id}${ext}`;
    const filePath = path.join(this.uploadDir, safeName);

    await fs.writeFile(filePath, file);

    const fileItem: FileItem = {
      id,
      name: fileName,
      size: file.length,
      type: mimeType,
      uploadedAt: new Date(),
      path: safeName,
      url: `/api/files/download/${id}`,
    };

    // Save metadata
    await this.saveMetadata(fileItem);
    
    return fileItem;
  }

  async download(fileId: string): Promise<Buffer> {
    const metadata = await this.getMetadata(fileId);
    if (!metadata) {
      throw new Error('File not found');
    }

    const filePath = path.join(this.uploadDir, metadata.path);
    return await fs.readFile(filePath);
  }

  async delete(fileId: string): Promise<void> {
    const metadata = await this.getMetadata(fileId);
    if (!metadata) {
      throw new Error('File not found');
    }

    const filePath = path.join(this.uploadDir, metadata.path);
    const metaPath = path.join(this.uploadDir, `${fileId}.meta.json`);

    await fs.unlink(filePath);
    await fs.unlink(metaPath);
  }

  async list(): Promise<FileItem[]> {
    const files = await fs.readdir(this.uploadDir);
    const metaFiles = files.filter(file => file.endsWith('.meta.json'));
    
    const fileItems: FileItem[] = [];
    
    for (const metaFile of metaFiles) {
      try {
        const metaPath = path.join(this.uploadDir, metaFile);
        const metaContent = await fs.readFile(metaPath, 'utf-8');
        const metadata = JSON.parse(metaContent);
        fileItems.push(metadata);
      } catch (error) {
        console.error('Error reading metadata:', error);
      }
    }

    return fileItems.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
  }

  async getFileUrl(fileId: string): Promise<string> {
    return `/api/files/download/${fileId}`;
  }

  private async saveMetadata(fileItem: FileItem): Promise<void> {
    const metaPath = path.join(this.uploadDir, `${fileItem.id}.meta.json`);
    await fs.writeFile(metaPath, JSON.stringify(fileItem, null, 2));
  }

  async getMetadata(fileId: string): Promise<FileItem | null> {
    try {
      const metaPath = path.join(this.uploadDir, `${fileId}.meta.json`);
      const metaContent = await fs.readFile(metaPath, 'utf-8');
      return JSON.parse(metaContent);
    } catch {
      return null;
    }
  }
}