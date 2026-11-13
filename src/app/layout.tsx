import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import { ThemeProvider } from "@amazecontinuityprojects/amazeui";
import "./globals.css";

const geist = Geist({ weight: "variable", subsets: ["latin"], display: "swap", variable: "--font-geist" });
const geistMono = Geist_Mono({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-geist-mono",
});
const dmSans = DM_Sans({
  weight: "variable",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-dm-sans",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#020617" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
  width: "device-width",
  initialScale: 0.85,
  maximumScale: 5.0,
  viewportFit: "cover",
};

export const metadata: Metadata = {
  applicationName: "AmazeCC Club Hub",
  title: {
    default: "AmazeCC Club Hub",
    template: "%s - Club Hub",
  },
  description: "Manage your club's presence on AmazeCC — feed, landing page, representatives.",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${geist.variable} ${geistMono.variable} ${dmSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
          value={{ light: "light", dark: "dark" }}
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
