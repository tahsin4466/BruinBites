from flask import Flask, send_from_directory, jsonify, request
from flask_cors import CORS

app = Flask(__name__, static_folder='client/build', static_url_path='')
CORS(app)

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

restaurantInfo = {
    "name": "Bruin Plate",
    "description": "Dining venue at UCLA emphasizing health-oriented dishes made with local & sustainable ingredients"
}

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

restaurant_hours = {
    "Breakfast": {"start": "08:00", "end": "11:00"},
    "Lunch": {"start": "12:00", "end": "14:00"},
    "Dinner": {"start": "18:00", "end": "21:00"},
    "Extended": {"start": "22:00", "end": "24:00"},
}

@app.route('/api/restaurantInfo', methods=['GET'])
def get_restaurantInfo():
    return jsonify(restaurantInfo)

@app.route('/api/menu', methods=['GET'])
def get_menu():
    return jsonify(sub_menus)

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
    data = request.json
    username = data.get('username')
    password = data.get('password')
    # Implement authentication logic here
    if username == 'valid_username' and password == 'valid_password':
        return jsonify({'message': 'Login successful'})
    else:
        return jsonify({'message': 'Invalid credentials'}), 401


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

