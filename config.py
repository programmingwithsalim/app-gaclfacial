import os

class Config:
    SECRET_KEY = "@Cybergho$t`"
    SQLALCHEMY_DATABASE_URI = 'mysql+pymysql://root@localhost/gaclattendance'
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # Flask-WTF CSRF settings
    WTF_CSRF_ENABLED = True
    WTF_CSRF_SECRET_KEY = os.environ.get('WTF_CSRF_SECRET_KEY', "@Cybergho$t`")

    # File upload settings
    MAX_CONTENT_LENGTH = 16 * 1024 * 1024
