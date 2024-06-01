-- MySQL dump 10.13  Distrib 8.0.36, for Win64 (x86_64)
--
-- Host: srv1154.hstgr.io    Database: u411477811_lottery_ledger
-- ------------------------------------------------------
-- Server version	5.5.5-10.11.7-MariaDB-cll-lve

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `announcement_users`
--

DROP TABLE IF EXISTS `announcement_users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcement_users` (
  `fk_announcement_id` int(11) NOT NULL,
  `fk_user_id` int(11) NOT NULL,
  PRIMARY KEY (`fk_announcement_id`,`fk_user_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `announcement_users_ibfk_1` FOREIGN KEY (`fk_announcement_id`) REFERENCES `announcements` (`announcement_id`),
  CONSTRAINT `announcement_users_ibfk_2` FOREIGN KEY (`fk_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcement_users`
--

LOCK TABLES `announcement_users` WRITE;
/*!40000 ALTER TABLE `announcement_users` DISABLE KEYS */;
/*!40000 ALTER TABLE `announcement_users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `announcements`
--

DROP TABLE IF EXISTS `announcements`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `announcements` (
  `announcement_id` int(11) NOT NULL AUTO_INCREMENT,
  `announcement_content` varchar(500) DEFAULT NULL,
  `date_created` timestamp NULL DEFAULT current_timestamp(),
  `isOutdated` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`announcement_id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `announcements`
--

LOCK TABLES `announcements` WRITE;
/*!40000 ALTER TABLE `announcements` DISABLE KEYS */;
INSERT INTO `announcements` VALUES (1,'Welcome to the official launch of Singapore Lottery Ledger! (24 Oct 2023)','2023-10-24 11:35:52',0);
/*!40000 ALTER TABLE `announcements` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `betslips`
--

DROP TABLE IF EXISTS `betslips`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `betslips` (
  `betslip_id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) DEFAULT NULL,
  `lottery_name` varchar(255) DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `date_of_upload` timestamp NULL DEFAULT current_timestamp(),
  `isChecked` tinyint(1) DEFAULT 0,
  `date_checked` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`betslip_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `betslips_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=80 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `betslips`
--

LOCK TABLES `betslips` WRITE;
/*!40000 ALTER TABLE `betslips` DISABLE KEYS */;
INSERT INTO `betslips` VALUES (1,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1698235272/Singapore%20Lottery%20Ledger/Betslips/l0uoodhmzuun6qkqvrce.jpg','2023-10-25 12:01:12',1,'2023-10-26 11:03:07'),(2,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1698573123/Singapore%20Lottery%20Ledger/Betslips/fl0mhy2cpoerpeqxadfw.jpg','2023-10-29 09:52:03',1,'2023-10-30 11:29:30'),(3,2,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1698586133/Singapore%20Lottery%20Ledger/Betslips/eh51ypa7dt7eyllzmko4.png','2023-10-29 13:28:54',1,'2024-02-08 05:48:57'),(4,1,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1698799948/Singapore%20Lottery%20Ledger/Betslips/r9n4abhkmqfz9q8mtpo4.jpg','2023-11-01 00:52:29',1,'2023-11-01 12:18:20'),(5,1,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1698799957/Singapore%20Lottery%20Ledger/Betslips/x2f8mc1pm4lhy9ad0yie.jpg','2023-11-01 00:52:38',1,'2023-11-01 12:18:23'),(6,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1698842655/Singapore%20Lottery%20Ledger/Betslips/zjdmfuit18vxovx5z7bo.jpg','2023-11-01 12:44:16',1,'2023-11-02 11:25:42'),(7,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1699100455/Singapore%20Lottery%20Ledger/Betslips/cpgpctchzwotgk59o7ly.jpg','2023-11-04 12:20:56',1,'2023-11-06 11:01:41'),(8,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1699491114/Singapore%20Lottery%20Ledger/Betslips/jqfxdk9yc9ug9rpx7o9u.jpg','2023-11-09 00:51:55',1,'2023-11-09 11:02:46'),(9,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1699752947/Singapore%20Lottery%20Ledger/Betslips/xs2oacmjchifxvxeqawe.jpg','2023-11-12 01:35:48',1,'2023-11-13 11:14:55'),(10,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1700132772/Singapore%20Lottery%20Ledger/Betslips/hinbofttzr4mivytenyv.jpg','2023-11-16 11:06:13',1,'2023-11-20 11:16:39'),(11,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1701068087/Singapore%20Lottery%20Ledger/Betslips/lpyo3ctqcav99g6mhouc.jpg','2023-11-27 06:54:47',1,'2023-11-27 13:41:03'),(12,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1701297067/Singapore%20Lottery%20Ledger/Betslips/xgbas4dstaola5vb7u9x.jpg','2023-11-29 22:31:07',1,'2023-12-01 11:45:56'),(13,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1701440022/Singapore%20Lottery%20Ledger/Betslips/bbkqx2dhiexzwnjdmblz.jpg','2023-12-01 14:13:43',1,'2023-12-02 01:26:06'),(14,1,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1701480445/Singapore%20Lottery%20Ledger/Betslips/wcgeugmplxoihg3gioiu.jpg','2023-12-02 01:27:26',1,'2023-12-07 00:01:50'),(15,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1701613525/Singapore%20Lottery%20Ledger/Betslips/dmcsnzixwgme7ui8emhc.jpg','2023-12-03 14:25:25',1,'2023-12-04 11:10:32'),(16,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1701907323/Singapore%20Lottery%20Ledger/Betslips/gbzupn4vjza9suyunhew.jpg','2023-12-07 00:02:04',1,'2023-12-07 10:53:22'),(17,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1702272213/Singapore%20Lottery%20Ledger/Betslips/dfzejwyha64pu78u08si.jpg','2023-12-11 05:23:33',1,'2023-12-11 13:32:23'),(18,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1702503611/Singapore%20Lottery%20Ledger/Betslips/z4u0z52vhi8bzv7zssiw.jpg','2023-12-13 21:40:12',1,'2023-12-14 13:00:54'),(19,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1702865797/Singapore%20Lottery%20Ledger/Betslips/vz3re3qpheckusgvlhrq.jpg','2023-12-18 02:16:37',1,'2023-12-18 10:59:56'),(20,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1703117718/Singapore%20Lottery%20Ledger/Betslips/nw7uj7miqshuq50mesul.jpg','2023-12-21 00:15:18',1,'2023-12-22 06:24:49'),(21,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1703117733/Singapore%20Lottery%20Ledger/Betslips/w9ap8y3ye36bgs5n5rd9.jpg','2023-12-21 00:15:33',1,'2023-12-22 06:24:52'),(22,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1703505314/Singapore%20Lottery%20Ledger/Betslips/bolsbyyqycvax6bsz5l8.jpg','2023-12-25 11:55:15',1,'2023-12-28 12:32:07'),(23,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1704083109/Singapore%20Lottery%20Ledger/Betslips/tyt3mojgyzbr4cexnmx1.jpg','2024-01-01 04:25:09',1,'2024-01-01 10:56:51'),(24,1,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1704114389/Singapore%20Lottery%20Ledger/Betslips/gftynpk7njeh9nregq3x.png','2024-01-01 13:06:30',1,'2024-01-03 13:34:12'),(25,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1704289024/Singapore%20Lottery%20Ledger/Betslips/busqnd3qud12j9ppc0nb.png','2024-01-03 13:37:05',1,'2024-01-06 00:56:39'),(26,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1704686023/Singapore%20Lottery%20Ledger/Betslips/icxoxufqmflbsfgjco53.jpg','2024-01-08 03:53:44',1,'2024-01-08 12:00:32'),(27,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1704897220/Singapore%20Lottery%20Ledger/Betslips/occglrglhm1noah9cell.jpg','2024-01-10 14:33:41',1,'2024-01-11 22:08:47'),(28,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1705306134/Singapore%20Lottery%20Ledger/Betslips/hehvak3oh7ky3xtdekbe.jpg','2024-01-15 08:08:55',1,'2024-01-15 11:16:46'),(29,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1705570745/Singapore%20Lottery%20Ledger/Betslips/sp0zn4i7mitbvuqzgpax.png','2024-01-18 09:39:05',1,'2024-01-18 13:07:33'),(30,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1705902665/Singapore%20Lottery%20Ledger/Betslips/oqd3a8jifk0z8t3jnnm2.jpg','2024-01-22 05:51:05',1,'2024-01-23 05:41:08'),(31,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1705988532/Singapore%20Lottery%20Ledger/Betslips/xcctqi6yq9sarepc3hrm.jpg','2024-01-23 05:42:12',1,'2024-01-25 08:23:00'),(32,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1706170986/Singapore%20Lottery%20Ledger/Betslips/uksmxmhehfhkwcpqiyjk.jpg','2024-01-25 08:23:08',1,'2024-01-26 02:12:25'),(33,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1706512408/Singapore%20Lottery%20Ledger/Betslips/ztbzrrww9r1hgoegmlh3.jpg','2024-01-29 07:13:28',1,'2024-01-30 08:58:32'),(34,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1706863539/Singapore%20Lottery%20Ledger/Betslips/je6zberiks5ay04l9tl9.jpg','2024-02-02 08:45:39',1,'2024-02-04 15:39:27'),(35,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1707061172/Singapore%20Lottery%20Ledger/Betslips/otwby5an6b7uc7gg2zec.jpg','2024-02-04 15:39:33',1,'2024-02-07 09:39:54'),(36,1,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1707298820/Singapore%20Lottery%20Ledger/Betslips/jaqieuap0ccf00lo9qig.jpg','2024-02-07 09:40:21',1,'2024-02-08 11:08:53'),(37,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1707377955/Singapore%20Lottery%20Ledger/Betslips/l8pcwlivxmgfevkkw1df.jpg','2024-02-08 07:39:16',1,'2024-02-08 11:14:48'),(38,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1707725467/Singapore%20Lottery%20Ledger/Betslips/qmbvyzdldatxprywoi3b.jpg','2024-02-12 08:11:08',1,'2024-02-26 00:46:58'),(39,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1707725479/Singapore%20Lottery%20Ledger/Betslips/zapvs3hqvzvqtzl8algb.jpg','2024-02-12 08:11:20',1,'2024-02-26 00:46:28'),(40,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1707725496/Singapore%20Lottery%20Ledger/Betslips/zcnz2echvlmybs6fq560.jpg','2024-02-12 08:11:37',1,'2024-02-26 00:45:31'),(41,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1707725502/Singapore%20Lottery%20Ledger/Betslips/o8ak29kgzoi9dkxcmyxa.jpg','2024-02-12 08:11:42',1,'2024-02-26 00:44:33'),(42,3,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708692825/Singapore%20Lottery%20Ledger/Betslips/fjcef0jiqkxhr3pgguyp.png','2024-02-23 12:53:45',1,'2024-02-24 15:05:22'),(43,3,'4d','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708692837/Singapore%20Lottery%20Ledger/Betslips/os8w3bqhl75ym84gee09.png','2024-02-23 12:53:57',1,'2024-02-24 14:44:24'),(44,3,'4d','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708692867/Singapore%20Lottery%20Ledger/Betslips/b3spw1sktxgvi8t9tbby.jpg','2024-02-23 12:54:28',1,'2024-02-24 14:44:22'),(45,2,'4d','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708782803/Singapore%20Lottery%20Ledger/Betslips/uwjlkuixs4ldhkyfoyw5.png','2024-02-24 13:53:24',1,'2024-02-24 14:30:42'),(46,2,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708785035/Singapore%20Lottery%20Ledger/Betslips/uxoxpcdob23uiufni4e6.png','2024-02-24 14:30:36',0,NULL),(47,2,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708785058/Singapore%20Lottery%20Ledger/Betslips/zuxtqy1781ntqyrtnmnm.png','2024-02-24 14:30:58',1,'2024-02-24 14:36:04'),(48,2,'4d','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708785358/Singapore%20Lottery%20Ledger/Betslips/zvvb56mbqzlkzlldgspk.jpg','2024-02-24 14:35:59',0,NULL),(49,3,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708785855/Singapore%20Lottery%20Ledger/Betslips/w41tu58ixnx8x7at9h04.jpg','2024-02-24 14:44:15',1,'2024-02-24 15:00:07'),(50,3,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708786826/Singapore%20Lottery%20Ledger/Betslips/yynoxdouudo7zpdiq7jb.png','2024-02-24 15:00:26',1,'2024-02-24 15:05:20'),(51,3,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708787130/Singapore%20Lottery%20Ledger/Betslips/ycumxakcsb5b5emwecra.jpg','2024-02-24 15:05:31',0,NULL),(52,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708908676/Singapore%20Lottery%20Ledger/Betslips/qnl5km7wz5b3ymrtkszp.jpg','2024-02-26 00:51:16',1,'2024-02-26 11:28:34'),(53,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1708908692/Singapore%20Lottery%20Ledger/Betslips/owdj1ruykqeg2hzo4xtk.jpg','2024-02-26 00:51:33',1,'2024-03-05 02:18:09'),(54,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1709546121/Singapore%20Lottery%20Ledger/Betslips/sjdz3j3womt6f6w9pi5m.jpg','2024-03-04 09:55:21',1,'2024-03-05 02:16:40'),(55,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1709605244/Singapore%20Lottery%20Ledger/Betslips/nv3pncyypxyoyffmv5jp.jpg','2024-03-05 02:20:45',1,'2024-03-05 02:21:11'),(56,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1709605255/Singapore%20Lottery%20Ledger/Betslips/afju71lqw08zjtuiurvd.jpg','2024-03-05 02:20:56',1,'2024-03-24 11:52:14'),(57,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1709605280/Singapore%20Lottery%20Ledger/Betslips/zfqjlkhzt0s3amriuiwv.jpg','2024-03-05 02:21:20',1,'2024-03-24 11:53:21'),(58,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1709605291/Singapore%20Lottery%20Ledger/Betslips/vdh0g6hwy1onbq53cdxh.jpg','2024-03-05 02:21:31',1,'2024-03-24 11:55:04'),(59,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1709605298/Singapore%20Lottery%20Ledger/Betslips/gxjb0jlvkxvebbjbyzh3.jpg','2024-03-05 02:21:38',1,'2024-03-24 11:56:05'),(60,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1711281526/Singapore%20Lottery%20Ledger/Betslips/zskl9y15hlerewxggtke.jpg','2024-03-24 11:58:46',1,'2024-03-25 10:59:29'),(61,1,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1711715763/Singapore%20Lottery%20Ledger/Betslips/vl2f58jezhbsp6qvn3gt.jpg','2024-03-29 12:36:04',1,'2024-04-06 03:37:21'),(62,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1711946761/Singapore%20Lottery%20Ledger/Betslips/w5fnwqj9ynpe5bo9avmj.jpg','2024-04-01 04:46:01',1,'2024-04-01 12:27:58'),(63,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1712223770/Singapore%20Lottery%20Ledger/Betslips/q2nwoimbgiarfbpch7a6.jpg','2024-04-04 09:42:51',1,'2024-04-06 03:39:40'),(64,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1712793839/Singapore%20Lottery%20Ledger/Betslips/onljva1fhif8g5yelxht.jpg','2024-04-11 00:03:59',1,'2024-04-15 06:37:21'),(65,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1713163047/Singapore%20Lottery%20Ledger/Betslips/n2ld9wadnjre9jifisgk.jpg','2024-04-15 06:37:28',1,'2024-04-17 09:46:45'),(66,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1713347213/Singapore%20Lottery%20Ledger/Betslips/nou09ctfjigkerdch6jd.jpg','2024-04-17 09:46:53',1,'2024-04-19 09:18:53'),(67,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1713754176/Singapore%20Lottery%20Ledger/Betslips/vlebr2gffwwewgb1ooak.jpg','2024-04-22 02:49:36',1,'2024-04-29 07:36:57'),(68,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1714376076/Singapore%20Lottery%20Ledger/Betslips/krl5z4ozrn0yxkw3oz3z.jpg','2024-04-29 07:34:36',1,'2024-04-30 13:48:39'),(69,1,'sg-sweep','https://res.cloudinary.com/dzkuzwesw/image/upload/v1714484924/Singapore%20Lottery%20Ledger/Betslips/tzcismrcw7pnxc2sp3qi.jpg','2024-04-30 13:48:45',1,'2024-05-02 02:23:53'),(70,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1714484929/Singapore%20Lottery%20Ledger/Betslips/oiliyiyqzzimkjbhpf9p.jpg','2024-04-30 13:48:50',1,'2024-05-06 10:32:05'),(71,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1714991400/Singapore%20Lottery%20Ledger/Betslips/w4czydnt1wylzht2p5wg.jpg','2024-05-06 10:30:01',1,'2024-05-06 10:30:05'),(72,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1714991415/Singapore%20Lottery%20Ledger/Betslips/fxxbla8o3pm4ttivvsjy.jpg','2024-05-06 10:30:15',1,'2024-05-08 01:08:19'),(73,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1715130863/Singapore%20Lottery%20Ledger/Betslips/xy0sgzbhlvjbwd9lxgev.jpg','2024-05-08 01:14:24',1,'2024-05-13 08:48:14'),(74,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1715590101/Singapore%20Lottery%20Ledger/Betslips/wmupt7yphanlaflumm9m.jpg','2024-05-13 08:48:22',1,'2024-05-16 05:32:02'),(75,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1715837611/Singapore%20Lottery%20Ledger/Betslips/t1kcgve08banjyfcfm99.jpg','2024-05-16 05:33:31',1,'2024-05-20 06:19:31'),(76,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1716185998/Singapore%20Lottery%20Ledger/Betslips/ukwmwhzbasicf3bqwnwg.jpg','2024-05-20 06:19:58',1,'2024-05-23 00:59:21'),(77,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1716426038/Singapore%20Lottery%20Ledger/Betslips/elmd3dzylagf5uxoyaz7.jpg','2024-05-23 01:00:39',1,'2024-05-27 02:29:56'),(78,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1716777095/Singapore%20Lottery%20Ledger/Betslips/hrbobgelufxz8jgyzpxb.jpg','2024-05-27 02:31:36',1,'2024-05-30 06:42:03'),(79,1,'toto','https://res.cloudinary.com/dzkuzwesw/image/upload/v1717051462/Singapore%20Lottery%20Ledger/Betslips/qaskp6scn8vxcdqkcsko.jpg','2024-05-30 06:44:22',0,NULL);
/*!40000 ALTER TABLE `betslips` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `messages`
--

DROP TABLE IF EXISTS `messages`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `messages` (
  `message_id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) DEFAULT NULL,
  `message_type` varchar(255) DEFAULT NULL,
  `message_content` varchar(1000) DEFAULT NULL,
  `sender_email` varchar(255) DEFAULT NULL,
  `date_submitted` timestamp NULL DEFAULT current_timestamp(),
  `isResolved` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`message_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `messages`
--

LOCK TABLES `messages` WRITE;
/*!40000 ALTER TABLE `messages` DISABLE KEYS */;
INSERT INTO `messages` VALUES (1,2,'Report bug or improvements','what u want?','rere@mail.com','2023-10-29 13:13:47',1),(2,2,'Report bug or improvements','what the f','rere@mail.com','2023-10-29 13:24:12',1),(3,2,'Others','Email test after new backend url','snow@mail.com','2023-12-01 14:09:02',1),(4,1,'Request help','Ok','snowkiller101@gmail.com','2023-12-01 14:14:25',1),(5,2,'Report bug or improvements','Hello','test@mail.comcl','2024-02-08 05:48:08',1),(6,2,'Request data change','need help to change my name','wayne123@mail.com','2024-02-24 14:36:30',1),(7,3,'Request data change','need help to change my name','wayne123@mail.com','2024-02-24 14:44:39',1),(8,3,'Request data change','need help to change my name','wayne123@mail.com','2024-02-24 15:05:48',1),(9,10,'Report bug or improvements','Good work','rere@mail.com','2024-06-01 11:20:54',0);
/*!40000 ALTER TABLE `messages` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `notes`
--

DROP TABLE IF EXISTS `notes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notes` (
  `note_id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) DEFAULT NULL,
  `notes_content` text DEFAULT NULL,
  PRIMARY KEY (`note_id`),
  UNIQUE KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `notes_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `notes`
--

LOCK TABLES `notes` WRITE;
/*!40000 ALTER TABLE `notes` DISABLE KEYS */;
INSERT INTO `notes` VALUES (1,1,'Don\'t buy 4D\n\nOnly buy Toto and Singapore Sweep, both Quick picks\n\n$30 Toto: 1x System 7, 23x Ordinary\n\nToto monthly spendings: $30x2x4=$240\n\nSingapore Sweep monthly spendings: $30'),(4,3,'Hello, this is a text saved in the database! abc123'),(5,2,'good day');
/*!40000 ALTER TABLE `notes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `records`
--

DROP TABLE IF EXISTS `records`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `records` (
  `record_id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) DEFAULT NULL,
  `lottery_name` varchar(255) DEFAULT NULL,
  `entry_type` varchar(255) DEFAULT NULL,
  `pick_type` varchar(255) DEFAULT NULL,
  `bet_amount` varchar(255) DEFAULT NULL,
  `outlet` varchar(255) DEFAULT NULL,
  `number_of_boards` int(11) DEFAULT NULL,
  `cost` int(11) DEFAULT NULL,
  `date_of_entry` timestamp NULL DEFAULT current_timestamp(),
  `isDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`record_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `records_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=184 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `records`
--

LOCK TABLES `records` WRITE;
/*!40000 ALTER TABLE `records` DISABLE KEYS */;
INSERT INTO `records` VALUES (1,2,'4D','Ordinary','Quick Pick','$0(Big), $5(Small)','Central City',1,5,'2023-10-23 16:00:00',0),(2,2,'4D','Ordinary','Quick Pick','$3(Big), $0(Small)','Woodlands N8',5,15,'2023-10-24 11:39:58',0),(3,2,'4D','Ordinary','Quick Pick','$0(Big), $3(Small)','Woodlands N8',2,6,'2023-10-28 16:00:00',0),(4,2,'4D','Ordinary','Quick Pick','$0(Big), $3(Small)','Woodlands N8',2,6,'2023-10-24 11:42:11',0),(5,2,'4D','Ordinary','Quick Pick','$0(Big), $2(Small)','Woodlands N8',2,4,'2023-10-24 11:43:13',0),(6,2,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',2,6,'2009-10-23 16:00:00',0),(7,2,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',2,6,'2023-10-24 11:43:37',0),(8,2,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',3,9,'2023-10-24 11:45:40',0),(9,2,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',3,9,'2023-10-24 11:45:49',1),(10,2,'Toto','Ordinary','Quick Pick','-','Woodlands N8',3,3,'2023-10-24 11:45:59',0),(11,1,'Toto','System 7','Quick Pick','-','Woodlands N8',1,7,'2023-09-17 16:00:00',0),(12,1,'Toto','Ordinary','Quick Pick','-','Woodlands N8',20,20,'2023-09-17 16:00:00',0),(13,1,'Toto','Ordinary','ChatGPT','-','Woodlands N8',5,5,'2023-09-17 16:00:00',0),(14,1,'Toto','Ordinary','Quick Pick','-','Woodlands N8',5,5,'2023-09-20 16:00:00',0),(15,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Woodlands N8',10,10,'2023-09-26 16:00:00',0),(16,1,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',10,30,'2023-10-03 16:00:00',0),(17,1,'Toto','System 7','Quick Pick','-','Woodlands N8',1,7,'2023-10-08 16:00:00',0),(18,1,'Toto','Ordinary','Quick Pick','-','Woodlands N8',3,3,'2023-10-08 16:00:00',0),(19,1,'Toto','Ordinary','Quick Pick','-','Online',5,5,'2023-09-18 16:00:00',0),(20,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',5,5,'2023-09-18 16:00:00',0),(21,1,'4D','Ordinary','Quick Pick','$0(Big), $1(Small)','Online',5,5,'2023-09-18 16:00:00',0),(22,1,'Toto','Ordinary','Quick Pick','-','Online',5,5,'2023-09-21 16:00:00',0),(23,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-09-22 16:00:00',1),(24,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',5,5,'2023-09-21 16:00:00',0),(25,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',5,5,'2023-09-22 16:00:00',0),(26,1,'Toto','Ordinary','Quick Pick','-','Online',5,5,'2023-09-22 16:00:00',0),(27,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-09-23 16:00:00',0),(28,1,'4D','Ordinary','Quick Pick','$0(Big), $1(Small)','Online',15,15,'2023-09-23 16:00:00',0),(29,1,'Toto','Ordinary','Quick Pick','-','Online',10,10,'2023-09-23 16:00:00',0),(30,1,'Toto','Ordinary','Quick Pick','-','Online',10,10,'2023-09-26 16:00:00',0),(31,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-09-29 16:00:00',0),(32,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-09-30 16:00:00',0),(33,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2023-09-30 16:00:00',0),(34,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2023-09-30 16:00:00',0),(35,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-10-02 16:00:00',0),(36,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2023-10-04 16:00:00',0),(37,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2023-10-04 16:00:00',0),(38,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2023-10-05 16:00:00',0),(39,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2023-10-05 16:00:00',0),(40,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-10-05 16:00:00',0),(41,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-10-07 16:00:00',0),(42,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-10-08 16:00:00',0),(43,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-10-08 16:00:00',0),(44,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-10-10 16:00:00',0),(45,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-10-12 16:00:00',0),(46,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-10-12 16:00:00',0),(47,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-10-14 16:00:00',0),(48,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-10-17 16:00:00',0),(49,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-10-17 16:00:00',0),(50,1,'4D','Ordinary','Quick Pick','$1(Big), $0(Small)','Online',10,10,'2023-10-17 16:00:00',0),(51,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-10-22 16:00:00',0),(52,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-10-22 16:00:00',0),(53,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-10-25 12:02:08',0),(54,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-10-25 12:02:08',0),(55,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-10-29 09:52:45',0),(56,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-10-29 09:52:45',0),(57,2,'Toto','Ordinary','Quick Pick','-','Woodlands N8',3,3,'2023-10-29 13:24:38',0),(58,1,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',16,48,'2023-11-01 00:52:12',0),(59,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-11-01 12:20:07',0),(60,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-11-01 12:20:07',0),(61,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-11-04 12:20:46',0),(62,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-11-04 12:20:46',0),(63,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-11-09 00:51:39',0),(64,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-11-09 00:51:39',0),(65,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2023-11-12 01:35:41',0),(66,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2023-11-12 01:35:41',0),(67,1,'Toto','Ordinary','Quick Pick','-','Online',16,160,'2023-11-13 11:14:40',1),(68,1,'Toto','System 7','Quick Pick','-','Online',2,140,'2023-11-13 11:14:40',1),(69,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-11-16 11:06:38',0),(70,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-11-16 11:06:38',0),(71,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-11-21 23:06:02',0),(72,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-11-21 23:06:02',0),(73,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-11-27 06:54:33',0),(74,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-11-27 06:54:33',0),(75,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-11-29 22:30:53',0),(76,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-11-29 22:30:53',0),(77,1,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',10,30,'2023-12-02 01:25:51',0),(78,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-12-03 14:25:16',0),(79,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-12-03 14:25:16',0),(80,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-12-07 00:01:40',0),(81,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-12-07 00:01:40',0),(82,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-12-11 05:23:18',0),(83,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-12-11 05:23:18',0),(84,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-12-13 21:40:03',0),(85,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-12-13 21:40:03',0),(86,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-12-18 02:16:28',0),(87,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-12-18 02:16:28',0),(88,1,'Toto','Ordinary','Quick Pick','-','Online',16,16,'2023-12-18 21:44:34',0),(89,1,'Toto','System 7','Quick Pick','-','Online',2,14,'2023-12-18 21:44:34',0),(90,1,'Toto','Ordinary','Quick Pick','-','Online',29,29,'2023-12-21 00:14:24',0),(91,1,'Toto','System 7','Quick Pick','-','Online',3,21,'2023-12-21 00:14:24',0),(92,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2023-12-25 11:55:07',0),(93,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2023-12-25 11:55:07',0),(94,1,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',10,30,'2023-12-31 15:53:30',0),(95,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-01 04:24:54',0),(96,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-01 04:24:54',0),(97,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-03 13:36:53',0),(98,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-03 13:36:53',0),(99,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-08 03:53:29',0),(100,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-08 03:53:29',0),(101,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-10 14:33:33',0),(102,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-10 14:33:33',0),(103,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-15 08:08:47',0),(104,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-15 08:08:47',0),(105,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-18 09:38:54',0),(106,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-18 09:38:54',0),(107,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-22 05:50:57',0),(108,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-22 05:50:57',0),(109,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-23 05:42:04',0),(110,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-23 05:42:04',0),(111,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-25 08:21:41',0),(112,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-25 08:21:41',0),(113,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-01-29 07:13:17',0),(114,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-01-29 07:13:17',0),(115,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-02-02 08:45:30',0),(116,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-02-02 08:45:30',0),(117,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-02-04 15:39:24',0),(118,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-02-04 15:39:24',0),(119,1,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',10,30,'2024-02-07 09:40:12',0),(120,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-02-08 07:38:55',0),(121,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-02-08 07:38:55',0),(122,1,'Toto','Ordinary','Quick Pick','-','Online',23,92,'2024-02-09 00:47:57',1),(123,1,'Toto','Ordinary','Quick Pick','-','Online',23,92,'2024-02-12 08:10:35',0),(124,1,'Toto','System 7','Quick Pick','-','Online',1,28,'2024-02-12 08:10:35',0),(125,3,'Toto','System 7','Quick Pick','-','Woodlands N8',1,7,'2024-02-23 12:52:28',1),(126,3,'Toto','Ordinary','ChatGPT','-','Woodlands N8',5,5,'2008-02-22 16:00:00',0),(127,3,'Toto','Ordinary','Quick Pick','-','Woodlands N8',20,20,'2024-02-23 12:52:28',0),(128,2,'Toto','System 7','Quick Pick','-','Online',5,35,'2024-02-24 14:29:05',0),(129,2,'Singapore Sweep','-','Self Pick','-','Woodlands N8',3,9,'2024-02-24 14:29:05',0),(130,2,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',3,9,'2024-02-24 14:34:08',0),(131,2,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',34,102,'2024-02-24 14:34:08',0),(132,3,'Toto','Ordinary','Quick Pick','-','Online',5,5,'2023-02-23 16:00:00',1),(133,3,'4D','Ordinary','Quick Pick','$5(Big), $3(Small)','Sembawang Shopping Centre',4,32,'2024-01-23 16:00:00',0),(134,3,'Toto','System 8','Quick Pick','-','Woodlands N8',1,28,'2024-02-24 15:03:23',0),(135,1,'Toto','Ordinary','Quick Pick','-','Online',23,46,'2024-02-26 00:50:18',1),(136,1,'Toto','System 7','Quick Pick','-','Online',1,14,'2024-02-26 00:50:18',1),(137,1,'Toto','Ordinary','Quick Pick','-','Online',23,46,'2024-02-26 00:50:18',1),(138,1,'Toto','System 7','Quick Pick','-','Online',1,14,'2024-02-26 00:50:18',1),(139,1,'Toto','Ordinary','Quick Pick','-','Online',23,46,'2024-02-26 00:50:18',0),(140,1,'Toto','System 7','Quick Pick','-','Online',1,14,'2024-02-26 00:50:18',0),(141,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-03-04 09:55:13',0),(142,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-03-04 09:55:13',0),(143,1,'Toto','Ordinary','Quick Pick','-','Online',23,92,'2024-03-05 02:18:33',0),(144,1,'Toto','System 7','Quick Pick','-','Online',1,28,'2024-03-05 02:18:33',0),(145,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-03-24 11:58:37',0),(146,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-03-24 11:58:37',0),(147,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-03-27 16:00:00',0),(148,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-03-27 16:00:00',0),(149,1,'Singapore Sweep','-','Quick Pick','-','Woodlands N3',10,30,'2024-03-29 12:33:27',0),(150,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-04-01 04:45:54',0),(151,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-01 04:45:54',0),(152,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-04-04 09:42:38',0),(153,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-04 09:42:38',0),(154,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-04-11 00:03:52',0),(155,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-11 00:03:52',0),(156,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-04-15 06:37:39',0),(157,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-15 06:37:39',0),(158,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-04-17 09:47:04',0),(159,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-17 09:47:04',0),(160,1,'Toto','Ordinary','Quick Pick','-','Online',23,23,'2024-04-22 02:49:29',0),(161,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-22 02:49:29',0),(162,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-04-29 07:34:20',0),(163,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-29 07:34:20',0),(164,1,'Singapore Sweep','-','Quick Pick','-','Woodlands N8',10,30,'2024-04-27 16:00:00',0),(165,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-04-30 13:49:01',0),(166,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-04-30 13:49:01',0),(167,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-06 10:29:38',0),(168,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-06 10:29:38',0),(169,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-08 01:14:38',0),(170,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-08 01:14:38',0),(171,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-13 08:47:09',0),(172,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-13 08:47:09',0),(173,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-16 05:33:19',0),(174,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-16 05:33:19',0),(175,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-20 06:19:48',0),(176,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-20 06:19:48',0),(177,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-23 01:00:31',0),(178,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-23 01:00:31',0),(179,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-27 02:31:20',0),(180,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-27 02:31:20',0),(181,1,'Toto','Ordinary','Quick Pick','-','Online',13,13,'2024-05-30 06:42:22',0),(182,1,'Toto','System 7','Quick Pick','-','Online',1,7,'2024-05-30 06:42:22',0),(183,1,'Singapore Sweep','-','Quick Pick','-','Jalan Tiga',10,30,'2024-05-31 07:43:47',0);
/*!40000 ALTER TABLE `records` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `full_name` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `first_day_betting` date DEFAULT NULL,
  `date_joined` timestamp NULL DEFAULT current_timestamp(),
  `sections_order` varchar(500) DEFAULT '["section-new-entry", "section-today-entry",  "section-total-spendings", "section-total-winnings", "section-notes", "section-purchase-history", "section-current-betslips"]',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'secret','tester05','$2b$10$2w6Ae0xGn1KbrszZRxahBO9NGHW4Wg.oxqldMyWWX5BF6icCNef2.','2023-09-18','2023-10-24 11:35:06','[\"section-new-entry\",\"section-today-entry\",\"section-total-spendings\",\"section-purchase-history\",\"section-current-betslips\",\"section-total-winnings\",\"section-notes\"]'),(2,'robot 1','robot1','$2b$10$eG3vGBTqEJOZc3Jgyi.bcuKvYoKsgAvTEqchm4TByuCHuxgywLhJG','2023-10-24','2023-10-24 11:38:22','[\"section-new-entry\",\"section-total-spendings\",\"section-today-entry\",\"section-total-winnings\",\"section-notes\",\"section-purchase-history\",\"section-current-betslips\"]'),(3,'Wei Lin','weilin','$2b$10$eG3vGBTqEJOZc3Jgyi.bcuKvYoKsgAvTEqchm4TByuCHuxgywLhJG','2023-09-18','2024-02-23 12:43:29','[\"section-today-entry\",\"section-new-entry\",\"section-total-spendings\",\"section-total-winnings\",\"section-notes\",\"section-purchase-history\",\"section-current-betslips\"]'),(4,'my name test 1','tester01','$2b$10$DeeFXgLp7ngt1fHwIR0Jt.aTOULkJgzzDMR1l5zv0bivddJK76rMO','2022-05-22','2024-02-23 12:47:39','[\"section-new-entry\", \"section-today-entry\",  \"section-total-spendings\", \"section-total-winnings\", \"section-notes\", \"section-purchase-history\", \"section-current-betslips\"]'),(5,'tester100','wayne123','$2b$10$DeeFXgLp7ngt1fHwIR0Jt.aTOULkJgzzDMR1l5zv0bivddJK76rMO','2014-06-10','2024-02-23 12:56:32','[\"section-new-entry\", \"section-today-entry\",  \"section-total-spendings\", \"section-total-winnings\", \"section-notes\", \"section-purchase-history\", \"section-current-betslips\"]'),(6,'James Ng','james1234','$2b$10$F4vYCKu0i0EK3Kl3./mSwO3.KAqZOF8HCczZNJnljR/Ch7F0gw.Rm','2005-02-01','2024-02-24 14:28:14','[\"section-new-entry\", \"section-today-entry\",  \"section-total-spendings\", \"section-total-winnings\", \"section-notes\", \"section-purchase-history\", \"section-current-betslips\"]'),(7,'robin','robin123','$2b$10$eQQwkfD96rmVqRKFNd2Ukuy6RicrTVgdSfKCgz3Qso3iomM8FNleC','2018-02-05','2024-02-24 14:32:57','[\"section-new-entry\", \"section-today-entry\",  \"section-total-spendings\", \"section-total-winnings\", \"section-notes\", \"section-purchase-history\", \"section-current-betslips\"]'),(8,'alvin tan','alvin123','$2b$10$o2cN0rU/5UPdj1tSKapGO.200AiLRFpvvCPYSzHC.gwhJdunpYulq','2024-02-05','2024-02-24 14:41:30','[\"section-new-entry\", \"section-today-entry\",  \"section-total-spendings\", \"section-total-winnings\", \"section-notes\", \"section-purchase-history\", \"section-current-betslips\"]'),(9,'Benjamin Tan','ben1','$2b$10$DMjl9jCEvA48vlbUbiexSecNFxrWYbiqjjAm0fttmRSBS.NUvhznu','2024-01-30','2024-02-24 15:02:06','[\"section-new-entry\", \"section-today-entry\",  \"section-total-spendings\", \"section-total-winnings\", \"section-notes\", \"section-purchase-history\", \"section-current-betslips\"]'),(10,'Hostinger Launch','Hostinger','$2b$10$Q4wkBYM2bOpd1ql.K/V5S.2FpxbItPSNX1UhAM2pvGluJ8f.xf13u','2024-06-01','2024-06-01 10:17:07','[\"section-new-entry\", \"section-today-entry\",  \"section-total-spendings\", \"section-total-winnings\", \"section-notes\", \"section-purchase-history\", \"section-current-betslips\"]');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `winnings`
--

DROP TABLE IF EXISTS `winnings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `winnings` (
  `winning_id` int(11) NOT NULL AUTO_INCREMENT,
  `fk_user_id` int(11) DEFAULT NULL,
  `lottery_name` varchar(255) DEFAULT NULL,
  `entry_type` varchar(255) DEFAULT NULL,
  `pick_type` varchar(255) DEFAULT NULL,
  `outlet` varchar(255) DEFAULT NULL,
  `winning_prize` int(11) DEFAULT NULL,
  `date_of_winning` date DEFAULT NULL,
  `isDeleted` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`winning_id`),
  KEY `fk_user_id` (`fk_user_id`),
  CONSTRAINT `winnings_ibfk_1` FOREIGN KEY (`fk_user_id`) REFERENCES `users` (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=37 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `winnings`
--

LOCK TABLES `winnings` WRITE;
/*!40000 ALTER TABLE `winnings` DISABLE KEYS */;
INSERT INTO `winnings` VALUES (1,2,'Singapore Sweep','-','Quick Pick','Woodlands N8',55,'2023-10-11',1),(2,2,'Singapore Sweep','-','Quick Pick','Woodlands N8',55,'2023-10-11',0),(3,2,'4D','Ordinary','Quick Pick','Woodlands N8',333,'2023-10-10',0),(4,2,'4D','Ordinary','Quick Pick','Woodlands N8',333,'2023-10-10',0),(5,1,'Singapore Sweep','-','Quick Pick','Woodlands N8',6,'2023-10-04',0),(6,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-10-09',0),(7,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-11-13',0),(8,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-11-20',0),(9,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-11-23',0),(10,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-11-27',0),(11,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-11-30',0),(12,1,'Singapore Sweep','-','Quick Pick','Woodlands N8',6,'2023-12-06',0),(13,1,'Singapore Sweep','-','Quick Pick','Woodlands N8',6,'2023-12-06',0),(14,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-12-22',0),(15,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-12-22',0),(16,1,'Toto','Ordinary','Quick Pick','Online',10,'2023-12-28',0),(17,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-01-09',0),(18,3,'Toto','Ordinary','Quick Pick','Woodlands N8',10,'2023-09-18',1),(19,2,'Toto','Ordinary','Quick Pick','Woodlands N8',500,'2024-01-29',1),(20,2,'Toto','Ordinary','Quick Pick','Online',5000,'2024-02-06',0),(21,3,'4D','Ordinary','Quick Pick','Online',700,'2024-02-04',0),(22,3,'4D','Ordinary','Quick Pick','Online',444,'2022-02-05',0),(23,3,'4D','Ordinary','Quick Pick','Online',2445,'2022-02-24',1),(24,3,'Singapore Sweep','-','Quick Pick','Woodlands N8',125,'2024-02-13',0),(25,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-03-04',0),(26,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-03-18',0),(27,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-03-18',0),(28,1,'Singapore Sweep','-','Quick Pick','Woodlands N3',6,'2024-04-03',0),(29,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-04-18',0),(30,1,'Singapore Sweep','-','Quick Pick','Woodlands N8',6,'2024-05-01',0),(31,1,'Singapore Sweep','-','Quick Pick','Woodlands N8',6,'2024-05-01',0),(32,1,'Toto','Ordinary','Quick Pick','Online',25,'2024-05-16',1),(33,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-05-16',0),(34,1,'Toto','System 7','Quick Pick','Online',25,'2024-05-16',0),(35,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-05-20',0),(36,1,'Toto','Ordinary','Quick Pick','Online',10,'2024-05-23',0);
/*!40000 ALTER TABLE `winnings` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-06-01 19:22:56
