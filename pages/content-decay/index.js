import Head from "next/head";

import {
  ConnectAnalytics,
  SelectProfile,
  Decay,
} from "@/components/content-decay";

export default function Index() {
  return (
    <>
      <Head>
        <title>Content Decay Checker | StudioHawk SEO Tools</title>
      </Head>
      <div className="chr-body-wrapper padding-horizontal-3 padding-vertical-3">
        <div className="margin-bottom-2">
          <h3 className="section-feature-text margin-0">
            Content Decay Checker
          </h3>
          <h6 className="subheader">
            Analyze articles that are losing traffic through your Google
            Analytics data.
          </h6>
        </div>
        <div className="margin-vertical-2">
          <ConnectAnalytics />
          <SelectProfile />
          <Decay />
        </div>
      </div>
    </>
  );
}
