create table movies (
  id serial not null primary key,
  movie_name text,
  poster_url text,
  user_id int,
  foreign key (user_id) references users(id)
);