"use client";

import {
    Alert,
    Box,
    Button,
    Divider,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { ZodError } from "zod";
import { loginSchema } from "../../../zod";

export default function LoginPage() {
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));
    const router = useRouter();

    const validate = () => {
        try {
            loginSchema.parse(formData);
            setFieldErrors({});
            return true;
        } catch (e) {
            if (e instanceof ZodError) {
                setFieldErrors(e.flatten().fieldErrors);
                return false;
            }
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        const newFormData = { ...formData, [name]: value };
        setFormData(newFormData);
        try {
            loginSchema.parse(newFormData);
            setFieldErrors({});
        } catch (err) {
            if (err instanceof ZodError) {
                setFieldErrors(err.flatten().fieldErrors);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        if (!validate()) return;

        const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            redirect: false,
        });

        if (result?.error) {
            setError("Неверный email или пароль");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100dvh",
            }}
        >
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: isMobile ? "1fr" : "60% 40%",
                    width: "100%",
                    overflow: "hidden",
                    height: "100%",
                }}
            >
                <Box
                    sx={{
                        p: 4,
                        maxWidth: "400px",
                        margin: "0 auto",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        height: "100%",
                    }}
                >
                    <Typography variant="h3" sx={{ textAlign: "center", mb: 2 }}>
                        ЛОГОТИП
                    </Typography>
                    <Typography variant="h4" gutterBottom sx={{ textAlign: "center" }}>
                        Вход
                    </Typography>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <form onSubmit={handleSubmit}>
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            margin="normal"
                            value={formData.email}
                            onChange={handleChange}
                            error={!!fieldErrors.email}
                            helperText={fieldErrors.email?.[0]}
                        />
                        <TextField
                            fullWidth
                            label="Пароль"
                            name="password"
                            type="password"
                            margin="normal"
                            value={formData.password}
                            onChange={handleChange}
                            error={!!fieldErrors.password}
                            helperText={fieldErrors.password?.[0]}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                            disabled={
                                !formData.email ||
                                !formData.password ||
                                Object.keys(fieldErrors).length > 0
                            }
                        >
                            Войти
                        </Button>
                    </form>
                    <Divider sx={{ my: 2 }}>или</Divider>
                    <Typography variant="body2" sx={{ textAlign: "center" }}>
                        <Link
                            href="/auth/register"
                            style={{
                                color: theme.palette.primary.main,
                                textDecoration: "none",
                            }}
                        >
                            Зарегистрироваться
                        </Link>
                    </Typography>
                </Box>
                {!isMobile && (
                    <Box sx={{ position: "relative", minHeight: "400px" }}>
                        <Image
                            src="/images/car.png"
                            alt="Login image"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
