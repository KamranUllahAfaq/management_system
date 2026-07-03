import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const branches = await prisma.branch.findMany({
      include: {
        students: {
          select: {
            id: true,
            balanceDue: true,
            monthlyFee: true,
            complaints: {
              where: { status: { not: 'Resolved' } },
              select: { id: true }
            }
          }
        },
        rooms: {
          select: {
            id: true,
            totalBeds: true,
            occupiedBeds: true
          }
        },
        wardens: { select: { id: true } },
        staff: { select: { id: true } }
      }
    });

    const formattedBranches = branches.map(b => {
      const totalStudents = b.students.length;
      const totalRooms = b.rooms.length;
      const occupiedRooms = b.rooms.filter(r => r.occupiedBeds > 0).length;
      const availableRooms = totalRooms - occupiedRooms;
      const assignedWardens = b.wardens.length;
      const totalStaff = b.staff.length;
      
      // Calculate revenue based on students
      const monthlyRevenue = b.students.reduce((acc, s) => acc + s.monthlyFee, 0);
      const pendingDues = b.students.reduce((acc, s) => acc + s.balanceDue, 0);
      const activeComplaints = b.students.reduce((acc, s) => acc + s.complaints.length, 0);

      return {
        id: b.id,
        name: b.name,
        type: b.type,
        totalStudents,
        totalRooms,
        occupiedRooms,
        availableRooms,
        assignedWardens,
        totalStaff,
        monthlyRevenue,
        pendingDues,
        activeComplaints
      };
    });

    return NextResponse.json({ success: true, branches: formattedBranches });
  } catch (e) {
    console.error('Fetch branches error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
