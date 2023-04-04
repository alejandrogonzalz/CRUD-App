# CRUD-App
List of python packages:
conda install flask
conda install PyMySQL



To create Table:

DROP TABLE IF EXISTS contacts;
CREATE TABLE contacts (
    phone_number CHAR(12) PRIMARY KEY NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_registered DATETIME NOT NULL DEFAULT NOW(),
    CONSTRAINT name_format CHECK(first_name REGEXP '^[A-Za-z]+(?:[ _-][A-Za-z]+)*$' 
    AND last_name REGEXP '^[A-Za-z]+(?:[ _-][A-Za-z]+)*$'),
    CONSTRAINT phone_format CHECK(phone_number REGEXP '[0-9]{3}[-][0-9]{3}[-][0-9]{4}')
);

