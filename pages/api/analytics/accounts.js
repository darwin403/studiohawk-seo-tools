import { googleOauth2 } from "@/utils/oauth2";
import { google } from "googleapis";

const analytics = google.analytics("v3");

export default async (req, res) => {
  try {
    const { accessToken } = req.query;
    googleOauth2.setCredentials({ access_token: accessToken });

    // fetch google analytics profiles of user
    const { data } = await analytics.management.accountSummaries.list({
      auth: googleOauth2,
    });

    return res.json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err.code, message: err.message });
  }
};
