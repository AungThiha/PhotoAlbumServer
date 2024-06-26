const verifySignUp = require("../middleware/verifySignUp");
const { verifyTokenIgnoreExpiration } = require("../middleware/authJwt");
const controller = require("../controllers/auth.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "x-access-token, Origin, Content-Type, Accept"
    );
    next();
  });

  app.post(
    "/api/auth/signup",
    [
      verifySignUp.checkDuplicateEmail
    ],
    controller.signup
  );

  app.post("/api/auth/signin", controller.signin);
  app.post(
    "/api/auth/refreshtoken", 
    [
      verifyTokenIgnoreExpiration
    ],
    controller.refreshToken
  );
  app.post("/api/auth/checkRefreshTokenExpiration", controller.checkRefreshTokenExpiration);
};
