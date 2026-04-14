import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role: "STUDENT" | "LIBRARIAN";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    role: "STUDENT" | "LIBRARIAN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: "STUDENT" | "LIBRARIAN";
  }
}
