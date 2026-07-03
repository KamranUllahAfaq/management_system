import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const branchFilter = searchParams.get('branch') || '';
    const universityFilter = searchParams.get('university') || '';
    const feeStatusFilter = searchParams.get('feeStatus') || '';

    // Build Prisma query filter
    const whereClause: any = {};

    if (search) {
      whereClause.OR = [
        { name: { contains: search } },
        { rollNumber: { contains: search } },
        { roomNumber: { contains: search } },
        { cnic: { contains: search } },
      ];
    }

    if (branchFilter) {
      whereClause.branch = { name: branchFilter };
    }

    if (universityFilter) {
      whereClause.university = universityFilter;
    }

    const students = await prisma.student.findMany({
      where: whereClause,
      include: {
        branch: true,
        room: true,
      },
      orderBy: { id: 'desc' },
    });

    // Client-side mapping for UI compatibility (paid, pending, overdue, partial paid)
    const formattedStudents = students.map((s) => {
      let feeStatus = 'Pending';
      if (s.balanceDue === 0) {
        feeStatus = 'Paid';
      } else if (s.balanceDue < s.monthlyFee) {
        feeStatus = 'Partial Paid';
      } else if (s.fine > 0) {
        feeStatus = 'Overdue';
      }

      return {
        id: s.id,
        name: s.name,
        fatherName: s.fatherName,
        cnic: s.cnic,
        mobile: s.mobile,
        emergencyContact: s.emergencyContact,
        email: s.email,
        university: s.university,
        semester: s.semester,
        registrationNumber: s.registrationNumber,
        branchName: s.branch.name,
        roomNumber: s.roomNumber,
        joiningDate: s.createdAt.toLocaleDateString(),
        monthlyFee: s.monthlyFee,
        paidAmount: Math.max(0, s.monthlyFee - s.balanceDue),
        balanceDue: s.balanceDue,
        fine: s.fine,
        transportUsing: s.transportUsing,
        feeStatus,
        accountStatus: s.accountStatus,
      };
    });

    // Apply feeStatus filter manually if set
    let filteredStudents = formattedStudents;
    if (feeStatusFilter) {
      filteredStudents = formattedStudents.filter((s) => s.feeStatus === feeStatusFilter);
    }

    return NextResponse.json({ success: true, students: filteredStudents });
  } catch (e) {
    console.error('Fetch admin students error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      username,
      password,
      name,
      fatherName,
      cnic,
      permanentAddress,
      semester,
      registrationNumber,
      university,
      email,
      rollNumber,
      branchName,
      roomNumber,
      mobile,
      emergencyContact,
      monthlyFee,
      transportUsing,
    } = body;

    // Check unique fields
    const existingUsername = await prisma.student.findUnique({ where: { username } });
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already exists' }, { status: 400 });
    }

    const existingEmail = await prisma.student.findUnique({ where: { email } });
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Resolve branch and room
    const branch = await prisma.branch.findUnique({
      where: { name: branchName },
    });

    if (!branch) {
      return NextResponse.json({ error: 'Selected branch does not exist' }, { status: 404 });
    }

    let room = await prisma.room.findFirst({
      where: { branchId: branch.id, roomNumber },
    });

    // If room doesn't exist, create it dynamically
    if (!room) {
      room = await prisma.room.create({
        data: {
          roomNumber,
          floor: '1st Floor',
          roomType: 'Quad',
          totalBeds: 4,
          branchId: branch.id,
        },
      });
    }

    if (room.occupiedBeds >= room.totalBeds) {
      return NextResponse.json({ error: 'Allotted room is already full' }, { status: 400 });
    }

    // Create student
    const newStudent = await prisma.student.create({
      data: {
        username,
        password: password || 'password',
        name,
        fatherName,
        cnic,
        permanentAddress,
        semester,
        registrationNumber,
        university,
        email,
        rollNumber,
        hostelName: branchName,
        roomNumber,
        balanceDue: parseFloat(monthlyFee),
        mobile,
        emergencyContact,
        fine: 0.0,
        transportUsing: transportUsing === 'true' || transportUsing === true,
        monthlyFee: parseFloat(monthlyFee),
        branchId: branch.id,
        roomId: room.id,
      },
    });

    // Update room occupancy
    await prisma.room.update({
      where: { id: room.id },
      data: { occupiedBeds: { increment: 1 } },
    });

    // Generate first monthly invoice
    await prisma.payment.create({
      data: {
        month: 'July 2026',
        dueDate: '10-07-2026',
        amount: parseFloat(monthlyFee),
        status: 'Pending',
        studentId: newStudent.id,
      },
    });

    return NextResponse.json({ success: true, student: newStudent });
  } catch (e) {
    console.error('Create student error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
