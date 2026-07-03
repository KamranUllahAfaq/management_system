import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const studentId = parseInt(id, 10);
    const body = await request.json();
    const { action } = body;

    const student = await prisma.student.findUnique({
      where: { id: studentId },
    });

    if (!student) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    if (action === 'add-fine') {
      const { amount } = body;
      const updated = await prisma.student.update({
        where: { id: studentId },
        data: {
          fine: student.fine + parseFloat(amount),
        },
      });

      // Create notification alert for fine
      await prisma.notification.create({
        data: {
          title: 'Fine Imposed',
          content: `A fine of ${amount} PKR has been added to your account. Reason: Policy violation. Please clear it with your dues.`,
          type: 'Warning',
          date: new Date().toLocaleDateString(),
          studentId,
        },
      });

      return NextResponse.json({ success: true, student: updated });
    }

    if (action === 'change-room') {
      const { newRoomNumber } = body;

      // Find room in the same branch
      const newRoom = await prisma.room.findFirst({
        where: { branchId: student.branchId, roomNumber: newRoomNumber },
      });

      if (!newRoom) {
        return NextResponse.json({ error: 'Selected room does not exist in this branch' }, { status: 404 });
      }

      if (newRoom.occupiedBeds >= newRoom.totalBeds) {
        return NextResponse.json({ error: 'Selected room is already full' }, { status: 400 });
      }

      // Execute transaction to transfer student
      await prisma.$transaction(async (tx) => {
        // Decrement old room occupancy
        if (student.roomId) {
          await tx.room.update({
            where: { id: student.roomId },
            data: { occupiedBeds: { decrement: 1 } },
          });
        }

        // Increment new room occupancy
        await tx.room.update({
          where: { id: newRoom.id },
          data: { occupiedBeds: { increment: 1 } },
        });

        // Update student room details
        await tx.student.update({
          where: { id: studentId },
          data: {
            roomId: newRoom.id,
            roomNumber: newRoomNumber,
          },
        });
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'change-branch') {
      const { newBranchName, newRoomNumber } = body;

      const newBranch = await prisma.branch.findUnique({
        where: { name: newBranchName },
      });

      if (!newBranch) {
        return NextResponse.json({ error: 'Selected branch does not exist' }, { status: 404 });
      }

      // Find or create room in the new branch
      let newRoom = await prisma.room.findFirst({
        where: { branchId: newBranch.id, roomNumber: newRoomNumber },
      });

      if (!newRoom) {
        newRoom = await prisma.room.create({
          data: {
            roomNumber: newRoomNumber,
            floor: '1st Floor',
            roomType: 'Quad',
            totalBeds: 4,
            branchId: newBranch.id,
          },
        });
      }

      if (newRoom.occupiedBeds >= newRoom.totalBeds) {
        return NextResponse.json({ error: 'Allotted room is already full in the new branch' }, { status: 400 });
      }

      await prisma.$transaction(async (tx) => {
        // Decrement old room
        if (student.roomId) {
          await tx.room.update({
            where: { id: student.roomId },
            data: { occupiedBeds: { decrement: 1 } },
          });
        }

        // Increment new room
        await tx.room.update({
          where: { id: newRoom.id },
          data: { occupiedBeds: { increment: 1 } },
        });

        // Update student
        await tx.student.update({
          where: { id: studentId },
          data: {
            branchId: newBranch.id,
            hostelName: newBranchName,
            roomId: newRoom.id,
            roomNumber: newRoomNumber,
          },
        });
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (e) {
    console.error('Execute student action error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
