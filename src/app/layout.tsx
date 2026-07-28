import type { Metadata } from "next";
import { Cinzel, Inter } from "next/font/google";
import "./globals.css";

const cinzel = Cinzel({
	subsets: ["latin"],
	variable: "--font-cinzel",
	display: "swap",
});

const inter = Inter({
	subsets: ["latin"],
	variable: "--font-inter",
	display: "swap",
});

export const metadata: Metadata = {
	title: "PoE Challenge Tracker",
	description:
		"Track your Path of Exile league challenge progress with an interactive guide",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en" className={`${cinzel.variable} ${inter.variable}`}>
			<body className="min-h-screen antialiased">{children}</body>
		</html>
	);
}
