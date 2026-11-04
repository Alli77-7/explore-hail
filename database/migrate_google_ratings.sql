USE explore_hail;

DROP PROCEDURE IF EXISTS add_google_rating_columns;
DELIMITER $$
CREATE PROCEDURE add_google_rating_columns()
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'service_providers' AND column_name = 'google_place_id') THEN
        ALTER TABLE service_providers ADD COLUMN google_place_id VARCHAR(120) NULL AFTER image_url;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'service_providers' AND column_name = 'google_maps_url') THEN
        ALTER TABLE service_providers ADD COLUMN google_maps_url VARCHAR(500) NULL AFTER google_place_id;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'service_providers' AND column_name = 'google_rating_count') THEN
        ALTER TABLE service_providers ADD COLUMN google_rating_count INT NULL AFTER google_maps_url;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = DATABASE() AND table_name = 'service_providers' AND column_name = 'google_rating_updated_at') THEN
        ALTER TABLE service_providers ADD COLUMN google_rating_updated_at DATETIME NULL AFTER google_rating_count;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.statistics WHERE table_schema = DATABASE() AND table_name = 'service_providers' AND index_name = 'idx_service_providers_google_place_id') THEN
        ALTER TABLE service_providers ADD INDEX idx_service_providers_google_place_id (google_place_id);
    END IF;
END$$
DELIMITER ;

CALL add_google_rating_columns();
DROP PROCEDURE add_google_rating_columns;
