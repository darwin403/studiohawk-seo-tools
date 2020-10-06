import { useState, useEffect } from "react";
import Head from "next/head";
import axios from "axios";
import { Controlled as CodeMirror } from "react-codemirror2";
import { html as beautify } from "js-beautify";

import crawlers from "@/utils/crawlers";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationCircle,
} from "@fortawesome/free-solid-svg-icons";
import robots from "../api/robots";

// Next.js SSR fix
if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  require("codemirror/mode/yaml/yaml");
}

export default function Index() {
  const [url, setUrl] = useState("");
  const [agent, setAgent] = useState("Googlebot");
  const [robotsFromEditor, setRobotsFromEditor] = useState(false);
  const [robotsData, setRobotsData] = useState("");
  const [isFetching, setIsFetching] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  // form submit
  const onSubmit = (e) => {
    e.preventDefault();

    setIsFetching(true);
    setResponse(null);
    setError(false);

    axios
      .get("/api/robots", {
        params: { url, agent, robotsData: robotsFromEditor ? robotsData : "" },
      })
      .then((response) => setResponse(response.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setIsFetching(false));
  };

  // response effect
  useEffect(() => {
    if (response) {
      setRobotsData(beautify(response?.robots?.data));
      setUrl(response?.url);
    }
  }, [response]);

  // render
  const isError = !!error;
  const isParsed = !!response?.robots?.parsed;
  const isValid = response?.robots?.parsed?.isValid || false;
  const isAllowed = (isValid && response?.robots?.parsed?.isAllowed) || false;
  const lineNumber = response?.robots?.parsed?.lineNumber;
  const sitemaps = response?.robots?.parsed?.sitemaps;

  return (
    <>
      <Head>
        <title>robots.txt Validator | StudioHawk SEO Tools</title>
      </Head>
      <div className="chr-body-wrapper">
        <h3 className="section-feature-text margin-0">
          robots.txt Tester &#x26; Validator
        </h3>
        <h6 className="subheader">
          Check if a URL is allowed to be crawled by a Search Engine or a User
          Agent.
        </h6>
        <form className="margin-top-2" id="fetchRobots" onSubmit={onSubmit}>
          <div className="input-group">
            <input
              className="input-group-field"
              type="text"
              placeholder="https://myblog.com/my-article"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <select
              className="input-group-field"
              value={agent}
              onChange={(e) => setAgent(e.target.value)}
            >
              {crawlers.map((crawler, i) => (
                <option value={crawler.userAgent} key={i}>
                  {crawler.name} ({crawler.userAgent})
                </option>
              ))}
            </select>
          </div>
        </form>

        {isError && <div className="callout alert">{error}</div>}
        {isParsed && (
          <div
            className={
              "callout " +
              (isValid && isAllowed
                ? "success"
                : !isValid && !isAllowed
                ? "alert"
                : "warning")
            }
          >
            <ul className="vertical menu">
              <li>
                <FontAwesomeIcon
                  icon={isValid ? faCheckCircle : faExclamationCircle}
                  color={isValid ? "green" : "red"}
                  style={{ marginRight: "0.75rem" }}
                />
                The robots.txt loaded from{" "}
                <b>
                  {response?.robots?.from === "website"
                    ? "Live Website"
                    : "Editor"}
                </b>{" "}
                is {!isValid && <b>NOT</b>} valid!
              </li>
              <li>
                <FontAwesomeIcon
                  icon={isAllowed ? faCheckCircle : faExclamationCircle}
                  color={isAllowed ? "green" : "red"}
                  style={{ marginRight: "0.75rem" }}
                />
                <b>{response.agent}</b> will {!isAllowed && <b>NOT</b>} crawl{" "}
                <a
                  className="display-inline padding-0"
                  href={response.url}
                  target="new"
                >
                  {response.url}
                </a>{" "}
                {lineNumber &&
                  lineNumber !== -1 &&
                  ` as per line ${lineNumber}`}
              </li>
            </ul>
          </div>
        )}

        <button
          type="submit"
          className="button expanded"
          form="fetchRobots"
          disabled={isFetching}
        >
          {!isFetching ? "Check and Validate" : "Validating ...."}
        </button>

        <div className="margin-bottom-2">
          <div className="grid-x grid-padding-y">
            <div className="cell auto">
              <small className="text-muted">
                Robots.txt{" "}
                {isParsed && (
                  <>
                    (
                    <a href={response.robots.url} target="new">
                      {response.robots.url}
                    </a>
                    )
                  </>
                )}
              </small>
            </div>
            <div className="cell small-6 text-right flex-container align-middle align-right">
              <small className="text-secondary margin-right-1">
                Robots.txt from Editor
              </small>
              <div className="switch tiny margin-0 display-inline-block">
                <input
                  className="switch-input"
                  id="yes-no"
                  type="checkbox"
                  checked={robotsFromEditor}
                  onChange={(e) => setRobotsFromEditor(e.target.checked)}
                />
                <label className="switch-paddle" htmlFor="yes-no">
                  <span className="switch-active" aria-hidden="true">
                    Yes
                  </span>
                  <span className="switch-inactive" aria-hidden="true">
                    No
                  </span>
                </label>
              </div>
            </div>
          </div>
          <div onBlur={(e) => setRobotsData(beautify(robotsData))}>
            <CodeMirror
              value={robotsData}
              options={{
                mode: "yaml",
                theme: "material",
                lineNumbers: true,
                readOnly: !robotsFromEditor ? "nocursor" : false,
              }}
              onBeforeChange={(editor, data, newValue) =>
                setRobotsData(newValue)
              }
              onPaste={(editor, e) =>
                setRobotsData(beautify(e.clipboardData.getData("Text")))
              }
            />
          </div>
        </div>
        {sitemaps && sitemaps.length !== 0 && (
          <>
            <small>Sitemaps:</small>
            <ul className="vertical menu">
              {sitemaps.map((sitemap, i) => (
                <li key={i}>
                  <a href={sitemap} target="new">
                    {sitemap}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </>
  );
}
