import os
from flask import Flask, render_template, jsonify, request, send_from_directory
import googlemaps
from google.oauth2 import id_token
from google.auth.transport import requests
from googleplaces import GooglePlaces, types, lang
from constants import constants
from datetime import datetime
from weather import Weather, Unit

app = Flask(__name__, static_folder="./static/dist",
        template_folder="./static")

google_places = GooglePlaces(constants.GOOGLE_MAPS_ID)
google_maps = googlemaps.Client(key=constants.GOOGLE_MAPS_ID)
weather = Weather(unit=Unit.FAHRENHEIT)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('static/assets', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

@app.route('/authenticate', methods=['POST'])
def authenticate():
    token = request.get_json()
    ret_token = { "token" : "SUCCESS" }
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token["userInfo"], requests.Request(), constants.GOOGLE_CLIENT_ID)
        
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

@app.route("/fetch-places")
def fetch_places():
    geocode_result = google_maps.geocode('Chicago, IL')
    print(geocode_result[0]['geometry']['location'])

    query_result = google_places.nearby_search(lat_lng={'lat': geocode_result[0]['geometry']['location']['lat'], 'lng': geocode_result[0]['geometry']['location']['lng']}, keyword='hotels', radius=20000, types=['hotels'])
    for place in query_result.places:
        print(place.name)
        
        place.get_details()

        print(place.details)

    return jsonify({ "status" : "success" })

@app.route('/feedback', methods=['POST'])
def getFeedback():
    feedback_token = request.get_json()
    print(feedback_token)

    ret_token = { "status" : "Feedback submitted" }

    return jsonify(ret_token)

@app.route('/travel-form', methods=['POST'])
def getTravelData():
    token = request.get_json()
    print(token)

    ret_token = { "status" : "Feedback submitted" }

    return jsonify(ret_token)

@app.route("/weather/<city>/<date>")
def getWeather(city, date):
    city.replace("-", " ")
    location = weather.lookup_by_location(city)
    forecasts = location.forecast()
    result = ""
    for forecast in forecasts:
        result += forecast.date() + ": " + " (high=" + forecast.high() + ",low=" + forecast.low() + ") " + forecast.text() + "\n<br>"
    return result

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run('localhost', port)
