import express from "express";
import logger from "./utils/logger";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config()

const app = express()
app.use(bodyParser.json());

app.use("/", express.static("locales"));

app.get("*", async (req, res) => {
  return res.redirect("https://www.edubeyond.dev")
})

app.listen(3000, () => {
  logger.info("Listening on http://localhost:3000")
})
