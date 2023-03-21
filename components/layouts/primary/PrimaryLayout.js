import NavigationLayout from '../navigation/NavigationLayout';
import Head from 'next/head';
import logo from '@/public/img/logo/BGtranstroke.png';
import { quicksand, inter } from '@/utils/getFont';

export default function PrimaryLayout({ children }) {
  return (
    <>
      <style jsx global>{`
        html {
          font-family: ${quicksand.style.fontFamily};
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

      <NavigationLayout />
      <main>{children}</main>
    </>
  );
}
