import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

type Role = "STUDENT" | "LIBRARIAN";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    redirect("/login");
  }
  return session;
}

export async function requireRole(role: Role) {
  const session = await requireSession();
  if (session.user.role !== role) {
    const fallback =
      session.user.role === "LIBRARIAN"
        ? "/admin/dashboard"
        : "/student/dashboard";
    redirect(fallback);
  }
  return session;
}
