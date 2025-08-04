import { NextRequest, NextResponse } from 'next/server';
import { storageManager } from '@/lib/storage/storage-manager';
import { uploadLogger } from '@/lib/upload-logger';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const logId = uuidv4();
    
    // Create upload log
    await uploadLogger.addLog({
      id: logId,
      fileName: file.name,
      fileSize: file.size,
      status: 'uploading',
      progress: 0,
      uploadedAt: new Date(),
    });

    try {
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Update progress
      await uploadLogger.updateLog(logId, { progress: 50 });
      
      const storage = storageManager.getStrategy();
      const fileItem = await storage.upload(buffer, file.name, file.type);
      
      // Update log with success
      await uploadLogger.updateLog(logId, {
        status: 'success',
        progress: 100,
        apiUrl: fileItem.url,
      });

      return NextResponse.json({
        success: true,
        file: fileItem,
        logId,
      });
    } catch (error) {
      // Update log with error
      await uploadLogger.updateLog(logId, {
        status: 'error',
        error: error instanceof Error ? error.message : 'Upload failed',
      });

      throw error;
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const storage = storageManager.getStrategy();
    const files = await storage.list();
    
    return NextResponse.json({ files });
  } catch (error) {
    console.error('List files error:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}