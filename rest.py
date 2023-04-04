from flask import Flask, request, jsonify
import pymysql

app = Flask(__name__)
# function to execute new entries to the database
@app.route('/insert', methods=['POST'])
def insert_new_entry():
    data = request.get_json()
    first_name = data['first_name']
    last_name = data['last_name']
    phone_number = data['phone_number']
    
    mydb = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="crud_app"
    )

    mycursor = mydb.cursor()
    sql = "INSERT INTO contacts (first_name, last_name, phone_number) VALUES (%s, %s, %s)"
    val = [(first_name, last_name, phone_number)]
    mycursor.executemany(sql,val)
    mydb.commit()
    mydb.close()

    return jsonify({'message':'New entry added'}), 200

# DELETE route to delete a row from the database
@app.route('/delete/<int:id>', methods=['DELETE'])
def delete_entry(id):
    mydb = pymysql.connect(
        host="localhost",
        user="root",
        password="root",
        database="crud_app"
    )

    mycursor = mydb.cursor()
    sql = "DELETE FROM contacts WHERE id=%s"
    val = (id,)
    mycursor.execute(sql,val)
    mydb.commit()
    mydb.close()

    return jsonify({'message': 'Entry deleted'}), 200

if __name__ == '__main__':
    app.run(debug=True)




# # function to create and/or drop table
# def dropTable():
#     mydb = pymysql.connect(
#     host="localhost",
#     user="root",
#     password="root",
#     database="crud_app"
#     )
#     mycursor = mydb.cursor()
#     mycursor.execute("DROP TABLE IF EXISTS contacts")
#     mycursor.execute("CREATE TABLE contacts (first_name VARCHAR(50), last_name VARCHAR(50), phone_number CHAR(12) PRIMARY KEY)")
#     mydb.commit()
#     mydb.close()
#     return
