-- --------------------------------------------------------
-- Host:                         127.0.0.1
-- Server version:               11.1.0-MariaDB - mariadb.org binary distribution
-- Server OS:                    Win64
-- HeidiSQL Version:             12.3.0.6589
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for dogdb
CREATE DATABASE IF NOT EXISTS `dogdb` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci */;
USE `dogdb`;

-- Dumping structure for table dogdb.comments
CREATE TABLE IF NOT EXISTS `comments` (
  `content` text NOT NULL,
  `created_at` date NOT NULL,
  `comment_id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` int(11) NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`comment_id`),
  KEY `user_id` (`user_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `comments_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `comments_ibfk_2` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=20 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.comments: ~0 rows (approximately)
DELETE FROM `comments`;

-- Dumping structure for table dogdb.dogs
CREATE TABLE IF NOT EXISTS `dogs` (
  `dog_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  `breed` text NOT NULL,
  `age` int(11) NOT NULL,
  `gender` text NOT NULL,
  `color` text NOT NULL,
  `bio` text NOT NULL,
  `profile_image` text NOT NULL,
  `created_at` date NOT NULL,
  `owner_id` int(11) NOT NULL,
  PRIMARY KEY (`dog_id`),
  KEY `owner_id` (`owner_id`),
  CONSTRAINT `dogs_ibfk_1` FOREIGN KEY (`owner_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.dogs: ~2 rows (approximately)
DELETE FROM `dogs`;
INSERT INTO `dogs` (`dog_id`, `name`, `breed`, `age`, `gender`, `color`, `bio`, `profile_image`, `created_at`, `owner_id`) VALUES
	(1, 'Doggo', 'Corgi', 11, 'Female', 'Yellow', 'tt', 'snek.png', '2023-04-22', 2),
	(2, 'Testidoggo', 'xd', 12, 'Male', 'blue', 'd', 'yep.png', '2023-04-23', 2);

-- Dumping structure for table dogdb.follows
CREATE TABLE IF NOT EXISTS `follows` (
  `follow_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` date NOT NULL,
  `follower_id` int(11) NOT NULL,
  `following_id` int(11) NOT NULL,
  PRIMARY KEY (`follow_id`),
  KEY `follower_id` (`follower_id`),
  KEY `following_id` (`following_id`),
  CONSTRAINT `follows_ibfk_1` FOREIGN KEY (`follower_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `follows_ibfk_2` FOREIGN KEY (`following_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.follows: ~0 rows (approximately)
DELETE FROM `follows`;

-- Dumping structure for table dogdb.likes
CREATE TABLE IF NOT EXISTS `likes` (
  `like_id` int(11) NOT NULL AUTO_INCREMENT,
  `created_at` date NOT NULL,
  `post_id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  PRIMARY KEY (`like_id`),
  KEY `post_id` (`post_id`),
  KEY `user_id` (`user_id`),
  CONSTRAINT `likes_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`),
  CONSTRAINT `likes_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=224 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.likes: ~0 rows (approximately)
DELETE FROM `likes`;

-- Dumping structure for table dogdb.posts
CREATE TABLE IF NOT EXISTS `posts` (
  `post_id` int(11) NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` date NOT NULL,
  `user_id` int(11) NOT NULL,
  `dog_id` int(11) NOT NULL,
  PRIMARY KEY (`post_id`),
  KEY `user_id` (`user_id`),
  KEY `dog_id` (`dog_id`),
  CONSTRAINT `posts_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `posts_ibfk_2` FOREIGN KEY (`dog_id`) REFERENCES `dogs` (`dog_id`)
) ENGINE=InnoDB AUTO_INCREMENT=74 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.posts: ~2 rows (approximately)
DELETE FROM `posts`;
INSERT INTO `posts` (`post_id`, `content`, `created_at`, `user_id`, `dog_id`) VALUES
	(19, 'test', '2023-04-23', 2, 2),
	(20, 'test', '2023-04-23', 2, 1);

-- Dumping structure for table dogdb.post_media
CREATE TABLE IF NOT EXISTS `post_media` (
  `media_id` int(11) NOT NULL AUTO_INCREMENT,
  `media_name` text NOT NULL,
  `post_id` int(11) NOT NULL,
  PRIMARY KEY (`media_id`),
  KEY `post_id` (`post_id`),
  CONSTRAINT `post_media_ibfk_1` FOREIGN KEY (`post_id`) REFERENCES `posts` (`post_id`)
) ENGINE=InnoDB AUTO_INCREMENT=92 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.post_media: ~2 rows (approximately)
DELETE FROM `post_media`;
INSERT INTO `post_media` (`media_id`, `media_name`, `post_id`) VALUES
	(2, 'imuri.jpg', 19),
	(4, 'pepestare.png', 20);

-- Dumping structure for table dogdb.roles
CREATE TABLE IF NOT EXISTS `roles` (
  `role_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` text NOT NULL,
  PRIMARY KEY (`role_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.roles: ~2 rows (approximately)
DELETE FROM `roles`;
INSERT INTO `roles` (`role_id`, `name`) VALUES
	(0, 'Admin'),
	(1, 'Normal');

-- Dumping structure for table dogdb.userroles
CREATE TABLE IF NOT EXISTS `userroles` (
  `user_id` int(11) NOT NULL,
  `role_id` int(11) NOT NULL,
  KEY `user_id` (`user_id`),
  KEY `role_id` (`role_id`),
  CONSTRAINT `userroles_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  CONSTRAINT `userroles_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.userroles: ~2 rows (approximately)
DELETE FROM `userroles`;
INSERT INTO `userroles` (`user_id`, `role_id`) VALUES
	(2, 0),
	(40, 1);

-- Dumping structure for table dogdb.users
CREATE TABLE IF NOT EXISTS `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` text NOT NULL,
  `email` text NOT NULL,
  `password` text NOT NULL,
  `profile_image` text DEFAULT NULL,
  `bio` text DEFAULT NULL,
  `location` text DEFAULT NULL,
  `website` text DEFAULT NULL,
  `created_at` date NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=41 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Dumping data for table dogdb.users: ~2 rows (approximately)
DELETE FROM `users`;
INSERT INTO `users` (`user_id`, `username`, `email`, `password`, `profile_image`, `bio`, `location`, `website`, `created_at`) VALUES
	(2, 'Admin', 'admin@metropolia.fi', '$2a$10$nBCPrxk.jG1BfQCe0L1JgOy4BFCSaf87wNyAfDWzgWhaTevcaXMY2', 'default_profile.png', NULL, '', NULL, '2023-04-20'),
	(40, 'Normal', 'test@test.com', '$2a$10$kQTNtiO2jVZsMmSBA4U3ie4xvR96k0Ycv/Ae3e6JxFJQAuJCmbzlu', 'ru4azspi85a01.jpg', NULL, '', NULL, '2023-04-30');

-- Dumping structure for trigger dogdb.insert_user_role
SET @OLDTMP_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO';
DELIMITER //
CREATE TRIGGER insert_user_role
AFTER INSERT ON users
FOR EACH ROW
BEGIN
    INSERT INTO userroles (user_id, role_id)
    VALUES (NEW.user_id, 1);
END//
DELIMITER ;
SET SQL_MODE=@OLDTMP_SQL_MODE;

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
