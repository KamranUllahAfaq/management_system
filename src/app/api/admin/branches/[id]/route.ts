import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const branchId = parseInt(id, 10);

    const branch = await prisma.branch.findUnique({
      where: { id: branchId },
      include: {
        wardens: true,
        staff: true,
        rooms: true,
        students: {
          include: {
            complaints: {
              select: { id: true, status: true }
            }
          }
        }
      }
    });

    if (!branch) {
      return NextResponse.json({ error: 'Branch not found' }, { status: 404 });
    }

    // Process students details
    const studentsFormatted = branch.students.map(s => {
      const activeComplaints = s.complaints.filter(c => c.status !== 'Resolved').length;
      return {
        id: s.id,
        name: s.name,
        university: s.university,
        roomNumber: s.roomNumber,
        mobile: s.mobile,
        balanceDue: s.balanceDue,
        fine: s.fine,
        transportUsing: s.transportUsing,
        complaintsCount: activeComplaints,
        accountStatus: s.accountStatus,
        feeStatus: s.balanceDue === 0 ? 'Paid' : s.balanceDue < s.monthlyFee ? 'Partial Paid' : 'Pending'
      };
    });

    // Subdivide staff
    const wardens = branch.wardens;
    const messStaff = branch.staff.filter(s => s.category === 'Mess Staff');
    const cleaningStaff = branch.staff.filter(s => s.category === 'Working Maid' || s.category === 'Sanitary Staff');
    
    // Stats aggregates
    const totalStudents = branch.students.length;
    const totalRooms = branch.rooms.length;
    const occupiedRooms = branch.rooms.filter(r => r.occupiedBeds > 0).length;
    const availableRooms = totalRooms - occupiedRooms;
    const monthlyRevenue = branch.students.reduce((acc, s) => acc + s.monthlyFee, 0);
    const pendingFees = branch.students.reduce((acc, s) => acc + s.balanceDue, 0);
    const activeComplaints = studentsFormatted.reduce((acc, s) => acc + s.complaintsCount, 0);

    return NextResponse.json({
      success: true,
      branch: {
        id: branch.id,
        name: branch.name,
        type: branch.type,
        stats: {
          totalStudents,
          totalRooms,
          occupiedRooms,
          availableRooms,
          totalWardens: wardens.length,
          messStaffCount: messStaff.length,
          cleaningStaffCount: cleaningStaff.length,
          monthlyRevenue,
          pendingFees,
          activeComplaints
        },
        wardens,
        messStaff,
        cleaningStaff,
        students: studentsFormatted
      }
    });
  } catch (e) {
    console.error('Fetch branch detail error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
