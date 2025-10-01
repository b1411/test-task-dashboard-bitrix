"use client";

import { Box, Button, Card, Typography } from "@mui/material";

type Deal = {
    ID: number;
    TITLE: string;
    DATE_CREATE: string;
    STAGE_ID: string;
};

type OrderCardProps = {
    deal: Deal;
    onRepeat: (dealId: number) => void;
};

export default function OrderCard({ deal, onRepeat }: OrderCardProps) {
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("ru-RU");
    };

    const getStatusText = (stageId: string) => {
        const statuses: Record<string, string> = {
            NEW: "Новая",
            PREPARATION: "Подготовка",
            PREPAYMENT_INVOICE: "Выставлен счёт",
            EXECUTING: "В работе",
            FINAL_INVOICE: "Финальный счёт",
            WON: "Сделка успешна",
            LOSE: "Сделка провалена",
            APOLOGY: "Анализ причины провала",
        };
        return statuses[stageId] || stageId;
    };

    return (
        <Card sx={{ mb: 2, p: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Box
                    sx={{
                        width: 8,
                        height: 8,
                        bgcolor: "primary.main",
                        borderRadius: "50%",
                        mr: 1,
                    }}
                />
                <Typography
                    variant="body1"
                    sx={{ fontWeight: "bold", color: "text.primary", fontSize: "1.1rem" }}
                >
                    {getStatusText(deal.STAGE_ID)}
                </Typography>
            </Box>
            <Typography
                variant="h5"
                gutterBottom
                sx={{ color: "text.primary", fontSize: "1.5rem" }}
            >
                {deal.TITLE}
            </Typography>
            <Typography
                variant="body1"
                sx={{ color: "text.primary", mb: 2, fontSize: "1rem" }}
            >
                Дата: {formatDate(deal.DATE_CREATE)}
            </Typography>
            <Button
                variant="outlined"
                onClick={() => onRepeat(deal.ID)}
                sx={{ mt: 2, width: "100%" }}
            >
                Повторить заказ
            </Button>
        </Card>
    );
}
