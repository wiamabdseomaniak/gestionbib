"use client";

import { useEffect, useMemo, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Header } from "@/components/layout/Header";
import { BookGrid } from "@/components/books/BookGrid";
import { Book, BorrowRecord } from "@/types";
import { Card, Badge } from "@/components/ui";

export default function StudentDashboardPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [error, setError] = useState("");

  async function loadData() {
    setError("");
    try {
      const [booksRes, recordsRes] = await Promise.all([
        fetch("/api/books?available=true"),
        fetch("/api/borrow"),
      ]);
      if (!booksRes.ok || !recordsRes.ok) throw new Error("fetch_failed");
      const booksData = await booksRes.json();
      const recordsData = await recordsRes.json();
      setBooks(booksData.books ?? []);
      setRecords(recordsData.borrowRecords ?? []);
    } catch {
      setError("Impossible de charger les donnees etudiant.");
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  const borrowedCount = useMemo(
    () => records.filter((item) => item.status === "APPROVED").length,
    [records],
  );

  async function borrowBook(book: Book) {
    setError("");
    try {
      const response = await fetch("/api/borrow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId: book.id }),
      });
      if (!response.ok) throw new Error("borrow_failed");
    } catch {
      setError("Echec de la demande d'emprunt.");
      return;
    }
    loadData();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <DashboardLayout>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-gray-500">Livres disponibles</p>
            <p className="text-3xl font-bold text-gray-900">{books.length}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Livres empruntes</p>
            <p className="text-3xl font-bold text-gray-900">{borrowedCount}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Demandes totales</p>
            <p className="text-3xl font-bold text-gray-900">{records.length}</p>
          </Card>
        </div>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <h2 className="mb-3 text-xl font-semibold text-gray-900">
          Catalogue disponible
        </h2>
        <BookGrid books={books} onBorrow={borrowBook} />

        <h2 className="mb-3 mt-10 text-xl font-semibold text-gray-900">
          Historique des emprunts
        </h2>
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Livre</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Statut</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="px-4 py-3">{record.book?.title}</td>
                  <td className="px-4 py-3">
                    {new Date(record.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <Badge>{record.status}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </div>
  );
}
