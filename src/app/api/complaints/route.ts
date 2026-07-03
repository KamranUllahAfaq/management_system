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
    const complaints = await prisma.complaint.findMany({
      where: { studentId },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, complaints });
  } catch (e) {
    console.error('Fetch complaints error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = parseInt(studentIdCookie.value, 10);
    const { title, category, description } = await request.json();

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Format current date as DD-MM-YYYY
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const year = today.getFullYear();
    const dateStr = `${day}-${month}-${year}`;

    const newComplaint = await prisma.complaint.create({
      data: {
        title,
        category,
        description,
        status: 'Open',
        date: dateStr,
        roomNumber: student.roomNumber,
        studentId,
      },
    });

    return NextResponse.json({ success: true, complaint: newComplaint });
  } catch (e) {
    console.error('Submit complaint error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
