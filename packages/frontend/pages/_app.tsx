import type { AppProps } from "next/app";
import Head from "next/head";
import { Footer, Header } from "nhsuk-react-components";
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
        <Header.NavItem href="/upload_solution">
          Upload a Solution
        </Header.NavItem>
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
      <Footer>
        <p aria-label="footer-text">
          Please contact{" "}
          <a href="mailto:amaan.ibn-nasar1@nhs.net">Amaan Ibn-Nasar</a> or{" "}
          <a href="mailto:jack.spagnoli1@nhs.net">Jack Spagnoli</a> with any
          questions or suggestions.
        </p>
      </Footer>
    </>
  );
}
