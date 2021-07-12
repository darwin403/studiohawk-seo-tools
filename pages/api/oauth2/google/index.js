import { googleOauth2 } from "@/utils/oauth2";

export default (_, res) => {
  // create oauth2 authentication url
  const url = googleOauth2.generateAuthUrl({
    access_type: "online",
    prompt: "consent",
    scope: ["https://www.googleapis.com/auth/analytics.readonly"],
  });

  return res.redirect(url);
};
