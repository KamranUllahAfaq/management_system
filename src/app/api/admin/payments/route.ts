import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    // Fetch all payments that are submitted for verification (status is Pending/Partial Paid but have transactionId)
    const payments = await prisma.payment.findMany({
      where: {
        transactionId: { not: null },
        verifiedBy: null,
      },
      include: {
        student: {
          include: { branch: true },
        },
      },
      orderBy: { id: 'desc' },
    });

    const formattedPayments = payments.map((p) => ({
      id: p.id,
      studentName: p.student.name,
      branchName: p.student.branch.name,
      roomNumber: p.student.roomNumber,
      university: p.student.university,
      paymentMethod: p.method || 'Unknown',
      transactionId: p.transactionId,
      submittedAmount: p.amount,
      paymentDate: p.paymentDate || 'Not specified',
      status: p.status,
    }));

    return NextResponse.json({ success: true, payments: formattedPayments });
  } catch (e) {
    console.error('Fetch verifications error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { paymentId, action, adminNote } = await request.json();

    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: { student: true },
    });

    if (!payment) {
      return NextResponse.json({ error: 'Payment record not found' }, { status: 404 });
    }

    if (action === 'Approve') {
      await prisma.$transaction(async (tx) => {
        // Mark payment as Paid
        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: 'Paid',
            verifiedBy: 'admin',
            adminNote: adminNote || 'Verified successfully',
          },
        });

        // Recalculate student balance
        const currentBalance = payment.student.balanceDue;
        const newBalance = Math.max(0, currentBalance - payment.amount);
        
        await tx.student.update({
          where: { id: payment.studentId },
          data: {
            balanceDue: newBalance,
          },
        });

        // Send confirmation notification
        await tx.notification.create({
          data: {
            title: 'Payment Verified',
            content: `Your payment of ${payment.amount} PKR for ${payment.month} has been verified and approved by the admin.`,
            type: 'Info',
            date: new Date().toLocaleDateString(),
            studentId: payment.studentId,
          },
        });
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'Reject') {
      await prisma.$transaction(async (tx) => {
        // Revert payment details, reset status to Pending
        await tx.payment.update({
          where: { id: paymentId },
          data: {
            status: 'Pending',
            transactionId: null,
            method: null,
            paymentDate: null,
            adminNote: adminNote || 'Rejected by Admin. Please check details and resubmit.',
          },
        });

        // Send rejection alert
        await tx.notification.create({
          data: {
            title: 'Payment Rejected',
            content: `Your payment submission for ${payment.month} was rejected. Reason: ${adminNote || 'Invalid transaction ID/receipt'}. Please resubmit.`,
            type: 'Alert',
            date: new Date().toLocaleDateString(),
            studentId: payment.studentId,
          },
        });
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action parameter' }, { status: 400 });
  } catch (e) {
    console.error('Verify payment error:', e);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
