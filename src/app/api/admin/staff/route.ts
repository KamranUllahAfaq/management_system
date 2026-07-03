import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        branch: true
      }
    });

    const formattedStaff = staff.map(s => ({
      id: s.id,
      name: s.name,
      category: s.category,
      role: s.role || 'General',
      contact: s.contact,
      salary: s.salary,
      dutyArea: s.dutyArea,
      shift: s.shift,
      status: s.status,
      joiningDate: s.joiningDate,
      branchId: s.branchId,
      branchName: s.branch.name
    }));

    return NextResponse.json({ success: true, staff: formattedStaff });
  } catch (e) {
    console.error('Fetch staff error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, category, role, contact, salary, dutyArea, shift, branchName } = body;

    const branch = await prisma.branch.findUnique({
      where: { name: branchName }
    });

    if (!branch) {
      return NextResponse.json({ error: 'Selected branch does not exist' }, { status: 404 });
    }

    const today = new Date();
    const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

    const newStaff = await prisma.staff.create({
      data: {
        name,
        category,
        role: role || 'General',
        contact,
        salary: parseFloat(salary),
        dutyArea,
        shift,
        joiningDate: dateStr,
        branchId: branch.id
      }
    });

    return NextResponse.json({ success: true, staff: newStaff });
  } catch (e) {
    console.error('Create staff error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, role, contact, salary, dutyArea, shift, status } = body;

    const updated = await prisma.staff.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        category,
        role: role || 'General',
        contact,
        salary: parseFloat(salary),
        dutyArea,
        shift,
        status
      }
    });

    return NextResponse.json({ success: true, staff: updated });
  } catch (e) {
    console.error('Update staff error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
