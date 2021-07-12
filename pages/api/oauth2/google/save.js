import { googleOauth2 } from "@/utils/oauth2";
import { serialize } from "cookie";

export default async (req, res) => {
  try {
    const { code } = req.query;
    const { tokens } = await googleOauth2.getToken(code);

    // save tokens as cookie on browser
    res.setHeader(
      "Set-Cookie",
      serialize("GA_accessToken", tokens.access_token, {
        path: "/",
        expires: new Date(tokens.expiry_date),
        maxAge: "3600",
      })
    );

    return res.send("oauth2:success");
  } catch (err) {
    return res
      .status(500)
      .json({ success: false, error: err.code, message: err.message });
  }
};
