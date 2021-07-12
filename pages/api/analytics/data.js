import { googleOauth2 } from "@/utils/oauth2";
import { google } from "googleapis";
import dayjs from "dayjs";

const analytics = google.analytics("v3");

export default async (req, res) => {
  try {
    const { accessToken, profileId } = req.query;
    const thisMonth = dayjs().startOf("month");

    googleOauth2.setCredentials({ access_token: accessToken });

    // fetch google analytics data of profile
    const { data } = await analytics.data.ga.get({
      auth: googleOauth2,
      ids: `ga:${profileId}`,
      "start-date": thisMonth.subtract(1, "year").format("YYYY-MM-DD"),
      "end-date": thisMonth.subtract(1, "day").format("YYYY-MM-DD"),
      dimensions: "ga:pageTitle,ga:yearMonth",
      metrics: "ga:pageviews",
      sort: "-ga:yearMonth",
      "max-results": "10000", // maximum allowed,
      "include-empty-rows": false,
    });

    return res.json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err.code, message: err.message });
  }
};
