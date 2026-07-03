import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { username, password } = await request.json();

    const student = await prisma.student.findUnique({
      where: { username },
      include: { roommates: true },
    });

    if (!student || student.password !== password) {
      return NextResponse.json({ success: false, error: 'Invalid username or password' }, { status: 401 });
    }

    // Set cookie session (simple mock cookie)
    const cookieStore = await cookies();
    cookieStore.set('student_id', student.id.toString(), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({
      success: true,
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
    console.error('Login error:', e);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
