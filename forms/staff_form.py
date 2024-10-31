from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SubmitField, SelectField, FileField
from wtforms.validators import DataRequired, Optional, Email, Length

class StaffForm(FlaskForm):
    full_name = StringField('Full Name', validators=[DataRequired(), Length(min=2, max=150)])
    staff_id = StringField('Staff ID', validators=[DataRequired(), Length(min=2, max=50)])
    gender = SelectField('Gender', choices=[('Male', 'Male'), ('Female', 'Female'), ('Other', 'Other')], validators=[DataRequired()])

    email = StringField('Email', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[Optional(), Length(min=6)])
    phone = StringField('Phone', validators=[DataRequired(), Length(min=10, max=10)])
    
    status = SelectField('Status', choices=[('active', 'Active'), ('inactive', 'Inactive')], validators=[DataRequired()])
    staff_type = SelectField('Staff Type', choices=[('Regular Staff', 'Regular Staff'), ('NSP', 'National Service Personnel')], validators=[DataRequired()])
    face_image = FileField('Upload Image', validators=[DataRequired()])
    
    submit = SubmitField('Submit')
