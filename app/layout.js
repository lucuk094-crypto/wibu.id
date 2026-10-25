import "./globals.css";
export const metadata = { title: "Wibu.ID — Nonton Anime Legal • Netflix Dark", description: "Wibu.ID - Katalog anime legal, jadwal, trending, genre, live Bstation via Next.js + Embed Resmi" };
export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-[#080808] text-white antialiased">{children}</body>
    </html>
  );
}
