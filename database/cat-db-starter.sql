DROP DATABASE IF EXISTS dogdb;
CREATE DATABASE dogdb;
USE dogdb;

CREATE TABLE Roles
(
  name INT NOT NULL,
  role_id INT NOT NULL,
  PRIMARY KEY (role_id)
);

CREATE TABLE Users
(
  user_id INT NOT NULL,
  username TEXT NOT NULL,
  email TEXT NOT NULL,
  password INT NOT NULL,
  profile_image TEXT NOT NULL,
  bio TEXT NOT NULL,
  location TEXT NOT NULL,
  website TEXT NOT NULL,
  created_at DATE NOT NULL,
  PRIMARY KEY (user_id)
);

CREATE TABLE Dogs
(
  name TEXT NOT NULL,
  breed TEXT NOT NULL,
  age INT NOT NULL,
  gender TEXT NOT NULL,
  color TEXT NOT NULL,
  bio TEXT NOT NULL,
  profile_image TEXT NOT NULL,
  created_at DATE NOT NULL,
  dog_id INT NOT NULL,
  owner_id INT NOT NULL,
  PRIMARY KEY (dog_id),
  FOREIGN KEY (owner_id) REFERENCES Users(user_id)
);

CREATE TABLE UserRoles
(
  user_id INT NOT NULL,
  role_id INT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (role_id) REFERENCES Roles(role_id)
);

CREATE TABLE Follows
(
  follow_id INT NOT NULL,
  created_at DATE NOT NULL,
  follower_id INT NOT NULL,
  following_id INT NOT NULL,
  PRIMARY KEY (follow_id),
  FOREIGN KEY (follower_id) REFERENCES Users(user_id),
  FOREIGN KEY (following_id) REFERENCES Users(user_id)
);

CREATE TABLE Posts
(
  content TEXT NOT NULL,
  media_path TEXT NOT NULL,
  created_at DATE NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  dog_id INT NOT NULL,
  PRIMARY KEY (post_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (dog_id) REFERENCES Dogs(dog_id)
);

CREATE TABLE Likes
(
  created_at DATE NOT NULL,
  like_id INT NOT NULL,
  post_id INT NOT NULL,
  user_id INT NOT NULL,
  PRIMARY KEY (like_id),
  FOREIGN KEY (post_id) REFERENCES Posts(post_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id)
);

CREATE TABLE Comments
(
  content TEXT NOT NULL,
  created_at DATE NOT NULL,
  comment_id INT NOT NULL,
  user_id INT NOT NULL,
  post_id INT NOT NULL,
  PRIMARY KEY (comment_id),
  FOREIGN KEY (user_id) REFERENCES Users(user_id),
  FOREIGN KEY (post_id) REFERENCES Posts(post_id)
);