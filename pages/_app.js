import '../styles/sass/main.scss';
import '../styles/icon-font/icon-font.css';
import Script from 'next/script';
import { AuthProvider } from '../context/AuthProvider';

function MyApp({ Component, pageProps }) {
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout || (page => page);
  return (
    <AuthProvider>
      {getLayout(
        <>
          <Script
            src="https://accounts.google.com/gsi/client"
            strategy="beforeInteractive"
            async
            defer
          />
          <Component {...pageProps} />
        </>
      )}
    </AuthProvider>
  );
}

export default MyApp;
