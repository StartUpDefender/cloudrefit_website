import clsx from "clsx";
import "src/styles/splash-screen.css";
import "src/styles/index.css";
import { Cairo, Roboto_Serif } from "next/font/google";
import "../../public/assets/styles/prism.css";
import { SessionProvider } from "next-auth/react";
import { auth } from "@auth/authJs";
import generateMetadata from "../utils/generateMetadata";
import App from "./App";

const cairo = Cairo({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-cairo",
});

const robotoSerif = Roboto_Serif({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-serif",
});
// eslint-disable-next-line react-refresh/only-export-components
export const metadata = await generateMetadata({
  title: "ClooudRefit",
  description: "ClooudRefit",
  cardImage: "/card.png",
  robots: "follow, index",
  favicon: "/favicon.ico",
  url: "https://react-material.fusetheme.com",
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${robotoSerif.variable} ${cairo.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
        <meta name="theme-color" content="#000000" />
        <base href="/" />
        {/*
					manifest.json provides metadata used when your web app is added to the
					homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
				*/}
        <link rel="manifest" href="/manifest.json" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <noscript id="emotion-insertion-point" />
      </head>
      <body id="root" className={clsx("loading")}>
        <SessionProvider basePath="/auth" session={session}>
          <App>{children}</App>
        </SessionProvider>
      </body>
    </html>
  );
}
