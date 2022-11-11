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

app.use(
  cors({
    origin: "*",
  })
);

app.use(bodyParser.json());

app.use("/locales", express.static("locales"));
app.use("/static", express.static("static"));

app.post("/api/signup", async (req, res) => {
  const inviteKey = req.body.inviteKey;
  const basic = req.headers.authorization;

  if (!basic) {
    res.status(401).send("No basic auth");
    return;
  }

  if (!inviteKey) {
    res.status(401).send("No invite key");
    return;
  }

  const stringified = Buffer.from(basic.split(" ")[1], "base64").toString(
    "utf-8"
  );

  const [password, email] = stringified.split(":");
  // check if invite key is valid

  const invite = await prisma.invite.findUnique({
    where: {
      invite: inviteKey,
    },
  });

  if (!invite) {
    res.status(401).send("Invalid invite key");
    return;
  }

  if (invite.Used) {
    res.status(401).send("Invite key already used");
    return;
  }

  // create user
  const user = await prisma.user.create({
    data: {
      email: email,
      password: crypto.createHash("sha512").update(password).digest("hex"),
      invitedBy: {
        connect: {
          id: invite.id,
        },
      },
    },
  });
  await prisma.invite.update({
    where: {
      id: invite.id,
    },
    data: {
      Used: true,
    },
  });

  return res.status(200).send("User created");
});

app.post("/api/login", async (req, res) => {
  // get Basic Auth credentials
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

  return res.status(200).json({ message: "success" });
});

app.post("/api/newinvite", async (req, res) => {
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

  const invite = await prisma.invite.create({
    data: {
      invite: crypto.randomBytes(16).toString("hex"),
      CreatedBy: {
        connect: {
          id: user.id,
        },
      },
    },
  });

  return res.status(200).json({ invite: invite.invite });
});

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
});

app.get("*", async (req, res) => {
  res.sendFile("./templates/index.html", { root: __filename.split("src")[0] });
});

app.listen(3000, () => {
  logger.info("Listening on http://localhost:3000");
});
