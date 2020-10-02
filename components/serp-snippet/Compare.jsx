import { useState, useEffect, useMemo } from "react";
import PropTypes from "prop-types";
import axios from "axios";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faThumbtack,
  faRandom,
  faCamera,
} from "@fortawesome/free-solid-svg-icons";

import countries from "@/utils/countries";
import { takeScreenShot } from "@/utils/screenshot";

export default function Compare({ includeResult }) {
  const [search, setSearch] = useState("");
  const [countryCode, setCountryCode] = useState("us");
  const [isFetching, setIsFetching] = useState(false);
  const [googleResult, setGoogleResult] = useState(null);
  const [error, setError] = useState(null);
  const [shuffle, setShuffle] = useState(false);

  // fetch
  const fetchResults = (e) => {
    e.preventDefault();

    setError(null);
    setIsFetching(true);

    axios
      .get("/api/google", { params: { search, countryCode } })
      .then((response) => setGoogleResult(response.data))
      .catch((err) => setError(err.response?.data?.message || err.message))
      .finally(() => setIsFetching(false));
  };

  // effects
  useEffect(() => {
    if (googleResult && !googleResult?.items?.[0]) {
      setError("No results returned for that search.");
    }
  }, [googleResult]);

  // render
  const googleResultItems = useMemo(
    () =>
      [
        { ...includeResult, includedResult: true },
        ...(googleResult?.items || []),
      ].sort(() => (shuffle ? Math.random() - 0.5 : 0)),
    [includeResult, googleResult, shuffle]
  );

  return (
    <>
      <form style={{ marginTop: "2rem" }} onSubmit={fetchResults}>
        <div className="input-group">
          <input
            className="input-group-field"
            type="text"
            placeholder="connect with people"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="input-group-field"
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
          >
            {countries.map((country, i) => (
              <option value={country.code} key={i}>
                {country.name}
              </option>
            ))}
          </select>
          <div className="input-group-button">
            <button
              type="submit"
              className="button expanded"
              disabled={isFetching}
            >
              {!isFetching ? "Compare" : "Fetching ..."}
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

      <div className="results" style={{ minHeight: "300px" }}>
        <div className="grid-x align-middle" data-html2canvas-ignore="true">
          <div className="cell small-6">
            Showing results for:{" "}
            <a
              href={`https://google.com/search?q=${search}&gl=${countryCode}`}
              target="new"
            >
              <b>
                {googleResult?.queries?.request?.[0]?.searchTerms ||
                  "connect with people"}
              </b>
            </a>
          </div>
          <div className="cell small-6">
            <div
              className="button-group clear large no-gaps float-right"
              style={{ marginBottom: 0 }}
            >
              {shuffle && (
                <button className="button" onClick={() => setShuffle(false)}>
                  <FontAwesomeIcon icon={faThumbtack} />
                </button>
              )}
              <button
                className="button"
                onClick={() => setShuffle({ dummy: "shallow" })}
              >
                <FontAwesomeIcon icon={faRandom} />
              </button>
              <button
                className="button"
                onClick={() =>
                  takeScreenShot(
                    ".results",
                    search ? `${search}-results.png` : "results.png"
                  )
                }
              >
                <FontAwesomeIcon icon={faCamera} />
              </button>
            </div>
          </div>
        </div>
        {googleResultItems.map((item, i) => (
          <div
            className={
              "card snippet " + (item?.includedResult ? "highlight" : "")
            }
            style={{ border: 0 }}
            key={i}
          >
            {isFetching && <div className="fetching"></div>}
            <div className="card-section">
              <div className="url">{item?.displayLink}</div>
              <h4 className="title">{item?.title}</h4>
              <div
                className="description"
                dangerouslySetInnerHTML={{ __html: item?.htmlSnippet }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

Compare.defaultProps = {
  includeResult: {
    title: "Title",
    displayLink: "website.com",
    htmlSnippet: "Description",
  },
};

Compare.prototype = {
  includeResult: PropTypes.shape({
    title: PropTypes.string,
    displayLink: PropTypes.string,
    htmlSnippet: PropTypes.string,
  }),
};
