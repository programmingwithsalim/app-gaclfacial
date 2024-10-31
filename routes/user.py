from flask import Blueprint, render_template, redirect, url_for, session, flash
from werkzeug.security import generate_password_hash
from models.user import db, User
from forms.user_form import UserForm
from .auth import login_required


user_bp = Blueprint('user', __name__)


@user_bp.route('/users', methods=['GET', 'POST'])
@login_required
def users():
    form = UserForm()
    users_list = User.query.all()

    if session['user_role'] != 'admin':
        flash('You are not authorized to add this record.', 'danger')
        return redirect(url_for('user.users'))

    if form.validate_on_submit():
        username = form.username.data
        role = form.role.data
        password = form.password.data

        if User.query.filter_by(username=username).first():
            flash('Username already exists. Please choose a different one.', 'danger')
        else:

            new_user = User(username=username, role=role)
            new_user.password = password

            db.session.add(new_user)
            db.session.commit()

            flash('User added successfully', 'success')
            return redirect(url_for('user.users'))

    return render_template('users.html', form=form, users=users_list)

# Update user
@user_bp.route('/edit_user/<int:user_id>', methods=['GET', 'POST'])
@login_required
def edit_user(user_id):
    user = User.query.get_or_404(user_id)
    form = UserForm(obj=user)


    if session['user_role'] != 'admin':
        flash('You are not authorized to edit this record.', 'danger')
        return redirect(url_for('user.users'))

    if form.validate_on_submit():
        if form.username.data != user.username and User.query.filter_by(username=form.username.data).first():
            flash('Username already exists. Please choose a different one.', 'danger')
        else:
            user.username = form.username.data
            if form.password.data:
                user.password = form.password.data
            user.role = form.role.data

            try:
                db.session.commit()
                flash('User updated successfully', 'success')
                return redirect(url_for('user.users'))
            except Exception as e:
                db.session.rollback()
                flash(f'Error updating user: {str(e)}', 'danger')

    return render_template('edit_user.html', form=form, user=user)

# Delete user
@user_bp.route('/delete_user/<int:user_id>', methods=['POST'])
@login_required
def delete_user(user_id):

    if session['user_role'] != 'admin':
        flash('You are not authorized to delete this record.', 'danger')
        return redirect(url_for('user.users'))
    try:
        user = User.query.get_or_404(user_id)
        db.session.delete(user)
        db.session.commit()
        flash('User deleted successfully', 'success')
    except Exception as e:
        db.session.rollback()
        flash('Error deleting user: {}'.format(str(e)), 'danger')
    return redirect(url_for('user.users'))
