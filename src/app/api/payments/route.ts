import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = parseInt(studentIdCookie.value, 10);
    const payments = await prisma.payment.findMany({
      where: { studentId },
      orderBy: { id: 'desc' },
    });

    return NextResponse.json({ success: true, payments });
  } catch (e) {
    console.error('Fetch payments error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const studentIdCookie = cookieStore.get('student_id');

    if (!studentIdCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const studentId = parseInt(studentIdCookie.value, 10);
    const { month, amount, method } = await request.json();

    // Find the pending payment for this month
    const payment = await prisma.payment.findFirst({
      where: {
        studentId,
        month,
        status: 'Pending',
      },
    });

    if (!payment) {
      return NextResponse.json({ error: 'No pending payment found for this month' }, { status: 400 });
    }

    // Generate a random transaction ID
    const txnId = 'TXN' + Math.floor(100000000 + Math.random() * 900000000);
    
    // Current date
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const m = String(today.getMonth() + 1).padStart(2, '0');
    const y = today.getFullYear();
    const dateStr = `${day}-${m}-${y}`;

    // Transaction within database
    const updatedPayment = await prisma.$transaction(async (tx) => {
      // 1. Update the payment status to Paid
      const updated = await tx.payment.update({
        where: { id: payment.id },
        data: {
          status: 'Paid',
          paymentDate: dateStr,
          transactionId: txnId,
          method,
        },
      });

      // 2. Reduce the student's balanceDue
      const student = await tx.student.findUnique({ where: { id: studentId } });
      if (student) {
        const newBalance = Math.max(0, student.balanceDue - amount);
        await tx.student.update({
          where: { id: studentId },
          data: { balanceDue: newBalance },
        });
      }

      return updated;
    });

    return NextResponse.json({ success: true, payment: updatedPayment });
  } catch (e) {
    console.error('Submit payment error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
