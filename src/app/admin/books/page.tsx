"use client";

import { FormEvent, useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Book } from "@/types";
import { Button, Card, Input } from "@/components/ui";

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: "",
    author: "",
    category: "",
    description: "",
  });
  const [error, setError] = useState("");

  async function loadBooks() {
    setError("");
    try {
      const response = await fetch("/api/books");
      if (!response.ok) throw new Error("fetch_failed");
      const data = await response.json();
      setBooks(data.books ?? []);
    } catch {
      setError("Impossible de charger les livres.");
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function createBook(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("create_failed");
    } catch {
      setLoading(false);
      setError("Echec de creation du livre.");
      return;
    }
    setLoading(false);
    setForm({ title: "", author: "", category: "", description: "" });
    loadBooks();
  }

  async function removeBook(id: string) {
    setError("");
    try {
      const response = await fetch(`/api/books/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("delete_failed");
    } catch {
      setError("Echec de suppression du livre.");
      return;
    }
    loadBooks();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <DashboardLayout>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">Gestion des livres</h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <Card className="mb-8">
          <form onSubmit={createBook} className="grid gap-3 md:grid-cols-2">
            <Input
              label="Titre"
              value={form.title}
              onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
              required
            />
            <Input
              label="Auteur"
              value={form.author}
              onChange={(e) => setForm((p) => ({ ...p, author: e.target.value }))}
              required
            />
            <Input
              label="Categorie"
              value={form.category}
              onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))}
              required
            />
            <Input
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm((p) => ({ ...p, description: e.target.value }))
              }
            />
            <Button type="submit" className="md:col-span-2" loading={loading}>
              Ajouter le livre
            </Button>
          </form>
        </Card>

        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Titre</th>
                <th className="px-4 py-3">Auteur</th>
                <th className="px-4 py-3">Categorie</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book) => (
                <tr key={book.id} className="border-t">
                  <td className="px-4 py-3">{book.title}</td>
                  <td className="px-4 py-3">{book.author}</td>
                  <td className="px-4 py-3">{book.category}</td>
                  <td className="px-4 py-3">
                    <Button variant="danger" size="sm" onClick={() => removeBook(book.id)}>
                      Supprimer
                    </Button>
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
