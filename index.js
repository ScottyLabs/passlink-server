const crypto = require("crypto");
const fs = require("fs");
const jose = require("jose");
const path = require("path");

class KeyStore {
  static #secretKey;

  constructor() {
    throw new Error("Do not instantiate this class. Use static methods");
  }

  static readKey(secretKey) {
    if (secretKey !== undefined) {
      KeyStore.#secretKey = secretKey;
    } else if (
      fs.existsSync(path.resolve(process.cwd(), "keys")) &&
      fs.existsSync(path.resolve(process.cwd(), "keys", "rsa.key"))
    ) {
      KeyStore.#secretKey = fs
        .readFileSync(path.resolve(process.cwd(), "keys", "rsa.key"))
        .toString();
    } else {
      throw new Error("No keys found!");
    }
  }

  static getSecretKey() {
    if (KeyStore.#secretKey) {
      return KeyStore.#secretKey;
    } else {
      throw new Error("No key read yet.");
    }
  }
}

function generateSigningRequestHandler(reqObj, secretKey, asymmetric) {
  return (req, res) => {
    if ((req.query?.origin ?? "") === "") {
      res.status(400).send("Bad Request");
      return;
    }
    reqObj.redirectUrl = req.query.origin;
    if (asymmetric) {
      new jose.SignJWT(reqObj)
        .setProtectedHeader({
          typ: "JWT",
          alg: "RS256",
        })
        .setAudience("scottylabs.org")
        .setExpirationTime("5 minutes")
        .setIssuedAt()
        .sign(crypto.createPrivateKey(secretKey))
        .then((loginRequest) => res.json({ token: loginRequest }));
    } else {
      new jose.SignJWT(reqObj)
        .setProtectedHeader({
          typ: "JWT",
          alg: "HS256",
        })
        .setAudience("scottylabs.org")
        .setExpirationTime("5 minutes")
        .setIssuedAt()
        .sign(new TextEncoder().encode(secretKey))
        .then((loginRequest) => res.json({ token: loginRequest }));
    }
  };
}

module.exports = { KeyStore, generateSigningRequestHandler };
