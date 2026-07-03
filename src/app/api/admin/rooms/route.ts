import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
      include: {
        branch: true,
        students: {
          select: { id: true, name: true, rollNumber: true }
        }
      },
      orderBy: [{ branchId: 'asc' }, { roomNumber: 'asc' }]
    });

    const formattedRooms = rooms.map(r => ({
      id: r.id,
      branchName: r.branch.name,
      branchType: r.branch.type,
      roomNumber: r.roomNumber,
      floor: r.floor,
      roomType: r.roomType,
      totalBeds: r.totalBeds,
      occupiedBeds: r.occupiedBeds,
      availableBeds: Math.max(0, r.totalBeds - r.occupiedBeds),
      assignedStudents: r.students.map(s => s.name).join(', '),
      status: r.status
    }));

    return NextResponse.json({ success: true, rooms: formattedRooms });
  } catch (e) {
    console.error('Fetch rooms error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
