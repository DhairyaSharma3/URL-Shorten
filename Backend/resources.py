from flask import request
from flask_restful import Resource
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, get_jwt
from models import db, User

class UserRegistration(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']

        if not username or not password:
            return {'message': 'missing username or password'}, 400
        if User.query.filter_by(username=username).first():
            return {'message': 'Username already taken'}, 400
        
        new_user = User(username=username)
        new_user.set_password(password)
        db.session.add(new_user)
        db.session.commit()
        return {'message': 'User created successfully'}, 200
    
class UserLogin(Resource):
    def post(self):
        data = request.get_json()
        username = data['username']
        password = data['password']
        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            access_token = create_access_token(identity=user.id, additional_claims={'username': user.username})
            return {'access_token': access_token}, 200
        
        return {'message': 'Invalid username or password'}, 401

class ProtectedResource(Resource):
    @jwt_required()
    def get(self):
        current_user_id = get_jwt_identity()
        claims = get_jwt()
        username = claims['username'] if 'username' in claims else 'Unknown'
        return {'message': f'hello user {current_user_id} ({username}), you accessed the protected resource'}, 200