import os
from flask import Flask, render_template, jsonify, request, send_from_directory
import googlemaps
import json
from google.oauth2 import id_token
from google.auth.transport import requests
from googleplaces import GooglePlaces, types, lang
from constants import constants
from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
from sqlalchemy import types
from geopy.geocoders import Nominatim
import forecastio
import eventful

app = Flask(__name__, static_folder="./static/dist",
        template_folder="./static")

#Update for Heroku
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://qfxhxptytnpaof:1a46958968d3d82efe5bf59c283d20d6109c5778c06bc304599231e8fc474a42@ec2-23-23-92-179.compute-1.amazonaws.com:5432/d2qrau5jsislcl' #'postgresql://localhost/preregistration'
db = SQLAlchemy(app)

# Create our database model

#Update to include new models
class User(db.Model):
    __tablename__ = "Users"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    firstname=db.Column(db.String(50))
    lastname=db.Column(db.String(50))
    email = db.Column(db.String(50), unique=True)
    def __init__(self, email,firstname,lastname):
        #self.id=1
        self.email = email
        self.firstname = firstname
        self.lastname = lastname

    def __repr__(self):
        return '<email %r, firstname %r, lastname %r>' % (self.email,self.firstname,self.lastname)


#feedback model
class Feedback(db.Model):
    __tablename__ = "Feedback"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    feedbacktext=db.Column(db.String(200))
    email = db.Column(db.String(50))

    def __init__(self,feedbacktext,email):
        #self.id=1
        #self.userid = userid
        self.feedbacktext = feedbacktext
        self.email = email

    def __repr__(self):
        return '<feedbacktext %r,email %r>' % (self.feedbacktext,self.email)

#itinerary model
class Itinerary(db.Model):
    __tablename__ = "Itinerary"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    userid=db.Column(db.Integer)
    itinname=db.Column(db.String(100))
    def __init__(self, userid,itinname):
        #self.id=1
        self.userid = userid
        self.itinname = itinname

    def __repr__(self):
        return '<userid %r, itinname %r>' % (self.userid,self.itinname)


#Itin-Contents model --this has to be corrected
class ItinContents(db.Model):
    __tablename__ = "Itin-Contents"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    day=db.Column(db.Integer) #make date type #currently will store like 1,2,3....
    slot=db.Column(db.String(100))
    eventname = db.Column(db.String(100))
    def __init__(self, day,slot,eventname):
        #self.id=1
        self.day = day
        self.slot = slot
        self.eventname = eventname

    def __repr__(self):
        return '<day %r, slot %r, eventname %r>' % (self.day,self.slot,self.eventname)

google_places = GooglePlaces(constants.GOOGLE_MAPS_ID)
google_maps = googlemaps.Client(key=constants.GOOGLE_MAPS_ID)

@app.route('/')
def index():
    return render_template("index.html")

@app.route('/assets/<path:path>')
def send_assets(path):
    return send_from_directory('static/assets', path)

@app.route('/css/<path:path>')
def send_css(path):
    return send_from_directory('static/css', path)

@app.route("/weather/<city>/<year>/<month>/<day>")
def getWeather(city, year, month, day):
    city.replace("-", " ")
    geolocator = Nominatim()
    location = geolocator.geocode(city)
    mydate = datetime.datetime(int(year), int(month), int(day))
    forecast = forecastio.load_forecast("5542c5bc0d6398ec832014be585b83b8", location.latitude, location.longitude, time=mydate)
    return str(forecast.currently()).replace("<", "").replace(">", "")

@app.route('/events/<city>/<category>/<year>/<month>/<day>')
def getEvents(city, category, year, month, day):
    api = eventful.API('pRWGnf7cxRpF8nmn')
    events = api.call('/events/search', q=category, l=city)
    ev = {}
    i = 0
    for event in events['events']['event']:
        ev[i]['event'] = event['title']
        ev[i]['venue'] = event['venue_name']
        ev[i]['location'] = city
        print("%s at %s" % (event['title'], event['venue_name']))
        i=i+1
    return jsonify(ev)

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

        print("success")
        print(idinfo)
        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        print(userid)
        print(idinfo['email'])
        name = idinfo['name'].split(' ')
        print(name)

        if not db.session.query(User).filter(User.email == idinfo['email']).count():
            reg = User(idinfo['email'],name[0],name[1])
            db.session.add(reg)
            #db.session.flush()
            db.session.commit()

        userid = idinfo['sub']
        print(userid)
        print(idinfo['email'])
        return jsonify(ret_token)
    except ValueError:
        # Invalid token
        pass

    return jsonify(ret_token)

def fetch_hotels(place):
    geocode_result = google_maps.geocode(place)
    #print(geocode_result[0]['geometry']['location'])

    hotels = {}

    query_result = google_places.nearby_search(lat_lng={'lat': geocode_result[0]['geometry']['location']['lat'], 'lng': geocode_result[0]['geometry']['location']['lng']}, keyword='hotels', radius=20000, types=['hotels'])

    for place in query_result.places:
        #print(place.name)
        place.get_details()
        #print(place.details)
        hotels[place.name] = place.details

    return hotels

@app.route('/feedback', methods=['POST'])
def getFeedback():
    feedback_token = request.get_json()
    #print(feedback_token)

    email=feedback_token['email']
    message=feedback_token['message']
    #tryal = db.session.query(User).filter(User.email == feedback_token['email']).id
    #print(tryal)

    reg=Feedback(message,email)
    db.session.add(reg)
    #db.session.flush()
    db.session.commit()

    ret_token = { "status" : "Feedback submitted" }

    return jsonify(ret_token)

@app.route('/travel-form', methods=['POST'])
def getTravelData():
    token = request.get_json()
    print(token)

    origin = token['from_location']
    stops = token['stops']
    destination = token['to_location']

    start_dest = origin
    end_dest = destination

    #print(start_dest)
    #print(end_dest)

    data = {}

    stop = 0

    if len(stops) != 0:
        for i in range(len(stops) + 1):
            if i == len(stops):
                end_dest = destination
                distance_matrix = google_maps.distance_matrix(start_dest, end_dest)
                #print(distance_matrix['rows'][0]['elements'][0]['duration']['text'])
                data[start_dest] = {}
                data[start_dest]['stop'] = i + 1
                data[start_dest]['time_to_next'] = distance_matrix['rows'][0]['elements'][0]['duration']['text']
                data[start_dest]['distance_to_next'] = distance_matrix['rows'][0]['elements'][0]['distance']['text']
                data[start_dest]['hotels'] = fetch_hotels(start_dest)
                stop = i + 1
                break
            else:
                end_dest = stops[i]
            distance_matrix = google_maps.distance_matrix(start_dest, end_dest)
            #print(distance_matrix['rows'][0]['elements'][0]['duration']['text'])
            data[start_dest] = {}
            data[start_dest]['stop'] = i + 1
            data[start_dest]['time_to_next'] = distance_matrix['rows'][0]['elements'][0]['duration']['text']
            data[start_dest]['distance_to_next'] = distance_matrix['rows'][0]['elements'][0]['distance']['text']
            data[start_dest]['hotels'] = fetch_hotels(start_dest)
            start_dest = stops[i]
    else:
        distance_matrix = google_maps.distance_matrix(origin, destination)
        #print(distance_matrix['rows'][0]['elements'][0]['duration']['text'])
        data[start_dest] = {}
        data[start_dest]['stop'] = 1
        data[start_dest]['time_to_next'] = distance_matrix['rows'][0]['elements'][0]['duration']['text']
        data[start_dest]['distance_to_next'] = distance_matrix['rows'][0]['elements'][0]['distance']['text']
        data[start_dest]['hotels'] = fetch_hotels(start_dest)
        stop = 2

    data[end_dest] = {}
    data[end_dest]['stop'] = stop + 1
    data[end_dest]['time_to_next'] = "N/a"
    data[start_dest]['distance_to_next'] = "N/a"
    data[end_dest]['hotels'] = fetch_hotels(end_dest)

    print(data)

    ret_token = { "status" : "Places submitted" }

    # Return data jsonified here
    return jsonify(ret_token)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run('localhost', port)
