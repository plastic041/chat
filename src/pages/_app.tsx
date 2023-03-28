import type { AppProps } from "next/app";
import { Nunito_Sans } from "next/font/google";
import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";

const nunitoSans = Nunito_Sans({ subsets: ["latin"], weight: ["400", "700"] });

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <div className={nunitoSans.className}>
        <Component {...pageProps} />
      </div>
    </ClerkProvider>
  );
}
