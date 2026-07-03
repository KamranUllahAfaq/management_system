import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const studentId = parseInt(id, 10);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        branch: true,
        room: true,
        payments: { orderBy: { id: 'desc' } },
        complaints: { orderBy: { id: 'desc' } },
      },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const totalComplaints = student.complaints.length;
    const openComplaints = student.complaints.filter(c => c.status !== 'Resolved' && c.status !== 'Rejected').length;
    const resolvedComplaints = student.complaints.filter(c => c.status === 'Resolved').length;

    let feeStatus = 'Pending';
    if (student.balanceDue === 0) {
      feeStatus = 'Paid';
    } else if (student.balanceDue < student.monthlyFee) {
      feeStatus = 'Partial Paid';
    } else if (student.fine > 0) {
      feeStatus = 'Overdue';
    }

    return NextResponse.json({
      success: true,
      student: {
        id: student.id,
        username: student.username,
        name: student.name,
        fatherName: student.fatherName,
        cnic: student.cnic,
        mobile: student.mobile,
        emergencyContact: student.emergencyContact,
        email: student.email,
        permanentAddress: student.permanentAddress,
        semester: student.semester,
        registrationNumber: student.registrationNumber,
        university: student.university,
        branchName: student.branch.name,
        branchId: student.branchId,
        roomNumber: student.roomNumber,
        roomId: student.roomId,
        joiningDate: student.createdAt.toLocaleDateString(),
        monthlyFee: student.monthlyFee,
        balanceDue: student.balanceDue,
        fine: student.fine,
        totalPayable: student.balanceDue + student.fine,
        transportUsing: student.transportUsing,
        feeStatus,
        accountStatus: student.accountStatus,
        complaints: {
          total: totalComplaints,
          open: openComplaints,
          resolved: resolvedComplaints,
          list: student.complaints,
        },
        payments: student.payments,
      },
    });
  } catch (e) {
    console.error('Fetch student admin profile error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const studentId = parseInt(id, 10);
    const body = await request.json();

    const {
      name,
      fatherName,
      cnic,
      email,
      mobile,
      emergencyContact,
      permanentAddress,
      university,
      semester,
      registrationNumber,
      monthlyFee,
      transportUsing,
    } = body;

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    const updated = await prisma.student.update({
      where: { id: studentId },
      data: {
        name,
        fatherName,
        cnic,
        email,
        mobile,
        emergencyContact,
        permanentAddress,
        university,
        semester,
        registrationNumber,
        monthlyFee: parseFloat(monthlyFee),
        transportUsing: transportUsing === 'true' || transportUsing === true,
      },
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (e) {
    console.error('Update student error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const studentId = parseInt(id, 10);

    const student = await prisma.student.findUnique({ where: { id: studentId } });
    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Toggle status
    const newStatus = student.accountStatus === 'Active' ? 'Inactive' : 'Active';
    const updated = await prisma.student.update({
      where: { id: studentId },
      data: { accountStatus: newStatus },
    });

    return NextResponse.json({ success: true, student: updated });
  } catch (e) {
    console.error('Toggle status error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
