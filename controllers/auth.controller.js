const db = require("../models");
const config = require("../config/auth.config");
const { user: User, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

const signJwt = (payload, options) => {
  const base64PrivateKey = process.env.PHOTO_ALBUM_PRIVATE_KEY
  const privateKey = Buffer.from(base64PrivateKey, 'base64')
  return jwt.sign(payload, privateKey, options);
};

const createAuthSuccessResponseBody = async (userId) => {
  let accessToken = signJwt({ userId: userId }, {
    algorithm: 'RS256',
    expiresIn: config.jwtExpiration
  });

  let refreshToken = await RefreshToken.createToken(userId, signJwt);

  return {
    userId: userId,
    accessToken: accessToken,
    refreshToken: refreshToken,
  };
};

exports.signup = (req, res) => {
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 14)
  })
    .then(async (user) => {
      let responseBody = await createAuthSuccessResponseBody(user.id);
      res.status(200).send(responseBody);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.signin = (req, res) => {
  User.findOne({
    where: {
      email: req.body.email
    }
  })
    .then(async (user) => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      let responseBody = await createAuthSuccessResponseBody(user.id);
      res.status(200).send(responseBody);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};

exports.checkRefreshTokenExpiration = async (req, res) => {
  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }
  try {
    let refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

    if (!refreshToken) {
      res.status(403).json({ message: "Refresh token is not valid!" });
      return;
    }

    const verifyExpiration = RefreshToken.verifyExpiration(refreshToken)

    res.status(200).json({
      verifyExpiration: verifyExpiration,
    });
  } catch (err) {
    res.status(500).send({ message: err });
  }
};

exports.refreshToken = async (req, res) => {

  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  RefreshToken.findOne(
        { where: { token: requestToken, userId: req.userId } }
    )
    .then(async (refreshToken) => {

      if (!refreshToken) {
        res.status(403).json({ message: "Refresh token is not valid!" });
        return;
      }

      if (RefreshToken.isExpired(refreshToken)) {
        RefreshToken.destroy({ where: { id: refreshToken.id } });
        
        res.status(403).json({
          message: "Refresh token was expired. Please make a new signin request",
        });
        return;
      }

      let responseBody = await createAuthSuccessResponseBody(req.userId);

      res.status(200).send(responseBody);
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};
