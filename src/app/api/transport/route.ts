import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const routes = await prisma.transportRoute.findMany({
      orderBy: { routeNumber: 'asc' },
    });

    return NextResponse.json({ success: true, routes });
  } catch (e) {
    console.error('Fetch transport error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
