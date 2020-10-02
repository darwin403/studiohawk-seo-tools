import Head from "next/head";
import Link from "next/link";

export default function Index() {
  return (
    <>
      <Head>
        <title>StudioHawk SEO Tools</title>
      </Head>
      <div className="chr-body-wrapper">
        <div className="module bg-blue text-center">
          <div className="grid-container">
            <h1 className="page-feature-text text-center">
              StudioHawk SEO Tools
            </h1>
            <p>
              <Link href="/serp-snippet">
                <a className="chr-button">hreflang Tags Generator</a>
              </Link>
              <Link href="/serp-snippet">
                <a className="chr-button">SERP Snippet Previewer</a>
              </Link>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
