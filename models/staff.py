from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from sqlalchemy.dialects.postgresql import JSON
from sqlalchemy import Enum

class Staff(db.Model):
    __tablename__ = 'staff'

    id = db.Column(db.Integer, primary_key=True)
    full_name = db.Column(db.String(150), nullable=False)
    staff_id = db.Column(db.String(50), unique=True, nullable=False)
    gender = db.Column(Enum('Male', 'Female', 'Other', name='gender_enum'), nullable=False)

    email = db.Column(db.String(150), unique=True, nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    phone = db.Column(db.String(20), nullable=False)

    status = db.Column(db.String(10), nullable=False)
    staff_type = db.Column(db.String(50), nullable=False)
    face_descriptor = db.Column(JSON, nullable=False)

    @property
    def password(self):
        raise AttributeError("Password is not accessible")

    @password.setter
    def password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f'<Staff {self.full_name}>'