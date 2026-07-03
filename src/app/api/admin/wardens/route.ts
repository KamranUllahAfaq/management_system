import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const wardens = await prisma.warden.findMany({
      include: {
        branch: true
      }
    });

    const formattedWardens = wardens.map(w => ({
      id: w.id,
      name: w.name,
      contact: w.contact,
      email: w.email,
      shift: w.shift,
      salary: w.salary,
      assignedFloor: w.assignedFloor,
      status: w.status,
      branchId: w.branchId,
      branchName: w.branch.name
    }));

    return NextResponse.json({ success: true, wardens: formattedWardens });
  } catch (e) {
    console.error('Fetch wardens error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, contact, email, shift, salary, assignedFloor, branchName } = body;

    const branch = await prisma.branch.findUnique({
      where: { name: branchName }
    });

    if (!branch) {
      return NextResponse.json({ error: 'Selected branch does not exist' }, { status: 404 });
    }

    const warden = await prisma.warden.create({
      data: {
        name,
        contact,
        email,
        shift,
        salary: parseFloat(salary),
        assignedFloor,
        branchId: branch.id
      }
    });

    return NextResponse.json({ success: true, warden });
  } catch (e) {
    console.error('Create warden error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, contact, email, shift, salary, assignedFloor, status } = body;

    const updated = await prisma.warden.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        contact,
        email,
        shift,
        salary: parseFloat(salary),
        assignedFloor,
        status
      }
    });

    return NextResponse.json({ success: true, warden: updated });
  } catch (e) {
    console.error('Update warden error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
