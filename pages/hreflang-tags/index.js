import { useState } from "react";
import Head from "next/head";

import File from "@/components/hreflang-tags/File";
import Tags from "@/components/hreflang-tags/Tags";
import Code from "@/components/hreflang-tags/Code";

export default function Home() {
  const [uploadTags, setUploadTags] = useState([]);
  const [generateTags, setGenerateTags] = useState([]);

  return (
    <>
      <Head>
        <title>hreflang Tags Generator | StudioHawk SEO Tools</title>
      </Head>
      <div className="chr-body-wrapper">
        <div className="margin-bottom-2">
          <h3 className="section-feature-text margin-0">
            hreflang Tags Generator
          </h3>
          <h6 className="subheader">
            Generate the hreflang tags for your multi-language or multi-country
            sites.
          </h6>
          <File onUpload={(tags) => setUploadTags(tags)} />
          <Tags
            tags={uploadTags}
            onGenerate={(tags) => setGenerateTags(tags)}
          />
        </div>
        <div className="margin-vertical-2">
          <Code tags={generateTags} />
        </div>
      </div>
    </>
  );
}
