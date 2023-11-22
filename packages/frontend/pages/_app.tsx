import type { AppProps } from "next/app";
import Head from "next/head";
import { Header } from "nhsuk-react-components";
import "../App.scss";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Advent of Code Leaderboard</title>
      </Head>
      <Header transactional>
        <Header.Container>
          <Header.Logo href="/" />
          <Header.ServiceName href="/" aria-label="header title">
            Advent of Code Leaderboard
          </Header.ServiceName>
        </Header.Container>
      </Header>
      <Component {...pageProps} />
    </>
  );
}
