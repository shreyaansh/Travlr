import os
from flask import Flask, render_template, jsonify, request
from google.oauth2 import id_token
from google.auth.transport import requests

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
    ret_token = { "token" : "SUCCESS" }
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token["userInfo"], requests.Request(), "110941707391-lin5grtvjtedoudnpe5p37tnbq7f3qkd.apps.googleusercontent.com")
        
        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        print(userid)
        print(idinfo['email'])
        return jsonify(ret_token)
    except ValueError:
        # Invalid token
        pass
    
    return jsonify(ret_token) 

@app.route('/feedback', methods=['POST'])
def getFeedback():
    feedback_token = request.get_json()
    print(feedback_token)

    ret_token = { "status" : "Feedback submitted" }
    
    return jsonify(ret_token)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run()
