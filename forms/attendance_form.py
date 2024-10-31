from flask_wtf import FlaskForm
from wtforms import StringField, TimeField, DateField, HiddenField, SubmitField, SelectField
from wtforms.validators import DataRequired

class AttendanceForm(FlaskForm):
    hidden_tag = HiddenField()
    staff_id = SelectField('Staff', coerce=int, validators=[DataRequired()])  # Change here
    clock_in = TimeField('Clock In', format='%H:%M', validators=[DataRequired()])
    clock_out = TimeField('Clock Out', format='%H:%M')
    date = DateField('Date', format='%Y-%m-%d', validators=[DataRequired()])
    submit = SubmitField("Submit")