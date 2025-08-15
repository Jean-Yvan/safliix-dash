import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "safliixboard",
  description: "Le dashboard de la plateforme de VOD SaFliix",
  
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="mytheme">
      <body
        className={`antialiased`}
      > 
       
        {children}
      </body>
    </html>
  );
}
