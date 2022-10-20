import 'bootstrap/dist/css/bootstrap.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'

function App({ Component, pageProps }: AppProps) {
  return <>
    <Head>
      <title>HNL Rezultati</title>
      <meta name="description" content="Rezultati HNL lige" />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Component {...pageProps} />
  </>
}

export default App
