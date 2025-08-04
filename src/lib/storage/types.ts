export interface FileItem {
  id: string;
  name: string;
  size: number;
  type: string;
  url?: string;
  uploadedAt: Date;
  path: string;
}

export interface UploadLog {
  id: string;
  fileName: string;
  fileSize: number;
  status: 'uploading' | 'success' | 'error';
  progress: number;
  uploadedAt: Date;
  error?: string;
  apiUrl?: string;
}

export interface StorageStrategy {
  upload(file: Buffer, fileName: string, mimeType: string): Promise<FileItem>;
  download(fileId: string): Promise<Buffer>;
  delete(fileId: string): Promise<void>;
  list(): Promise<FileItem[]>;
  getFileUrl(fileId: string): Promise<string>;
}