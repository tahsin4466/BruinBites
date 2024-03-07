from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS
import pymysql

app = Flask(__name__, static_folder='client/build', static_url_path='')
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




@app.route('/api/restaurantInfo', methods=['GET'])
def get_restaurantInfo():
    restaurantID = 2
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Dining_Name, Dining_Description FROM `BB_Dining` WHERE BB_DiningID = %s"
            cursor.execute(sql, (restaurantID,))
            info = cursor.fetchone()
            restaurantInfo = {"name": info[0], "description": info[1]}
    finally:
        db_connection.close()
    return jsonify(restaurantInfo)

sub_menus = [
    {
        "name": "Starters",
        "items": [
            {"name": "Soup of the day", "price": "$5"},
            {"name": "Bruschetta", "price": "$7"},
            # Add other starters
        ],
    },
{
        "name": "Starters",
        "items": [
            {"name": "Soup of the day", "price": "$5"},
            {"name": "Bruschetta", "price": "$7"},
            # Add other starters
        ],
    },
    # Add other categories
]

@app.route('/api/menu', methods=['GET'])
def get_menu():
    '''
    restaurantID = 2
    db_connection = dbConnect()
    try:
        with db_connection.cursor() as cursor:
            sql = "SELECT Menu_Heading, Menu_Subheading, Menu_Item FROM `BB_Menu` WHERE BB_DiningID = %s"
            cursor.execute(sql, (restaurantID,))
            info = cursor.fetchall()
            #sub_menus2 = []
            breakfast, lunch, dinner, extended = [], [],[],[]
            for row in info:
                if row[0] == 'Breakfast':
                    for

                #sub_menus2.append


    finally:
        db_connection.close()
    '''

    return jsonify(sub_menus)

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
    return jsonify(reviewData)

@app.route('/api/restaurantImages', methods=['GET'])
def getRestaurantImages():
    return jsonify(restaurantImages)
@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    print(email)
    print(password)
    if email and password:
        return jsonify({'message': 'Login successful', 'status': 'success'}), 200
    else:
        return jsonify({'message': 'Missing credentials', 'status': 'error'}), 400

@app.route('/api/signup', methods=['POST'])
def signup():
    data = request.get_json()
    FirstName = data.get('firstName')
    LastName = data.get('lastName')
    Email = data.get('email')
    Password = data.get('password')
    print(Email)
    print(Password)
    print (FirstName)
    print (LastName)
    # For this example, let's just return a success message
    return jsonify({'message': 'Sign up successful', 'status': 'success'}), 201


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def catch_all(path):
    if path.startswith("api/"):
        # If the path starts with api/, return a 404 error or similar
        # since this route should be caught by one of the above API route handlers
        return "Not Found", 404
    return send_from_directory(app.static_folder, 'index.html')


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

