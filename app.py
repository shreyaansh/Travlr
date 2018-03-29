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
import simplejson as json
from sqlalchemy.dialects.postgresql.json import JSON
import sys
from ast import literal_eval
import urllib.request

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
        self.userid = userid
        self.itinname = itinname

    def __repr__(self):
        return '<userid %r, itinname %r>' % (self.userid,self.itinname)


#Itin-Contents model --this has to be corrected
class ItinContents(db.Model):
    __tablename__ = "Itin-Contents"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    day=db.Column(db.Integer) # make date type #currently will store like 1,2,3....
    slot=db.Column(db.String(100))
    eventname = db.Column(db.String(100))
    def __init__(self, day,slot,eventname):
        self.day = day
        self.slot = slot
        self.eventname = eventname

    def __repr__(self):
        return '<day %r, slot %r, eventname %r>' % (self.day,self.slot,self.eventname)


class JSONCache(db.Model):
    __tablename__="JSONCache"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    location=db.Column(db.String(200))
    data=db.Column(JSON)

    def __init__(self, location, data):
        self.location = location
        self.data = data

    def __repr__(self):
        return '<location %r, data %r>' % (self.location, self.data)


google_places = GooglePlaces(constants.GOOGLE_MAPS_ID)
google_maps = googlemaps.Client(key=constants.GOOGLE_MAPS_ID)

def clean_fetched_data(temp_temp_hotels,dest):
    temp_hotels={}
    temp_hotels[dest]=temp_temp_hotels

    for location in temp_hotels:
        for hotel in temp_hotels[location]:
            del temp_hotels[location][hotel]['reviews']
            del temp_hotels[location][hotel]['geometry']['viewport']
            temp_hotels[location][hotel]['rating'] = str(temp_hotels[location][hotel]['rating'])
            for coordinate in temp_hotels[location][hotel]['geometry']['location']:
                temp_hotels[location][hotel]['geometry']['location'][coordinate] = str(temp_hotels[location][hotel]['geometry']['location'][coordinate])
    temp_temp_hotels = temp_hotels



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

def getEvents(city, category, year, month, day):
		url="http://api.eventful.com/json/events/search?app_key=pRWGnf7cxRpF8nmn&keywords=" + category + "&location=" + city + "&date=" + year + month + day + "00-" + year + month + day + "00"
		response = urllib.request.urlopen(url)
		data = json.loads(response.read())
		return data

@app.route('/authenticate', methods=['POST'])
def authenticate():
    token = request.get_json()
    ret_token = { "token" : "SUCCESS" }
    try:
        # Specify the CLIENT_ID of the app that accesses the backend:
        idinfo = id_token.verify_oauth2_token(token["userInfo"], requests.Request(), constants.GOOGLE_CLIENT_ID)

        if idinfo['iss'] not in ['accounts.google.com', 'https://accounts.google.com']:
            raise ValueError('Wrong issuer.')

        print("success")
        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        name = idinfo['name'].split(' ')

        if not db.session.query(User).filter(User.email == idinfo['email']).count():
            reg = User(idinfo['email'],name[0],name[1])
            db.session.add(reg)
            db.session.commit()

        userid = idinfo['sub']
        return jsonify(ret_token)
    except ValueError:
        pass

    return jsonify(ret_token)

def fetch_hotels(place):
    geocode_result = google_maps.geocode(place)
    hotels = {}
    query_result = google_places.nearby_search(lat_lng={'lat': geocode_result[0]['geometry']['location']['lat'], 'lng': geocode_result[0]['geometry']['location']['lng']}, keyword='hotels', radius=20000, types=['hotels'])
    for place in query_result.places:
        place.get_details()
        hotels[place.name] = place.details
    return hotels

@app.route('/feedback', methods=['POST'])
def getFeedback():
    feedback_token = request.get_json()
    email=feedback_token['email']
    message=feedback_token['message']
    reg=Feedback(message,email)
    db.session.add(reg)
    db.session.commit()
    ret_token = { "status" : "Feedback submitted" }
    return jsonify(ret_token)

@app.route('/travel-form', methods=['POST'])
def getTravelData():
    token = request.get_json()
    from_date = datetime.strptime(token['from_date'], '%m-%d-%Y')
    to_date = datetime.strptime(token['to_date'], '%m-%d-%Y')

    origin = token['from_location']
    stops = token['stops']
    destination = token['to_location']

    start_dest = origin
    end_dest = destination

    data = {}
    temp_hotels = {}
    datadict = {}
    stop = 0

    if len(stops) != 0:
        for i in range(len(stops) + 1):
            if i == len(stops):
                end_dest = destination
                distance_matrix = google_maps.distance_matrix(start_dest, end_dest)
                data[start_dest] = {}
                data[start_dest]['stop'] = i + 1
                data[start_dest]['time_to_next'] = distance_matrix['rows'][0]['elements'][0]['duration']['text']
                data[start_dest]['distance_to_next'] = distance_matrix['rows'][0]['elements'][0]['distance']['text']
                data[start_dest]['events'] = getEvents(start_dest.replace(" ", ""), 'music', str(from_date.year), str('{:02d}'.format(from_date.month)), str('{:02d}'.format(from_date.day)))
                data[start_dest]['hotels'] = {}

                if not db.session.query(JSONCache).filter(JSONCache.location == start_dest).count():
                    data[start_dest]['hotels'] = fetch_hotels(start_dest)
                    clean_fetched_data(data[start_dest]['hotels'],start_dest)
                    jData = json.dumps(data[start_dest]["hotels"])
                    reg = JSONCache(start_dest, jData)
                    db.session.add(reg)
                    db.session.commit()
                else:
                    sqlq='Select data from "public"."JSONCache" where location like \'%s\'' %(start_dest)
                    result = db.engine.execute(sqlq)
                    for row in result:
                        datadict[start_dest] =  json.loads(str(row.data))
                    data[start_dest]['hotels'] = datadict[start_dest]
                temp_hotels[start_dest] = data[start_dest]['hotels']
                stop = i + 1
                break

            else:
                end_dest = stops[i]

            distance_matrix = google_maps.distance_matrix(start_dest, end_dest)
            data[start_dest] = {}
            data[start_dest]['stop'] = i + 1
            data[start_dest]['time_to_next'] = distance_matrix['rows'][0]['elements'][0]['duration']['text']
            data[start_dest]['distance_to_next'] = distance_matrix['rows'][0]['elements'][0]['distance']['text']
            data[start_dest]['events'] = getEvents(start_dest.replace(" ", ""), 'music', str(from_date.year), str('{:02d}'.format(from_date.month)), str('{:02d}'.format(from_date.day)))
            data[start_dest]['hotels'] = {}

            if not db.session.query(JSONCache).filter(JSONCache.location == start_dest).count():
                data[start_dest]['hotels'] = fetch_hotels(start_dest)
                clean_fetched_data(data[start_dest]['hotels'],start_dest)
                jData = json.dumps(data[start_dest]["hotels"])
                reg = JSONCache(start_dest, jData)
                db.session.add(reg)
                db.session.commit()
            else:
                sqlq='Select data from "public"."JSONCache" where location like \'%s\'' %(start_dest)
                result = db.engine.execute(sqlq)
                for row in result:
                    datadict[start_dest] =  json.loads(str(row.data))
                data[start_dest]['hotels'] = datadict[start_dest]
            start_dest = stops[i]
            temp_hotels[start_dest] = data[start_dest]['hotels']
    else:
        distance_matrix = google_maps.distance_matrix(origin, destination)
        data[start_dest] = {}
        data[start_dest]['stop'] = 1
        data[start_dest]['time_to_next'] = distance_matrix['rows'][0]['elements'][0]['duration']['text']
        data[start_dest]['distance_to_next'] = distance_matrix['rows'][0]['elements'][0]['distance']['text']
        data[start_dest]['events'] = getEvents(start_dest.replace(" ", ""), 'music', str(from_date.year), str('{:02d}'.format(from_date.month)), str('{:02d}'.format(from_date.day)))
        data[start_dest]['hotels'] = {}

        if not db.session.query(JSONCache).filter(JSONCache.location == start_dest).count():
            data[start_dest]['hotels'] = fetch_hotels(start_dest)
            clean_fetched_data(data[start_dest]['hotels'],start_dest)
            jData = json.dumps(data[start_dest]["hotels"])
            reg = JSONCache(start_dest, jData)
            db.session.add(reg)
            db.session.commit()
        else:
            sqlq='Select data from "public"."JSONCache" where location like \'%s\'' %(start_dest)
            result = db.engine.execute(sqlq)
            for row in result:
                datadict[start_dest] =  json.loads(str(row.data))
            data[start_dest]['hotels'] = datadict[start_dest]
        temp_hotels[start_dest] = data[start_dest]['hotels']
        stop = 2
    data[end_dest] = {}
    data[end_dest]['stop'] = stop + 1
    data[end_dest]['time_to_next'] = "N/a"
    data[end_dest]['distance_to_next'] = "N/a"
    data[end_dest]['events'] = getEvents(end_dest.replace(" ", ""), 'music', str(to_date.year), str('{:02d}'.format(to_date.month)), str('{:02d}'.format(to_date.day)))
    data[end_dest]['hotels'] = {}

    if not db.session.query(JSONCache).filter(JSONCache.location == end_dest).count():
        data[end_dest]['hotels'] = fetch_hotels(end_dest)
        clean_fetched_data(data[end_dest]['hotels'],end_dest)
        jData = json.dumps(data[end_dest]["hotels"])
        reg = JSONCache(end_dest, jData)
        db.session.add(reg)
        db.session.commit()
    else:
        sqlq='Select data from "public"."JSONCache" where location like \'%s\'' %(end_dest)
        result = db.engine.execute(sqlq)
        for row in result:
            datadict[end_dest] =  json.loads(str(row.data))
        data[end_dest]['hotels'] = datadict[end_dest]
    temp_hotels[end_dest] = data[end_dest]['hotels']
    return jsonify(data)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run('localhost', port)
