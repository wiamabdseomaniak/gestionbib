"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { BorrowRecord } from "@/types";
import { Badge, Button } from "@/components/ui";

export default function AdminRequestsPage() {
  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [error, setError] = useState("");

  async function loadRecords() {
    setError("");
    try {
      const response = await fetch("/api/borrow");
      if (!response.ok) throw new Error("fetch_failed");
      const data = await response.json();
      setRecords(data.borrowRecords ?? []);
    } catch {
      setError("Impossible de charger les demandes.");
    }
  }

  useEffect(() => {
    loadRecords();
  }, []);

  async function updateStatus(id: string, status: string) {
    setError("");
    try {
      const response = await fetch(`/api/borrow/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!response.ok) throw new Error("update_failed");
    } catch {
      setError("Echec de mise a jour du statut.");
      return;
    }
    loadRecords();
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <DashboardLayout>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Demandes d&apos;emprunt
        </h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Etudiant</th>
                <th className="px-4 py-3">Livre</th>
                <th className="px-4 py-3">Statut</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-t">
                  <td className="px-4 py-3">{record.user?.name}</td>
                  <td className="px-4 py-3">{record.book?.title}</td>
                  <td className="px-4 py-3">
                    <Badge>{record.status}</Badge>
                  </td>
                  <td className="flex gap-2 px-4 py-3">
                    <Button size="sm" onClick={() => updateStatus(record.id, "APPROVED")}>
                      Approuver
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => updateStatus(record.id, "REJECTED")}
                    >
                      Rejeter
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => updateStatus(record.id, "RETURNED")}
                    >
                      Retour
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
