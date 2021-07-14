import { useAnalyticsAccounts, useAnalyticsData } from "@/hooks/content-decay";
import {
  faExternalLinkAlt,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cookie from "js-cookie";
import { useMemo } from "react";
import { Line } from "react-chartjs-2";
import dayjs from "dayjs";

export function Decay() {
  // cookies
  const accessToken = cookie.get("GA_accessToken");
  const profileId = cookie.get("GA_profileId");
  const profileInfoJSON = cookie.get("GA_profileInfo");
  const profileInfo = profileInfoJSON ? JSON.parse(profileInfoJSON) : undefined;

  // hooks
  const { accounts } = useAnalyticsAccounts();
  const { data, dataError, isDataLoading, mutateData } = useAnalyticsData();

  // aggregate google analytics data by pageTitle
  const aggregateByTitle = useMemo(() => {
    const aggregate = {};

    if (!data || !data.rows) return aggregate;

    data.rows.forEach(([pageTitle, yearMonth, pageviews, sessions]) => {
      if (!(pageTitle in aggregate)) aggregate[pageTitle] = [];

      aggregate[pageTitle].push({ yearMonth, pageviews, sessions });
    });

    return aggregate;
  }, [data]);

  // calculate decaying articles
  const decayByTitle = useMemo(() => {
    const decays = {};

    if (!aggregateByTitle) return decays;

    for (let pageTitle in aggregateByTitle) {
      const trafficByYearMonth = aggregateByTitle[pageTitle];
      const maxTrafficByYearMonth = trafficByYearMonth.reduce((prev, current) =>
        prev.pageviews > current.pageviews ? prev : current
      );
      const maxPageviews = maxTrafficByYearMonth.pageviews;

      const hasSizeableTraffic = maxPageviews > 50;
      const is5MonthsTrafficLessThanPeak = trafficByYearMonth
        .slice(0, 5)
        .every((traffic) => traffic.pageviews < maxPageviews);
      const isLastMonthTrafficDrastic =
        trafficByYearMonth[0].pageviews < 0.2 * maxPageviews;

      // decay criterion
      const isDecaying =
        hasSizeableTraffic &&
        is5MonthsTrafficLessThanPeak &&
        isLastMonthTrafficDrastic;

      if (!isDecaying) continue;

      decays[pageTitle] = aggregateByTitle[pageTitle];
    }

    return decays;
  }, [aggregateByTitle]);

  // render: fallback
  if (!accessToken || !profileId) return null;

  if (accessToken && !accounts) return null;

  if (!isDataLoading) {
    if (dataError) {
      return (
        <div className="callout alert">
          <h5>Error Occurred</h5>
          <p>{dataError.message}</p>
        </div>
      );
    }
    if (!data) {
      <div className="callout warning">
        <h5>No Data!</h5>
        <p>
          We were unable to retrieve any Google Analytics data for that profile.
        </p>
      </div>;
    }
  }

  return (
    <>
      <div className="padding-vertical-3">
        <h3>
          Decaying Articles of{" "}
          <a href={profileInfo.propertyUrl} target="_blank">
            {profileInfo.propertyName}
          </a>
        </h3>
        <h6 className="subheader">
          The following articles of {profileInfo.profileName} (
          {profileInfo.profileId}). Check{" "}
          <a
            onClick={(e) => {
              e.preventDefault();
              cookie.remove("GA_profileId");
              cookie.remove("GA_profileInfo");

              mutateData();
            }}
          >
            another profile
          </a>
          ?
        </h6>
      </div>
      {isDataLoading ? (
        <div>
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            style={{ marginRight: "0.5rem" }}
          />
          Fetching data ...
        </div>
      ) : (
        <DisplayResults decayData={decayByTitle} />
      )}
    </>
  );
}

const DisplayResults = ({ decayData }) => {
  const profileInfoJSON = cookie.get("GA_profileInfo");
  const profileInfo = profileInfoJSON ? JSON.parse(profileInfoJSON) : undefined;

  // render: no decaying articles
  if (!decayData || Object.keys(decayData).length === 0) {
    return (
      <div className="callout success">
        <h5>No Decaying Articles!</h5>
        <p>
          <b>Way to go!</b> No articles are decaying for this profile.
        </p>
      </div>
    );
  }

  // render: show decaying articles
  return (
    <ul style={{ listStyle: "none" }}>
      {Object.keys(decayData).map((pageTitle, i) => (
        <li key={i} style={{ margin: "1.25em 0" }}>
          <div className="margin-vertical-2">
            <span
              style={{ cursor: "pointer" }}
              onClick={() => setActiveArticle(pageTitle)}
            >
              {pageTitle}
            </span>
            <a
              href={`https://google.com/search?q=site:${profileInfo.propertyUrl} "${pageTitle}"`}
              target="new"
              className="margin-left-1"
            >
              <FontAwesomeIcon icon={faExternalLinkAlt} />
            </a>
          </div>
          <Line
            data={{
              datasets: [
                {
                  label: "Pageviews",
                  data: decayData[pageTitle]
                    ? [...decayData[pageTitle]]
                        .reverse()
                        .map(({ yearMonth, pageviews }) => ({
                          x: dayjs(yearMonth).format("MMM YY"),
                          y: pageviews,
                        }))
                    : [],
                  fill: false,
                  backgroundColor: "#3db8ea",
                  borderColor: "#3db8ea",
                },
              ],
            }}
            options={{
              plugins: {
                legend: { display: false },
              },
            }}
            height={75}
          />
        </li>
      ))}
    </ul>
  );
};

export default Decay;
