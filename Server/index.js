const express = require('express');
const cors = require('cors');
const PgPromise = require('pg-promise');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const Services = require('./services');
const cookieParser = require('cookie-parser')

const app = express();

const pgp = PgPromise();
const DATABASE_URL = process.env.DATABASE_URL;
const config = { connectionString: DATABASE_URL };

if (process.env.NODE_ENV == 'production') {
  config.ssl = {
    rejectUnauthorized: false
  }
}

const db = pgp(config);
const api = Services(db);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(cookieParser())

app.post('/api/signup', api.signup);
app.post('/api/refresh', api.handleRefreshToken);
app.post('/api/login', api.login);
//app.use(api.verifyJWT)
app.get('/api/search', api.search);
app.get('/api/playlist/:username', api.getPlaylist);
app.post('/api/playlist/:username/add', api.addToPlaylist);
app.post('/api/playlist/:username/remove', api.removeFromPlaylist);
app.get('/api/trending', api.getTrending);

const PORT = process.env.PORT || 3023;

app.listen(PORT, () => console.log(`App started on ${PORT}`));
