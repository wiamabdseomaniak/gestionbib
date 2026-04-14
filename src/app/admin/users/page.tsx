"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

type UserView = {
  id: string;
  name: string;
  email: string;
  role: string;
  borrowCount: number;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserView[]>([]);
  const [error, setError] = useState("");

  async function loadUsers() {
    setError("");
    try {
      const response = await fetch("/api/users");
      if (!response.ok) throw new Error("fetch_failed");
      const data = await response.json();
      setUsers(data.users ?? []);
    } catch {
      setError("Impossible de charger les utilisateurs.");
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <DashboardLayout>
        <h1 className="mb-4 text-2xl font-bold text-gray-900">
          Gestion des utilisateurs
        </h1>
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        <div className="overflow-hidden rounded-xl bg-white shadow">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3">Nom</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Emprunts</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.role}</td>
                  <td className="px-4 py-3">{user.borrowCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </DashboardLayout>
    </div>
  );
}
