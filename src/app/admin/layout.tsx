import { ReactNode } from "react";
import { requireRole } from "@/lib/guards";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("LIBRARIAN");
  return <>{children}</>;
}
