import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const complaints = await prisma.complaint.findMany({
      include: {
        student: {
          include: { branch: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    const formattedComplaints = complaints.map((c) => ({
      id: c.id,
      studentName: c.student.name,
      branchName: c.student.branch.name,
      roomNumber: c.student.roomNumber,
      university: c.student.university,
      category: c.category,
      title: c.title,
      description: c.description,
      date: c.date,
      priority: c.priority,
      status: c.status,
      assignedTo: c.assignedTo || 'Unassigned',
      adminNote: c.adminNote || '',
    }));

    return NextResponse.json({ success: true, complaints: formattedComplaints });
  } catch (e) {
    console.error('Fetch complaints error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const { complaintId, status, assignedTo, adminNote, priority } = await request.json();

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: { student: true },
    });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    const updated = await prisma.complaint.update({
      where: { id: complaintId },
      data: {
        status: status || complaint.status,
        assignedTo: assignedTo !== undefined ? assignedTo : complaint.assignedTo,
        adminNote: adminNote !== undefined ? adminNote : complaint.adminNote,
        priority: priority || complaint.priority,
      },
    });

    // Notify the student about updates
    let notificationText = `Your complaint regarding "${complaint.title}" has been updated. Status: ${status || complaint.status}.`;
    if (adminNote) {
      notificationText += ` Admin Note: ${adminNote}`;
    }

    await prisma.notification.create({
      data: {
        title: 'Complaint Update',
        content: notificationText,
        type: 'Info',
        date: new Date().toLocaleDateString(),
        studentId: complaint.studentId,
      },
    });

    return NextResponse.json({ success: true, complaint: updated });
  } catch (e) {
    console.error('Update complaint error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
