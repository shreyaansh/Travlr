import os
from flask import Flask, render_template, jsonify, request

app = Flask(__name__, static_folder="./static/dist",
        template_folder="./static")

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/hello")
def hello():
    return "Hello World"

@app.route('/authenticate', methods=['POST'])
def authenticate():
    token = request.get_json()
    print(token)
    ret_token = { "token" : "SUCCESS" }
    return jsonify(ret_token) 

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
