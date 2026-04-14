import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');

    const where: any = {};

    if (session.user.role === 'STUDENT') {
      where.userId = session.user.id;
    }

    if (status) {
      where.status = status;
    }

    const borrowRecords = await prisma.borrowRecord.findMany({
      where,
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
      orderBy: { borrowDate: 'desc' },
    });

    return NextResponse.json({ borrowRecords });
  } catch (error) {
    console.error('Error fetching borrow records:', error);
    return NextResponse.json(
      { error: 'Error fetching borrow records' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { bookId } = await request.json();

    if (!bookId) {
      return NextResponse.json(
        { error: 'Book ID is required' },
        { status: 400 }
      );
    }

    const book = await prisma.book.findUnique({
      where: { id: bookId },
    });

    if (!book) {
      return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    }

    if (!book.isAvailable) {
      return NextResponse.json(
        { error: 'Book is not available' },
        { status: 400 }
      );
    }

    const existingRequest = await prisma.borrowRecord.findFirst({
      where: {
        userId: session.user.id,
        bookId,
        status: { in: ['PENDING', 'APPROVED'] },
      },
    });

    if (existingRequest) {
      return NextResponse.json(
        { error: 'You already have a pending or active request for this book' },
        { status: 400 }
      );
    }

    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 14);

    const borrowRecord = await prisma.borrowRecord.create({
      data: {
        userId: session.user.id,
        bookId,
        dueDate,
        status: 'PENDING',
      },
      include: {
        book: true,
      },
    });

    return NextResponse.json({
      message: 'Borrow request submitted successfully',
      borrowRecord,
    });
  } catch (error) {
    console.error('Error creating borrow record:', error);
    return NextResponse.json(
      { error: 'Error creating borrow request' },
      { status: 500 }
    );
  }
}
