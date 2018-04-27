import os
import uuid
from flask import Flask, render_template, jsonify, request, send_from_directory
import googlemaps
import json
from google.oauth2 import id_token
from google.auth.transport import requests
from googleplaces import GooglePlaces, types, lang
from constants import constants
from datetime import datetime as dt
from datetime import timedelta
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import Sequence
from sqlalchemy import types
from geopy.geocoders import Nominatim
from darksky import forecast
import simplejson as json
from sqlalchemy.dialects.postgresql.json import JSON
import dropbox
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
    isdeveloper = db.Column(db.Boolean)
    def __init__(self, email,firstname,lastname):
        self.email = email
        self.firstname = firstname
        self.lastname = lastname
        self.isdeveloper=False

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
    preference = db.Column(db.String(50))
    def __init__(self, location, data, preference):
        self.location = location
        self.data = data
        self.preference = preference

    def __repr__(self):
        return '<location %r, data %r, preference %r>' % (self.location, self.data, self.preference)


class ItineraryStorage(db.Model):
    __tablename__="ItineraryStorage"
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    itinname=db.Column(db.String(200))
    email = db.Column(db.String(50))
    itinerary=db.Column(JSON)
    def __init__(self, email, itinname, itinerary):
        self.email = email
        self.itinname = itinname
        self.itinerary = itinerary

    def __repr__(self):
        return '<email %r, itinname %r, itinerary %r>' % (self.email, self.itinname, self.itinerary)


google_places = GooglePlaces(constants.GOOGLE_MAPS_ID)
google_maps = googlemaps.Client(key=constants.GOOGLE_MAPS_ID)

def clean_fetched_data(temp_temp_hotels,dest):
    temp_hotels={}
    temp_hotels[dest]=temp_temp_hotels

    for location in temp_hotels:
        for hotel in temp_hotels[location]:
            if 'reviews' in temp_hotels[location][hotel]:
                del temp_hotels[location][hotel]['reviews']
            if 'viewport' in temp_hotels[location][hotel]:
                del temp_hotels[location][hotel]['geometry']['viewport']
            if 'rating' in temp_hotels[location][hotel]:
                temp_hotels[location][hotel]['rating'] = str(temp_hotels[location][hotel]['rating'])
            else:
                temp_hotels[location][hotel]['rating'] = ''

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

@app.route("/weather/<city>/<year>/<month>/<day>/<info>")
def getWeather(city, year, month, day, info):
    key = "5542c5bc0d6398ec832014be585b83b8"
    city.replace("-", " ")
    geolocator = Nominatim()
    location = geolocator.geocode(city)
    premydate = dt(int(year), int(month), int(day))
    mydate = premydate.isoformat()
    now = dt.now()
    diff = premydate - now
    CITY = key, location.latitude, location.longitude
    city = forecast(*CITY, time=mydate)
    if info == "summary":
        return str(city.summary)
    elif info == "icon":
        return str(city.icon)
    elif info == "precipProb":
        if diff.days <= 6:
            return str(city.precipProbability)
        else:
            return str(-1)
    elif info == "temperature":
        return str(city.temperature)
    elif info == "clothing":
        temperature = city.temperature
        precipProb = -1
        if diff.days <= 6:
            precipProb = city.precipProbability
        clothing = "No Extra Clothing"
        if temperature <= 40 and precipProb >= 0.5:
            clothing = "Winter Coat, Rain Jacket"
        elif temperature <= 40:
            clothing = "Winter Coat"
        elif precipProb >= 0.5:
            clothing = "Rain Jacket"
        return clothing
    elif info == 'severe':
        precipProb = -1
        if diff.days <= 6:
            precipProb = city.precipProbability
        if precipProb >= 0.9:
            return "Severe Weather Warning"
        else:
            return "No Severe Weather"
    else:
        return "last input <info> must be 'summary', 'precipProb', or 'temperature'"
    return str(city.summary) + "<br>" + str(city.precipProbability) + "<br>" + str(city.temperature)

def getEvents(city, event_prefs, year, month, day):
    category = ""

    for cat in event_prefs:
        category += cat.lower() + ','

    category = category[:-1]

    url="http://api.eventful.com/json/events/search?app_key=pRWGnf7cxRpF8nmn&location=" + city + "&category=" + category + "&date=" + year + month + day + "00-" + year + month + day + "00"
    response = urllib.request.urlopen(url)
    data = json.loads(response.read())
    if type(data['events']) == type(None):
        data['events'] = {'event': []}

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

        # ID token is valid. Get the user's Google Account ID from the decoded token.
        userid = idinfo['sub']
        name = idinfo['name'].split(' ')

        if not db.session.query(User).filter(User.email == idinfo['email']).count():
            reg = User(idinfo['email'],name[0],name[1])
            db.session.add(reg)
            db.session.commit()

        userid = idinfo['sub']

        sqlq='Select isdeveloper from "public"."Users" where email like \'%s\'' %(idinfo['email'])
        result = db.engine.execute(sqlq)
        developerdict={}
        for row in result:
            developerdict['isDeveloper'] =  str(row.isdeveloper)
            break


        return jsonify(developerdict)
        #return jsonify(ret_token)
    except ValueError:
        pass

    return jsonify(ret_token)

def fetch_hotels(hotel_pref, place):
    geocode_result = google_maps.geocode(place)
    hotels = {}
    query_result = google_places.nearby_search(lat_lng={'lat': geocode_result[0]['geometry']['location']['lat'], 'lng': geocode_result[0]['geometry']['location']['lng']}, keyword=hotel_pref + 'hotels', radius=20000, types=['hotels'])
    for place in query_result.places:
        place.get_details()
        hotels[place.name] = place.details
    return hotels

@app.route('/feedback', methods=['POST'])
def submitFeedback():
    feedback_token = request.get_json()
    email=feedback_token['email']
    message=feedback_token['message']
    reg=Feedback(message,email)
    db.session.add(reg)
    db.session.commit()
    ret_token = { "status" : "Feedback submitted" }

    return jsonify(ret_token)

@app.route('/autocomplete/<token>', methods=['GET'])
def autocomplete(token):
    token = token.lower()
    readf = open('./constants/cities_data.txt', 'r')

    cities = json.loads(readf.read())
    ckeys = list(cities.keys())
    terms = []
    ret_data = []
    for key in ckeys:
        if key.startswith(token):
            terms.append(key)

    for t in terms:
        ret_data.append(cities[t])

    # Flatten Nested Lists into one list
    ret_list = [y for x in ret_data for y in x]

    ret_token = {"result" : ret_list}

    return jsonify(ret_token)

@app.route('/save-itin', methods=['POST'])
def saveItinerary():
    token = request.get_json()
    names="ItinTest"
    reg = ItineraryStorage(token['data']['email'],names,token['data']['itinerary'])
    db.session.add(reg)
    db.session.commit()
    # Now request should have two things: 1. The user information, so we can correctly map the itinerary to the user
    # 2. Obviously, the itinerary in JSON format

    # Add database calls here
    return jsonify({"TEST" : "Success"})

@app.route('/get-itin', methods=['POST'])
def getItineraries():
    token = request.get_json()
    #token=token.replace("\'","\"")
    email = token['email']
    sqlq = 'Select * from "public"."ItineraryStorage" where email =\'%s\''%(email)
    result = db.engine.execute(sqlq)

    ItinDict={}
    for row in result:
        if row.email not in ItinDict:
            ItinDict[row.email]={}
        ItinDict[row.email][row.id] =  json.dumps(row.itinerary)
    return jsonify(ItinDict)

@app.route('/delete-feedback', methods=['POST'])
def deleteFeedback():
    token = request.get_json()
    feedid = int(token['feedback-id'])
    sqlq = 'Delete from "public"."Feedback" where id = %d' %(feedid)
    result = db.engine.execute(sqlq)
    return jsonify({"Success": "Feedback Deleted"})

@app.route('/get-feedback', methods=['GET'])
def getFeedback():
    sqlq='Select * from "public"."Feedback"'
    result = db.engine.execute(sqlq)
    FeedbackDict={}
    for row in result:
        if row.email not in FeedbackDict:
            FeedbackDict[row.email]={}
        FeedbackDict[row.email][row.id] =  str(row.feedbacktext)
    #return jsonify(ret_token)
    return jsonify(FeedbackDict)

@app.route('/upload-itin', methods=['POST'])
def uploadItinerary():
    dbx = dropbox.Dropbox('m6hTLFgZa3IAAAAAAAATBAlZ9jB14q37sy2ITRHoQLqfOhMgX0yg5C9AmX5PvKtT')

    token = request.get_json()
    pdf_str = token['pdf']

    pdf_name = str(uuid.uuid1()) + '.pdf'

    with open(pdf_name, 'w+') as pdf:
        pdf.write(pdf_str)

    with open(pdf_name, "rb") as f:
        dbx.files_upload(f.read() , '/' + pdf_name, mute=True)

    os.remove(pdf_name)

    result = dbx.sharing_create_shared_link('/' + pdf_name, short_url=True, pending_upload=None)

    return jsonify({'link': result.url})

@app.route('/travel-form', methods=['POST'])
def getTravelData():
    token = request.get_json()
    from_date = dt.strptime(token['from_date'], '%m-%d-%Y')
    to_date = dt.strptime(token['to_date'], '%m-%d-%Y')
    iter_date = from_date

    origin = token['from_location']
    stops = token['stops']
    destination = token['to_location']
    stop_no = 1

    if len(token['hotel_prefs']) == 0:
        hotel_pref = ''
    else:
        hotel_pref = token['hotel_prefs'][0] + ' '

    event_prefs = token['event_prefs']

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
                data[start_dest]['events'] = getEvents(start_dest.replace(" ", "%20"), event_prefs, str(from_date.year), str('{:02d}'.format(from_date.month)), str('{:02d}'.format(from_date.day)))
                data[start_dest]['hotels'] = {}
                days = -1
                for city in token['stop_days']:
                    thecity = str(city.keys())
                    thecity = thecity[12:thecity.find(']') - 1]
                    if thecity == start_dest:
                        days = int(city[start_dest])
                print("EndLoop1-" + start_dest + "-" + str(days))
                for index in range(0, days):
                    print(str(iter_date))
                    weatherName = "weather_" + str(index)
                    data[start_dest][weatherName] = {}
                    data[start_dest][weatherName]['date'] = str(iter_date)
                    data[start_dest][weatherName]['summary'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "summary")
                    data[start_dest][weatherName]['temperature'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "temperature")
                    data[start_dest][weatherName]['clothing'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "clothing")
                    data[start_dest][weatherName]['icon'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "icon")
                    data[start_dest][weatherName]['severe'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "severe")
                    iter_date += timedelta(days=1)
                data[start_dest]['stop_no'] = stop_no
                stop_no += 1
               
                if not db.session.query(JSONCache).filter(JSONCache.location == start_dest, JSONCache.preference == hotel_pref).count():
                    data[start_dest]['hotels'] = fetch_hotels(hotel_pref, start_dest)
                    clean_fetched_data(data[start_dest]['hotels'],start_dest)
                    jData = json.dumps(data[start_dest]["hotels"])
                    reg = JSONCache(start_dest, jData, hotel_pref)
                    db.session.add(reg)
                    db.session.commit()
                else:
                    sqlq='Select data from "public"."JSONCache" where location like \'%s\' and preference like \'%s\'' %(start_dest, hotel_pref)
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
            data[start_dest]['events'] = getEvents(start_dest.replace(" ", "%20"), event_prefs, str(from_date.year), str('{:02d}'.format(from_date.month)), str('{:02d}'.format(from_date.day)))
            data[start_dest]['hotels'] = {}
            days = -1
            for city in token['stop_days']:
                thecity = str(city.keys())
                thecity = thecity[12:thecity.find(']') - 1]
                if thecity == start_dest:
                    days = int(city[start_dest])
            print("EndLoop2-" + start_dest + "-" + str(days))
            for index in range(0, days):
                print(str(iter_date))
                weatherName = "weather_" + str(index)
                data[start_dest][weatherName] = {}
                data[start_dest][weatherName]['date'] = str(iter_date)
                data[start_dest][weatherName]['summary'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "summary")
                data[start_dest][weatherName]['temperature'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "temperature")
                data[start_dest][weatherName]['clothing'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "clothing")
                data[start_dest][weatherName]['icon'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "icon")
                data[start_dest][weatherName]['severe'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "severe")
                iter_date += timedelta(days=1)
            data[start_dest]['stop_no'] = stop_no
            stop_no += 1

            if not db.session.query(JSONCache).filter(JSONCache.location == start_dest, JSONCache.preference == hotel_pref).count():
                data[start_dest]['hotels'] = fetch_hotels(hotel_pref, start_dest)
                clean_fetched_data(data[start_dest]['hotels'],start_dest)
                jData = json.dumps(data[start_dest]["hotels"])
                reg = JSONCache(start_dest, jData, hotel_pref)
                db.session.add(reg)
                db.session.commit()
            else:
                sqlq='Select data from "public"."JSONCache" where location like \'%s\' and preference like \'%s\'' %(start_dest, hotel_pref)
                result = db.engine.execute(sqlq)
                for row in result:
                    datadict[start_dest] =  json.loads(str(row.data))
                data[start_dest]['hotels'] = datadict[start_dest]

            temp_hotels[start_dest] = data[start_dest]['hotels']
            start_dest = stops[i]
    else:
        distance_matrix = google_maps.distance_matrix(origin, destination)
        data[start_dest] = {}
        data[start_dest]['stop'] = 1
        data[start_dest]['time_to_next'] = distance_matrix['rows'][0]['elements'][0]['duration']['text']
        data[start_dest]['distance_to_next'] = distance_matrix['rows'][0]['elements'][0]['distance']['text']
        data[start_dest]['events'] = getEvents(start_dest.replace(" ", "%20"), event_prefs, str(from_date.year), str('{:02d}'.format(from_date.month)), str('{:02d}'.format(from_date.day)))
        data[start_dest]['hotels'] = {}
        days = -1
        for city in token['stop_days']:
            thecity = str(city.keys())
            thecity = thecity[12:thecity.find(']') - 1]
            if thecity == start_dest:
                days = int(city[start_dest])
        print("EndLoop3-" + start_dest + "-" + str(days))
        for index in range(0, days):
            print(str(iter_date))
            weatherName = "weather_" + str(index)
            data[start_dest][weatherName] = {}
            data[start_dest][weatherName]['date'] = str(iter_date)
            data[start_dest][weatherName]['summary'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "summary")
            data[start_dest][weatherName]['temperature'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "temperature")
            data[start_dest][weatherName]['clothing'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "clothing")
            data[start_dest][weatherName]['icon'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "icon")
            data[start_dest][weatherName]['severe'] = getWeather(start_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "severe")
            iter_date += timedelta(days=1)
        data[start_dest]['stop_no'] = stop_no
        stop_no += 1

        if not db.session.query(JSONCache).filter(JSONCache.location == start_dest, JSONCache.preference == hotel_pref).count():
            data[start_dest]['hotels'] = fetch_hotels(hotel_pref, start_dest)
            clean_fetched_data(data[start_dest]['hotels'],start_dest)
            jData = json.dumps(data[start_dest]["hotels"])
            reg = JSONCache(start_dest, jData, hotel_pref)
            db.session.add(reg)
            db.session.commit()
        else:
            sqlq='Select data from "public"."JSONCache" where location like \'%s\' and preference like \'%s\'' %(start_dest, hotel_pref)
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
    data[end_dest]['events'] = getEvents(end_dest.replace(" ", "%20"), event_prefs, str(to_date.year), str('{:02d}'.format(to_date.month)), str('{:02d}'.format(to_date.day)))
    data[end_dest]['hotels'] = {}
    days = -1
    for city in token['stop_days']:
        thecity = str(city.keys())
        thecity = thecity[12:thecity.find(']') - 1]
        if thecity == end_dest:
            days = int(city[end_dest])
    print("EndLoop4-" + end_dest + "-" + str(days))
    for index in range(0, days):
        print(str(iter_date))
        weatherName = "weather_" + str(index)
        data[end_dest][weatherName] = {}
        data[end_dest][weatherName]['date'] = str(iter_date)
        data[end_dest][weatherName]['summary'] = getWeather(end_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "summary")
        data[end_dest][weatherName]['temperature'] = getWeather(end_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "temperature")
        data[end_dest][weatherName]['clothing'] = getWeather(end_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "clothing")
        data[end_dest][weatherName]['icon'] = getWeather(end_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "icon")
        data[end_dest][weatherName]['severe'] = getWeather(end_dest.replace(" ", "-"), str(iter_date.year), str('{:02d}'.format(iter_date.month)), str('{:02d}'.format(iter_date.day)), "severe")
        iter_date += timedelta(days=1)
    data[end_dest]['stop_no'] = stop_no
    stop_no += 1

    if not db.session.query(JSONCache).filter(JSONCache.location == end_dest, JSONCache.preference == hotel_pref).count():
        data[end_dest]['hotels'] = fetch_hotels(hotel_pref, end_dest)
        clean_fetched_data(data[end_dest]['hotels'], end_dest)
        jData = json.dumps(data[end_dest]["hotels"])
        reg = JSONCache(end_dest, jData, hotel_pref)
        db.session.add(reg)
        db.session.commit()
    else:
        sqlq='Select data from "public"."JSONCache" where location like \'%s\' and preference like \'%s\'' %(end_dest, hotel_pref)
        result = db.engine.execute(sqlq)
        for row in result:
            datadict[end_dest] =  json.loads(str(row.data))
        data[end_dest]['hotels'] = datadict[end_dest]

    return jsonify(data)


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run('localhost', port)
