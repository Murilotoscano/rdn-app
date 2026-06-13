import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RDN Exam Practice",
  description: "Prepare for your RDN exam with 900+ practice questions.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "RDN Practice",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // App-like feel
  themeColor: "#667eea",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <div style={{ 
          position: "fixed", 
          top: "10px", 
          right: "10px", 
          fontSize: "12px", 
          fontWeight: "bold",
          background: "#ef4444", 
          color: "white",
          padding: "4px 8px",
          borderRadius: "4px",
          zIndex: 9999,
          boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
        }}>
          v3.0.0-en
        </div>
        {children}
      </body>
    </html>
  );
}
