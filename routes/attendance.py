from flask import Blueprint, render_template, redirect, url_for, session, flash
from models.attendance import db, Attendance
from models.staff import Staff
from forms.attendance_form import AttendanceForm
from .auth import login_required

attendance_bp = Blueprint('attendance', __name__)

@attendance_bp.route('/attendance', methods=['GET', 'POST'])
@login_required
def attendance():
    form = AttendanceForm()
    attendance_list = Attendance.query.all()

    form.staff_id.choices = [(staff.id, staff.full_name) for staff in Staff.query.all()]

    if session['user_role'] != 'admin':
        flash('You are not authorized to add this record.', 'danger')
        return redirect(url_for('attendance.attendance'))

    if form.validate_on_submit():
        try:
            staff_id = form.staff_id.data
            if not Staff.query.filter_by(id=staff_id).first():
                flash('Staff ID not valid!', 'danger')
                return redirect(url_for('attendance.attendance'))

            clock_in = form.clock_in.data
            clock_out = form.clock_out.data
            date = form.date.data

            print(staff_id, clock_in, clock_out, date)

            new_attendance = Attendance(staff_id=staff_id, clock_in=clock_in, clock_out=clock_out, date=date)
            db.session.add(new_attendance)
            db.session.commit()
            flash('Attendance record added successfully', 'success')
            return redirect(url_for('attendance.attendance'))
        except Exception as e:
            db.session.rollback()
            flash(f'Error adding attendance record: {str(e)}', 'danger')
    else:
        print(form.errors) 
    return render_template('attendance.html', form=form, attendance=attendance_list)

@attendance_bp.route('/attendance/edit/<int:attendance_id>', methods=['GET', 'POST'])
@login_required
def edit_attendance(attendance_id):
    attendance = Attendance.query.get_or_404(attendance_id)
    form = AttendanceForm(obj=attendance)

    if form.validate_on_submit():
        if session['user_role'] != 'admin':
            flash('You are not authorized to edit this record.', 'danger')
            return redirect(url_for('attendance.attendance'))

        attendance.clock_in = form['clock_in']
        attendance.clock_out = form['clock_out']
        attendance.date = form['date']

        try:
            db.session.commit()
            flash('Attendance record updated successfully!', 'success')
            return redirect(url_for('attendance.attendance'))
        except Exception as e:
            db.session.rollback()
            flash('Error updating attendance record: {}'.format(str(e)), 'danger')

    return render_template('edit_attendance.html', attendance=attendance, form=form)

@attendance_bp.route('/delete_attendance/<int:attendance_id>', methods=['POST'])
@login_required
def delete_attendance(attendance_id):
    try:
        attendance = Attendance.query.get_or_404(attendance_id)

        if session['user_role'] != 'admin':
            flash('You are not authorized to delete this record.', 'danger')
            return redirect(url_for('attendance.attendance'))

        db.session.delete(attendance)
        db.session.commit()
        flash('Attendance record deleted successfully', 'success')
    except Exception as e:
        db.session.rollback()
        flash('Error deleting attendance: {}'.format(str(e)), 'danger')
    return redirect(url_for('attendance.attendance'))
