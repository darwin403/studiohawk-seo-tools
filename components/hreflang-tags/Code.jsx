import { memo, useEffect, useState } from "react";
import PropTypes from "prop-types";
import copy from "copy-to-clipboard";

import hreflang from "@/utils/hreflang";

const MAX_TAGS = 10000;

function Code(props) {
  const [tags, setTags] = useState([]);
  const [type, setType] = useState("html");
  const [code, setCode] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    setTags(props.tags.slice(0, MAX_TAGS));
  }, [props.tags]);

  useEffect(() => {
    let value = "";

    if (tags.length !== 0) {
      if (type === "html") {
        value = tags
          .map(({ href, languageCode, countryCode }) => {
            return `<link rel="alternate" hreflang="${hreflang(
              languageCode,
              countryCode
            )}" href="${href}" />`;
          })
          .join("\n");
      }

      if (type === "xml") {
        const xhtml = tags
          .map(({ href, languageCode, countryCode }) => {
            return `\t\t<xhtml:link rel="alternate" hreflang="${hreflang(
              languageCode,
              countryCode
            )}" href="${href}" />`;
          })
          .join("\n");

        const urls = tags
          .map(({ href }) => {
            return `\t<url>\n\t\t<loc>${href}</loc>\n${xhtml}\n\t</url>`;
          })
          .join("\n");

        value = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>`;
      }
    }

    setCode(value);
  }, [tags, type]);

  const downloadFile = () => {
    const a = document.createElement("a");
    const file = new Blob([code], { type: "text/plain" });

    a.href = URL.createObjectURL(file);
    a.download = type === "html" ? "hreftags.html" : "hreftags.xml";

    document.body.appendChild(a); // for firefox
    a.click();
  };

  const copyToClipboard = () => {
    copy(code);
    setIsCopied(true);

    setTimeout(() => {
      setIsCopied(false);
    }, 500);
  };

  return (
    <>
      <small
        className="float-left margin-0"
        style={{ padding: ".85em 0", color: "gray" }}
      >
        {code ? `Generated ${tags.length} tag(s)` : "Preview"}
      </small>
      <div className="button-group small clear margin-0 align-right">
        <button
          type="button"
          className="button"
          onClick={() => downloadFile()}
          disabled={!code}
        >
          {type === "html" ? "Download .html" : "Download .xml"}
        </button>

        <button
          type="button"
          className="button"
          onClick={() => copyToClipboard()}
          disabled={!code}
        >
          {!isCopied ? "Copy Code" : "Copied!"}
        </button>

        <button
          type="button"
          className="button"
          onClick={() =>
            setType((prevType) => (prevType === "html" ? "xml" : "html"))
          }
        >
          {type === "html" ? "View in XML" : "View in HTML"}
        </button>
      </div>

      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder={
          type === "html"
            ? `<link rel="alternate" hreflang="x-default" href="https://example.com" />`
            : `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n\t<url>\n\t\t<loc>https://example.com</loc>\n\t\t<xhtml:link rel="alternate" hreflang="x-default" href="https://example.com" /></url>\n\t</url>\n</urlset>`
        }
        rows={code ? 5 : 3}
        spellCheck={false}
        disabled={!code}
      />
    </>
  );
}

Code.defaultProps = {
  tags: [],
};

Code.propTypes = {
  tags: PropTypes.arrayOf(
    PropTypes.shape({
      href: PropTypes.string,
      languageCode: PropTypes.string,
      countryCode: PropTypes.string,
    })
  ),
};

export default memo(Code);
