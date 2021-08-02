import 'tailwindcss/tailwind.css';
import '@material-tailwind/react/tailwind.css';
import '../styles.css';
import Head from 'next/head';
import NextNprogress from 'nextjs-progressbar';
import { Provider } from 'next-auth/client';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        // Material Icons Link
        <link
          href='https://fonts.googleapis.com/icon?family=Material+Icons'
          rel='stylesheet'
        />
      </Head>

      <Provider session={pageProps.session}>
        <NextNprogress
          color='#2196f3'
          height={5}
          options={{ showSpinner: false }}
        />
        <Component {...pageProps} />
      </Provider>
    </>
  );
}

export default MyApp;
