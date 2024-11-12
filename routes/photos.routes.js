const { verifyToken } = require("../middleware/authJwt");
const controller = require("../controllers/photos.controller");

module.exports = function(app) {
  app.use(function(req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Authorization, Origin, Content-Type, Accept"
    );
    next();
  });

  app.get(
    "/photos",
    [
      verifyToken
    ],
    controller.photos
  );
};
