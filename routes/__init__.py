from .auth import auth_bp
from .attendance import attendance_bp
from .staff import staff_bp
from .user import user_bp
from .dashboard import dashboard_bp

def register_routes(app):
    app.register_blueprint(auth_bp)
    app.register_blueprint(attendance_bp)
    app.register_blueprint(staff_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(dashboard_bp)
