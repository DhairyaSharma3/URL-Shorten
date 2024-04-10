from flask_cors import CORS
from flask import Flask, render_template, request, redirect, url_for, jsonify, redirect
from flask_restful import Api
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from models import db, User, ShortenedURL
from resources import ProtectedResource
from datetime import timedelta

app = Flask(__name__)
cors = CORS(app)
app.config['SECRET_KEY'] = 'SUPER-SECRET-KEY'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['JWT_EXPIRATION_DELTA'] = timedelta(days=1)

db.init_app(app)
api = Api(app)
jwt = JWTManager(app)

# Call db.create_all() to create the necessary tables
with app.app_context():
    db.create_all()

# Route to render the single-page interface
@app.route('/', methods=['GET'])
def index():
    return 'index.html'

@app.route('/login', methods=['POST'])
def login():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        return jsonify(access_token=access_token), 200  # Status code 200 for success
    else:
        return jsonify(message="Invalid username or password. Please try again."), 401  # Status code 401 for unauthorized

from flask import jsonify

@app.route('/register', methods=['POST'])
def register():
    username = request.json['username']
    password = request.json['password']
    user = User.query.filter_by(username=username).first()

    if user:
        return jsonify(message="Username already taken. Please choose a different username."), 409  # Status code 409 for conflict

    new_user = User(username=username)
    new_user.set_password(password)
    db.session.add(new_user)
    db.session.commit()
    return jsonify(message="User registered successfully!"), 201  # Status code 201 for created


# Protected endpoint
@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    return jsonify(message=f"Hello, user {current_user_id}. You have accessed the protected resource."), 200  # Status code 200 for OK


# Route to handle URL shortening requests
@app.route('/shorten', methods=['POST'])
@jwt_required()  # You might want to secure this endpoint
def shorten_url():
    user_id = get_jwt_identity()
    long_url = request.json.get('long_url')
    alias = request.json.get('alias')

    if not long_url:
        return jsonify(message="Long URL is required."), 400  # Status code 400 for Bad Request

    if alias:
        existing_short_url = ShortenedURL.query.filter_by(alias=alias).first()
        if existing_short_url:
            return jsonify(message="Alias is already taken. Please choose a different one."), 400  # Status code 400 for Bad Request

    # short_url = generate_short_url()  # Implement this function to generate short URLs
    base_url = f'http://127.0.0.1:5000/'
    short_url = f"{base_url}{alias}"
    new_shortened_url = ShortenedURL(long_url=long_url, short_url=short_url, alias=alias, user_id=user_id)
    db.session.add(new_shortened_url)
    db.session.commit()

    return jsonify(short_url=short_url), 201  # Status code 201 for Created


# Route to redirect from short aliases to original long URLs
@app.route('/<alias>', methods=['GET'])
def redirect_to_long_url(alias):
    shortened_url = ShortenedURL.query.filter_by(alias=alias).first()
    if shortened_url:
        shortened_url.click_count += 1  # Increment click count
        db.session.commit()
        return redirect(shortened_url.long_url)
    else:
        return jsonify(message="Shortened URL not found."), 404  # Status code 404 for Not Found

@app.route('/urls', methods=['GET'])
@jwt_required()
def get_urls():
    user_id = get_jwt_identity()
    user_urls = ShortenedURL.query.filter_by(user_id=user_id).all()

    urls_data = []
    for url in user_urls:
        urls_data.append({
            'id': url.id,
            'long_url': url.long_url,
            'short_url': url.short_url,
            'click_count': url.click_count,
        })

    return jsonify(urls_data), 200  # Status code 200 for OK

@app.route('/delete/<int:url_id>', methods=['DELETE'])
@jwt_required()
def delete_url(url_id):
    user_id = get_jwt_identity()
    shortened_url = ShortenedURL.query.get(url_id)

    if not shortened_url:
        return jsonify(message="URL not found."), 404  # Status code 404 for Not Found

    if shortened_url.user_id != user_id:
        return jsonify(message="You are not authorized to delete this URL."), 403  # Status code 403 for Forbidden

    db.session.delete(shortened_url)
    db.session.commit()

    return jsonify(message="URL deleted successfully."), 200  # Status code 200 for OK

if __name__ == "__main__":
    app.run(debug=True)
