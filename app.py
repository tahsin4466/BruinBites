import flask
from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS

app = Flask(__name__, static_folder='client/build', static_url_path='')
CORS(app)


# Example route to receive GET requests from React
@app.route('/api/data', methods=['GET'])
def get_data():
    data = {'message': 'Hello from Flask API!'}
    return jsonify(data)


# Example route to receive POST requests from React
@app.route('/api/submit', methods=['POST'])
def submit_data():
    data = request.json  # Assuming JSON data is sent from React
    # Process the received data
    return jsonify({'message': 'Data received successfully!'})


@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    # Implement authentication logic here
    if username == 'valid_username' and password == 'valid_password':
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run()

'''
By implementing these changes, your login.tsx component will be able to communicate with the
Flask backend to authenticate users. Remember to replace 'valid_username' and 'valid_password' 
with actual credentials validation logic in your Flask backend. Additionally, make sure to handle 
user authentication securely, such as by using encryption for passwords.
'''