import { google } from "googleapis";

export const googleOauth2 = new google.auth.OAuth2({
  clientId: process.env.GOOGLE_OAUTH2_CLIENT_ID,
  clientSecret: process.env.GOOGLE_OAUTH2_CLIENT_SECRET,
  redirectUri: process.env.GOOGLE_OAUTH2_REDIRECT_URI,
});
