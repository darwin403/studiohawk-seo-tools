import axios from "axios";

// get google search api keys from .env
const { GOOGLE_SEARCH_API_KEY, GOOGLE_SEARCH_ENGINE_ID } = process.env;

export default (req, res) => {
  const search = req.query.search;
  const countryCode = req.query.countryCode || "us";
  const total = req.query.total || 4;

  // check if key provided
  if (!GOOGLE_SEARCH_API_KEY || !GOOGLE_SEARCH_ENGINE_ID) {
    return res.status(500).json({
      status: false,
      error: "Invalid API Key",
      message: "Google Search API keys are not provided!",
    });
  }

  // google search endpoint
  const endpoint = `https://www.googleapis.com/customsearch/v1?&key=${GOOGLE_SEARCH_API_KEY}&cx=${GOOGLE_SEARCH_ENGINE_ID}&q=${search}&gl=${countryCode}&num=${total}`;

  return axios
    .get(endpoint)
    .then(({ data }) => res.status(200).json(data))
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, error: err.code, message: err.message })
    );
};
