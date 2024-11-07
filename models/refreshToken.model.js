const config = require("../config/auth.config");

module.exports = (sequelize, Sequelize) => {
  const RefreshToken = sequelize.define("refresh_token", {
    token: {
      type: Sequelize.STRING(2048),
    },
    expiry: {
      type: Sequelize.DATE,
    },
  });

  RefreshToken.createToken = async function (userId, signJwt) {
    let expiredAt = new Date();

    expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

    const _token = signJwt({ id: userId }, {
      algorithm: 'RS256',
      expiresIn: config.jwtExpiration
    });

    let refreshToken = await this.create({
      token: _token,
      userId: userId,
      expiry: expiredAt.getTime(),
    });

    return refreshToken.token;
  };

  RefreshToken.isExpired = (token) => {
    return token.expiry.getTime() < new Date().getTime();
  };

  return RefreshToken;
};
