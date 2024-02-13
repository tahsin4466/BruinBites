import flask
from flask import Flask, send_from_directory, jsonify
from flask import CORS

app = Flask(__name__, static_folder='client/build', static_url_path='')
CORS(app)


@app.route('/')
def hello_world():  # put application's code here

    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run()
