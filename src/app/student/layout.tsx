import { ReactNode } from "react";
import { requireRole } from "@/lib/guards";

export default async function StudentLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireRole("STUDENT");
  return <>{children}</>;
}
