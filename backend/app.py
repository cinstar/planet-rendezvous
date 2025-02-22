from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///dateideas.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# ----------------------
# Database Models
# ----------------------
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    # Additional fields (password, email) could be added

class Activity(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    name = db.Column(db.String(120), nullable=False)
    description = db.Column(db.String(500))
    timeframe = db.Column(db.String(50))
    mood = db.Column(db.String(50))
    weather = db.Column(db.String(50))
    category = db.Column(db.String(50))
    # Storing vector as a pickled numpy array (for simplicity)
    vector = db.Column(db.PickleType)

    user = db.relationship('User', backref=db.backref('activities', lazy=True))

# ----------------------
# Utility Functions
# ----------------------
def vectorize_activity(name, description, timeframe, mood, weather, category):
    """
    Dummy vectorization function.
    Replace with a transformer model for production use.
    """
    np.random.seed(hash(name) % 2**32)
    return np.random.rand(300)  # 300-dimensional vector

# ----------------------
# API Endpoints
# ----------------------

# Register a new user
@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({'error': 'Username required'}), 400

    user = User(username=username)
    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User registered', 'user_id': user.id}), 201

# Add a new activity (date idea)
@app.route('/api/activities', methods=['POST'])
def add_activity():
    data = request.get_json()
    user_id = data.get('user_id')
    name = data.get('name')
    description = data.get('description', '')
    timeframe = data.get('timeframe', '')
    mood = data.get('mood', '')
    weather = data.get('weather', '')
    category = data.get('category', '')

    if not user_id or not name:
        return jsonify({'error': 'User ID and activity name required'}), 400

    vector = vectorize_activity(name, description, timeframe, mood, weather, category)
    activity = Activity(user_id=user_id, name=name, description=description,
                        timeframe=timeframe, mood=mood, weather=weather,
                        category=category, vector=vector)
    db.session.add(activity)
    db.session.commit()
    return jsonify({'message': 'Activity added', 'activity_id': activity.id}), 201

# Retrieve all activities for a given user
@app.route('/api/activities', methods=['GET'])
def get_activities():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({'error': 'User ID required'}), 400

    activities = Activity.query.filter_by(user_id=user_id).all()
    result = []
    for activity in activities:
        result.append({
            'id': activity.id,
            'name': activity.name,
            'description': activity.description,
            'timeframe': activity.timeframe,
            'mood': activity.mood,
            'weather': activity.weather,
            'category': activity.category
        })
    return jsonify(result), 200

# Recommend similar activities based on a selected activity
@app.route('/api/recommend', methods=['GET'])
def recommend():
    user_id = request.args.get('user_id')
    activity_id = request.args.get('activity_id')
    if not user_id or not activity_id:
        return jsonify({'error': 'User ID and activity ID required'}), 400

    base_activity = Activity.query.filter_by(id=activity_id, user_id=user_id).first()
    if not base_activity:
        return jsonify({'error': 'Activity not found'}), 404

    activities = Activity.query.filter_by(user_id=user_id).all()
    base_vector = base_activity.vector.reshape(1, -1)
    similarity_scores = []
    for activity in activities:
        if activity.id == base_activity.id:
            continue
        sim = cosine_similarity(base_vector, activity.vector.reshape(1, -1))[0][0]
        similarity_scores.append((activity, sim))
    
    similarity_scores.sort(key=lambda x: x[1], reverse=True)
    recommendations = [{
        'id': activity.id,
        'name': activity.name,
        'description': activity.description,
        'timeframe': activity.timeframe,
        'mood': activity.mood,
        'weather': activity.weather,
        'category': activity.category,
        'similarity': score
    } for activity, score in similarity_scores]

    return jsonify(recommendations), 200

# ----------------------
# Run the App
# ----------------------
if __name__ == '__main__':
    db.create_all()  # Create tables if they don't exist
    app.run(debug=True)
