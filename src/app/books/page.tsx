"use client";

import { useEffect, useMemo, useState } from "react";
import { Header } from "@/components/layout/Header";
import { BookGrid } from "@/components/books/BookGrid";
import { Book } from "@/types";
import { Input, Button } from "@/components/ui";

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function loadBooks() {
    setLoading(true);
    setError("");
    const query = new URLSearchParams();
    if (search) query.set("search", search);
    if (category) query.set("category", category);

    try {
      const response = await fetch(`/api/books?${query.toString()}`);
      if (!response.ok) throw new Error("fetch_failed");
      const data = await response.json();
      setBooks(data.books ?? []);
    } catch {
      setError("Impossible de charger les livres pour le moment.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  const categories = useMemo(() => {
    return Array.from(new Set(books.map((book) => book.category)));
  }, [books]);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex flex-col gap-3 rounded-xl bg-white p-4 shadow-md md:flex-row">
          <Input
            placeholder="Rechercher un titre ou un auteur"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Toutes les categories</option>
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          <Button onClick={loadBooks} loading={loading}>
            Filtrer
          </Button>
        </div>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

        <BookGrid books={books} />
      </main>
    </div>
  );
}
