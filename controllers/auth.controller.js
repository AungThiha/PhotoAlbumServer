const db = require("../models");
const config = require("../config/auth.config");
const { user: User, refreshToken: RefreshToken } = db;

const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

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

      const token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: config.jwtExpiration
      });

      let refreshToken = await RefreshToken.createToken(user.id);

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

    console.log(refreshToken)

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

  // verify access token
  let token = req.headers["x-access-token"];
  if (!token) {
    return res.status(403).send({
      message: "No token provided!"
    });
  }

  const { refreshToken: requestToken } = req.body;
  if (requestToken == null) {
    return res.status(403).json({ message: "Refresh Token is required!" });
  }

  jwt.verify(token, config.secret, { ignoreExpiration: true }, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: err });
    }
    req.userId = decoded.id;
  });

  try {
    let refreshToken = await RefreshToken.findOne(
        { where: { token: requestToken, userId: req.userId } }
      );

    console.log(refreshToken)

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

    let newAccessToken = jwt.sign({ id: req.userId }, config.secret, {
      expiresIn: config.jwtExpiration,
    });
    let newRefreshToken = await RefreshToken.createToken(req.userId);

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    return res.status(500).send({ message: err });
  }
};
