import os

class Config:
    # Database URI (using MariaDB/MySQL with PyMySQL driver)
    SQLALCHEMY_DATABASE_URI = "mysql+pymysql://arch_user:Arch1234!@localhost/archeo_db"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = os.environ.get("SECRET_KEY") or "supersecretkey"
