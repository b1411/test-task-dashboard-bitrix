"use client";

import { Alert, Box, Button, Container, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { getBitrix24Deals, recreateBitrix24Deal } from "../../../actions";
import OrderCard from "../../../components/OrderCard";

type Deal = {
  ID: number;
  TITLE: string;
  DATE_CREATE: string;
  STAGE_ID: string;
};

export default function Orders() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [currentStart, setCurrentStart] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadDeals = useCallback(
    async (start: number = 0, append: boolean = false) => {
      try {
        if (append) setLoadingMore(true);
        else setLoading(true);
        const response = await getBitrix24Deals(start);
        const newDeals = response.result as Deal[];
        if (append) {
          setDeals((prev) => [...prev, ...newDeals]);
        } else {
          setDeals(newDeals);
        }
        if (response.next) {
          setCurrentStart(response.next);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
        setLoading(false);
        setLoadingMore(false);
      } catch (err) {
        console.error(err);
        setError("Ошибка загрузки сделок");
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [],
  );

  useEffect(() => {
    loadDeals();
  }, [loadDeals]);

  const handleRepeatOrder = async (dealId: number) => {
    try {
      await recreateBitrix24Deal(dealId);
      setMessage("Заказ повторён успешно");
      setLoading(true);
      await loadDeals();
    } catch (err) {
      console.error(err);
      setMessage("Ошибка при повторении заказа");
    }
  };

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Typography variant="h4" gutterBottom>
          Загрузка...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="xl">
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Сделки
        </Typography>
        {message && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {message}
          </Alert>
        )}
        {deals.length === 0 ? (
          <Typography>Нет сделок</Typography>
        ) : (
          <Grid
            component={"div"}
            container
            spacing={2}
            columns={{
              xs: 1,
              sm: 2,
              md: 3,
              lg: 4,
              xl: 4,
            }}
          >
            {deals.map((deal) => (
              <Grid
                key={deal.ID}
                size={{
                  xs: 1,
                  sm: 1,
                  md: 1,
                  lg: 1,
                  xl: 1,
                }}
              >
                <OrderCard deal={deal} onRepeat={handleRepeatOrder} />
              </Grid>
            ))}
          </Grid>
        )}
        {hasMore && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              onClick={() => loadDeals(currentStart, true)}
              disabled={loadingMore}
              variant="outlined"
            >
              {loadingMore ? "Загрузка..." : "Загрузить ещё"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
