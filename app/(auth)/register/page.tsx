"use client";

import {
    Alert,
    Box,
    Button,
    TextField,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Image from "next/image";
import { useFormState } from "react-dom";
import { register } from "../../../actions";

export default function RegisterPage() {
    const [state, formAction] = useFormState(register, null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
                py: isMobile ? 0 : 4,
            }}
        >
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: isMobile ? '1fr' : '60% 40%',
                    width: "100%",
                    maxWidth: "lg",
                    boxShadow: isMobile ? 0 : 3,
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Box sx={{ p: 4, maxWidth: '400px', margin: '0 auto' }}>
                    <Typography variant="h4" sx={{ textAlign: 'center', mb: 2 }}>
                        ЛОГОТИП
                    </Typography>
                    <Typography variant="h5" gutterBottom sx={{ textAlign: 'center' }}>
                        Регистрация
                    </Typography>
                    {state?.message && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {state.message}
                        </Alert>
                    )}
                    <form action={formAction}>
                        <TextField
                            fullWidth
                            label="Имя"
                            name="name"
                            margin="normal"
                            error={!!(state?.error as Record<string, string[]>)?.name}
                            helperText={(state?.error as Record<string, string[]>)?.name?.[0]}
                        />
                        <TextField
                            fullWidth
                            label="Email"
                            name="email"
                            type="email"
                            margin="normal"
                            error={!!(state?.error as Record<string, string[]>)?.email}
                            helperText={(state?.error as Record<string, string[]>)?.email?.[0]}
                        />
                        <TextField
                            fullWidth
                            label="Пароль"
                            name="password"
                            type="password"
                            margin="normal"
                            error={!!(state?.error as Record<string, string[]>)?.password}
                            helperText={(state?.error as Record<string, string[]>)?.password?.[0]}
                        />
                        <TextField
                            fullWidth
                            label="Телефон"
                            name="phone"
                            margin="normal"
                            error={!!(state?.error as Record<string, string[]>)?.phone}
                            helperText={(state?.error as Record<string, string[]>)?.phone?.[0]}
                        />
                        <TextField
                            fullWidth
                            label="Адрес"
                            name="address"
                            margin="normal"
                            error={!!(state?.error as Record<string, string[]>)?.address}
                            helperText={(state?.error as Record<string, string[]>)?.address?.[0]}
                        />
                        <Button
                            type="submit"
                            variant="contained"
                            fullWidth
                            sx={{ mt: 2 }}
                        >
                            Зарегистрироваться
                        </Button>
                    </form>
                </Box>
                {!isMobile && (
                    <Box sx={{ position: "relative", minHeight: "400px" }}>
                        <Image
                            src="/images/car.png"
                            alt="Registration image"
                            fill
                            style={{ objectFit: "cover" }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );
}
