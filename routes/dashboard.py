from flask import Blueprint, render_template, redirect, url_for, session
from sqlalchemy import func


from .auth import login_required
from models.attendance import Attendance
from models.staff import Staff
from models.user import User 

dashboard_bp = Blueprint('dashboard', __name__)

@dashboard_bp.route('/dashboard')
@login_required
def dashboard():
    total_users = User.query.count()
    active_sessions = len(session)
    pending_approvals = Staff.query.filter_by(status='inactive').count()
    
    total_attendances = Attendance.query.count()
    
    staff_type_totals = Staff.query.with_entities(Staff.staff_type, func.count(Staff.id)).group_by(Staff.staff_type).all()
    
    gender_totals = Staff.query.with_entities(Staff.gender, func.count(Staff.id)).group_by(Staff.gender).all()
    
    admin_users_count = User.query.filter_by(role='admin').count()

    return render_template('dashboard.html', 
                           total_users=total_users, 
                           active_sessions=active_sessions, 
                           pending_approvals=pending_approvals,
                           total_attendances=total_attendances,
                           staff_type_totals=staff_type_totals,
                           gender_totals=gender_totals,
                           admin_users_count=admin_users_count)

@dashboard_bp.route('/')
@login_required
def home():
    if 'user_id' not in session:
        return redirect(url_for("auth.login"))
    return render_template('dashboard.html')
