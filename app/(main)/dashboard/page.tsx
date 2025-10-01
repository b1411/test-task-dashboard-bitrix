"use client";

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Container,
    FormControl,
    InputLabel,
    LinearProgress,
    MenuItem,
    Paper,
    Select,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";
import { Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useState } from "react";
import useSWR from "swr";
import { getProfile } from "../../../actions";
import { mockOrders, mockPayments } from "../../../mocks/data";

export default function Dashboard() {
    const { data: user } = useSWR("profile", getProfile);
    const [filterName, setFilterName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filteredPayments = mockPayments.filter((payment) => {
        return (
            (filterName === "" ||
                (payment.employee || "")
                    .toLowerCase()
                    .includes(filterName.toLowerCase())) &&
            (filterStatus === "" || payment.status === filterStatus)
        );
    });

    return (
        <Container maxWidth="xl" sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Привет, {user?.name || "Пользователь"} 👋
            </Typography>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "7fr 3fr" },
                    gap: 3,
                    mb: 3,
                }}
            >
                {/* Заказы */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box
                                sx={{
                                    width: 4,
                                    height: 24,
                                    backgroundColor: "primary.main",
                                    mr: 1,
                                }}
                            />
                            <Typography variant="h6">Заказы</Typography>
                        </Box>
                        <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={10}
                            slidesPerView={1}
                            navigation
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                        >
                            {mockOrders.map((order) => (
                                <SwiperSlide key={order.id}>
                                    <Card sx={{ minHeight: 150 }}>
                                        <CardContent>
                                            <Typography variant="h6">{order.title}</Typography>
                                            <Typography variant="body2">
                                                {order.description}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Статус: {order.status}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary">
                                                Дата: {order.date}
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </CardContent>
                </Card>

                {/* Профиль */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box
                                sx={{
                                    width: 4,
                                    height: 24,
                                    backgroundColor: "primary.main",
                                    mr: 1,
                                }}
                            />
                            <Typography variant="h6">Профиль</Typography>
                        </Box>
                        <Box sx={{ display: "flex", gap: 3 }}>
                            <Avatar sx={{ width: 90, height: 90 }}>
                                {user?.name?.[0] || "U"}
                            </Avatar>
                            <Box sx={{ flex: 1 }}>
                                <TextField
                                    label="Имя"
                                    value={user?.name || ""}
                                    disabled
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
                                    value={user?.phone || ""}
                                    disabled
                                    fullWidth
                                    sx={{ mb: 2 }}
                                />
                                <TextField
                                    label="Адрес"
                                    value={user?.address || ""}
                                    disabled
                                    fullWidth
                                />
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "7fr 13fr" },
                    gap: 3,
                }}
            >
                {/* Трансляция */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box
                                sx={{
                                    width: 4,
                                    height: 24,
                                    backgroundColor: "primary.main",
                                    mr: 1,
                                }}
                            />
                            <Typography variant="h6">Трансляция</Typography>
                        </Box>
                        <Box
                            sx={{
                                height: 200,
                                backgroundColor: "grey.300",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                borderRadius: 1,
                            }}
                        >
                            <Typography>Моковое изображение трансляции</Typography>
                        </Box>
                    </CardContent>
                </Card>

                {/* Платежи */}
                <Card>
                    <CardContent>
                        <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                            <Box
                                sx={{
                                    width: 4,
                                    height: 24,
                                    backgroundColor: "primary.main",
                                    mr: 1,
                                }}
                            />
                            <Typography variant="h6">Платежи</Typography>
                        </Box>
                        <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                            <TextField
                                label="Сотрудник"
                                value={filterName}
                                onChange={(e) => setFilterName(e.target.value)}
                                size="small"
                            />
                            <FormControl size="small" sx={{ minWidth: 120 }}>
                                <InputLabel>Статус</InputLabel>
                                <Select
                                    value={filterStatus}
                                    onChange={(e) => setFilterStatus(e.target.value)}
                                    label="Статус"
                                >
                                    <MenuItem value="">Все</MenuItem>
                                    <MenuItem value="Оплачен">Оплачен</MenuItem>
                                    <MenuItem value="Не оплачен">Не оплачен</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <TableContainer component={Paper}>
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Сотрудник</TableCell>
                                        <TableCell>Статус</TableCell>
                                        <TableCell>Выполнено</TableCell>
                                        <TableCell>Действие</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredPayments.map((payment) => (
                                        <TableRow key={payment.id}>
                                            <TableCell>{payment.employee}</TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{
                                                        display: "flex",
                                                        alignItems: "center",
                                                        border: 1,
                                                        justifyContent: "center",
                                                        borderRadius: "60px",
                                                        px: 1,
                                                        py: 0.5,
                                                        borderColor:
                                                            payment.status === "Оплачен"
                                                                ? "success.light"
                                                                : "error.light",
                                                        bgcolor:
                                                            payment.status === "Оплачен"
                                                                ? "success.light"
                                                                : "error.light",
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            width: 8,
                                                            height: 8,
                                                            bgcolor:
                                                                payment.status === "Оплачен"
                                                                    ? "success.dark"
                                                                    : "error.dark",
                                                            borderRadius: "50%",
                                                            mr: 1,
                                                        }}
                                                    />
                                                    <Typography
                                                        variant="body2"
                                                        sx={{
                                                            color:
                                                                payment.status === "Оплачен"
                                                                    ? "success.dark"
                                                                    : "error.dark",
                                                        }}
                                                    >
                                                        {payment.status}
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Box
                                                    sx={{ display: "flex", alignItems: "center", gap: 1 }}
                                                >
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={payment.progress || 0}
                                                        sx={{
                                                            width: 100,
                                                            "& .MuiLinearProgress-bar": {
                                                                bgcolor: "success.main",
                                                            },
                                                            "& .MuiLinearProgress-track": {
                                                                bgcolor: "grey.300",
                                                            },
                                                        }}
                                                    />
                                                    <Typography variant="body2">
                                                        {payment.progress || 0}%
                                                    </Typography>
                                                </Box>
                                            </TableCell>
                                            <TableCell>
                                                <Button variant="text" size="small">
                                                    Просмотреть
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </CardContent>
                </Card>
            </Box>
        </Container>
    );
}
