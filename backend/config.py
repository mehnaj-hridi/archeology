import os

# MariaDB/MySQL connection details
DB_USER = "arch_user"
DB_PASSWORD = "Arch1234!"
DB_HOST = "localhost"
DB_NAME = "archeo_db"

# Flask SQLAlchemy configuration
SQLALCHEMY_DATABASE_URI = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}"
SQLALCHEMY_TRACK_MODIFICATIONS = False
