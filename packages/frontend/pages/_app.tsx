import type { AppProps } from "next/app";
import Head from "next/head";
import React from "react";
// import "../App.scss";
import "../styles/globals.css";

const LeaderboardHeader: React.FC = () => {
  return (
    <div className="bg-green-800" style={{ position: "sticky", top: 0 }}>
      <div className="container mx-auto flex justify-between items-center py-4">
        <a href="/" className="text-2xl text-white font-bold">
          Advent of Code Leaderboard
        </a>
        <nav className="space-x-4">
          <a href="/" className="text-xl text-white font-bold">
            Leaderboard
          </a>
          <a href="/solutions" className="text-xl text-white font-bold">
            Solutions
          </a>
          <a href="/upload_solution" className="text-xl text-white font-bold">
            Upload a Solution
          </a>
        </nav>
      </div>
    </div>
  );
};

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-200 py-4 mt-auto">
      <p aria-label="footer-text" className="text-center">
        Please contact{" "}
        <a href="mailto:amaan5260@gmail.com" className="text-blue-700">
          Amaan Ibn-Nasar
        </a>{" "}
        or{" "}
        <a href="mailto:jackspagnoli@gmail.com" className="text-blue-700">
          Jack Spagnoli
        </a>{" "}
        with any questions or suggestions.
      </p>
    </footer>
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
      <Footer />
    </>
  );
}
