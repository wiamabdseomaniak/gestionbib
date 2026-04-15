import NextAuth, { DefaultSession } from "next-auth";
// types/next-auth.d.ts
import { Role } from '@prisma/client';
import "next-auth";
import { Role } from "./index";

declare module "next-auth" {
  interface User {
    role: Role;
    id: string;
  }
  
  interface Session {
    user: {
      role: Role;
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: Role;
    id: string;
  }
}
