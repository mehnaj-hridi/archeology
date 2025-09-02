from flask import Flask, send_from_directory, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text
import config
import os

# Initialize Flask app
app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
app.config.from_object(config)

# Enable CORS
CORS(app)

# Initialize DB
db = SQLAlchemy(app)

# Serve React App
@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

# Serve static files (CSS, JS, images)
@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# Test DB route
@app.route('/test-db')
def test_db():
    try:
        result = db.session.execute(text("SELECT 1")).scalar()
        if result == 1:
            return "Database connected!"
        else:
            return "Database test failed!"
    except Exception as e:
        return f"Database connection failed: {e}"

# Donate route
@app.route('/donate', methods=['POST'])
def donate():
    data = request.json
    try:
        sql = """
        INSERT INTO donations 
        (first_name, last_name, email, message,donation_type, amount) 
        VALUES (:first_name, :last_name, :email, :message, :donation_type, :amount)
        """
        db.session.execute(text(sql), {
            'first_name': data.get('first_name'),
            'last_name': data.get('last_name'),
            'email': data.get('email'),
            'message': data.get('message'),
            'donation_type': data.get('donation_type'),
            'amount': data.get('amount')
        })
        db.session.commit()
        return jsonify({"status": "success", "message": "Donation recorded!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": f"Failed to record donation: {e}"}), 500

if __name__ == '__main__':
    app.run(debug=True)
