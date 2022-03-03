#!/usr/bin/env node

const genKeyPair = require("./keygen");
const fs = require("fs");
const path = require("path");

if (!fs.existsSync(path.resolve(process.cwd(), "keys"))) {
  console.log("Generating new RSA keypairs...");
  const { private: privatekey, public: pubkey } = genKeyPair();
  fs.mkdirSync(path.resolve(process.cwd(), "keys"));
  fs.writeFileSync(path.resolve(process.cwd(), "keys", "rsa.key"), privatekey);
  fs.writeFileSync(path.resolve(process.cwd(), "keys", "rsa.key.pub"), pubkey);

  console.log(
    "Keys generated! Please add the 'keys' directory to your " +
      "project's .gitignore file."
  );
} else {
  console.log(
    "A directory or file named 'keys' already exists in your project " +
      "directory! To avoid overwriting other important files, the operation " +
      "was aborted."
  );
}
