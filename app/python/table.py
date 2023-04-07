import pymysql

# To change your MySQL credentials
my_user = 'root'
my_password = 'root'

def create_database():
    # Connect to the MySQL server
    connection = pymysql.connect(
        host='localhost',
        user= my_user,
        password= my_password,
        db='mysql'
    )
    # Execute query
    cursor = connection.cursor()
    query = "CREATE DATABASE IF NOT EXISTS crud_app"
    cursor.execute(query)
    connection.commit()
    # Close the cursor and connection
    cursor.close()
    connection.close()
# Call the function to create the database
create_database()

def create_table():
    # Connect to the MySQL server
    connection = pymysql.connect(
        host='localhost',
        user= my_user,
        password= my_password,
        db='crud_app'
    )
     # Create cursor object
    cursor = connection.cursor()
    # Create and execute drop query
    drop_query = "DROP TABLE IF EXISTS contacts;"
    cursor.execute(drop_query)
    # Create and execute create_query
    create_query = """
        CREATE TABLE contacts (
            contact_id int NOT NULL AUTO_INCREMENT,
            phone_number CHAR(12) NOT NULL UNIQUE,
            first_name VARCHAR(50) NOT NULL,
            last_name VARCHAR(50) NOT NULL,
            date_registered DATETIME NOT NULL DEFAULT NOW(),
            PRIMARY KEY (contact_id)
        );
    """
    cursor.execute(create_query)
    # Commit all the changes
    connection.commit()
    # Close database
    cursor.close()
    connection.close()
# Call the function to create the database
create_table()

    