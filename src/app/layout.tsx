import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LogisTrack V2 - SaaS B2B Delivery & Invoice Distribution Management',
  description: 'Plateforme SaaS de gestion de livraison et distribution grand volume en Afrique',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
