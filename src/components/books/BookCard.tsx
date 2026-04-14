'use client';

import { Book } from '@/types';
import { Card, Badge, Button } from '@/components/ui';
import { getCategoryColor } from '@/lib/utils';

interface BookCardProps {
  book: Book;
  onBorrow?: (book: Book) => void;
  onView?: (book: Book) => void;
  showActions?: boolean;
}

export const BookCard = ({ book, onBorrow, onView, showActions = true }: BookCardProps) => {
  return (
    <Card hover className="h-full flex flex-col">
      <div className="flex-1">
        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl p-8 mb-4 flex items-center justify-center">
          <svg className="h-20 w-20 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">
          {book.title}
        </h3>

        <p className="text-gray-600 mb-3">
          by <span className="font-medium">{book.author}</span>
        </p>

        <div className="flex items-center space-x-2 mb-3">
          <Badge className={getCategoryColor(book.category)}>
            {book.category}
          </Badge>
          <Badge variant={book.isAvailable ? 'success' : 'warning'}>
            {book.isAvailable ? 'Available' : 'Borrowed'}
          </Badge>
        </div>

        {book.description && (
          <p className="text-sm text-gray-500 line-clamp-3 mb-4">
            {book.description}
          </p>
        )}
      </div>

      {showActions && (
        <div className="flex space-x-2 mt-4">
          {onView && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onView(book)}
              className="flex-1"
            >
              View Details
            </Button>
          )}
          {onBorrow && book.isAvailable && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => onBorrow(book)}
              className="flex-1"
            >
              Borrow
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
