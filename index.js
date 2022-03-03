const fs = require("fs");
const jwt = require("jsonwebtoken");
const path = require("path");

class KeyStore {
  static #secretKey;

  constructor() {
    throw new Error("Do not instantiate this class. Use static methods");
  }

  static readKey() {
    if (
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
  return (_req, res) => {
    if (asymmetric) {
      try {
        const loginRequest = jwt.sign(reqObj, secretKey, {
          algorithm: "RS256",
          expiresIn: "5 minutes",
        });
        res.json({ token: loginRequest });
      } catch {
        throw new Error("Invalid secret key! Use the keygen");
      }
    } else {
      const loginRequest = jwt.sign(
        reqObj,
        secretKey,
        { algorithm: "HS256", expiresIn: "5 minutes" }
      );
      res.json({ token: loginRequest });
    }
  };
}

module.exports = { KeyStore, generateSigningRequestHandler };
