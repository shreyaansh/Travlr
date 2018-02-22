import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__, static_folder="./static/dist",
        template_folder="./static")

@app.route('/')
def index():
    return render_template("index.html")

@app.route("/hello")
def hello():
    return "Hello World"

@app.route('/assets/<path:path>')
def send_assets(path):
    print("Path is here: ")
    print path
    return send_from_directory('static/assets', path)

@app.route('/css/<path:path>')
def send_css(path):
    print("Path is here: ")
    print path
    return send_from_directory('static/css', path)

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='localhost', port=port)
