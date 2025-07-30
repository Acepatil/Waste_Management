import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import random

def create_otp():
    return random.randint(10000, 99999)

def send_mail(email,is_admin=False):
    smtp_server = "smtp.gmail.com"
    smtp_port = 587  # Use 465 for SSL
    username = "wastewiz.co.op@gmail.com"
    password = "rmmruldcrtkxeijx"
    from_email = "wastewiz.co.op@gmail.com"
    to_email = email

    otp = create_otp()
    msg = MIMEMultipart()
    if is_admin:
        msg['Subject'] = f'Admin Selection Approved'
    else:
        msg['Subject'] = f'OTP Code is {otp}'
    msg['From'] = username
    msg['To'] = to_email


    if is_admin:
        content = f"""
        <html>
        <body>
            <h1>Congratulations on Your Admin Selection!</h1>
            <p>We are pleased to inform you that you have been selected as an admin for the Waste Reporter website. This role involves monitoring and managing the waste reporting services to ensure a cleaner environment.</p>
            <p>Thank you for your dedication to keeping our surroundings clean!</p>
            <p>Best regards,<br/>The Waste Reporter Team</p>
        </body>
        </html>
        """
    else:
        content = f"""
        <html>
        <body>
            <h1>Welcome to Waste Reporter!</h1>
            <p>Thank you for joining the Waste Reporter website. This platform is dedicated to helping keep our environment clean by reporting waste around your surroundings.</p>
            <p>Your OTP code is <strong>{otp}</strong>.</p>
            <p>Together, we can make a difference!</p>
            <p>Best regards,<br/>The Waste Reporter Team</p>
        </body>
        </html>
        """


    msg.attach(MIMEText(content, 'html'))

    try:
        # Connect to the SMTP server
        server = smtplib.SMTP(smtp_server, smtp_port)
        server.starttls()  # Upgrade the connection to a secure encrypted SSL/TLS connection
        server.login(username, password)
        server.sendmail(from_email, to_email, msg.as_string())
    except smtplib.SMTPServerDisconnected:
        print("Failed to connect to the server. Wrong user/password?")
    except smtplib.SMTPException as e:
        print(f"SMTP error occurred: {e}")
    finally:
        server.quit()
    
    return otp
