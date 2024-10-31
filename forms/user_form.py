from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, SelectField, SubmitField
from wtforms.validators import DataRequired, Optional

class UserForm(FlaskForm):
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Optional()]) 
    role = SelectField('Role', choices=[('admin', 'Admin'), ('staff', 'Staff')], validators=[DataRequired()])
    
    submit = SubmitField('Submit')
