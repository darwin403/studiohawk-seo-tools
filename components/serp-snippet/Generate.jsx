import { useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import PreviewSnippet from "@/components/serp-snippet/PreviewSnippet";

const defaultMetaTags = {
  title: "Facebook - Log In or Sign Up",
  url: "facebook.com",
  description:
    "Create an account or log into Facebook. Connect with friends, family and other people you know. Share photos and videos, send messages.",
};

export default function Generate({ onSnippetModify }) {
  const [url, setUrl] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [metaTags, setMetaTags] = useState(defaultMetaTags);
  const [error, setError] = useState(null);

  // fetch
  const fetchMetaTags = (e) => {
    e.preventDefault();

    setError(false);
    setIsFetching(true);

    axios
      .get("/api/metatags", { params: { url } })
      .then((response) => setMetaTags(response.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setIsFetching(false));
  };

  // render
  return (
    <>
      <form onSubmit={fetchMetaTags}>
        <div className="input-group">
          <input
            className="input-group-field"
            type="text"
            placeholder={defaultMetaTags.url}
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
          <div className="input-group-button">
            <button
              type="submit"
              className="button"
              disabled={isFetching}
              style={{ width: "180px" }}
            >
              {!isFetching ? "Generate Preview" : "Generating..."}
            </button>
          </div>
        </div>
      </form>

      {error && (
        <div className="callout alert">
          <h5>Oops!</h5>
          <p>{error}</p>
        </div>
      )}

      <PreviewSnippet
        isFetching={isFetching}
        title={metaTags?.title || "Not available"}
        url={metaTags?.uri?.host || metaTags?.url || "Not available"}
        description={metaTags?.description || "Not Available"}
        onModify={onSnippetModify}
      />
    </>
  );
}

Generate.defaultProps = {
  onSnippetModify: (i) => i,
};

Generate.propTypes = {
  onSnippetModify: PropTypes.func,
};
