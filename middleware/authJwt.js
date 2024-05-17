const jwt = require("jsonwebtoken");
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;

const { TokenExpiredError } = jwt;

const catchError = (err, res) => {
  if (err instanceof TokenExpiredError) {
    return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
  }

  return res.sendStatus(401).send({ message: "Unauthorized!" });
}

verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  let base64PublicKey = process.env.PHOTO_ALBUM_PUBLIC_KEY
  let publicKey = Buffer.from(base64PublicKey, 'base64')

  jwt.verify(token, publicKey, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.userId;
    next();
  });
};

verifyTokenIgnoreExpiration = (req, res, next) => {
  let token = req.headers["x-access-token"];

  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  let base64PublicKey = process.env.PHOTO_ALBUM_PUBLIC_KEY
  let publicKey = Buffer.from(base64PublicKey, 'base64')

  jwt.verify(token, publicKey, { ignoreExpiration: true }, (err, decoded) => {
    if (err) {
      return catchError(err, res);
    }
    req.userId = decoded.userId;
    next();
  });
};

const authJwt = {
  verifyToken: verifyToken,
  verifyTokenIgnoreExpiration: verifyTokenIgnoreExpiration
};
module.exports = authJwt;
