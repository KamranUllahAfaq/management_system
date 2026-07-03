import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";

export const metadata: Metadata = {
  title: "Royal Group of Hostel | Portal",
  description: "Premium Hostel Management System - Islamabad Hostel City",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark h-full antialiased">
      <head>
        {/* Load Google Fonts and Material Symbols Icons */}
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full bg-background text-foreground selection:bg-primary selection:text-on-primary">
        <AdminAuthProvider>
          <AuthProvider>
            {children}
          </AuthProvider>
        </AdminAuthProvider>
      </body>
    </html>
  );
}
