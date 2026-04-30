import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Viral Clip Finder",
  description: "Generate viral clips from podcasts",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-full flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}