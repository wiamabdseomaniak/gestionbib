import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const hashed = await bcrypt.hash("Password123!", 10);

  const librarian = await prisma.user.upsert({
    where: { email: "librarian@gestiobib.local" },
    update: {
      name: "Admin Librarian",
      password: hashed,
      role: "LIBRARIAN",
    },
    create: {
      name: "Admin Librarian",
      email: "librarian@gestiobib.local",
      password: hashed,
      role: "LIBRARIAN",
    },
  });

  const student = await prisma.user.upsert({
    where: { email: "student@gestiobib.local" },
    update: {
      name: "Demo Student",
      password: hashed,
      role: "STUDENT",
    },
    create: {
      name: "Demo Student",
      email: "student@gestiobib.local",
      password: hashed,
      role: "STUDENT",
    },
  });

  const books = [
    {
      title: "Clean Code",
      author: "Robert C. Martin",
      category: "Technology",
      description: "A handbook of agile software craftsmanship.",
    },
    {
      title: "The Pragmatic Programmer",
      author: "Andrew Hunt",
      category: "Technology",
      description: "Practical software engineering best practices.",
    },
    {
      title: "Sapiens",
      author: "Yuval Noah Harari",
      category: "History",
      description: "A brief history of humankind.",
    },
    {
      title: "A Brief History of Time",
      author: "Stephen Hawking",
      category: "Science",
      description: "Cosmology and our universe.",
    },
    {
      title: "Atomic Habits",
      author: "James Clear",
      category: "Non-Fiction",
      description: "Build good habits and break bad ones.",
    },
    {
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      category: "Fiction",
      description: "A fantasy adventure classic.",
    },
  ];

  for (const book of books) {
    const existing = await prisma.book.findFirst({
      where: { title: book.title, author: book.author },
    });

    if (existing) {
      await prisma.book.update({
        where: { id: existing.id },
        data: {
          description: book.description,
          category: book.category,
        },
      });
    } else {
      await prisma.book.create({
        data: {
          title: book.title,
          author: book.author,
          description: book.description,
          category: book.category,
        },
      });
    }
  }

  const firstBook = await prisma.book.findFirst({
    orderBy: { createdAt: "asc" },
  });

  if (firstBook) {
    const existing = await prisma.borrowRecord.findFirst({
      where: {
        userId: student.id,
        bookId: firstBook.id,
        status: "PENDING",
      },
    });

    if (!existing) {
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 14);
      await prisma.borrowRecord.create({
        data: {
          userId: student.id,
          bookId: firstBook.id,
          dueDate,
          status: "PENDING",
        },
      });
    }
  }

  console.log("Seed termine.");
  console.log("Librarian: librarian@gestiobib.local / Password123!");
  console.log("Student: student@gestiobib.local / Password123!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
