import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dra. Gabriela Urrutia | Odontología integral",
  description: "Mockup de portafolio para una consulta de odontología integral cercana, precisa y serena.",
  openGraph: {
    title: "Dra. Gabriela Urrutia",
    description: "Odontología integral · Una atención serena, precisa y cercana.",
    images: [{ url: "/og.png", width: 1536, height: 1024, alt: "Dra. Gabriela Urrutia · Odontología integral" }],
    locale: "es_CL",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dra. Gabriela Urrutia",
    description: "Odontología integral · Una atención serena, precisa y cercana.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
