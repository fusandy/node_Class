CREATE TABLE `test_avatar` (
                               `sid` int(11) NOT NULL,
                               `avatar` varchar(255) DEFAULT NULL,
                               `name` varchar(255) NOT NULL,
                               `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

ALTER TABLE `test_avatar`
    ADD PRIMARY KEY (`sid`);

ALTER TABLE `test_avatar`
    MODIFY `sid` int(11) NOT NULL AUTO_INCREMENT;