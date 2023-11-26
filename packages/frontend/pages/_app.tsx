import type { AppProps } from "next/app";
import Head from "next/head";
import { Header } from "nhsuk-react-components";
import React from "react";
import "../App.scss";

const LeaderboardHeader: React.FC = () => {
  return (
    <Header transactional>
      <Header.Container>
        <Header.Logo href="/" />
        <Header.Content>
          <Header.ServiceName href="/" aria-label="header title" long>
            Advent of Code Leaderboard
          </Header.ServiceName>
        </Header.Content>
      </Header.Container>
      <Header.Container>
        <Header.NavItem href="/">Leaderboard</Header.NavItem>
        <Header.NavItem href="/solutions">Solutions</Header.NavItem>
      </Header.Container>
    </Header>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>Advent of Code Leaderboard</title>
      </Head>
      <LeaderboardHeader />
      <Component {...pageProps} />
    </>
  );
}
