"use server";

import { hash } from "bcryptjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ZodError } from "zod";
import { auth } from "./auth";
import prisma from "./prisma";
import { registerSchema } from "./zod";

type FormState = { error?: Record<string, string[]>; message?: string };

export async function register(
    _prevState: FormState | null | undefined,
    data: FormData,
): Promise<FormState | undefined> {
    try {
        const formData = Object.fromEntries(data.entries());
        const { email, password, name, phone, address } =
            await registerSchema.parseAsync(formData);

        const passwordHash = await hash(password, 10);

        await prisma.user.create({
            data: {
                email,
                passwordHash,
                name,
                phone,
                address,
            },
        });

        redirect("/login");
    } catch (error) {
        if (error instanceof ZodError) {
            const flattened = error.flatten();
            return {
                error: flattened.fieldErrors,
                message: "Ошибка валидации данных",
            };
        }
        if (
            error &&
            typeof error === "object" &&
            "code" in error &&
            error.code === "P2002"
        ) {
            return { message: "Пользователь с таким email уже существует" };
        }
        if (error instanceof Error) {
            return {
                message: `Что-то пошло не так: ${error.message}`,
            };
        }
    }
}

export async function updateProfile(
    data: { name: string; phone?: string; address?: string },
): Promise<{ message?: string } | undefined> {
    try {
        const session = await auth();
        if (!session?.user?.id) {
            return { message: "Не авторизован" };
        }

        await prisma.user.update({
            where: { id: parseInt(session.user.id, 10) },
            data: {
                name: data.name || null,
                phone: data.phone || null,
                address: data.address || null,
            },
        });

        revalidatePath("/profile");
        return { message: "Профиль обновлен" };
    } catch (error) {
        if (error instanceof Error) {
            return { message: `Ошибка: ${error.message}` };
        }
    }
}

export async function getProfile() {
    const session = await auth();
    if (!session?.user?.id) {
        return redirect("/login");
    }

    const user = await prisma.user.findUnique({
        where: { id: parseInt(session.user.id, 10) },
        select: { id: true, email: true, name: true, phone: true, address: true }
    });

    return user;
}

export async function getBitrix24Deals(start: number = 0): Promise<{
    result: unknown[];
    total: number;
    next?: number;
    time: Record<string, unknown>;
}> {
    const res = await fetch(`${process.env.BITRIX24_API_URL}crm.deal.list`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            start
        })
    });

    if (!res.ok) {
        throw new Error("Failed to fetch deals from Bitrix24");
    }

    return await res.json();
}

async function getBitrix24Deal(dealId: number): Promise<{
    result: Record<string, unknown>;
    time: Record<string, unknown>;
}> {
    const res = await fetch(`${process.env.BITRIX24_API_URL}crm.deal.get`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            id: dealId
        })
    });
    if (!res.ok) {
        throw new Error("Failed to fetch deal from Bitrix24");
    }
    return await res.json();
}

async function createBitrix24Contact({
    name,
    phone,
    email,
    address
}: {
    name: string;
    phone?: string;
    email?: string;
    address?: string;
}): Promise<{ result: number; time: Record<string, unknown> }> {
    const res = await fetch(`${process.env.BITRIX24_API_URL}crm.contact.add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            fields: {
                NAME: name,
                PHONE: phone ? [{ VALUE: phone, VALUE_TYPE: "WORK" }] : [],
                EMAIL: email ? [{ VALUE: email, VALUE_TYPE: "WORK" }] : [],
                ADDRESS: address || ""
            },
        })
    });

    if (!res.ok) {
        throw new Error("Failed to create contact in Bitrix24");
    }

    return await res.json();
}

export async function recreateBitrix24Deal(dealId: number): Promise<{
    result: number;
    time: Record<string, unknown>;
}> {
    const session = await auth();

    if (!session?.user?.id) {
        return redirect("/login");
    }

    const deal = await getBitrix24Deal(dealId);
    if (!deal.result) {
        throw new Error("Deal not found");
    }

    const createdContactId = await createBitrix24Contact({
        name: session.user.name || "No Name",
        phone: session.user.phone || undefined,
        email: session.user.email || undefined,
        address: session.user.address || undefined,
    })

    const res = await fetch(`${process.env.BITRIX24_API_URL}crm.deal.add`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({
            fields: {
                TITLE: deal.result.TITLE,
                CONTACT_ID: createdContactId.result,
                STAGE_ID: "NEW",
                OPPORTUNITY: deal.result.OPPORTUNITY,
                CURRENCY_ID: deal.result.CURRENCY_ID,
                ASSIGNED_BY_ID: deal.result.ASSIGNED_BY_ID,
            },
        })
    });

    if (!res.ok) {
        throw new Error("Failed to recreate deal in Bitrix24");
    }

    return await res.json();
}