module.exports = {
  HOST: "localhost",
  USER: "me",
  PASSWORD: "password",
  DB: "photo_album",
  PORT: 5432,
  dialect: "postgres",
  pool: {
    max: 5,
    min: 0,
    // The maximum time, in milliseconds, that pool will try to get connection before throwing error
    acquire: 30000,
    // The maximum time, in milliseconds, that a connection can be idle before being released.
    idle: 10000
  }
};
