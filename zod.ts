import { z } from "zod";

export const registerSchema = z.object({
    email: z.email("Неверный формат email"),
    phone: z.string().min(10, "Телефон должен содержать минимум 10 символов").max(15, "Телефон не должен превышать 15 символов").optional(),
    address: z.string().min(5, "Адрес должен содержать минимум 5 символов").max(200, "Адрес не должен превышать 200 символов").optional(),
    password: z.string().min(6, "Пароль должен содержать минимум 6 символов").max(100, "Пароль не должен превышать 100 символов"),
    name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100, "Имя не должно превышать 100 символов"),
});

export const loginSchema = z.object({
    email: z.string().email("Неверный формат email"),
    password: z.string().min(1, "Пароль обязателен"),
});

export const profileSchema = z.object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа").max(100, "Имя не должно превышать 100 символов"),
    phone: z.string().min(10, "Телефон должен содержать минимум 10 символов").max(15, "Телефон не должен превышать 15 символов").optional().or(z.literal("")),
    address: z.string().min(5, "Адрес должен содержать минимум 5 символов").max(200, "Адрес не должен превышать 200 символов").optional().or(z.literal("")),
});