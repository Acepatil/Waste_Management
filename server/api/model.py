from api import db

class OTP(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(20),nullable=False)
    otp=db.Column(db.Integer,nullable=False)

    def __repr__(self) -> str:
        return f"{self.username}-> {self.otp}"
    
class Admin(db.Model):
    username = db.Column(db.String(20), primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(150), nullable=False)

    def __repr__(self) -> str:
        return f"{self.username}->{self.email}"
    
class AdminPending(db.Model):
    username = db.Column(db.String(20), primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(60), nullable=False)
    reason=db.Column(db.String(150),nullable=False)

    def __repr__(self) -> str:
        return f"{self.username}->{self.email}"

class User(db.Model):
    username = db.Column(db.String(20), primary_key=True)
    email = db.Column(db.String(50), nullable=False)
    password = db.Column(db.String(150), nullable=False)
    complaints = db.relationship('Complaint', backref='user', lazy=True)

    def __repr__(self) -> str:
        return f"{self.username}->{self.email}"

class Complaint(db.Model):
    task_id = db.Column(db.Integer, primary_key=True)
    lat = db.Column(db.Float, nullable=False)
    lng = db.Column(db.Float, nullable=False)
    image_name = db.Column(db.String(60), nullable=False)
    description = db.Column(db.String(200), nullable=False)
    image_file = db.Column(db.LargeBinary, nullable=False)
    username = db.Column(db.String(20), db.ForeignKey('user.username'), nullable=False)
    status=db.Column(db.String(20),nullable=False)
    predicted_class = db.Column(db.String(50))
    confidence = db.Column(db.Float)

    def __repr__(self) -> str:
        return f"{self.image_name}->{self.username}"
