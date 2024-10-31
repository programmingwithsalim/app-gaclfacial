from flask import Blueprint, render_template, redirect, url_for, request, session, flash, jsonify
from models.user import User
from models.attendance import Attendance
from models.staff import Staff
from models import db
from functools import wraps

auth_bp = Blueprint('auth', __name__)


def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            flash('You need to log in first!', 'warning')
            return redirect(url_for('auth.login'))
        return f(*args, **kwargs)
    return decorated_function

# Login route
@auth_bp.route('/login', methods=['GET', 'POST'])
def login():
    if "user_id" in session:
        return redirect(url_for('dashboard.dashboard'))

    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()
        print(user)

        if user and user.verify_password(password):
            session['user_id'] = user.id
            session['user_role'] = user.role
            return redirect(url_for('dashboard.dashboard'))

        flash('Login Failed. Check username and password', 'danger')

    return render_template('login.html')

@auth_bp.route('/auth/login', methods=['POST'])
def app_login():
    data = request.get_json()
    staff_id = data.get('staff_id')
    password = data.get('password')

    if not staff_id or not password:
        return jsonify({"error": "Staff ID and password are required"}), 400

    staff = Staff.query.filter_by(staff_id=staff_id).first()

    if staff:
        if staff.status != 'active':
            return jsonify({"error": "Staff is inactive"}), 403
        
        if staff.check_password(password):
            session['user_id'] = staff.id

            staff_data = {
                "id": staff.id,
                "full_name": staff.full_name,
                "staff_id": staff.staff_id,
                "staff_type": staff.staff_type
            }

            return jsonify({"token": "fake-jwt-token-for-demo", "staff": staff_data})
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    else:
        return jsonify({"error": "Invalid credentials"}), 401

# Logout route
@auth_bp.route('/logout')
@login_required
def logout():
    session.pop('user_id', None)
    flash('You have been logged out successfully', 'success')
    return redirect(url_for('auth.login'))


import face_recognition
import numpy as np
import base64
import io

THRESHOLD = 0.6

def compare_faces(face_encodings, face_to_compare):
    face_encodings = np.array(face_encodings, dtype=np.float64)
    face_to_compare = np.array(face_to_compare, dtype=np.float64)
    
    return np.linalg.norm(face_encodings - face_to_compare)

@auth_bp.route('/auth/verify', methods=['POST'])
def verify_face():
    incoming_image = request.form.get('incoming_descriptor')
    staff_id = request.form.get('staff_id')

    if not incoming_image:
        return jsonify({"message": "No face image provided"}), 400

    try:
        header, encoded = incoming_image.split(',', 1) 
        face_image = base64.b64decode(encoded)

        image = face_recognition.load_image_file(io.BytesIO(face_image))
        face_encodings = face_recognition.face_encodings(image)

        if len(face_encodings) == 0:
            return jsonify({"message": "No face detected in the image"}), 400

        incoming_descriptor = face_encodings[0].tolist()

    except Exception as e:
        return jsonify({"message": f"Error processing image: {str(e)}"}), 400

    staff = Staff.query.filter_by(staff_id=staff_id).first()
    if not staff:
        return jsonify({"message": "Staff not found"}), 404

    stored_descriptor = np.array(staff.face_descriptor, dtype=np.float64)
    distance = compare_faces(incoming_descriptor, stored_descriptor)

    if distance < THRESHOLD:

        staff_data = {
            "id": staff.id,
            "name": staff.full_name,
            "staff_id": staff.staff_id
        }

        return jsonify({ "message": "Face recognized", "staff": staff_data }), 200

    return jsonify({"message": "Face not recognized"}), 404

@auth_bp.route('/auth/attendance', methods=['POST'])
def take_attendance():
    try:
        data = request.get_json()
        staff_id = data.get('staff_id')
        clock_in = data.get('clock_in')
        date = data.get('date')

        if not all([staff_id, clock_in, date]):
            return jsonify({"message": "Staff ID, clock in time, and date are required."}), 400

        staff = Staff.query.filter_by(staff_id=staff_id).first()
        
        if not staff:
            return jsonify({"message": "Staff not found."}), 404

        existing_record = Attendance.query.filter_by(staff_id=staff_id, date=date).first()


        def attendance_to_dict(attendance):
            return {
                "attendance_id": attendance.id,
                "staff_id": attendance.staff_id,
                "clock_in": attendance.clock_in.strftime('%H:%M:%S') if attendance.clock_in else None,
                "clock_out": attendance.clock_out.strftime('%H:%M:%S') if attendance.clock_out else None,
                "date": attendance.date.isoformat()
            }
        
        if existing_record:
            return jsonify({ "message": "Attendance record already exists for this date.", "attendance": attendance_to_dict(existing_record) }), 400

        new_attendance = Attendance(staff_id=staff_id, clock_in=clock_in, clock_out=None, date=date)
        db.session.add(new_attendance)
        db.session.commit()

        return jsonify({"message": "Attendance record added successfully.", "attendance_id": new_attendance.id}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": f"Error adding attendance record: {str(e)}"}), 500

@auth_bp.route('/auth/attendance/<int:attendance_id>', methods=['PUT'])
def edit_attendance(attendance_id):
    try:
        data = request.get_json()
        clock_out = data.get('clock_out')

        if not clock_out:
            return jsonify({"error": "Clock out time is required."}), 400

        attendance_record = Attendance.query.filter_by(id=attendance_id).first()

        if not attendance_record:
            return jsonify({"error": "Attendance record not found."}), 404

        attendance_record.clock_out = clock_out
        db.session.commit()

        return jsonify({"message": "Attendance record updated successfully."}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": f"Error updating attendance record: {str(e)}"}), 500
