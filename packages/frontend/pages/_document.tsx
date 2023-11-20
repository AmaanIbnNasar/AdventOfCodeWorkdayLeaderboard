import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link
          rel="shortcut icon"
          href="/assets/favicons/favicon.ico"
          type="image/x-icon"
        />
        <link
          rel="apple-touch-icon"
          href="/assets/favicons/apple-touch-icon-180x180.png"
        />
        <link
          rel="mask-icon"
          href="/assets/favicons/favicon.svg"
          color="#005eb8"
        />
        <link
          rel="icon"
          sizes="192x192"
          href="/assets/favicons/favicon-192x192.png"
        />
        <meta
          name="msapplication-TileImage"
          content="/assets/favicons/mediumtile-144x144.png"
        />
        <meta name="msapplication-TileColor" content="#005eb8" />
        <meta
          name="msapplication-square70x70logo"
          content="/assets/favicons/smalltile-70x70.png"
        />
        <meta
          name="msapplication-square150x150logo"
          content="/assets/favicons/mediumtile-150x150.png"
        />
        <meta
          name="msapplication-wide310x150logo"
          content="/assets/favicons/widetile-310x150.png"
        />
        <meta
          name="msapplication-square310x310logo"
          content="/assets/favicons/largetile-310x310.png"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
