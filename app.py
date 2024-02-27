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




@app.route('/')
def home():
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run()


'''
from flask import Flask, jsonify, request

app = Flask(__name__)

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

if __name__ == '__main__':
    app.run(debug=True)

'''