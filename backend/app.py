from flask import Flask, send_from_directory, request, jsonify, session
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from sqlalchemy import text
import config
import os

app = Flask(__name__, static_folder="../frontend/build", static_url_path="/")
app.config.from_object(config)
app.secret_key = "supersecretkey"  # session secret
CORS(app, supports_credentials=True)

db = SQLAlchemy(app)

# Serve React App
@app.route('/')
def serve_react():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# ---------- LOGIN ----------
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    nid = data.get('nid')
    password = data.get('password')

    try:
        sql = "SELECT nid, name, role, email FROM Users WHERE nid=:nid AND password=:password"
        user = db.session.execute(text(sql), {'nid': nid, 'password': password}).mappings().fetchone()

        if user:
            user_dict = dict(user)
            session['user'] = user_dict
            return jsonify({"status": "success", "user": user_dict})
        else:
            return jsonify({"status": "error", "message": "Invalid NID or password"}), 401
    except Exception as e:
        return jsonify({"status": "error", "message": f"Login failed: {e}"}), 500
    
    # ---------- LOGOUT ----------
@app.route('/logout', methods=['POST'])
def logout():
    session.clear()  # clear the user session
    return jsonify({"status": "success", "message": "Logged out"})


# ---------- GET SITES ----------
@app.route('/sites', methods=['GET'])
def get_sites():
    if 'user' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401
    sites = db.session.execute(text("SELECT * FROM Sites")).mappings().fetchall()
    return jsonify([dict(site) for site in sites])

# ---------- DONATE ----------
@app.route('/donate', methods=['POST'])
def donate():
    if 'user' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    data = request.json
    nid = session['user']['nid']
    try:
        sql = """
        INSERT INTO donations 
        (nid, message, donation_type, amount) 
        VALUES (:nid, :message, :donation_type, :amount)
        """
        db.session.execute(text(sql), {
            'nid': nid,
            'message': data.get('message'),
            'donation_type': data.get('donation_type'),
            'amount': data.get('amount')
        })
        db.session.commit()
        return jsonify({"status": "success", "message": "Donation recorded!"})
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": f"Failed to record donation: {e}"}), 500
    
    
    # ---------- TICKET PURCHASE ----------
@app.route('/tickets/purchase', methods=['POST'])
def purchase_ticket():
    if 'user' not in session:
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    data = request.get_json()
    site_id = data.get('site_id')
    no_of_tickets = data.get('no_of_tickets')

    if not site_id or not no_of_tickets or no_of_tickets <= 0:
        return jsonify({"status": "error", "message": "Invalid data"}), 400

    nid = session['user']['nid']

    try:
        # Fetch ticket price and name from Sites
        sql_site = "SELECT ticket_price, name FROM Sites WHERE site_id = :site_id"
        site = db.session.execute(text(sql_site), {'site_id': site_id}).mappings().fetchone()
        if not site:
            return jsonify({"status": "error", "message": "Site not found"}), 404

        ticket_price = site['ticket_price']
        site_name = site['name']
        total_amount = ticket_price * no_of_tickets

        # Insert ticket purchase
        sql_insert = """
            INSERT INTO TicketPurchase (siteid, nid, no_of_tickets)
            VALUES (:siteid, :nid, :no_of_tickets)
        """
        db.session.execute(text(sql_insert), {
            'siteid': site_id,
            'nid': nid,
            'no_of_tickets': no_of_tickets
        })
        db.session.commit()

        return jsonify({
            "status": "success",
            "message": f"Purchased {no_of_tickets} tickets!",
            "ticket_price": float(ticket_price),
            "total_amount": float(total_amount),
            "site_name": site_name
        })

    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": f"Failed to purchase ticket: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
