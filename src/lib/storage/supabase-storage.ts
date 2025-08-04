import { StorageStrategy, FileItem } from './types';
import { createClient } from '@supabase/supabase-js';
import { v4 as uuidv4 } from 'uuid';

export class SupabaseStorageStrategy implements StorageStrategy {
  private supabase;
  private bucketName = 'cloud-storage';

  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not configured');
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
  }

  async upload(file: Buffer, fileName: string, mimeType: string): Promise<FileItem> {
    const id = uuidv4();
    const ext = fileName.split('.').pop();
    const safeName = `${id}.${ext}`;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(safeName, file, {
        contentType: mimeType,
      });

    if (error) {
      throw new Error(`Upload failed: ${error.message}`);
    }

    const fileItem: FileItem = {
      id,
      name: fileName,
      size: file.length,
      type: mimeType,
      uploadedAt: new Date(),
      path: data.path,
    };

    // Get public URL
    const { data: urlData } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(data.path);

    fileItem.url = urlData.publicUrl;

    return fileItem;
  }

  async download(fileId: string): Promise<Buffer> {
    // For Supabase, we'll use the public URL instead of downloading the buffer
    // This is a simplified implementation
    throw new Error('Direct download not implemented for Supabase strategy');
  }

  async delete(fileId: string): Promise<void> {
    const { error } = await this.supabase.storage
      .from(this.bucketName)
      .remove([fileId]);

    if (error) {
      throw new Error(`Delete failed: ${error.message}`);
    }
  }

  async list(): Promise<FileItem[]> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .list();

    if (error) {
      throw new Error(`List failed: ${error.message}`);
    }

    return data?.map(file => ({
      id: file.name.split('.')[0],
      name: file.name,
      size: file.metadata?.size || 0,
      type: file.metadata?.mimetype || 'application/octet-stream',
      uploadedAt: new Date(file.created_at),
      path: file.name,
      url: this.supabase.storage.from(this.bucketName).getPublicUrl(file.name).data.publicUrl,
    })) || [];
  }

  async getFileUrl(fileId: string): Promise<string> {
    const { data } = this.supabase.storage
      .from(this.bucketName)
      .getPublicUrl(fileId);

    return data.publicUrl;
  }
}