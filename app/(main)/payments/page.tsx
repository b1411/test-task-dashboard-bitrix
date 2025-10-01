"use client";

import {
    Box,
    Button,
    Container,
    FormControl,
    InputLabel,
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
import { useState } from "react";
import { mockPayments } from "../../../mocks/data";

export default function Payments() {
    const [filterName, setFilterName] = useState("");
    const [filterStatus, setFilterStatus] = useState("");

    const filteredPayments = mockPayments.filter((payment) => {
        return (
            (filterName === "" ||
                (payment.accountNumber || "").toLowerCase().includes(filterName.toLowerCase())) &&
            (filterStatus === "" || payment.status === filterStatus)
        );
    });

    return (
        <Container maxWidth="xl" sx={{ p: 3 }}>
            <Typography variant="h4" gutterBottom>
                Платежи
            </Typography>
            <Box sx={{ mb: 2, display: "flex", gap: 2, flexWrap: "wrap" }}>
                <TextField
                    label="Номер счета"
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
                            <TableCell sx={{ color: 'primary.main' }}>Номер счета</TableCell>
                            <TableCell sx={{ color: 'primary.main' }}>Дата</TableCell>
                            <TableCell sx={{ color: 'primary.main' }}>Сумма</TableCell>
                            <TableCell sx={{ color: 'primary.main' }}>Статус</TableCell>
                            <TableCell sx={{ color: 'primary.main' }}>Действие</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredPayments.map((payment) => (
                            <TableRow key={payment.id}>
                                <TableCell>{payment.accountNumber}</TableCell>
                                <TableCell>{payment.date}</TableCell>
                                <TableCell>{payment.amount} тг</TableCell>
                                <TableCell>
                                    <Typography sx={{ color: payment.status === 'Оплачен' ? 'primary.main' : 'text.primary' }}>
                                        {payment.status}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    {payment.status !== 'Оплачен' ? (
                                        <Button variant="contained" sx={{ bgcolor: 'black', color: 'white' }}>
                                            Отправить
                                        </Button>
                                    ) : null}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Container>
    );
}