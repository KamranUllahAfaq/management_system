import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = parseInt(studentIdCookie.value, 10);
    const notifications = await prisma.notification.findMany({
      where: { studentId },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, notifications });
  } catch (e) {
    console.error('Fetch notifications error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT() {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = parseInt(studentIdCookie.value, 10);
    await prisma.notification.updateMany({
      where: { studentId, read: false },
      data: { read: true },
    });

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Mark notifications read error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
