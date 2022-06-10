-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema SoPraTestDB
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `SoPraTestDB` ;

-- -----------------------------------------------------
-- Schema SoPraTestDB
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `SoPraTestDB` DEFAULT CHARACTER SET utf8 ;
USE `SoPraTestDB` ;

-- -----------------------------------------------------
-- Table `SoPraTestDB`.`activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`activity` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`activity` (
  `activity_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `name` VARCHAR(45) NULL,
  `capacity` INT NULL,
  `affiliated_project_id` INT NULL,
  PRIMARY KEY (`activity_id`),
  FOREIGN KEY (`affiliated_project_id`) REFERENCES Project(`project_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`departure`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.departure ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`departure` (
  `departure_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `time_stamp` DATETIME NULL,
  PRIMARY KEY (`departure_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`eventtransaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`eventtransaction` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`eventtransaction` (
  `eventtransaction_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `affiliated_work_time_account_id` INT NULL,
  `event` INT NULL,
  PRIMARY KEY (`eventtransaction_id`),
  FOREIGN KEY (`affiliated_work_time_account_id`) REFERENCES worktimeaccount(`worktimeaccount_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`person`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`person` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`person` (
  `person_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `firstname` VARCHAR(45) NULL,
  `lastname` VARCHAR(45) NULL,
  `username` VARCHAR(45) NULL,
  `mailaddress` VARCHAR(45) NULL,
  `firebase_id` VARCHAR(45) NULL,
  PRIMARY KEY (`person_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`project`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`project` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`project` (
  `project_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `project_name` VARCHAR(45) NULL,
  `client` VARCHAR(45) NULL,
  `timeinterval_id` INT NULL,
  `owner` INT NULL,
  PRIMARY KEY (`project_id`),
  FOREIGN KEY (`timeinterval_id`) REFERENCES timeinterval(`timeinterval_id`),
  FOREIGN KEY (`owner`) REFERENCES person(`person_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`projectwork`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`projectwork` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`projectwork` (
  `projectwork_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `projectwork_name` VARCHAR(45) NULL,
  `description` VARCHAR(45) NULL,
  `start_event` DATETIME NULL,
  `end_event` DATETIME NULL,
  `time_period` TIME,
  `affiliated_activity_id` INT NOT NULL,
  PRIMARY KEY (`projectwork_id`),
  FOREIGN KEY (`affiliated_activity_id`) REFERENCES activity(`activity_id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `SoPraTestDB`.`projectmembers`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`projectmembers` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`projectmembers` (
  `projectmember_id` INT NOT NULL,
  `project_id` INT NOT NULL,
  `person_id` INT NOT NULL,
   `last_edit` DATETIME NULL,
  PRIMARY KEY (`projectmember_id`),
  FOREIGN KEY (`project_id`) REFERENCES project(`project_id`),
  FOREIGN KEY (`person_id`) REFERENCES person(`person_id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `SoPraTestDB`.`arrive`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.arrive ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`arrive` (
  `arrive_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `time_stamp` DATETIME NULL,
  PRIMARY KEY (`arrive_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`timeinterval`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`timeinterval` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`timeinterval` (
  `timeinterval_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `start_time` DATETIME NULL,
  `end_time` DATETIME NULL,
  `time_period` TIME NULL,
  PRIMARY KEY (`timeinterval_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`timeintervaltransaction`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`timeintervaltransaction` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`timeintervaltransaction` (
  `timeintervaltransaction_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `affiliated_work_time_account_id` INT NULL,
  `affiliated_time_interval_id` INT NULL,
  `affiliated_break_id` INT,
  `affiliated_projectwork_id` INT,
  PRIMARY KEY (`timeintervaltransaction_id`),
  FOREIGN KEY (`affiliated_work_time_account_id`) REFERENCES worktimeaccount(`worktimeaccount_id`),
  FOREIGN KEY (`affiliated_time_interval_id`)REFERENCES timeinterval(`timeinterval_id`),
  FOREIGN KEY (`affiliated_projectwork_id`) REFERENCES projectwork(`projectwork_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `SoPraTestDB`.`worktimeaccount`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`worktimeaccount` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`worktimeaccount` (
  `worktimeaccount_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `person_id` INT NULL,
  PRIMARY KEY (`worktimeaccount_id`),
  FOREIGN KEY (`person_id`) REFERENCES person(`person_id`))
ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table `SoPraTestDB`.`activity`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `SoPraTestDB`.`event` ;

CREATE TABLE IF NOT EXISTS `SoPraTestDB`.`event` (
  `event_id` INT NOT NULL,
  `last_edit` DATETIME NULL,
  `event_type` INT NULL,
  `time_stamp` DATETIME NULL,
  PRIMARY KEY (`event_id`))
ENGINE = InnoDB;



SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
