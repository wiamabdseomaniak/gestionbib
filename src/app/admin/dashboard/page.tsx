"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    users: 0,
    pending: 0,
  });
  const [error, setError] = useState("");

  async function loadStats() {
    setError("");
    try {
      const [booksRes, usersRes, borrowRes] = await Promise.all([
        fetch("/api/books"),
        fetch("/api/users"),
        fetch("/api/borrow?status=PENDING"),
      ]);
      if (!booksRes.ok || !usersRes.ok || !borrowRes.ok) {
        throw new Error("fetch_failed");
      }
      const booksData = await booksRes.json();
      const usersData = await usersRes.json();
      const borrowData = await borrowRes.json();

      setStats({
        totalBooks: booksData.pagination?.total ?? 0,
        users: usersData.users?.length ?? 0,
        pending: borrowData.borrowRecords?.length ?? 0,
      });
    } catch {
      setError("Impossible de charger les statistiques admin.");
    }
  }

  useEffect(() => {
    loadStats();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <DashboardLayout>
        <h1 className="mb-6 text-2xl font-bold text-gray-900">
          Dashboard Bibliothecaire
        </h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <p className="text-sm text-gray-500">Total des livres</p>
            <p className="text-3xl font-bold text-gray-900">{stats.totalBooks}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Utilisateurs actifs</p>
            <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Demandes en attente</p>
            <p className="text-3xl font-bold text-gray-900">{stats.pending}</p>
          </Card>
        </div>
      </DashboardLayout>
    </div>
  );
}
