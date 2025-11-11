// src/routes/authRouter.ts

import express, {
  NextFunction,
  Request,
  Response
} from "express";
import { Credential } from "../models/credential";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

import CredentialService from "../services/credential-svc";

const authRouter = express.Router();
const credentialService = new CredentialService();

dotenv.config();
const TOKEN_SECRET: string =
  process.env.TOKEN_SECRET || "NOT_A_SECRET";

// register
authRouter.post("/register", (req: Request, res: Response) => {
    const { email, password } = req.body; // from form

    if ( typeof email !== "string" ||
        typeof password !== "string"
    ) {
        res.status(400).send("Bad request: Invalid input data.");
    } else {
    credentialService
      .createCredential(email, password)
      .then((creds: Credential) => generateAccessToken(creds.email))
      .then((token) => {
        res.status(201).send({ token: token });
      })
      .catch((err) => {
        res.status(409).send({ error: err.message });
      });
  }
});

// login
authRouter.post("/login", (req: Request, res: Response) => {
  const { email, password } = req.body; // from form

  if (!email || !password) {
    res.status(400).send("Bad request: Invalid input data.");
  } else {
    credentialService
      .verify(email, password)
      .then((goodUser: string) => generateAccessToken(goodUser))
      .then((token) => res.status(200).send({ token: token }))
      .catch((error) => res.status(401).send("Unauthorized"));
  }
});

function generateAccessToken(email: string): Promise<String> {
  return new Promise((resolve, reject) => {
    jwt.sign(
      { username: email },
      TOKEN_SECRET,
      { expiresIn: "1d" },
      (error, token) => {
        if (error) reject(error);
        else resolve(token as string);
      }
    );
  });
}

export function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers["authorization"];
  //Getting the 2nd part of the auth header (the token)
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    res.status(401).end();
  } else {
    jwt.verify(token, TOKEN_SECRET, (error, decoded) => {
      if (decoded) next();
      else res.status(401).end();
    });
  }
}

export default authRouter;
