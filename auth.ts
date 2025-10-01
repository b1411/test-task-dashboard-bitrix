import { compare } from "bcryptjs";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import prisma from "./prisma";
import { loginSchema as authSchema } from "./zod";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Credentials({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    const { email, password } = await authSchema.parseAsync(credentials);

                    const user = await prisma.user.findUnique({
                        where: { email: email },
                    })

                    if (!user) {
                        throw new Error("No user found with the given email");
                    }

                    const isPasswordValid = await compare(password, user.passwordHash);

                    if (!isPasswordValid) {
                        throw new Error("Invalid password");
                    }

                    return {
                        "id": user.id.toString(),
                        "email": user.email,
                        "name": user.name,
                        "phone": user.phone,
                        "address": user.address,
                    };
                } catch {
                    return null;
                }
            },
        })
    ],
    pages: {
        signIn: "/login",
        error: "/login",
    },
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.email = user.email;
                token.name = user.name;
                token.phone = user.phone;
                token.address = user.address;
            }
            return token;
        },
        async session({ session, token }) {
            if (token) {
                session.user.id = token.id as string;
                session.user.email = token.email as string;
                session.user.name = token.name as string;
                session.user.phone = token.phone as string;
                session.user.address = token.address as string;
            }
            return session;
        }
    }
})
