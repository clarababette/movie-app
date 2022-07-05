create table movies (
  id serial not null primary key,
  movie_name text,
  poster_url text,
  year int,
  user_id int,
  foreign key (user_id) references users(id),
  unique(poster_url, user_id)
);