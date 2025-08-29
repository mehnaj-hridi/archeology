from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text
import config

# Initialize Flask app
app = Flask(__name__)
app.config.from_object(config)

# Enable CORS
CORS(app)

# Initialize DB
db = SQLAlchemy(app)

# Home route
@app.route('/')
def home():
    return "Welcome to Archeology API 🚀"

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

if __name__ == '__main__':
    app.run(debug=True)
