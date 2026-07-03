import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const { title, message, sendTo, branchName, studentId, priority } = await request.json();

    // 1. Determine target students
    let targetStudents: { id: number }[] = [];

    const dateStr = new Date().toLocaleDateString();

    if (sendTo === 'All Students') {
      targetStudents = await prisma.student.findMany({ select: { id: true } });
    } else if (sendTo === 'Specific Branch') {
      const branch = await prisma.branch.findUnique({
        where: { name: branchName },
        select: { id: true }
      });
      if (branch) {
        targetStudents = await prisma.student.findMany({
          where: { branchId: branch.id },
          select: { id: true }
        });
      }
    } else if (sendTo === 'Specific Student') {
      const sId = parseInt(studentId, 10);
      if (sId) {
        targetStudents = [{ id: sId }];
      }
    } else if (sendTo === 'Fee Pending Students') {
      targetStudents = await prisma.student.findMany({
        where: { balanceDue: { gt: 0 } },
        select: { id: true }
      });
    } else if (sendTo === 'Transport Users') {
      targetStudents = await prisma.student.findMany({
        where: { transportUsing: true },
        select: { id: true }
      });
    }

    if (targetStudents.length === 0) {
      return NextResponse.json({ error: 'No target students matched the selection criteria' }, { status: 400 });
    }

    // 2. Create notifications for target students in a transaction
    await prisma.$transaction(
      targetStudents.map((s) =>
        prisma.notification.create({
          data: {
            title,
            content: message,
            type: priority === 'Urgent' ? 'Alert' : priority === 'Important' ? 'Warning' : 'Info',
            date: dateStr,
            priority,
            studentId: s.id,
          },
        })
      )
    );

    return NextResponse.json({ success: true, count: targetStudents.length });
  } catch (e) {
    console.error('Send announcement error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
