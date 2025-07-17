import { Quicksand } from "next/font/google";
import { ThemeProvider } from 'next-themes';
import { Analytics } from "@vercel/analytics/next"

// CSS imports
import "@/public/css/globals.css";
import "@/public/css/darkmode.css";
import "@/public/css/pagesize.css";

const quicksand = Quicksand({
  weight: ["500"],
  subsets: ["latin"]
});

export const viewport = {
  themeColor: "#2e2e2e",
  colorScheme: "dark",
  width: "device-width",
}

export const metadata = {
  title: "Overlay Share",
  description: "Share your overlays with your friends.",

  // Favicon
  icons: {
    icon: "/images/favicon.png",
    shortcut: "/images/favicon.png",
    apple: "/images/favicon.png",
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning >
      <body className={quicksand.className}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
