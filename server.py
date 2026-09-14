"""
Jeevitha Sakthivel - Portfolio Local/Custom Backend Server
Built with Python & Flask.

Usage:
1. Install dependencies:
   pip install flask flask-cors

2. Run the server:
   python server.py

The server runs on http://localhost:5000 and serves the portfolio,
while also accepting contact form POST submissions at /api/contact.
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__, static_folder=".")
CORS(app)

# Target email to notify
OWNER_EMAIL = "kayaljeevitha43@gmail.com"

@app.route("/")
def index():
    """Serve the portfolio index.html."""
    return send_from_directory(".", "index.html")

@app.route("/<path:path>")
def static_files(path):
    """Serve static assets (CSS, JS, images)."""
    return send_from_directory(".", path)

@app.route("/api/contact", methods=["POST"])
def handle_contact():
    """
    Handle contact form submissions and log or forward notification.
    """
    try:
        data = request.get_json() or request.form
        name = data.get("name", "").strip()
        email = data.get("email", "").strip()
        subject = data.get("_subject") or data.get("subject", "New Portfolio Inquiry")
        message = data.get("message", "").strip()

        if not name or not email or not message:
            return jsonify({
                "success": False,
                "error": "Missing required fields (name, email, message)."
            }), 400

        print(f"\n[NEW MESSAGE RECEIVED]")
        print(f"From:    {name} <{email}>")
        print(f"Subject: {subject}")
        print(f"Message: {message}\n")

        # Optional: configure SMTP to send real emails via Gmail if SMTP credentials are provided in env:
        smtp_user = os.environ.get("SMTP_EMAIL")
        smtp_pass = os.environ.get("SMTP_PASSWORD")

        if smtp_user and smtp_pass:
            msg = MIMEMultipart()
            msg["From"] = smtp_user
            msg["To"] = OWNER_EMAIL
            msg["Subject"] = f"[Portfolio Contact] {subject}"
            msg["Reply-To"] = email

            body_content = f"New message from {name} ({email}):\n\nSubject: {subject}\n\nMessage:\n{message}"
            msg.attach(MIMEText(body_content, "plain"))

            with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
                server.login(smtp_user, smtp_pass)
                server.send_message(msg)

        return jsonify({
            "success": True,
            "message": "Notification received successfully."
        }), 200

    except Exception as e:
        print(f"Error handling contact message: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    print("Starting Jeevitha's Portfolio Backend on http://localhost:5000 ...")
    app.run(host="0.0.0.0", port=5000, debug=True)
