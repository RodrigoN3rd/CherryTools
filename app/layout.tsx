/* eslint-disable @next/next/no-page-custom-font, @next/next/google-font-display -- Root App Router layout loads the Google CSS API globally; the text stylesheet explicitly uses display=swap. */
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
  title: { default: "Cherry Tools — pequeno estúdio para grandes ideias", template: "%s — Cherry Tools" },
  description: "Ferramentas gentis e locais para artistas, designers e criadores."
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@10..48,75..100,200..800&family=Cormorant+Garamond:ital,wght@0,400..700;1,400..700&family=DM+Sans:ital,wght@0,400;0,500;0,600;0,700;0,800;1,400;1,500;1,600;1,700&family=Fraunces:opsz,wght@9..144,100..900&family=Instrument+Serif:ital@0;1&family=Space+Mono:wght@400;700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined&icon_names=animation,auto_awesome,brush,devices,draw,format_size,grid_on,image,keyboard_command_key,light_mode,neurology,phone_iphone,play_circle,select_window,texture,title,view_in_ar,web_asset&display=block" />
      </head>
      <body>{children}</body>
    </html>
  );
}
