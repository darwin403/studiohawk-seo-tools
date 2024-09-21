// Next.js document support: https://nextjs.org/docs/advanced-features/custom-document

import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  static async getInitialProps(ctx) {
    const initialProps = await Document.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html>
        <Head>
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css?family=Montserrat:400,600,700,800"
          />
          <link
            rel="stylesheet"
            href="https://cdn-bmdmm.nitrocdn.com/OxJWvJfybhFfQJHQBydkoZJrDKWthmzq/assets/static/optimized/rev-4cdbfbd/studiohawk.com.au/combinedCss/nitro-min-noimport-7e2b4849719a7f6a7538fab40b6270f8-stylesheet.css"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
