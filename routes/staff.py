from flask import Blueprint, render_template, redirect, url_for, flash
from models.staff import db, Staff
from forms.staff_form import StaffForm
import face_recognition
import numpy as np

from .auth import login_required

staff_bp = Blueprint('staff', __name__)

# Staff management route
@staff_bp.route('/staff', methods=['GET', 'POST'])
@login_required
def staff():
    form = StaffForm()
    staff_list = Staff.query.all()

    if form.validate_on_submit():
        if Staff.query.filter_by(staff_id=form.staff_id.data).first():
            flash('Staff ID already exists. Please use a different ID.', 'danger')
            return redirect(url_for('staff.staff'))

        face_image = form.face_image.data

        if not face_image:
            flash('Face image is required.', 'danger')
            return redirect(url_for('staff.staff'))

        image = face_recognition.load_image_file(face_image)
        face_encodings = face_recognition.face_encodings(image)

        if len(face_encodings) == 0:
            flash('No face detected in the image. Please upload a valid face image.', 'danger')
            return redirect(url_for('staff.staff'))

        face_descriptor = face_encodings[0].tolist()

        new_staff = Staff(
            staff_id=form.staff_id.data,
            full_name=form.full_name.data,
            gender=form.gender.data,
            email=form.email.data,
            phone=form.phone.data,
            status=form.status.data,
            staff_type=form.staff_type.data,
            face_descriptor=face_descriptor
        )

        new_staff.password = form.password.data

        try:
            db.session.add(new_staff)
            db.session.commit()
            flash('Staff added successfully', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Error adding staff: {str(e)}', 'danger')

        return redirect(url_for('staff.staff'))

    return render_template('staff.html', form=form, staff_list=staff_list)


# Update staff
@staff_bp.route('/edit_staff/<int:id>', methods=['GET', 'POST'])
@login_required
def edit_staff(id):
    staff = Staff.query.get_or_404(id)
    form = StaffForm(obj=staff)

    if form.validate_on_submit():
        if form.staff_id.data != staff.staff_id and Staff.query.filter_by(staff_id=form.staff_id.data).first():
            flash('Staff ID already exists. Please use a different ID.', 'danger')
            return redirect(url_for('staff.edit_staff', id=id))

        staff.full_name = form.full_name.data
        staff.staff_id = form.staff_id.data
        staff.gender = form.gender.data
        staff.email = form.email.data
        staff.phone = form.phone.data
        staff.status = form.status.data
        staff.staff_type = form.staff_type.data

        if form.face_image.data:
            face_image = form.face_image.data
            image = face_recognition.load_image_file(face_image)
            face_encodings = face_recognition.face_encodings(image)

            if len(face_encodings) > 0:
                staff.face_descriptor = face_encodings[0].tolist()
            else:
                flash('No face detected in the image. Face descriptor not updated.', 'warning')

        if form.password.data:
            staff.password = form.password.data

        try:
            db.session.commit()
            flash('Staff updated successfully!', 'success')
        except Exception as e:
            db.session.rollback()
            flash(f'Error updating staff: {str(e)}', 'danger')

        return redirect(url_for('staff.staff'))

    return render_template('edit_staff.html', form=form, staff=staff)



# Delete staff
@staff_bp.route('/staff/delete/<int:id>', methods=['POST'])
@login_required
def delete_staff(id):
    staff = Staff.query.get_or_404(id)
    db.session.delete(staff)
    db.session.commit()
    flash('Staff deleted successfully', 'success')
    return redirect(url_for('staff.staff'))
