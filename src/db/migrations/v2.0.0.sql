
-- -----------------------------------------------------
-- Table `sterring`.`aeon_api_req_types`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sterring`.`aeon_api_req_types` (
  `id` VARCHAR(7) NOT NULL,
  `event_type` VARCHAR(60) NULL,
  `description` VARCHAR(128) NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sterring`.`aeon_api_sockets`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sterring`.`aeon_api_sockets` (
  `id` BIGINT(20) NOT NULL,
  `host_ip` VARCHAR(45) NULL,
  `port` VARCHAR(45) NULL,
  `user_pin` VARCHAR(45) NULL,
  `device_ser` VARCHAR(45) NULL,
  `device_id` VARCHAR(45) NULL,
  `created_at` DATETIME NULL DEFAULT NOW(),
  `app_name` VARCHAR(45) NULL,
  `socket_time_ms` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `sterring`.`aeon_api_req_res`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sterring`.`aeon_api_req_res` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT,
  `socket_id` BIGINT(20) NULL,
  `req_id` VARCHAR(7) NULL,
  `req_json` JSON NULL,
  `req_xml` VARCHAR(8096) NULL,
  `req_at` DATETIME NULL DEFAULT NOW(),
  `res_xml` TEXT(64096) NULL,
  `res_json` JSON NULL,
  `res_time_ms` VARCHAR(512) NULL,
  PRIMARY KEY (`id`),
  INDEX `socket_id_idx` (`socket_id` ASC) VISIBLE,
  INDEX `fk_aeon_api_req_res_aeon_api_req_types1_idx` (`req_id` ASC) VISIBLE,
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  CONSTRAINT `socket_id`
    FOREIGN KEY (`socket_id`)
    REFERENCES `sterring`.`aeon_api_sockets` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_aeon_api_req_res_aeon_api_req_types1`
    FOREIGN KEY (`req_id`)
    REFERENCES `sterring`.`aeon_api_req_types` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;


-- -----------------------------------------------------
-- Table `sterring`.`aeon_auth`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `sterring`.`aeon_auth` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `app_name` VARCHAR(45) NOT NULL,
  `product` VARCHAR(45) NOT NULL,
  `timeout` INT NOT NULL,
  `ip` VARCHAR(45) NOT NULL,
  `port` INT NOT NULL,
  `user_pin` VARCHAR(45) NOT NULL,
  `device_id` VARCHAR(45) NOT NULL,
  `device_ser` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`, `user_pin`))
ENGINE = InnoDB;



INSERT INTO aeon_auth
		(product, timeout, app_name, ip, port, user_pin, device_id, device_ser)

VALUES
	('default', 60000, 'whatsApp', 'aeon.qa.bltelecoms.net', 7800, '016351', '865181', 'w!22!t'),
	('default', 60000, 'moyaApp', 'aeon.qa.bltelecoms.net', 7800, '011234', '869220', 'SterringMoya!'),
	('electricity', 180000, 'whatsApp', '196.26.170.3', 7893, '011234', '7305', 'TiZZIw779!');

INSERT INTO aeon_api_req_types
VALUES 
	('atval','MNOValidation',''),
	('atbuy','GetTopup',''),
	('gbndl','',''),
	('vbndl','',''),
	('tbndl','DoBundleTopup',''),
	('velec','ConfirmMeter',''),
	('telec','GetVoucher',''),
	('selec','',''),
	('apay','',''),
	('ipay','GetSubscriberBillInfo',''),
	('ppay','Confirm','');
