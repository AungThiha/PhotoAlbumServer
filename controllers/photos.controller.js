const ip = require('ip');

exports.photos = (req, res) => {
  let port = process.env.PORT || 8080
  let photoBaseUrl = ip.address() + ":" + port + "/photos/";
  let photos = [
      { id: 1, url: photoBaseUrl + "1.jpg"},
      { id: 2, url: photoBaseUrl + "2.jpg"},
      { id: 3, url: photoBaseUrl + "3.jpg"},
      { id: 4, url: photoBaseUrl + "4.jpg"},
    ]
  return res.status(200).send(photos);
};