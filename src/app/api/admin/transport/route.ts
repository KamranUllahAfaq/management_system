import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // 1. Fetch all students who are transport users
    const students = await prisma.student.findMany({
      where: { transportUsing: true },
      include: { branch: true }
    });

    // 2. Fetch all transport routes
    const routes = await prisma.transportRoute.findMany();

    const formattedStudents = students.map(s => {
      // Find route based on student's university/location or just assign a mock route for display
      const assignedRoute = routes.find(r => r.destination.toLowerCase().includes(s.university.toLowerCase())) || routes[0] || {
        routeNumber: 'R-1',
        destination: 'Campus',
        driverName: 'Not Assigned',
        contact: 'N/A',
        departure: 'N/A'
      };

      return {
        id: s.id,
        name: s.name,
        branchName: s.branch.name,
        roomNumber: s.roomNumber,
        university: s.university,
        contact: s.mobile,
        transportUsing: s.transportUsing,
        routeName: assignedRoute.routeNumber,
        pickupPoint: 'Hostel Main Gate',
        dropOffPoint: s.university + ' Entrance',
        driverName: assignedRoute.driverName,
        driverContact: assignedRoute.contact,
        vehicleNumber: 'MN-902-ISB',
        transportFee: 5000.0,
        status: assignedRoute.status
      };
    });

    return NextResponse.json({
      success: true,
      students: formattedStudents,
      routes
    });
  } catch (e) {
    console.error('Fetch transport error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { studentId, action, routeId } = await request.json();

    const student = await prisma.student.findUnique({
      where: { id: studentId }
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (action === 'Remove') {
      const updated = await prisma.student.update({
        where: { id: studentId },
        data: { transportUsing: false }
      });
      return NextResponse.json({ success: true, student: updated });
    }

    if (action === 'Assign') {
      const updated = await prisma.student.update({
        where: { id: studentId },
        data: { transportUsing: true }
      });
      return NextResponse.json({ success: true, student: updated });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (e) {
    console.error('Update transport error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
