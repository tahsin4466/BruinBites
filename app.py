#Library imports
from flask import Flask, send_from_directory, jsonify, request, session
from flask_cors import CORS
import pymysql
import os
from random import randint
from datetime import date
import re
import boto3
import uuid
import bcrypt
from dotenv import load_dotenv

#Flask configurations
app = Flask(__name__, static_folder='client/build', static_url_path='')
secret = os.urandom(24)
app.config['SECRET_KEY'] = secret
CORS(app)

#.env variable loading and checkers
load_dotenv()
S3_KEY_ID = os.environ.get("S3_KEY_ID")
S3_SECRET_KEY = os.environ.get("S3_SECRET_KEY")
RDS_HOST = os.environ.get("RDS_HOST")
RDS_USER = os.environ.get("RDS_USER")
RDS_PASSWORD = os.environ.get("RDS_PASSWORD")
if not all([S3_KEY_ID, S3_SECRET_KEY, RDS_HOST, RDS_USER, RDS_PASSWORD]):
    raise ValueError("One or more environment variables are not set.")

#CDN connection object
s3_client = boto3.client(
    's3',
    aws_access_key_id=S3_KEY_ID,
    aws_secret_access_key=S3_SECRET_KEY,
    region_name='us-east-2'
)
BUCKET_NAME = 'bruinbitescdn'

#Database connection object and function
def dbConnect():
    return pymysql.connect(
        host=RDS_HOST,
        port=3306,
        user=RDS_USER,
        passwd=RDS_PASSWORD,
        db="BruinBites"
    )

#Regex checker functions
def getRestaurantID(name):
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT BB_DiningID FROM BB_Dining WHERE Dining_Name = %s"
            cursor.execute(sql, (name))
            id = cursor.fetchone()[0]
    finally:
        db_connection.close()
    return id

def validName(name):
    if re.match(r'^[A-Z][a-z]+(?:[ -\'][A-Za-z]+)*$', name) is None:
        return False
    else:
        return True

def validEmail(email):
    if re.match(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email) is None:
        return False
    else:
        return True

def validPassword(password):
    if re.match(r'^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$', password) is None:
        return False
    else:
        return True

#API app routes
@app.route('/api/userImage', methods=['GET'])
def get_userImage():
    if 'id' in session:
        db_connection = dbConnect()
        try:
            with db_connection.cursor() as cursor:
                sql = "SELECT User_PFP FROM BB_User WHERE User_ID = %s"
                cursor.execute(sql, (session.get('id'),))
                info = cursor.fetchone()
                userPFP = {
                    "imageURL": info[0],
                    "loggedIn": "true"
                }
        finally:
            db_connection.close()

    else:
        userPFP = {
            "imageURL": "",
            "loggedIn": "false"
        }

    return jsonify(userPFP)

@app.route('/api/restaurantInfo/<restaurantName>', methods=['GET'])
def get_restaurantInfo(restaurantName):
    restaurantID = getRestaurantID(restaurantName)
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

@app.route('/api/menu/<restaurantName>', methods=['GET'])
def get_menu(restaurantName):
    restaurantID = getRestaurantID(restaurantName)
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

@app.route('/api/hours/<restaurantName>', methods=['GET'])
def get_hours(restaurantName):
    restaurantID = getRestaurantID(restaurantName)
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

            restaurant_hours = {}
            if times[0] != "0":
                restaurant_hours["Breakfast"] = {"start": times[0], "end": times[1]}

            if times[2] != "0":
                restaurant_hours["Lunch"] = {"start": times[2], "end": times[3]}

            restaurant_hours["Dinner"] = {"start": times[4], "end": times[5]}

            if times[6] != "0":
                restaurant_hours["Extended Dinner"] = {"start": times[6], "end": times[7]}

    finally:
        db_connection.close()
    return jsonify(restaurant_hours)

@app.route('/api/reviews/<restaurantName>', methods=['GET'])
def get_reviews(restaurantName):
    restaurantID = getRestaurantID(restaurantName)
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = (
                "SELECT r.Review_Title, r.Review_Rating, u.User_PFP, u.First_Name, r.Review_Comment, r.Review_ID, u.Last_Name, r.Review_Date, u.User_ID FROM BB_Review r "
                "JOIN BB_User u ON r.User_ID = u.User_ID WHERE r.BB_DiningID = %s ORDER BY r.Review_Date DESC")
            cursor.execute(sql, (restaurantID,))
            info = cursor.fetchall()

            reviewData = []
            for row in info:
                reviewID = row[5]
                sql2 = ("SELECT Image_URL FROM `BB_Images` WHERE Review_ID = %s")
                cursor.execute(sql2, (reviewID,))
                info2 = cursor.fetchall()

                photos = []
                for image in info2:
                    photos.append(image)
                userName = row[3] + " " + row[6]
                reviewData.append(
                    {"title": row[0], "rating": row[1], "thumbnailUrls": photos, "userProfilePhoto": row[2],
                     "userName": userName, "content": row[4], "date": row[7].strftime("%m/%d/%Y"), "userID": row[8]})
    finally:
        db_connection.close()
    return jsonify(reviewData)

@app.route('/api/userReviews', methods=['GET'])
def get_user_reviews():
    userID = session.get('id')
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = (
                "SELECT r.Review_Title, r.Review_Rating, u.User_PFP, u.First_Name, r.Review_Comment, r.Review_ID, u.Last_Name, r.Review_Date, u.User_ID FROM BB_Review r "
                "JOIN BB_User u ON r.User_ID = u.User_ID WHERE u.User_ID = %s ORDER BY r.Review_Date DESC")
            cursor.execute(sql, (userID,))
            info = cursor.fetchall()
            userReviews = []
            for row in info:
                reviewID = row[5]
                sql2 = ("SELECT Image_URL FROM `BB_Images` WHERE Review_ID = %s")
                cursor.execute(sql2, (reviewID,))
                info2 = cursor.fetchall()

                photos = []
                for image in info2:
                    photos.append(image)
                userName = row[3] + " " + row[6]
                userReviews.append(
                    {"title": row[0], "rating": row[1], "thumbnailUrls": photos, "userProfilePhoto": row[2],
                     "userName": userName, "content": row[4], "date": row[7].strftime("%m/%d/%Y"), "userID": row[8]})
    finally:
        db_connection.close()
    return jsonify(userReviews)

@app.route('/api/searchedReviews/<userID>', methods=['GET'])
def get_searched_reviews(userID):
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = (
                "SELECT r.Review_Title, r.Review_Rating, u.User_PFP, u.First_Name, r.Review_Comment, r.Review_ID, u.Last_Name, r.Review_Date, u.User_ID FROM BB_Review r "
                "JOIN BB_User u ON r.User_ID = u.User_ID WHERE u.User_ID = %s ORDER BY r.Review_Date DESC")
            cursor.execute(sql, (userID,))
            info = cursor.fetchall()
            userReviews = []
            for row in info:
                reviewID = row[5]
                sql2 = ("SELECT Image_URL FROM `BB_Images` WHERE Review_ID = %s")
                cursor.execute(sql2, (reviewID,))
                info2 = cursor.fetchall()

                photos = []
                for image in info2:
                    photos.append(image)
                userName = row[3] + " " + row[6]
                userReviews.append(
                    {"title": row[0], "rating": row[1], "thumbnailUrls": photos, "userProfilePhoto": row[2],
                     "userName": userName, "content": row[4], "date": row[7].strftime("%m/%d/%Y"), "userID": row[8]})
    finally:
        db_connection.close()
    return jsonify(userReviews)


@app.route('/api/restaurantImages/<restaurantName>', methods=['GET'])
def getRestaurantImages(restaurantName):
    restaurantImages = []
    restaurantID = getRestaurantID(restaurantName)
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Image_URL FROM BB_Images INNER JOIN BB_Review ON BB_Images.Review_ID = BB_Review.Review_ID WHERE BB_DiningID = %s ORDER BY Review_Date DESC"
            cursor.execute(sql, (restaurantID))
            images = cursor.fetchall()
            for URL in images:
                restaurantImages.append(URL[0])
    finally:
        db_connection.close()
    return jsonify(restaurantImages)

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password').encode('utf-8')  # Encode password to bytes

    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Password, User_ID FROM `BB_User` WHERE Email = %s"
            cursor.execute(sql, (email,))
            row = cursor.fetchone()  # Assuming email is unique, fetchone is more appropriate

            if row is None:
                message = jsonify({'message': 'User does not exist', 'status': 'failure'}), 404
            elif not bcrypt.checkpw(password, row[0].encode('utf-8')):  # Check the hashed password
                message = jsonify({'message': 'Incorrect password', 'status': 'failure'}), 401
            else:
                session['id'] = row[1]
                message = jsonify({'message': 'Login successful', 'status': 'success'}), 202
    finally:
        db_connection.close()
    return message


@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    firstName = data.get('firstName')
    lastName = data.get('lastName')
    email = data.get('email')
    password = data.get('password')
    ID = randint(10000000, 99999999)
    dateToday = date.today()
    # Regex pattern for valid email
    if validEmail(email) is False:
        message = jsonify({'message': 'Invalid email', 'status': 'failure'}), 400
    # Regex patterns for valid First and Last names
    elif validName(firstName) is False:
        message = jsonify(
            {'message': 'First name must be properly formatted (capital, no numbers etc.)', 'status': 'failure'}), 400
    elif validName(lastName) is False:
        message = jsonify(
            {'message': 'Last name must be properly formatted (capital, no numbers etc.)', 'status': 'failure'}), 400

    # Regex pattern for strong password
    elif validPassword(password) is False:
        message = jsonify({'message': 'Password must be at least 8 characters long, with a capital and special character', 'status': 'failure'}), 400
    else:
        bytePassword = password = data.get('password').encode('utf-8')
        hashed_password = bcrypt.hashpw(bytePassword, bcrypt.gensalt())  # Hash the password
        db_connection = dbConnect()
        try:
            with db_connection.cursor() as cursor:
                # Check if email already exists...
                # If not, insert the new user with the hashed password:
                sql = "INSERT INTO BB_User (User_ID, First_Name, Last_Name, User_PFP, Email, Date_Joined, Password) VALUES (%s, %s, %s, 'https://example.com/user7.jpg', %s, %s, %s)"
                cursor.execute(sql, (ID, firstName, lastName, email, dateToday, hashed_password))
                db_connection.commit()
                message = jsonify({'message': 'Sign up successful', 'status': 'success'}), 201
        finally:
            db_connection.close()
    return message

@app.route('/api/checkReviewStatus/<restaurantName>', methods=['GET'])
def checkReviewStatus(restaurantName):
    diningID = getRestaurantID(restaurantName)
    userID = session.get('id')
    db_connection = dbConnect()
    dateToday = date.today()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT (Review_Date) FROM BB_Review WHERE User_ID = %s AND BB_DiningID = %s ORDER BY Review_Date DESC"
            cursor.execute(sql, (userID, diningID,))
            row = cursor.fetchone()
            try:
                if len(row) != 0 and row[0] == dateToday:
                    message = jsonify({"hasSubmitted": True}), 200
                else:
                    message = jsonify({"hasSubmitted": False}), 200
            except:
                message = jsonify({"hasSubmitted": False}), 200
    finally:
        db_connection.close()
    return message

@app.route('/api/restaurantResults', methods=['GET'])
def restaurantResults():
    results = []
    jsonResults = []
    dbConnection = dbConnect()
    try:
        with dbConnection.cursor() as cursor:
            #Get dining name and description
            sql = "SELECT BB_DiningID, Dining_Name, Dining_Description FROM BB_Dining"
            cursor.execute(sql)
            info = cursor.fetchall()
            for result in info:
                results.append([result[0], result[1], result[2]])

            #Get star ratings for reviews
            sql = "SELECT Review_Rating FROM BB_Review WHERE BB_DiningID = %s;"
            i = 0
            for entry in results:
                cursor.execute(sql, (entry[0]))
                ratings = list(cursor.fetchall())
                ratingValues = [num for (num,) in ratings]
                if (sum(ratingValues) != 0) or (len(ratingValues) != 0):
                    results[i].insert(3, (sum(ratingValues)/len(ratingValues)))
                else:
                    results[i].insert(3, 0)
                i+=1

            #Get Image
            sql = "SELECT Image_URL FROM BB_Images INNER JOIN BB_Review ON BB_Images.Review_ID = BB_Review.Review_ID WHERE BB_DiningID = %s ORDER BY Review_Date DESC"
            i = 0
            for entry in results:
                cursor.execute(sql, (entry[0]))
                image = cursor.fetchone()
                if image is not None:
                    results[i].insert(4,(image))
                else:
                    results[i].insert(4, "https://media.istockphoto.com/id/1319101018/vector/restaurant-line-icon.jpg?s=612x612&w=0&k=20&c=jxdSdOZHPYRD4rfEIb4HCln5ief3QDT5ZT2SQXvJEjI=")
                i+=1
    finally:
        dbConnection.close()

    #Organize results into expected JSON structure
    for result in results:
        jsonResults.append({"image": result[4], "name": result[1], "review": result[3], "description": result[2]})

    return jsonify(jsonResults)

userInfo2 = {
    "name": "Jane Doe",
    "email": "janedoe@example.com",
    "joinDate": "2024-10-10"
}
@app.route('/api/personalInfo', methods=['GET'])
def getPersonalInfo():
    userId = session.get('id')
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT First_Name, Last_Name, Email, Date_Joined, User_PFP FROM `BB_User` WHERE User_ID = %s"
            cursor.execute(sql, (userId,))
            info = cursor.fetchone()
            userInfo = {
                "name": info[0] + " " + info[1],
                "email": info[2],
                "date": info[3].strftime("%m/%d/%Y"),
                "userPFP": info[4]
            }
    finally:
        db_connection.close()
    return jsonify(userInfo)

@app.route('/api/searchedInfo/<userId>', methods=['GET'])
def getSearchedInfo(userId):
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT First_Name, Last_Name, Email, Date_Joined, User_PFP FROM `BB_User` WHERE User_ID = %s"
            cursor.execute(sql, (userId,))
            info = cursor.fetchone()
            userInfo = {
                "name": info[0] + " " + info[1],
                "email": info[2],
                "date": info[3].strftime("%m/%d/%Y"),
                "userPFP": info[4]
            }
    finally:
        db_connection.close()
    return jsonify(userInfo)

@app.route('/api/updateProfile', methods=['POST'])
def updateProfile():
    userId = session.get('id')
    file = request.files.get('profilePhoto')
    passwordUpdated = request.form.get('updatedPassword')
    imageUpdated = request.form.get('updatedImage')

    if passwordUpdated == "true":
        # Get the new password from the form
        updatedPassword = request.form.get('password')
        if validPassword(updatedPassword) is False:
            return jsonify({'message': 'Password must be at least 8 characters long, with a capital and special character', 'status': 'failure'}), 200
        # Hash the new password
        encodedPassword = updatedPassword.encode('utf-8')  # Encode the new password to bytes
        hashed_password = bcrypt.hashpw(encodedPassword, bcrypt.gensalt())

        db_connection = dbConnect()
        try:
            with db_connection.cursor() as cursor:
                # Update the hashed password in the database
                sql = "UPDATE BB_User SET Password = %s WHERE User_ID = %s"
                cursor.execute(sql, (hashed_password, userId,))
                db_connection.commit()
        finally:
            db_connection.close()

    if imageUpdated == "true":
        file_name = f'reviews/{uuid.uuid4()}-{file.filename}'
        s3_client.upload_fileobj(
            file,
            BUCKET_NAME,
            file_name,
        )
        profilePhotoURL = f'https://{BUCKET_NAME}.s3.amazonaws.com/{file_name}'

        db_connection = dbConnect()
        try:
            with db_connection.cursor() as cursor:
                sql = "UPDATE BB_User SET User_PFP = %s WHERE User_ID = %s"
                cursor.execute(sql, (profilePhotoURL, userId,))
                db_connection.commit()
        finally:
            db_connection.close()

    newFirstName = request.form.get('firstName')
    newLastName = request.form.get('lastName')
    newEmail = request.form.get('email')

    if validEmail(newEmail) is False:
        return jsonify({'message': 'Invalid email', 'status': 'failure'}), 200
    elif validName(newFirstName) is False:
        return jsonify({'message': 'First name must be properly formatted (capital, no numbers etc.)', 'status': 'failure'}), 200
    elif validName(newLastName) is False:
        return jsonify({'message': 'Last name must be properly formatted (capital, no numbers etc.)', 'status': 'failure'}), 200

    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "UPDATE BB_User SET First_Name = %s, Last_Name = %s, Email = %s WHERE User_ID = %s"
            cursor.execute(sql, (newFirstName, newLastName, newEmail, userId,))
            db_connection.commit()
    finally:
        db_connection.close()
    return jsonify({'message': 'Update succeeded', 'status': 'success'}), 200

@app.route('/api/reviewUpload/<restaurantName>', methods=['POST'])
def uploadReview(restaurantName):
    files = request.files.getlist('images')
    imageUrls = []

    title = request.form.get('title')
    content = request.form.get('content')
    rating = request.form.get('rating')
    restaurantID = getRestaurantID(restaurantName)
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
    session.pop('id', None)
    return jsonify({"success": True, "message": "You have been logged out successfully."}), 200

@app.route('/api/session')
def check_session():
    if 'id' in session:
        return jsonify({'isAuthenticated': True})
    else:
        return jsonify({'isAuthenticated': False})

#Page routing app routes
@app.route('/')
def homePage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/restaurant')
def restaurantPage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/restaurant/<restaurantName>')
def restaurantPageSpecific(restaurantName):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/login')
def loginPage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/search')
def searchPage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/profile')
def userPage():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/profile/<userID>')
def userViewPage(userID):
    return send_from_directory(app.static_folder, 'index.html')

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000, debug=True)
