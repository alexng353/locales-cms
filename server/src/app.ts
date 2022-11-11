import express from "express";
import logger from "./utils/logger";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import fs from "fs";

import crypto from "crypto";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

import cors from "cors";

dotenv.config();

const app = express();

app.use("/", require("./auth"));

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.use("/locales", express.static("locales"));
app.use("/static", express.static("static"));

app.post("/api/post", async (req, res) => {
  const basic = req.headers.authorization;

  if (!basic) {
    res.status(401).send("Unauthorized");

    return;
  }

  const [password, email] = Buffer.from(basic.split(" ")[1], "base64")
    .toString("utf-8")
    .split(":");

  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });

  if (!user) {
    res.status(401).send("Unauthorized");
    return;
  }

  const hashedPassword = crypto
    .createHash("sha512")
    .update(password)
    .digest("hex");

  if (user.password !== hashedPassword) {
    res.status(401).send("Unauthorized");
    return;
  }

  const { namespace, language, content } = req.body;

  // write content

  const path = `./locales/${language}/${namespace}.json`;

  fs.writeFile(path, content, (err) => {
    if (err) {
      logger.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }
  });

  let db_namespace = await prisma.namespace.findUnique({
    where: {
      name: namespace,
    },
  });

  if (!db_namespace) {
    db_namespace = await prisma.namespace.create({
      data: {
        name: namespace,
        content: content,
        language: language,
        path: path,
      },
    });
  }

  const post = await prisma.edit.create({
    data: {
      language: language,
      namespace: namespace,
      user: {
        connect: {
          id: user.id,
        },
      },
      Namespace: {
        connect: {
          id: db_namespace.id,
        },
      },
    },
  });
  return res.status(200).json(post);
});

app.get("*", async (req, res) => {
  res.sendFile("./templates/index.html", { root: __filename.split("src")[0] });
});

app.listen(3000, () => {
  logger.info("Listening on http://localhost:3000");
});
