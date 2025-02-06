const crypto = require("crypto");

function generatePassword(password) {
  const salt = crypto.randomBytes(32).toString("hex");
  const hash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return { salt: salt, hash: hash };
}

function verifyPassword(password, salt, hash) {
  const hashVerify = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");
  return hash === hashVerify;
}

module.exports.generatePassword = generatePassword;
module.exports.verifyPassword = verifyPassword;
