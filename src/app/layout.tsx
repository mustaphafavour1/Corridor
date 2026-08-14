import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "react-day-picker/dist/style.css";
import "./globals.css";
import { AppProvider } from "@/context/app-provider";

// Parkinsans is loaded via <link> below (not yet in this next/font registry version);
// the --font-parkinsans variable is declared in globals.css :root.
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "Corridor — Cross-Border Payments & Payout Orchestration",
  description:
    "Institutional platform for orchestrating cross-border payments and payouts across corridors, currencies and local payout partners.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${mono.variable} dark`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Parkinsans:wght@300..800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased">
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
