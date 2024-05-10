module.exports = {
  // TODO use RSA private key instead. Store the key somewhere safe
  secret: "bezkoder-secret-key",
  // jwtExpiration: 86400,           // 24 hours
  // jwtRefreshExpiration: 2592000,   // 30 days
  jwtExpiration: 300,           // 1 minute
  jwtRefreshExpiration: 86400,   // 30 days
};
