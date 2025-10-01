import type { DefaultSession } from "next-auth";

declare module "next-auth" {
    interface User {
        id: string;
        email: string;
        name: string | null;
        phone: string | null;
        address: string | null;
    }

    interface Session {
        user: User & DefaultSession["user"];
        expires: string;
        error: string;
    }
}
