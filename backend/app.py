from flask import Flask, request, jsonify
import mysql.connector
from config import db_config
from flask_cors import CORS
from flask_wtf.csrf import CSRFProtect

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}}, methods=["GET", "POST", "OPTIONS"])
app.config['SECRET_KEY'] = 'your-secret-key'  # Necessary for CSRF protection
csrf = CSRFProtect(app)


@app.route('/api/register', methods=['POST'])
@csrf.exempt
def register():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({"error": "Username is required"}), 400

    try:
        # Connect to your SingleStore database
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor()
        # Insert the new user into the users table
        sql = "INSERT INTO users (username) VALUES (%s)"
        cursor.execute(sql, (username,))
        conn.commit()
        user_id = cursor.lastrowid  # get the auto-generated user id
    except mysql.connector.Error as err:
        print("Database error:", err)
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    # Return the user_id so the front end can store it and load the profile page
    return jsonify({"user_id": user_id}), 200

@app.route('/api/activities', methods=['GET'])
def get_activities():
    user_id = request.args.get('user_id')
    if not user_id:
        return jsonify({"error": "User ID is required"}), 400

    try:
        conn = mysql.connector.connect(**db_config)
        cursor = conn.cursor(dictionary=True)
        sql = "SELECT * FROM activities WHERE user_id = %s"
        cursor.execute(sql, (user_id,))
        activities = cursor.fetchall()
    except mysql.connector.Error as err:
        print("Database error:", err)
        return jsonify({"error": "Database error occurred"}), 500
    finally:
        if cursor:
            cursor.close()
        if conn:
            conn.close()

    return jsonify(activities), 200

@app.route('/api/recommend', methods=['GET'])
def get_recommendations():
    # For demonstration purposes, return some dummy recommendations.
    return jsonify({"recommendations": ["Picnic", "Movie night", "Dinner"]}), 200

if __name__ == '__main__':
    app.run(debug=True)
