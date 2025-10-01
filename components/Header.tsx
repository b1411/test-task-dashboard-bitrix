"use client";

import {
    Dashboard as DashboardIcon,
    LiveTv as LiveTvIcon,
    Payment as PaymentIcon,
    Person as PersonIcon,
    ShoppingCart as ShoppingCartIcon,
} from "@mui/icons-material";
import {
    AppBar,
    Box,
    Tab,
    Tabs,
    Toolbar,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigationItems = [
    { label: "Дашборд", href: "/dashboard", icon: <DashboardIcon /> },
    { label: "Профиль", href: "/profile", icon: <PersonIcon /> },
    { label: "Заказы", href: "/orders", icon: <ShoppingCartIcon /> },
    { label: "Платежи", href: "/payments", icon: <PaymentIcon /> },
    { label: "Трансляция", href: "/stream", icon: <LiveTvIcon /> },
];

export default function Header() {
    const pathname = usePathname();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("md"));

    const activeTab = navigationItems.findIndex((item) => item.href === pathname);

    return (
        <AppBar position="static" sx={{ backgroundColor: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
            <Toolbar>
                <Box sx={{ width: "100%", overflow: "hidden", display: 'flex', justifyContent: isMobile ? 'flex-start' : 'flex-end' }}>
                    <Tabs
                        value={activeTab !== -1 ? activeTab : false}
                        variant={isMobile ? "scrollable" : "standard"}
                        scrollButtons={isMobile ? "auto" : false}
                        allowScrollButtonsMobile
                        sx={{
                            "& .MuiTab-root": {
                                minHeight: 48,
                                textTransform: "none",
                                borderRadius: 1,
                                mx: 0.5,
                            },
                            "& .Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "white !important",
                                "& .MuiTab-iconWrapper": {
                                    color: "white",
                                },
                            },
                            "& .MuiTab-root:not(.Mui-selected)": {
                                backgroundColor: "#f5f5f5",
                                color: "grey.600",
                                "& .MuiTab-iconWrapper": {
                                    color: "grey.600",
                                },
                            },
                        }}
                    >
                        {navigationItems.map((item) => (
                            <Tab
                                key={item.href}
                                label={
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                        {item.icon}
                                        {item.label}
                                    </Box>
                                }
                                component={Link}
                                href={item.href}
                            />
                        ))}
                    </Tabs>
                </Box>
            </Toolbar>
        </AppBar>
    );
}
