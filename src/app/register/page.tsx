"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button, Card, Input } from "@/components/ui";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError("");

    let response: Response;
    try {
      response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
    } catch {
      setLoading(false);
      setError("Erreur reseau. Verifiez la connexion puis reessayez.");
      return;
    }

    setLoading(false);

    if (!response.ok) {
      const data = await response.json();
      setError(data.error ?? "Erreur de creation de compte.");
      return;
    }

    router.push(`/login?role=${form.role === "LIBRARIAN" ? "librarian" : "student"}`);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-2xl px-4 py-10">
        <Card className="w-full">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Inscription</h1>
          <p className="mb-6 text-sm text-gray-600">
            Creez un compte et commencez a utiliser GestioBib.
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              label="Nom complet"
              value={form.name}
              onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
              required
            />
            <Input
              type="email"
              label="Email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              required
            />
            <Input
              type="password"
              label="Mot de passe"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              required
            />
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) => setForm((prev) => ({ ...prev, role: e.target.value }))}
                className="w-full rounded-md border border-gray-300 px-4 py-2 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="STUDENT">Etudiant</option>
                <option value="LIBRARIAN">Bibliothecaire</option>
              </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">
              Creer mon compte
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
