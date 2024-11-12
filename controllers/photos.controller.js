const ip = require('ip');

exports.photos = (req, res) => {
  let port = process.env.PORT || 8080
  let photoBaseUrl = ip.address() + ":" + port + "/photos/";
  let photos = [
      { id: 1, url: "https://scontent.fbkk22-6.fna.fbcdn.net/v/t39.30808-6/244535430_323700936224252_8947657960075204630_n.jpg?_nc_cat=104&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeH--HNJVZXrfEzD9jxhciz29jbrBneWATj2NusGd5YBOIiPbEOzEfDDIkeESzV5iXSh35A9B7jCJP8KhVPZfX84&_nc_ohc=KIol3m8uQpwQ7kNvgGYzH66&_nc_zt=23&_nc_ht=scontent.fbkk22-6.fna&_nc_gid=A8ynoE9xkkXRyiHlaJ3SneI&oh=00_AYCRZ6pLm6iMWYWI9Im5uIAayVgYJNpNMj-qEzPO_xgjDg&oe=6738FF4A"},
      { id: 2, url: "https://scontent.fbkk22-2.fna.fbcdn.net/v/t39.30808-6/311120965_564192528841757_5992025753218779282_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeGnSPYKDScKkMz_T7414ElGdF2DMpiu5yV0XYMymK7nJQvOK1MhVKHj_m6Nt3Fvrk3UVWcvagCBOQXwjQhdYI08&_nc_ohc=HQbZbWmyRU4Q7kNvgEgJQow&_nc_zt=23&_nc_ht=scontent.fbkk22-2.fna&_nc_gid=ABzyw140rlsv17dVf57iay-&oh=00_AYC9T26dqkoll9FJnJ44pL9FMAZdsj49BpU41MosDSIyZA&oe=6738E873"},
      { id: 3, url: "https://scontent.fbkk22-7.fna.fbcdn.net/v/t39.30808-6/311083231_565011365426540_1861495596735216226_n.jpg?_nc_cat=107&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeEACzJluBa_W-_un-KOrR0IhdZ6QoMIwI6F1npCgwjAjiRUUOU1rJQ6Vq6x8iEMEcXhSxpWUlink6YWIJkvQ6_N&_nc_ohc=QfbLz7R0Q78Q7kNvgHBedeC&_nc_zt=23&_nc_ht=scontent.fbkk22-7.fna&_nc_gid=A7XCzOjVfo-gdMMeFJdlmA5&oh=00_AYC_OyLsI33hd2XzDQPS7pC0EwmF7U-HiNRBCAyD8L3q-w&oe=6738F636"},
      { id: 4, url: "https://scontent.fbkk22-2.fna.fbcdn.net/v/t39.30808-6/310867748_565118222082521_3617461375937046780_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=f727a1&_nc_eui2=AeE4Mz9qYBO9cZsr_wEC_EhYOLQXIKEqqpI4tBcgoSqqkqDHEyJZB85wkw2x2_GtQGdytSQeC2mXfvCh-T7ga7hp&_nc_ohc=nXRqHcJvCEgQ7kNvgF0EiAV&_nc_zt=23&_nc_ht=scontent.fbkk22-2.fna&_nc_gid=Ac8-SfF7nA8tCVNDc0-UZi2&oh=00_AYClHlZkhpV45e-FnsEbgA_jDpQ7lVzJ6xCzvAFfdV-v0Q&oe=67390451"},
    ]
  return res.status(200).send(photos);
};