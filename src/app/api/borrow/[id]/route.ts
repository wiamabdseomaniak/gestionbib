import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';  // Notez les accolades

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'LIBRARIAN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await request.json();

    const borrowRecord = await prisma.borrowRecord.findUnique({
      where: { id },
      include: { book: true },
    });

    if (!borrowRecord) {
      return NextResponse.json(
        { error: 'Borrow record not found' },
        { status: 404 }
      );
    }

    if (status === 'APPROVED') {
      await prisma.book.update({
        where: { id: borrowRecord.bookId },
        data: { isAvailable: false },
      });
    } else if (status === 'REJECTED' || status === 'RETURNED') {
      await prisma.book.update({
        where: { id: borrowRecord.bookId },
        data: { isAvailable: true },
      });
    }

    const updatedRecord = await prisma.borrowRecord.update({
      where: { id },
      data: {
        status,
        returnDate: status === 'RETURNED' ? new Date() : undefined,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        book: true,
      },
    });

    return NextResponse.json({
      message: 'Borrow record updated successfully',
      borrowRecord: updatedRecord,
    });
  } catch (error) {
    console.error('Error updating borrow record:', error);
    return NextResponse.json(
      { error: 'Error updating borrow record' },
      { status: 500 }
    );
  }
}
