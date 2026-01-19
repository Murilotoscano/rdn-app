"use client";

import React from "react";
import styles from "./AppLayout.module.css";
import sidebarStyles from "./Sidebar.module.css";
import { LayoutDashboard, BookOpen, BarChart2, User, Settings, Calendar } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const NavItem = ({ href, icon: Icon, label, active }: any) => (
    <Link href={href} className={clsx(sidebarStyles.navItem, active && sidebarStyles.active)}>
        <Icon size={24} />
        <span className={sidebarStyles.label}>{label}</span>
    </Link>
);

const Sidebar = () => {
    const pathname = usePathname();

    const links = [
        { href: "/", label: "Dashboard", icon: LayoutDashboard },
        { href: "/study-plan", label: "Study Plan", icon: Calendar },
        { href: "/modules", label: "Modules", icon: BookOpen },
        { href: "/stats", label: "Stats", icon: BarChart2 },
        { href: "/profile", label: "Profile", icon: User },
    ];

    return (
        <nav className={sidebarStyles.sidebar}>
            <div className={sidebarStyles.brand}>
                <div style={{ width: 32, height: 32, background: "var(--primary)", borderRadius: 8 }}></div>
                <div className={sidebarStyles.brandTitle}>RDN Practice</div>
            </div>

            {links.map((link) => (
                <NavItem
                    key={link.href}
                    {...link}
                    active={pathname === link.href}
                />
            ))}
        </nav>
    );
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={styles.layout}>
            <Sidebar />
            <main className={styles.mainContent}>
                <div className="container">
                    {children}
                </div>
            </main>
        </div>
    );
}
