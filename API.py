# from flask import Flask, jsonify

# app = Flask(__name__)

# @app.route('/api/hello')
# def hello():
#     return jsonify({'message': 'Hello, World!'})

# if __name__ == '__main__':
#     app.run(debug=True)


import requests

url = 'http://localhost:5000/insert'
data = {
    'first_name': 'John',
    'last_name': 'Doe',
    'phone_number': '123-456-7890'
}
response = requests.post(url, json=data)
print(response.text)
