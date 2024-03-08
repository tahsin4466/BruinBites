from flask import Flask, send_from_directory, jsonify, request, session
from flask_cors import CORS
import pymysql
import os
from datetime import date

app = Flask(__name__, static_folder='client/build', static_url_path='')
secret = os.urandom(12)
app.config['SECRET_KEY'] = secret
CORS(app)

def dbConnect():
    return pymysql.connect(
        host="bruin-bites.ctamuwuo6it1.us-east-2.rds.amazonaws.com",
        port=3306,
        user="admin",
        passwd="bruinbites",
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

reviewData = [
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

menus = {
  "menus": [
    {
      "name": "Breakfast",
      "subMenus": [
        {
          "name": "Main Dishes",
          "items": [
            {
              "name": "Pancakes",
              "price": "$5.99"
            },
            {
              "name": "Waffles",
              "price": "$6.99"
            }
          ]
        },
        {
          "name": "Sides",
          "items": [
            {
              "name": "Bacon",
              "price": "$2.99"
            },
            {
              "name": "Fruit Bowl",
              "price": "$3.99"
            }
          ]
        }
      ]
    },
    {
      "name": "Lunch",
      "subMenus": [
        {
          "name": "Sandwiches",
          "items": [
            {
              "name": "Turkey Club",
            },
            {
              "name": "Grilled Cheese",
            }
          ]
        },
        {
          "name": "Salads",
          "items": [
            {
              "name": "Caesar Salad",
            },
            {
              "name": "Garden Salad",
            }
          ]
        }
      ]
    },
    {
      "name": "Dinner",
      "subMenus": [
        {
          "name": "Entrees",
          "items": [
            {
              "name": "Steak",
            },
            {
              "name": "Salmon",
            }
          ]
        },
        {
          "name": "Desserts",
          "items": [
            {
              "name": "Cheesecake",
            },
            {
              "name": "Chocolate Cake",
            }
          ]
        }
      ]
    }
  ]
}

restaurant_hours = {
    "Breakfast": {"start": "08:00", "end": "11:00"},
    "Lunch": {"start": "12:00", "end": "14:00"},
    "Dinner": {"start": "18:00", "end": "20:00"},
    "Extended": {"start": "21:00", "end": "24:00"},
}

@app.route('/api/userImage', methods=['GET'])
def get_userImage():
    if 'id' in session:
        print("In session")
        db_connection = dbConnect()
        try:
            with db_connection.cursor() as cursor:
                sql = "SELECT User_PFP FROM BB_User WHERE User_ID = %s"
                cursor.execute(sql, (session['id'],))
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
    return jsonify(menus)

@app.route('/api/hours', methods=['GET'])
def get_hours():
    return jsonify(restaurant_hours)

@app.route('/api/reviews', methods=['GET'])
def get_reviews():
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
    data = request.get_json()
    FirstName = data.get('firstName')
    LastName = data.get('lastName')
    Email = data.get('email')
    Password = data.get('password')
    today = date.today()
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT * FROM `BB_User` WHERE Email = %s"
            cursor.execute(sql, (Email))
            row = cursor.fetchall()
            if len(row) > 0:
                message = jsonify({'message': 'Email exists', 'status': 'failure'}), 400
            else:
                sql = "INSERT INTO BB_User (First_Name, Last_Name, User_PFP, Email, Date_Joined, Password) VALUES (%s, %s, 'https://example.com/user7.jpg', %s, %s, %s)"
                cursor.execute(sql, (FirstName, LastName, Email, today, Password,))
                db_connection.commit()
                message = jsonify({'message': 'Sign up successful', 'status': 'success'}), 201
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