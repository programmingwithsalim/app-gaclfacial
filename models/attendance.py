from . import db

class Attendance(db.Model):
    __tablename__ = 'attendance'

    id = db.Column(db.Integer, primary_key=True)
    staff_id = db.Column(db.Integer, db.ForeignKey('staff.id'), nullable=False)
    clock_in = db.Column(db.Time, nullable=False)
    clock_out = db.Column(db.Time, nullable=True)
    date = db.Column(db.Date, nullable=False)

    staff = db.relationship('Staff', backref='attendances')

    def __repr__(self):
        return f'<Attendance {self.staff.full_name} on {self.date}>'
