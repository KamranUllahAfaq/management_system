import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const studentId = parseInt(studentIdCookie.value, 10);
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { roommates: true },
    });

    if (!student) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      student: {
        id: student.id,
        username: student.username,
        name: student.name,
        email: student.email,
        rollNumber: student.rollNumber,
        hostelName: student.hostelName,
        roomNumber: student.roomNumber,
        balanceDue: student.balanceDue,
        mobile: student.mobile,
        emergencyContact: student.emergencyContact,
        roommates: student.roommates,
      },
    });
  } catch (e) {
    console.error('Session retrieval error:', e);
    return NextResponse.json({ authenticated: false, error: 'Internal server error' }, { status: 500 });
  }
}
