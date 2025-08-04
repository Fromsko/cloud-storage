import { NextResponse } from 'next/server';
import { uploadLogger } from '@/lib/upload-logger';

export async function GET() {
  const logs = await uploadLogger.getAllLogs();
  return NextResponse.json({ logs });
}

export async function PUT(request: Request) {
  try {
    const { logs } = await request.json();
    await uploadLogger.updateLogs(logs);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to update logs:', error);
    return NextResponse.json({ error: 'Failed to update logs' }, { status: 500 });
  }
}

export async function DELETE() {
  await uploadLogger.clearLogs();
  return NextResponse.json({ success: true });
}