const fs = require('fs');
const path = require('path');

const photosDirectory = path.join(__dirname, '../photos/');

exports.photos = (req, res) => {
  fs.readdir(photosDirectory, (err, files) => {
    if (err) {
        console.error('Error reading photos directory:', err);
        return res.status(500).json({ error: 'Unable to provide photos' });
    }

    const baseUrl = `${req.protocol}://${req.headers.host}`;

    const photos = files.map((file, index) => ({
        id: index + 1,
        url: `${baseUrl}/photos/${file}`
    }));

    return res.status(200).send(photos);
  });
};