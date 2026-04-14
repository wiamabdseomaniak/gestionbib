"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Button, Card, Input } from "@/components/ui";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const selectedRole = useMemo(
    () => (searchParams.get("role") === "librarian" ? "LIBRARIAN" : "STUDENT"),
    [searchParams],
  );

  useEffect(() => {
    if (!session?.user) return;
    const target =
      session.user.role === "LIBRARIAN"
        ? "/admin/dashboard"
        : "/student/dashboard";
    router.replace(target);
  }, [router, session]);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setLoading(true);

    let result;
    try {
      result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });
    } catch {
      setLoading(false);
      setError("Erreur reseau. Verifiez que le serveur est demarre.");
      return;
    }

    setLoading(false);

    if (!result?.ok || result.error) {
      setError("Identifiants invalides.");
      return;
    }

    const nextPath =
      selectedRole === "LIBRARIAN" ? "/admin/dashboard" : "/student/dashboard";
    router.push(nextPath);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto flex max-w-2xl px-4 py-10">
        <Card className="w-full">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Connexion</h1>
          <p className="mb-6 text-sm text-gray-600">
            Role selectionne:{" "}
            <span className="font-semibold">
              {selectedRole === "LIBRARIAN" ? "Bibliothecaire" : "Etudiant"}
            </span>
          </p>
          <form onSubmit={onSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" loading={loading} className="w-full">
              Se connecter
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
}
