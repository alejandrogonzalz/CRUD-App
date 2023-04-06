# CRUD-App
List of python packages:
conda install flask
conda install PyMySQL



To create Table:

DROP TABLE IF EXISTS contacts;

CREATE TABLE contacts (
    contact_id int NOT NULL AUTO_INCREMENT,
    phone_number CHAR(12) NOT NULL UNIQUE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    date_registered DATETIME NOT NULL DEFAULT NOW(),
    CONSTRAINT name_format CHECK(first_name REGEXP '^[[:alpha:]]+([[:blank:]]+[[:alpha:]]+)*$' 
    AND last_name REGEXP '^[[:alpha:]]+([[:blank:]]+[[:alpha:]]+)*$'),
    CONSTRAINT phone_format CHECK(phone_number REGEXP '[0-9]{3}[-][0-9]{3}[-][0-9]{4}'),
    PRIMARY KEY (contact_id)
);


{
    "first_name": "Alejandro",
    "last_name": "Gonzalez",
    "phone_number": "111-000-1231",
    "contact_id": "28"
}