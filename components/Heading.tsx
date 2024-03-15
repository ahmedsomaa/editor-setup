import Head from "next/head";

export default function Heading() {
  return (
    <Head>
      {/* Meta */}
      <meta charSet="UTF-8" />
      <meta name="author" content="Ahmed Abu Qahf" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta
        name="description"
        content="Explore a curated list of font and theme pairings for Visual Studio
        Code that just work!"
      />
      <meta name="keywords" content="VS Code, Theme, Font" />
      <meta name="robots" content="index, follow" />

      {/* Links */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="canonical" href="https://editorsetup.vercel.app" />

      {/* Open Graph */}
      <meta property="og:title" content="EditorSetup" />
      <meta
        property="og:description"
        content="Explore a curated list of font and theme pairings for Visual Studio
        Code that just work!"
      />
      <meta property="og:url" content="https://editorsetup.vercel.app" />
      <meta property="og:image" content="/img/og-image.png" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="https://editorsetup.vercel.app" />
      <meta name="twitter:creator" content="Ahmed Abu Qahf" />
      <meta name="twitter:title" content="EditorSetup" />
      <meta
        name="twitter:description"
        content="Explore a curated list of font and theme pairings for Visual Studio
        Code that just work!"
      />
      <meta name="twitter:image" content="/img/og-image.png" />

      {/* Title */}
      <title>EditorSetup</title>
    </Head>
  );
}
