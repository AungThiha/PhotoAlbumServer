# PhotoAlbumServer
Express.js Backend Application for a Photo Album App

##  To make this development ready
- delete the secret key in `auth.config.js`, make your own and store it somewhere safe
- remove `db.sync` from `app.js`. There's a comment why it needs to be removed
- use RSA instead of simple single secret key encryption for authentication