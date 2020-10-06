import axios from "axios";
import robotsParser from "robots-parser";
import validator from "validator";

const parseRobots = (robotsUrl, url, agent, robotsData) => {
  const robots = robotsParser(robotsUrl, robotsData);

  const isValid = Object.keys(robots._rules).length !== 0;
  const isAllowed = robots.isAllowed(url, agent.toLowerCase());
  const lineNumber = robots.getMatchingLineNumber(url, agent.toLowerCase());
  const sitemaps = robots.getSitemaps();

  return { isValid, isAllowed, lineNumber, sitemaps };
};

export default (req, res) => {
  let url, origin, agent, robotsData;

  // validate url
  try {
    url = req.query.url;

    if (!validator.isURL(url)) {
      throw new Error(`Invalid URL: ${url}`);
    }

    url = new URL(req.query.url);
    agent = req.query.agent;
    robotsData = req.query.robotsData;

    if (!agent) {
      throw new Error("Invalid Agent");
    }

    if (!robotsData && !url) {
      throw new Error("URL or Robots Data is required");
    }
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err.code, message: err.message });
  }

  origin = url.origin;
  url = url.href;

  // validate origin
  if (!url.includes(origin))
    return res.status(500).json({
      success: false,
      error: "NO_ORIGIN",
      message: `Invalid origin: ${url}`,
    });

  // robots.txt location
  const robotsUrl = `${origin}/robots.txt`;
  let robotsParsed;

  if (robotsData) {
    robotsParsed = parseRobots(robotsUrl, url, agent, robotsData);

    return res.status(200).json({
      url,
      agent,
      robots: {
        from: "editor",
        url: robotsUrl,
        data: robotsData,
        parsed: robotsParsed,
      },
    });
  }

  // fetch robots.txt content
  return axios
    .get(robotsUrl)
    .then(({ data }) => {
      robotsParsed = parseRobots(robotsUrl, url, agent, data);

      return res.status(200).json({
        url,
        agent,
        robots: {
          from: "website",
          url: robotsUrl,
          data,
          parsed: robotsParsed,
        },
      });
    })
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, error: err.code, message: err.message })
    );
};
