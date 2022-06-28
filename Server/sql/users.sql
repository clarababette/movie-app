create table users(
  id serial not null primary key,
  first_name text,
  last_name text,
  username text unique,
  password text
);