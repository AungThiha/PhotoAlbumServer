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

exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      res.send({ message: "User was registered successfully!" });
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

      let token = signJwt({ id: user.id }, {
        algorithm: 'RS256',
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user.id, signJwt);

      res.status(200).send({
          id: user.id,
          email: user.email,
          accessToken: token,
          refreshToken: refreshToken,
        });
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

    return res.status(200).json({
      verifyExpiration: verifyExpiration,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};

exports.refreshToken = async (req, res) => {

  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  try {
    let refreshToken = await RefreshToken.findOne(
        { where: { token: requestToken, userId: req.userId } }
    );

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

    let newAccessToken = signJwt({ id: req.userId }, {
      algorithm: 'RS256',
      expiresIn: config.jwtExpiration
    });
    let newRefreshToken = await RefreshToken.createToken(req.userId, signJwt);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
