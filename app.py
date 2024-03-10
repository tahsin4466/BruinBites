from flask import Flask, send_from_directory, jsonify, request, session
from flask_cors import CORS
import pymysql
import os
from random import randint
from datetime import date
import re
import boto3
import uuid
from dotenv import load_dotenv

app = Flask(__name__, static_folder='client/build', static_url_path='')
secret = os.urandom(12)
app.config['SECRET_KEY'] = secret
CORS(app)
load_dotenv()

S3_KEY_ID = os.environ.get("S3_KEY_ID")
S3_SECRET_KEY = os.environ.get("S3_SECRET_KEY")
RDS_HOST = os.environ.get("RDS_HOST")
RDS_USER = os.environ.get("RDS_USER")
RDS_PASSWORD = os.environ.get("RDS_PASSWORD")

if not all([S3_KEY_ID, S3_SECRET_KEY, RDS_HOST, RDS_USER, RDS_PASSWORD]):
    raise ValueError("One or more environment variables are not set.")

s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_KEY_ID,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name='us-east-2'
)
BUCKET_NAME = 'bruinbitescdn'

def dbConnect():
    return pymysql.connect(
        host=RDS_HOST,
        port=3306,
        user=RDS_USER,
        passwd=RDS_PASSWORD,
        db="BruinBites"
    )

# Sample data
restaurantImages = [
    "https://portal.housing.ucla.edu/sites/default/files/media/images/Interior%20Greens%20and%20More%20Station%20Seating_square.png",
    "https://bruinplate.hh.ucla.edu/img/About_Facility1.jpg",
    "https://bruinplate.hh.ucla.edu/img/Home_NewFreshSlide.jpg",
    "https://i.insider.com/59f2479dcfad392f0d75597b?width=700",
    "https://s3-media0.fl.yelpcdn.com/bphoto/AH1o0Xj5aS_5LR9yIsSXRg/348s.jpg",
    "https://i.insider.com/59f2479dcfad392f0d75597d?width=800&format=jpeg&auto=webp",
    "https://i.insider.com/59f2479dcfad392f0d75597e?width=800&format=jpeg&auto=webp",
    "https://s3-media0.fl.yelpcdn.com/bphoto/8KxbxoUtL57Qp_C-SNg4tg/348s.jpg",
    "https://i.insider.com/59f2479ccfad392f0d755979?width=600&format=jpeg&auto=webp",
]

'''
reviewData2 = [
    {
        "title": "Delicious and Affordable",
        "rating": 5,
        "thumbnailUrls": [
            "https://portal.housing.ucla.edu/sites/default/files/media/images/Interior%20Greens%20and%20More%20Station%20Seating_square.png",
            "https://bruinplate.hh.ucla.edu/img/About_Facility1.jpg",
        ],
        "userProfilePhoto": "https://example.com/user1.jpg",
        "userName": "Alex Johnson",
        "content": "I was pleasantly surprised by the quality of food offered at the campus dining hall. Great variety and everything tastes fresh. Definitely worth checking out!",
    },
    {
        "title": "Good for a Quick Bite",
        "rating": 4,
        "thumbnailUrls": [
            "https://bruinplate.hh.ucla.edu/img/Home_NewFreshSlide.jpg",
            "https://i.insider.com/59f2479dcfad392f0d75597b?width=700",
            "https://s3-media0.fl.yelpcdn.com/bphoto/AH1o0Xj5aS_5LR9yIsSXRg/348s.jpg",
            "https://i.insider.com/59f2479dcfad392f0d75597d?width=800&format=jpeg&auto=webp",
        ],
        "userProfilePhoto": "https://example.com/user2.jpg",
        "userName": "Bethany Miles",
        "content": "It's my go-to place when I need something quick and tasty between classes. The snacks section is my favorite.",
    },
    {
        "title": "Average Experience",
        "rating": 3,
        "userProfilePhoto": "https://example.com/user3.jpg",
        "userName": "Charlie Smith",
        "content": "It's okay if you're in a hurry, but don't expect too much. It gets the job done, though.",
    },
    {
        "title": "Not Great",
        "rating": 2,
        "userProfilePhoto": "https://example.com/user4.jpg",
        "userName": "Dana Lee",
        "content": "",
    },
    {
        "title": "Disappointed",
        "rating": 1,
        "userProfilePhoto": "https://example.com/user5.jpg",
        "userName": "Evan Wright",
        "content": "The worst dining experience I've had on campus. I found a hair in my food, and the staff seemed indifferent when I complained. Will not be returning anytime soon.",
    },
    {
        "title": "Excellent Variety",
        "rating": 5,
        "thumbnailUrls": [
            "https://i.insider.com/59f2479dcfad392f0d75597e?width=800&format=jpeg&auto=webp",
            "https://s3-media0.fl.yelpcdn.com/bphoto/8KxbxoUtL57Qp_C-SNg4tg/348s.jpg",
            "https://i.insider.com/59f2479ccfad392f0d755979?width=600&format=jpeg&auto=webp",
        ],
        "userProfilePhoto": "https://example.com/user6.jpg",
        "userName": "Fiona Graham",
        "content": "The campus dining hall has a fantastic variety of foods to choose from. Whether you're vegan, vegetarian, or a meat-lover, there's something for everyone. Highly recommend the vegan options!",
    },
    {
        "title": "Great for Vegetarians",
        "rating": 4.5,
        "thumbnailUrls": [],
        "userProfilePhoto": "https://example.com/user7.jpg",
        "userName": "George Huang",
        "content": "As a vegetarian, it's often hard to find good options on campus. However, the dining hall has a great selection that doesn't disappoint. The veggie burgers are a must-try!",
    },
    {
        "title": "Mac and Cheese",
        "rating": 4,
        "thumbnailUrls": [],
        "userProfilePhoto": "https://example.com/user7.jpg",
        "userName": "Jesse",
        "content": "The mac and cheese slaps"
    }
]

restaurant_hours2 = {
    "Breakfast": {"start": "08:00", "end": "11:00"},
    "Lunch": {"start": "12:00", "end": "14:00"},
    "Dinner": {"start": "18:00", "end": "20:00"},
    "Extended": {"start": "21:00", "end": "24:00"},
}
'''

@app.route('/api/userImage', methods=['GET'])
def get_userImage():
    if 'id' in session:
        print("In session")
        db_connection = dbConnect()
        try:
            with db_connection.cursor() as cursor:
                sql = "SELECT User_PFP FROM BB_User WHERE User_ID = %s"
                cursor.execute(sql, (session.get('id'),))
                info = cursor.fetchone()
                print(info)
                userPFP = {
                    "imageURL": info[0],
                    "loggedIn": "true"
                }
        finally:
            db_connection.close()
        print("sent user image")
    else:
        userPFP = {
            "imageURL": "",
            "loggedIn": "false"
        }
        print("sent default image")

    print(userPFP)
    return jsonify(userPFP)

@app.route('/api/restaurantInfo', methods=['GET'])
def get_restaurantInfo():
    restaurantID = 2
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Dining_Name, Dining_Description FROM `BB_Dining` WHERE BB_DiningID = %s"
            cursor.execute(sql, (restaurantID,))
            info = cursor.fetchone()
            restaurantInfo = {
                "name": info[0],
                "description": info[1]
            }
    finally:
        db_connection.close()
    return jsonify(restaurantInfo)

@app.route('/api/menu', methods=['GET'])
def get_menu():
    restaurantID = 2
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Menu_Heading, Menu_Subheading, Menu_Item FROM `BB_Menu` WHERE BB_DiningID = %s"
            cursor.execute(sql, (restaurantID,))
            info = cursor.fetchall()

            result = []
            for row in info:
                heading, subheading, item = row

                # Check if the heading already exists in the result list
                heading_exists = False
                for menu in result:
                    if menu['name'] == heading:
                        heading_exists = True
                        heading_menu = menu
                        break

                # If heading doesn't exist, add it to the result list
                if not heading_exists:
                    heading_menu = {"name": heading, "subMenus": []}
                    result.append(heading_menu)

                # Check if the subheading already exists in the heading's submenus
                subheading_exists = False
                for submenu in heading_menu['subMenus']:
                    if submenu['name'] == subheading:
                        subheading_exists = True
                        subheading_menu = submenu
                        break

                # If subheading doesn't exist, add it to the heading's submenus
                if not subheading_exists:
                    subheading_menu = {"name": subheading, "items": []}
                    heading_menu['subMenus'].append(subheading_menu)

                # Add the item to the subheading's items list
                subheading_menu['items'].append({"name": item})

            menus = {"menus": result}
    finally:
        db_connection.close()
    return jsonify(menus)

@app.route('/api/hours', methods=['GET'])
def get_hours():
    restaurantID = 1
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Dining_Breakfast, Dining_Lunch, Dining_Dinner, Dining_Extended FROM `BB_Dining` WHERE BB_DiningID = %s"
            cursor.execute(sql, (restaurantID,))
            info = cursor.fetchone()
            times = []
            for time_range in info:
                start_time, end_time = time_range.split()
                times.append(start_time)
                times.append(end_time)
            restaurant_hours = {
                "Breakfast": {"start": times[0], "end": times[1]},
                "Lunch": {"start": times[2], "end": times[3]},
                "Dinner": {"start": times[4], "end": times[5]},
                "Extended": {"start": times[6], "end": times[7]},
            }
    finally:
        db_connection.close()
    return jsonify(restaurant_hours)

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
    restaurantID = 2
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = (
                "SELECT r.Review_Title, r.Review_Rating, r.Review_Picture, u.User_PFP, u.First_Name, r.Review_Comment FROM BB_Review r "
                "JOIN BB_User u ON r.User_ID = u.User_ID WHERE r.BB_DiningID = %s")
            cursor.execute(sql, (restaurantID,))
            info = cursor.fetchall()
            reviewData = []
            for row in info:
                photos = row[2].split()
                reviewData.append(
                    {"title": row[0], "rating": row[1], "thumbnailUrls": photos, "userProfilePhoto": row[3],
                     "userName": row[4], "content": row[5]})
    finally:
        db_connection.close()
    return jsonify(reviewData)

@app.route('/api/restaurantImages', methods=['GET'])
def getRestaurantImages():
    return jsonify(restaurantImages)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Password, User_ID FROM `BB_User` WHERE Email = %s"
            cursor.execute(sql, (email,))
            row = cursor.fetchall()
            if len(row) == 0:
                print("Invalid email")
                message = jsonify({'message': 'User does not exist', 'status': 'failure'}), 404
            elif len(row) > 1:
                print("Email already registered")
                message = jsonify({'message': 'Database error, duplicate entry', 'status': 'failure'}), 400
            elif row[0][0] != password:
                print("Invalid password")
                message = jsonify({'message': 'Incorrect password', 'status': 'failure'}), 401
            else:
                print("Logged in successfully")
                session['id'] = row[0][1]
                message = jsonify({'message': 'Login successful', 'status': 'success'}), 202
    finally:
        db_connection.close()
    return message

@app.route('/api/signup', methods=['POST'])
def signup():
  firstName = data.get('firstName')
  lastName = data.get('lastName')
  email = data.get('email')
  password = data.get('password')
  ID = randint(10000000, 99999999)
  dateToday = date.today()
  #Regex pattern for valid email
  if re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) is None:
      message = jsonify({'message': 'Invalid email', 'status': 'failure'}), 400
  #Regex patterns for valid First and Last names
  elif re.match(r'^[A-Z][a-z]+(?: [A-Z][a-z]+)*$|^([A-Z][a-z]+(?:[-\'][A-Z][a-z]+)*)+$', firstName) is None:
      message = jsonify({'message': 'First name must be properly formatted (capital, no numbers etc.)', 'status': 'failure'}), 400
  elif re.match(r'^[A-Z][a-z]+(?: [A-Z][a-z]+)*$|^([A-Z][a-z]+(?:[-\'][A-Z][a-z]+)*)+$', lastName) is None:
      message = jsonify({'message': 'Last name must be properly formatted (capital, no numbers etc.)', 'status': 'failure'}), 400
  #Regex pattern for strong password
  elif re.match(r'^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$', password) is None:
      message = jsonify({'message': 'Password must be at least 8 characters long, with a capital and special character', 'status': 'failure'}), 400
  else:
      db_connection = dbConnect()
      try:
          with db_connection.cursor() as cursor:
              sql = "SELECT * FROM `BB_User` WHERE Email = %s"
              cursor.execute(sql, (email))
              row = cursor.fetchall()
              if len(row) > 0:
                  message = jsonify({'message': 'Email exists', 'status': 'failure'}), 400
              else:
                  sql = "INSERT INTO BB_User (User_ID, First_Name, Last_Name, User_PFP, Email, Date_Joined, Password) VALUES (%s, %s, %s, 'https://example.com/user7.jpg', %s, %s, %s)"
                  cursor.execute(sql, (ID, firstName, lastName, email, dateToday, password,))
                  db_connection.commit()
                  message = jsonify({'message': 'Sign up successful', 'status': 'success'}), 201
        finally:
            db_connection.close()
    return message

@app.route('/')
def homePage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/restaurant')
def restaurantPage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login')
def loginPage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/checkReviewStatus', methods=['GET'])
def checkReviewStatus():
    print("checking review status")
    diningID = 2
    userID = session.get('id')
    db_connection = dbConnect()
    dateToday = date.today()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT (Review_Date) FROM BB_Review WHERE User_ID = %s AND BB_DiningID = %s;"
            cursor.execute(sql, (userID, diningID,))
            row = cursor.fetchone()
            if len(row) != 0 and row[0] == dateToday:
                print("User submitted a review today!")
                message = jsonify({"hasSubmitted": True}), 200
            else:
                print("User has not reviewed today")
                message = jsonify({"hasSubmitted": False}), 200
    finally:
        db_connection.close()
    return message
@app.route('/api/reviewUpload', methods=['POST'])
def upload_review():
    files = request.files.getlist('images')
    imageUrls = []

    title = request.form.get('title')
    content = request.form.get('content')
    rating = request.form.get('rating')
    restaurantID = 2
    userID = session.get('id')
    dateToday = date.today()
    message = jsonify({'message': 'Review submission failed', 'status': 'failure'}), 400

    # Upload images to S3 and get their URLs
    for file in files:
        file_name = f'reviews/{uuid.uuid4()}-{file.filename}'
        s3_client.upload_fileobj(
            file,
            BUCKET_NAME,
            file_name,
        )
        imageUrl = f'https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}'
        imageUrls.append(imageUrl)

    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "INSERT INTO BB_Review (BB_DiningID, User_ID, Review_Title, Review_Comment, Review_Rating, Review_Date) VALUES (%s, %s, %s, %s, %s, %s)"
            cursor.execute(sql, (restaurantID, userID, title, content, rating, dateToday))
            db_connection.commit()
            reviewID = cursor.lastrowid
            sql = "INSERT INTO BB_Images (Review_ID, Image_URL) VALUES (%s, %s)"
            for imageUrl in imageUrls:
                cursor.execute(sql, (reviewID, imageUrl))
            db_connection.commit()
            message = jsonify({'message': 'Review submission succeeded', 'status': 'success'}), 200
    finally:
        db_connection.close()

    return message

@app.route('/api/logout', methods=['POST'])
def logout():
    print("Popped the session")
    session.pop('id', None)
    return jsonify({"success": True, "message": "You have been logged out successfully."}), 200

#Page routing
@app.route('/api/session')
def check_session():
    if 'id' in session:
        return jsonify({'isAuthenticated': True})
    else:
        return jsonify({'isAuthenticated': False})

@app.route('/')
def homePage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/restaurant')
def restaurantPage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login')
def loginPage():
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)