"use client";

import {
    Avatar,
    Box,
    Button,
    Container,
    TextField,
    Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import useSWR from "swr";
import { getProfile, updateProfile } from "../../../actions";

type ProfileForm = {
    name: string;
    phone?: string;
    address?: string;
};

type FormErrors = {
    name?: string;
    phone?: string;
    address?: string;
};

export default function Profile() {
    const { data: user } = useSWR("profile", getProfile);
    const [message, setMessage] = useState<string | null>(null);
    const [formData, setFormData] = useState<ProfileForm>({
        name: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
    });
    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                phone: user.phone || "",
                address: user.address || "",
            });
        }
    }, [user]);

    const validateField = (name: keyof ProfileForm, value: string) => {
        const newErrors = { ...errors };
        if (name === "name") {
            if (!value.trim()) {
                newErrors.name = "Имя обязательно";
            } else {
                delete newErrors.name;
            }
        } else if (name === "phone") {
            if (value && !/^\+?\d{10,15}$/.test(value)) {
                newErrors.phone = "Неверный формат телефона";
            } else {
                delete newErrors.phone;
            }
        } else if (name === "address") {
            delete newErrors.address;
        }
        setErrors(newErrors);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        validateField(name as keyof ProfileForm, value);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = "Имя обязательно";
        if (formData.phone && !/^\+?\d{10,15}$/.test(formData.phone))
            newErrors.phone = "Неверный формат телефона";
        setErrors(newErrors);

        if (Object.keys(newErrors).length === 0) {
            const result = await updateProfile(formData);
            setMessage(result?.message || "Ошибка");
        }
    };

    return (
        <Container maxWidth="xl">
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Профиль
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Box sx={{ display: "flex", gap: 3, mb: 3, maxWidth: "60%" }}>
                        <Avatar sx={{ width: 90, height: 90 }}>
                            {user?.name?.[0] || "U"}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                            <TextField
                                label="Имя"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={!!errors.name}
                                helperText={errors.name}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Email"
                                value={user?.email || ""}
                                disabled
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Телефон"
                                name="phone"
                                value={formData.phone || ""}
                                onChange={handleChange}
                                error={!!errors.phone}
                                helperText={errors.phone}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <TextField
                                label="Адрес"
                                name="address"
                                value={formData.address || ""}
                                onChange={handleChange}
                                error={!!errors.address}
                                helperText={errors.address}
                                fullWidth
                                sx={{ mb: 2 }}
                            />
                            <Button type="submit" variant="contained" fullWidth>
                                Сохранить
                            </Button>
                        </Box>
                    </Box>

                    {message && (
                        <Typography sx={{ mt: 2 }} color="primary">
                            {message}
                        </Typography>
                    )}
                </form>
            </Box>
        </Container>
    );
}
