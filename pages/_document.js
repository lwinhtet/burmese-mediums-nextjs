import { Html, Head, Main, NextScript } from 'next/document';
// import Script from 'next/script';

export default function Document() {
  return (
    <Html>
      <Head />
      <body>
        <Main />
        <div id="myportal" />
        <NextScript />
        {/* <Script
          src="https://accounts.google.com/gsi/client"
          strategy="beforeInteractive"
          async
          defer
        /> */}
      </body>
    </Html>
  );
}
