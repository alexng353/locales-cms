import express from "express";
import logger from "./utils/logger";
import bodyParser from "body-parser";

const app = express()
app.use(bodyParser.json());


app.get("/", async (req, res) => {
  return res.status(200).send("Hello world")
})

app.listen(3000, () => {
  logger.info("Listening on http://localhost:3000")
})
