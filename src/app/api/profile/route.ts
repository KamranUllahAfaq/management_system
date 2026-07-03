import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = parseInt(studentIdCookie.value, 10);
    const { mobile, emergencyContact, email } = await request.json();

    const updatedStudent = await prisma.student.update({
      where: { id: studentId },
      data: {
        mobile,
        emergencyContact,
        email,
      },
    });

    return NextResponse.json({
      success: true,
      student: {
        id: updatedStudent.id,
        username: updatedStudent.username,
        name: updatedStudent.name,
        email: updatedStudent.email,
        rollNumber: updatedStudent.rollNumber,
        hostelName: updatedStudent.hostelName,
        roomNumber: updatedStudent.roomNumber,
        balanceDue: updatedStudent.balanceDue,
        mobile: updatedStudent.mobile,
        emergencyContact: updatedStudent.emergencyContact,
      },
    });
  } catch (e) {
    console.error('Update profile error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
