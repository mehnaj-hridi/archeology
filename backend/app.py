from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import text   # <-- add this import
from config import Config

app = Flask(__name__)
app.config.from_object(Config)
db = SQLAlchemy(app)

@app.route('/')
def home():
    return "Welcome to the Archeology API. Go to /test-db to check DB connection."

@app.route('/test-db')
def test_db():
    try:
        # wrap SQL in text()
        with db.engine.connect() as connection:
            connection.execute(text("SELECT 1"))
        return "Database connected!"
    except Exception as e:
        return f"Database connection failed: {str(e)}"

if __name__ == "__main__":
    app.run(debug=True)
