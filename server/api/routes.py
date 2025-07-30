from api import app,db,bcrypt
from flask import jsonify,request,send_file
from api.models import User,Complaint,OTP,Admin,AdminPending
from api.otp_generation import send_mail
from io import BytesIO
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import timedelta
import random

def create_otp():
    ans=random.randint(10000,99999)
    return ans

@app.route('/create_all_tables')
def create_tables():
    db.create_all()
    return jsonify({"message":"All tables created"})

@app.route('/delete_all_tables')
def delete_tables():
    db.drop_all()
    return jsonify({"message":"All tables deleted"})

@app.route('/all_users')
def get_users():
    users=User.query.all()
    users_list = [{ "username": user.username, "email": user.email,"password":user.password} for user in users]
    return jsonify(users_list),200

@app.route('/all_complaints')
def get_complaints():
    complaints=Complaint.query.all()
    complaints_list = [{"task_id": complaint.task_id, "description": complaint.description,"username":complaint.username,"status":complaint.status} for complaint in complaints]
    return jsonify(complaints_list),200

def authenticate(username, password):
    user = User.query.filter_by(username=username).first()
    if user and bcrypt.check_password_hash(user.password,password):  # Add proper password hashing in a real app
        return user
    return None

@app.route("/admin")
def admin():
    hashed_password=bcrypt.generate_password_hash("secret").decode("utf-8")
    admin=Admin(username="Ace",email="sasuke410206@gmail.com",password=hashed_password)
    user=User(username="Ace",email="sasuke410206@gmail.com",password=hashed_password)
    db.session.add(admin)
    db.session.add(user)
    db.session.commit()
    return jsonify({"message":"Created the general admin and user"})

@app.route('/register', methods=['POST'])
def register():
    email=request.json.get('email',None)
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not email:
        return jsonify({"message":"Give a proper email"}),400
    if not username:
        return jsonify({"message":"Give proper username"}),400
    if not password:
        return jsonify({"message":"Give proper password"}),400
    user=User.query.filter_by(username=username).first()
    if user:
        return jsonify({"message":"The username already exists"}),400
    user=User.query.filter_by(email=email).first()
    if user:
        return jsonify({"message":"The email already exists"}),400
    otp=send_mail(email=email)
    otp_user=OTP(username=username,otp=otp)
    db.session.add(otp_user)
    db.session.commit()
    return jsonify({'message': 'OTP successfully send'}), 200

@app.route('/register/admin', methods=['POST'])
def registerasadmin():
    email=request.json.get('email',None)
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    reason=request.json.get('reason',None)
    if not email:
        return jsonify({"message":"Give a proper email"}),400
    if not username:
        return jsonify({"message":"Give proper username"}),400
    if not password:
        return jsonify({"message":"Give proper password"}),400
    if not reason:
        return jsonify({"message":"Give proper reason"}),400
    existing_admin = Admin.query.filter_by(username=username).first()
    if existing_admin:
        return jsonify({"message": "Already an Admin"}), 400
    user=AdminPending.query.filter_by(username=username).first()
    if user:
        return jsonify({"message":"The username already exists"}),400
    user=AdminPending.query.filter_by(email=email).first()
    if user:
        return jsonify({"message":"The email already exists"}),400
    hashed_password=bcrypt.generate_password_hash(password).decode("utf-8")
    admin_trial=AdminPending(username=username,email=email,password=hashed_password,reason=reason)

    db.session.add(admin_trial)
    db.session.commit()
    return jsonify({'message': 'Request successfully send'}), 200

@app.route("/validate",methods=["POST"])
def otp_validate():
    otp=request.json.get("otp")
    username=request.json.get("username")
    email=request.json.get("email")
    password=request.json.get("password")
    hashed_password=bcrypt.generate_password_hash(password).decode('utf-8')
    user=OTP.query.filter_by(username=username).first()
    if not user:
        return jsonify({"message":"First Register the username"}),400
    otp=OTP.query.filter_by(username=username ,otp=otp).first()
    if not otp:
        return jsonify({"message":"Wrong OTP"}),400
    user=User(username=username,email=email,password=hashed_password)

    db.session.add(user)
    db.session.commit()
    return jsonify({'message': 'User successfully uploaded'}), 200

@app.route("/validate/admin", methods=["POST"])
def validateadmin():
    username = request.json.get("username")
    pending_user = AdminPending.query.filter_by(username=username).first()
    if not pending_user:
        return jsonify({"message": "First Register the username"}), 400

    email = pending_user.email
    hashed_password = pending_user.password
    admin = Admin(username=username, email=email, password=hashed_password)
    send_mail(email=email,is_admin=True)
    # Start a transaction
    try:
        db.session.add(admin)
        db.session.delete(pending_user)
        db.session.commit()
    except Exception as e:
        db.session.rollback()
        return jsonify({"message": "An error occurred while validating admin: " + str(e)}), 500

    return jsonify({'message': 'Admin successfully uploaded'}), 200



@app.route('/login', methods=['POST'])
def login():
    username = request.json.get('username', None)
    password = request.json.get('password', None)
    if not username:
        return jsonify({"message":"Give proper username"}),400
    if not password:
        return jsonify({"message":"Give proper password"}),400
    user = authenticate(username, password)
    if user:
        access_token = create_access_token(expires_delta=timedelta(days=1),identity=user.username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Bad username or password"}), 401

@app.route('/protected', methods=['GET'])
@jwt_required()
def protected():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        return jsonify(logged_in_as=user.username), 200
    else:
        return jsonify({"msg": "User not found"}), 404

@app.route('/image/<int:complaint_id>', methods=['GET'])
def get_image(complaint_id):
    complaint = Complaint.query.get(complaint_id)
    if complaint and complaint.image_file:
        return send_file(
            BytesIO(complaint.image_file),
            mimetype='image/jpeg'  # Adjust the mimetype as needed
        )
    return jsonify({'error': 'Image not found'}), 404

@app.route("/get_all_images",methods=["GET"])
def get_all_images():
    complaints = Complaint.query.all()
    if not complaints:
        return jsonify({'message': 'No complaints found'}), 203

    complaints_list = []
    for complaint in complaints:
        complaint_data = {
            "lat": complaint.lat,
            "lng": complaint.lng,
            "task_id": complaint.task_id,
            "description": complaint.description,
            "username": complaint.username,
            "status": complaint.status,
            "photo_url":None
        }

        # Use URL for the image
        if complaint.image_file:
            image_url = f"http://localhost:8080/image/{complaint.task_id}"  # Adjust the URL as needed
            complaint_data["photo_url"] = image_url
        else:
            complaint_data["photo_url"] = None

        complaints_list.append(complaint_data)

    return jsonify(complaints_list)

@app.route("/get_requests")
def get_requests():
    requests=AdminPending.query.all()

    if not requests:
        return jsonify({'message': 'No requests found'}), 203
    request_list=[]

    for request in requests:
        complaint_data = {
            "username":request.username,
            "reason":request.reason
        }
        request_list.append(complaint_data)

    return jsonify(request_list)

@app.route("/updatecomp", methods=['POST'])
def updatecomp():
    id = request.json.get("id", None)
    if not id:
        return jsonify({"message": "There is no id"}), 203  # 400 is a better status code for bad requests

    complaint = Complaint.query.filter_by(task_id=id).first()
    if not complaint:
        return jsonify({"message": "There is no complaint with this id"}), 203  # 404 is a better status code for not found

    complaint.status = 'pending' if complaint.status == 'completed' else 'completed'
    db.session.commit()
    return jsonify({"message": f"Complaint status updated to {complaint.status}"}), 200

@app.route("/get_all_images/pend",methods=["GET"])
def get_all_images_pen():
    complaints = Complaint.query.filter_by(status="pending").all()
    if not complaints:
        return jsonify({'message': 'No complaints found'}), 203

    complaints_list = []
    for complaint in complaints:
        complaint_data = {
            "lat": complaint.lat,
            "lng": complaint.lng,
            "task_id": complaint.task_id,
            "description": complaint.description,
            "username": complaint.username,
            "status": complaint.status
        }

        # Use URL for the image
        if complaint.image_file:
            image_url = f"http://localhost:8080/image/{complaint.task_id}"  # Adjust the URL as needed
            complaint_data["photo_url"] = image_url
        else:
            complaint_data["photo_url"] = None

        complaints_list.append(complaint_data)

    return jsonify(complaints_list)


@app.route("/get_all_images/comp",methods=["GET"])
def get_all_images_comp():
    complaints = Complaint.query.filter_by(status="completed").all() 

    if (len(complaints)==0):
        return jsonify({'message': 'No complaints found'}), 203

    complaints_list = []
    for complaint in complaints:
        complaint_data = {
            "lat": complaint.lat,
            "lng": complaint.lng,
            "task_id": complaint.task_id,
            "description": complaint.description,
            "username": complaint.username,
            "status": complaint.status
        }

        # Use URL for the image
        if complaint.image_file:
            image_url = f"http://localhost:8080/image/{complaint.task_id}"  # Adjust the URL as needed
            complaint_data["photo_url"] = image_url
        else:
            complaint_data["photo_url"] = None

        complaints_list.append(complaint_data)

    return jsonify(complaints_list),200

@app.route("/add_complaint", methods=["POST"])
def upload():
    file = request.files.get('file')
    description = request.form.get('description')
    lat = request.form.get('lat')
    lng = request.form.get('lng')
    username=request.form.get('username')
    status=request.form.get('status')

    if not file:
        return jsonify({'error': 'No selected file'}), 400
    if not description:
        return jsonify({'error': 'No description of complaint'}), 400
    if not lat or not lng:
        return jsonify({'error': 'No defined location from your device'}), 400
    if not username:
        return jsonify({'error': 'No username. Log in first'}), 400
    
    user = User.query.filter_by(username=username).first()
    if not user:
        return jsonify({'error': 'User not found'}), 404

    new_complaint = Complaint(
        image_name=file.filename,
        image_file=file.read(),
        description=description,
        lat=lat,
        lng=lng,
        username=username,
        status=status
    )
    
    db.session.add(new_complaint)
    db.session.commit()

    return jsonify({'message': 'File successfully uploaded'}), 200
