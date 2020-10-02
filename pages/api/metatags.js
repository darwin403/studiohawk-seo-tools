import metafetch from "metafetch";

export default (req, res) => {
  return metafetch
    .fetch(req.query.url)
    .then((meta) => res.status(200).json(meta))
    .catch((err) =>
      res
        .status(500)
        .json({ success: false, error: err.code, message: err.message })
    );
};
