import cors from "cors";
import express from "express";
import api from "./api/index.js";
import config from "./config/index.js";
const app = express();

app.use(cors());
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/brand/:offerId", (req, res) => {
  const { offerId } = req.params;
  api
    .getBrandByOfferID(parseInt(offerId, 10))
    .then((response) => {
      res.send(response);
    })
    .catch(() => {
      res.status(400).send({ error: "DocumentNotFound" });
    });
});

app.get("/brand/stats/:offerId", (req, res) => {
  const { offerId } = req.params;
  api
    .getBrandStatsByOfferID(parseInt(offerId, 10))
    .then((response) => {
      res.send(response);
    })
    .catch(() => {
      res.status(400).send({ error: "DocumentNotFound" });
    });
});

app.get("/influencer/:influencerId", (req, res) => {
  const { influencerId } = req.params;
  api
    .getInfluencerById(influencerId)
    .then((response) => {
      res.send(response);
    })
    .catch(() => {
      res.status(400).send({ error: "DocumentNotFound" });
    });
});

app.get("/article/:articleId", (req, res) => {
  const { articleId } = req.params;
  api
    .getArticleById(articleId)
    .then((response) => {
      res.send(response);
    })
    .catch(() => {
      res.status(400).send({ error: "DocumentNotFound" });
    });
});
app.listen(config.app.port, () => {
  console.log(`Dashboard api listening on port ${config.app.port}`);
});
