from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/')
def index():
    return "Hello, Flask is running!"

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    # Here add your user registration logic (DB save, validation, etc.)
    # For now, just simulate success:
    return jsonify({'message': f'User {username} registered successfully!'}), 201

if __name__ == '__main__':
    app.run(debug=True)
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS so frontend can talk to backend

# In-memory "database" for example only
users_db = {}

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data:
        return jsonify({'error': 'Missing JSON in request'}), 400
    
    username = data.get('username')
    password = data.get('password')
    
    if not username or not password:
        return jsonify({'error': 'Missing username or password'}), 400
    
    if username in users_db:
        return jsonify({'error': 'Username already exists'}), 409
    
    # Save user (here in-memory; replace with your DB logic)
    users_db[username] = {
        'password': password  # In production, **hash passwords!**
    }
    
    return jsonify({'message': f'User {username} registered successfully!'}), 201

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK'}), 200

if __name__ == '__main__':
    app.run(debug=True)
