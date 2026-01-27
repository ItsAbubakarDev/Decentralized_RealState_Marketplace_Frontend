import "./globals.css";
import { ThemeProvider } from "next-themes";
import { Providers } from "../components/Providers";
import Header from "../components/Header";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <Header />
            <main className="pt-16">{children}</main>
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
