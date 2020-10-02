import { useState } from "react";
import Head from "next/head";

import Compare from "@/components/serp-snippet/Compare";
import Generate from "@/components/serp-snippet/Generate";

export default function Index() {
  const [snippet, setSnippet] = useState(null);

  const includeResult = {
    title: snippet?.title,
    displayLink: snippet?.url,
    htmlSnippet: snippet?.description,
  };

  return (
    <>
      <Head>
        <title>SERP Snippet Preview | StudioHawk SEO Tools</title>
      </Head>

      <div className="chr-body-wrapper">
        <div className="margin-bottom-2">
          <h3 className="section-feature-text m-0">SERP Snippet Preview</h3>
          <h6 className="subheader">
            Checkout how your website currently is seen as by Google.
          </h6>
        </div>

        <Generate onSnippetModify={setSnippet} />

        <div style={{ height: "2rem" }}></div>

        <div className="margin-vertical-2">
          <h3 className="section-feature-text" style={{ marginBottom: 0 }}>
            SERP Results Preview
          </h3>
          <h6 className="subheader">
            Checkout how your above snippet would compare with your competitors
            on Google.
          </h6>
        </div>

        <Compare includeResult={includeResult} />
      </div>
    </>
  );
}
