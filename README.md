# CRUD-App

## Requirements and recommendations:
-	In order to  run this app its necessary to install the following packages: flask (version 2.2.2), flask-cors (version 3.0.10) and pymysql (version 1.0.2) in Python 3.11.2.
-	You must use MySQL8.0.32 for it to work.
-   This program is using pymysql library to access MySQL and create an API, therefore its a requirement that your user and password are both 'root', OR you might change the code in rest.py and table.py (its up to you).
-   In case that you want to edit the css styles, I recommend you to install Live Sass Compiler from Glen Marks (in VS Code) or any other Live Sass Compilers. If you download the one I mentioned, is important to go to you settings.json and add this to save the css in the direction the html is asking for:
        "liveSassCompile.settings.formats":[
            {
                "format": "expanded",
                "extensionName": ".css",
                "savePath": "/dist"
            }
        ],

## To run the file:
-   In the app directory, you should run the table.py and then the rest.py which are located at the python folder.
-   You can start the index.html by just clicking on it or using a Live Server extension in the IDE of your election! 

## MySQL table 
-   This is the raw query to create the table in MySQL:

        DROP TABLE IF EXISTS contacts;

        CREATE TABLE contacts (
            contact_id int NOT NULL AUTO_INCREMENT,
            phone_number CHAR(12) NOT NULL UNIQUE,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            date_registered DATETIME NOT NULL DEFAULT NOW(),
            PRIMARY KEY (contact_id)
        );