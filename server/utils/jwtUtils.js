const jsonwebtoken = require("jsonwebtoken");
const fs = require("fs");
const path = require("path");

const pathToKey = path.join(__dirname, "..", "id_rsa_priv.pem");
const PRIV_KEY = fs.readFileSync(pathToKey, "utf8");

module.exports.issueJWT = (user) => {
  const userId = user.id;

  const payload = {
    sub: userId,
    iat: Math.floor(Date.now() / 1000),
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, {
    expiresIn: "1d",
    algorithm: "RS256",
  });

  return {
    token: "Bearer " + signedToken,
    expires: "1d",
  };
};
