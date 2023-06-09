from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import pymysql
import re

# Create web application and enabling Cross-Origin Resource Sharing (CORS) 
app = Flask(__name__)
CORS(app)

# To change your MySQL credentials
my_user = 'root'
my_password = 'root'

# INSERT new entries to the database
@app.route("/insert", methods = ["POST"])
@cross_origin()
def insert_new_entry():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    phone_number = data['phone_number']
    phone_format = r'[0-9]{3}[-][0-9]{3}[-][0-9]{4}'
    first_name_format = r'\w+'
    last_name_format = r'\w+'
    # validate inputs
    msg_error = ''
    if not re.match(first_name_format, first_name):
        msg_error = 'Error 1'
    if not re.match(last_name_format, last_name):
        msg_error = msg_error + ' Error 2'
    if not re.match(phone_format, phone_number):
        msg_error = msg_error + ' Error 3'
    if msg_error != '':
        return jsonify({'message': msg_error}), 400
    # conect to the database
    try:
        mydb = pymysql.connect(
        host="localhost",
        user= my_user,
        password= my_password,
        database="crud_app"
    )
    # execute query
        with mydb.cursor() as cursor:
            query = "INSERT INTO contacts (first_name, last_name, phone_number) VALUES (%s, %s, %s)"
            val = [(first_name, last_name, phone_number)]
            cursor.executemany(query,val)
            mydb.commit()
        # message of success
        return jsonify({'message':'New entry added'}), 200
    # message error
    except:
        return jsonify({'message': 'Insertion failed'}), 500
    finally:
        # close the database
        cursor.close()
        mydb.close()           

# GET all the rows from the table
@app.route('/contacts')
def get_contacts():
    # open the database
    mydb = pymysql.connect(
        host="localhost",
        user= my_user,
        password= my_password,
        database="crud_app"
    )
    # execute query
    with mydb.cursor() as cursor:
        query = "SELECT contact_id, phone_number, first_name, last_name, date_registered FROM contacts ORDER BY first_name ASC"
        cursor.execute(query)
        rows = cursor.fetchall()
    # transform the list of tuples from cursor.fetchall() to a list of dictionaries by first 
    # getting all the columns names using cursor.description attribute and then zip them with 
    # the rows returned by cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    result = []
    for row in rows:
        result.append(dict(zip(columns,row)))
    # close the database
    cursor.close()
    mydb.close()
    # to display all the database 
    return jsonify({'contacts':result})

# DELETE route to delete a row from the database
@app.route('/delete/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_entry(id):
    # open the database
    mydb = pymysql.connect(
        host="localhost",
        user= my_user,
        password= my_password,
        database="crud_app"
    )
    # execute query
    with mydb.cursor() as cursor:
        query = "DELETE FROM contacts WHERE contact_id=%s"
        val = (id,)
        cursor.execute(query,val)
        mydb.commit()
    # close the database
    cursor.close()
    mydb.close()
    # message of success
    return jsonify({'message': 'Entry deleted'}), 200

# UPDATE to database
@app.route("/update", methods = ["PUT"])
@cross_origin()
def update_entry():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    phone_number = data ['phone_number']
    contact_id = int(data['contact_id'])    
    phone_format = r'[0-9]{3}[-][0-9]{3}[-][0-9]{4}'
    first_name_format = r'\w+'
    last_name_format = r'\w+'
    # validate inputs
    msg_error = ''
    if not re.match(first_name_format, first_name):
        msg_error = 'Error 1'
    if not re.match(last_name_format, last_name):
        msg_error = msg_error + ' Error 2'
    if not re.match(phone_format, phone_number):
        msg_error = msg_error + ' Error 3'
    if msg_error != '':
        return jsonify({'message': msg_error}), 400
    try:
        # open the database
        mydb = pymysql.connect(
            host="localhost",
            user= my_user,  
            password= my_password,
            database="crud_app"
        )        
        # execute UPDATE query
        with mydb.cursor() as cursor:
            query = "UPDATE contacts SET first_name = %s, last_name = %s, phone_number = %s WHERE contact_id = %s"
            val = [(first_name, last_name, phone_number, contact_id)]
            cursor.executemany(query,val)
            mydb.commit()
        return jsonify({'message': 'Updated to database'}), 200
    except:
        return jsonify({'message': 'Updated failed'}), 500
    finally:
        #close the database
        cursor.close()
        mydb.close()

# Hello world to check if the API is working
@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello, World!'})

# Only execute if the script is being run as the main program
if __name__ == '__main__':
    app.run(debug=True)

