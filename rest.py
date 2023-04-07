from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import pymysql
import re

app = Flask(__name__)
CORS(app)
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

    try:
        # conect to the database
        mydb = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="crud_app"
    )
    # execute query
        with mydb.cursor() as cursor:
            sql = "INSERT INTO contacts (first_name, last_name, phone_number) VALUES (%s, %s, %s)"
            val = [(first_name, last_name, phone_number)]
            cursor.executemany(sql,val)
            mydb.commit()
        return jsonify({'message':'New entry added'}), 200
    except:
        return jsonify({'message': 'Insertion failed'}), 500
    finally:
        # close the database
        mydb.close()           


# GET all the rows from the table
@app.route('/contacts')
def get_contacts():
    mydb = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="crud_app"
    )

    with mydb.cursor() as cursor:
        sql = "SELECT contact_id, phone_number, first_name, last_name, date_registered FROM contacts ORDER BY first_name ASC"
        cursor.execute(sql)
        rows = cursor.fetchall()

    # transform the list of tuples from cursor.fetchall() to a list of dictionaries by first 
    # getting all the columns names using cursor.description attribute and then zip them with 
    # the rows returned by cursor.fetchall()
    columns = [col[0] for col in cursor.description]
    result = []
    for row in rows:
        result.append(dict(zip(columns,row)))

    mydb.close()

    return jsonify({'contacts':result})

# DELETE route to delete a row from the database
@app.route('/delete/<int:id>', methods=['DELETE'])
@cross_origin()
def delete_entry(id):

    mydb = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="crud_app"
    )

    with mydb.cursor() as cursor:
        sql = "DELETE FROM contacts WHERE contact_id=%s"
        val = (id,)
        cursor.execute(sql,val)
        mydb.commit()

    mydb.close()

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
            user="root",  
            password="root",
            database="crud_app"
        )        
        # execute UPDATE query
        with mydb.cursor() as cursor:
            sql = "UPDATE contacts SET first_name = %s, last_name = %s, phone_number = %s WHERE contact_id = %s"
            val = [(first_name, last_name, phone_number, contact_id)]
            cursor.executemany(sql,val)
            mydb.commit()
        return jsonify({'message': 'Updated to database'}), 200
    except:
        return jsonify({'message': 'Updated failed'}), 500

    finally:
        #close the database
        mydb.close()


# Hello world 
@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello, World!'})


if __name__ == '__main__':
    app.run(debug=True)

