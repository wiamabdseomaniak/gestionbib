import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const adapter = new PrismaBetterSqlite3({
  url: process.env.DATABASE_URL ?? "file:./dev.db",
});

const prisma = new PrismaClient({ adapter });

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function main() {
  const librarian = await prisma.user.findUnique({
    where: { email: "librarian@gestiobib.local" },
  });
  const student = await prisma.user.findUnique({
    where: { email: "student@gestiobib.local" },
  });
  const booksCount = await prisma.book.count();
  const pendingCount = await prisma.borrowRecord.count({
    where: { status: "PENDING" },
  });

  assert(librarian, "Utilisateur librarian manquant.");
  assert(student, "Utilisateur student manquant.");
  assert(librarian.role === "LIBRARIAN", "Role librarian invalide.");
  assert(student.role === "STUDENT", "Role student invalide.");
  assert(booksCount >= 6, "Nombre de livres insuffisant (< 6).");
  assert(pendingCount >= 1, "Aucune demande PENDING detectee.");

  console.log("Smoke test reussi.");
  console.log(`- Books: ${booksCount}`);
  console.log(`- Pending requests: ${pendingCount}`);
}

main()
  .catch((error) => {
    console.error("Smoke test echec:", error.message);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
