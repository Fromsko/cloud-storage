import { StorageStrategy, FileItem } from './types';
import PocketBase from 'pocketbase';
import { v4 as uuidv4 } from 'uuid';

export class PocketBaseStorageStrategy implements StorageStrategy {
  private pb: PocketBase;

  constructor() {
    const pbUrl = process.env.POCKETBASE_URL || 'http://127.0.0.1:8090';
    this.pb = new PocketBase(pbUrl);
  }

  async upload(file: Buffer, fileName: string, mimeType: string): Promise<FileItem> {
    const id = uuidv4();
    
    // Convert Buffer to File object
    const fileBlob = new Blob([new Uint8Array(file)], { type: mimeType });
    const formData = new FormData();
    formData.append('file', fileBlob, fileName);
    formData.append('name', fileName);
    formData.append('size', file.length.toString());
    formData.append('type', mimeType);

    try {
      const record = await this.pb.collection('files').create(formData);
      
      return {
        id: record.id,
        name: fileName,
        size: file.length,
        type: mimeType,
        uploadedAt: new Date(record.created),
        path: record.file,
        url: this.pb.files.getUrl(record, record.file),
      };
    } catch (error) {
      throw new Error(`PocketBase upload failed: ${error}`);
    }
  }

  async download(fileId: string): Promise<Buffer> {
    try {
      const record = await this.pb.collection('files').getOne(fileId);
      const fileUrl = this.pb.files.getUrl(record, record.file);
      
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      
      return Buffer.from(arrayBuffer);
    } catch (error) {
      throw new Error(`PocketBase download failed: ${error}`);
    }
  }

  async delete(fileId: string): Promise<void> {
    try {
      await this.pb.collection('files').delete(fileId);
    } catch (error) {
      throw new Error(`PocketBase delete failed: ${error}`);
    }
  }

  async list(): Promise<FileItem[]> {
    try {
      const records = await this.pb.collection('files').getFullList({
        sort: '-created',
      });

      return records.map(record => ({
        id: record.id,
        name: record.name,
        size: record.size,
        type: record.type,
        uploadedAt: new Date(record.created),
        path: record.file,
        url: this.pb.files.getUrl(record, record.file),
      }));
    } catch (error) {
      throw new Error(`PocketBase list failed: ${error}`);
    }
  }

  async getFileUrl(fileId: string): Promise<string> {
    try {
      const record = await this.pb.collection('files').getOne(fileId);
      return this.pb.files.getUrl(record, record.file);
    } catch (error) {
      throw new Error(`PocketBase get URL failed: ${error}`);
    }
  }
}