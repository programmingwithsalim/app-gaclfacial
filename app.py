from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS

from config import Config
from routes import register_routes
from models import db

app = Flask(__name__)
app.config.from_object(Config)

db.init_app(app)
migrate = Migrate(app, db)
CORS(app)

register_routes(app)


if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
