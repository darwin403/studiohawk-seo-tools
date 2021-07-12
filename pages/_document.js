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
            href="https://studiohawk.com.au/assets/themes/chr-studiohawk/dist/css/chr-main-styles.h.04e288919dd7.min.css?x90453"
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
