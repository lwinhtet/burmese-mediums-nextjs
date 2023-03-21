import Head from 'next/head';
import AuthNavigation from '@/layouts/navigation/AuthNavigation';
import { quicksand, inter } from '@/utils/getFont';

export default function SecondaryLayout({ children }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${inter.style.fontFamily};
        }
      `}</style>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Burmese Mediums</title>
        <link
          rel="shortcut icon"
          type="image/png"
          href="/img/logo/Gtranstroke.png"
        />
      </Head>
      <AuthNavigation />
      <main>{children}</main>
    </>
  );
}
