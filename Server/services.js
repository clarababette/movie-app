const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');

function Services(db) {
  const signup = async (req, res) => {
    const {firstName, lastName, username, password} = req.body;

    const saltRounds = 10;
    bcrypt.hash(password, saltRounds, async (err, hash) => {
      await db
        .one(
          'insert into users (first_name, last_name, username, password) values ($1,$2,$3,$4) returning username ',
          [firstName, lastName, username, hash],
        )
        .then((result) => {
          const {username} = result;
          const accessToken = jwt.sign(
            {username},
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: '30s'},
          );
          const refreshToken = jwt.sign(
            {username},
            process.env.REFRESH_TOKEN_SECRET,
            {expiresIn: '1d'},
          );
          res.cookie('jwt', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
          });
          res.json({username, accessToken});
        })
        .catch((err) => {
          res.send(err);
        });
    });
  };

  const login = async (req, res) => {
    const {username, password} = req.body;
    await db
      .one('select password, id from users where username = $1', [username])
      .then((result) => {
        const hash = result.password;

        bcrypt.compare(password, hash, (err, result) => {
          if (result) {
            const accessToken = jwt.sign(
              {username},
              process.env.ACCESS_TOKEN_SECRET,
              {expiresIn: '30s'},
            );
            const refreshToken = jwt.sign(
              {username},
              process.env.REFRESH_TOKEN_SECRET,
              {expiresIn: '1d'},
            );
            res.cookie('jwt', refreshToken, {
              httpOnly: true,
              maxAge: 24 * 60 * 60 * 1000,
            });
            res.json({username, accessToken});
          } else {
            res.status(401).send('invalid password');
          }
        });
      })
      .catch((err) => {
        res.status(401).send('user not found');
      });
  };

  function sortByPropFloat(arr, prop) {
    return arr.sort((a, b) => {
      a = parseFloat(a[prop]);
      b = parseFloat(b[prop]);
      return b - a;
    });
  }

  const verifyJWT = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader) return res.sendStatus(401);
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) return res.sendStatus(403);
      req.user = decoded.username;
      next();
    });
  };

  const handleRefreshToken = (req, res) => {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(499);
    const refreshToken = cookies.jwt;
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) return res.sendStatus(498);
        const username = decoded.username;
        const accessToken = jwt.sign(
          {username},
          process.env.ACCESS_TOKEN_SECRET,
          {expiresIn: '30s'},
        );
        res.json({username, accessToken});
      },
    );
  };

  const search = async (req, res) => {
    const { queryString } = req.query;
    let movies;
    if (!queryString) { res.sendStatus(418) }
    else {
    const key = process.env.MOVIE_API_KEY;
    const config = await axios.get(
      `https://api.themoviedb.org/3/configuration?api_key=${key}`,
    );
    const posterBase = config.data.images.base_url;
    await axios
      .get(
        `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${queryString}&include_adult=false`,
      )
      .then((result) => {
        movies = result.data.results.map((movie) => {
          const date = new Date(movie.release_date)
          return {
            popularity: movie.popularity,
            poster: `${posterBase}w185${movie.poster_path}`,
            title: movie.title,
            year: date.getFullYear()
          };
        });
        movies = sortByPropFloat(movies, 'popularity');
        res.json(movies);
      });
    }
  };
  const getPlaylist = async (req, res) => {
    const {username} = req.params;
    await db
      .many(
        'select movies.* from movies join users on movies.user_id=users.id where users.username = $1',
        [username],
      )
      .then((result) => {
        const movies = result.map((movie) => { return { title: movie.movie_name, poster: movie.poster_url, year: movie.year } });
        res.json(movies);
      })
      .catch((err) => res.send(err));
  };
  const addToPlaylist = async (req, res) => {
    const { username } = req.params;
    const {title, poster, year} = req.body;
    await db
      .none(
        'insert into movies(movie_name, poster_url, year, user_id) values( $1, $2, $3, (select users.id from users where users.username = $4)) on conflict do nothing',
        [title, poster, year, username],
      )
      .then(res => res.send('added'))
      .catch((err) => res.send(err));
  };
  const removeFromPlaylist = async (req, res) => {
    const { username } = req.params;
    const {title, poster} = req.body;
    await db
      .none(
        'delete from movies using users where user_id = users.id and users.username=$1 and movie_name = $2 and poster_url = $3',
        [username, title, poster],
      )
      .then(res.send('removed'))
      .catch((err) => res.send(err));
  };

  const getTrending = async (req, res) => {
    let movies;
    const key = process.env.MOVIE_API_KEY;
    const config = await axios.get(
      `https://api.themoviedb.org/3/configuration?api_key=${key}`,
    );
    const posterBase = config.data.images.base_url;
    await axios
      .get(
        `https://api.themoviedb.org/3/trending/movie/day?api_key=${key}`,
      )
      .then((result) => {
        movies = result.data.results.map((movie) => {
          const date = new Date(movie.release_date)
          return {
            popularity: movie.popularity,
            poster: `${posterBase}w185${movie.poster_path}`,
            title: movie.title,
            year: date.getFullYear()
          };
        });
        movies = sortByPropFloat(movies, 'popularity');
        res.json(movies);
      });
  }

  return {
    signup,
    login,
    search,
    getPlaylist,
    addToPlaylist,
    removeFromPlaylist,
    handleRefreshToken,
    verifyJWT,
    getTrending
  };
}

module.exports = Services;
