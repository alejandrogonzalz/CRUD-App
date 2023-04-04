from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
import pymysql

app = Flask(__name__)
CORS(app)
# function to execute new entries to the database
@app.route("/insert", methods = ["POST"])
@cross_origin()
def insert_new_entry():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    phone_number = data['phone_number']
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
    # close the daatabase
    mydb.close()
           
    return jsonify({'message':'New entry added'}), 200

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
        sql = "SELECT phone_number, first_name, last_name, date_registered FROM contacts ORDER BY date_registered DESC"
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
@app.route('/delete/<string:id>', methods=['DELETE'])
@cross_origin()
def delete_entry(id):

    mydb = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="crud_app"
    )

    with mydb.cursor() as cursor:
        sql = "DELETE FROM contacts WHERE phone_number=%s"
        val = (id,)
        cursor.execute(sql,val)
        mydb.commit()

    mydb.close()

    return jsonify({'message': 'Entry deleted'}), 200



# Hello world 
@app.route('/api/hello')
def hello():
    return jsonify({'message': 'Hello, World!'})

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    return response

if __name__ == '__main__':
    app.run(debug=True)

