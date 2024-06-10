from flask import Flask, jsonify
from flask_cors import CORS
import json
import os

json_file_path = os.path.join(os.path.dirname(__file__), 'jsonfiles', 'stock_market_data.json')

with open(json_file_path) as file:
    stock_market_data = json.load(file)

app = Flask(__name__)
cors = CORS(app, origins = '*')

@app.route("/api/stock-market-data", methods=["GET"])
def get_market_data():
    response = {
        "data": stock_market_data,
        "total_rows": len(stock_market_data)
    }
    return jsonify(response)

if __name__ == "__main__":
    app.run(debug = True, port = 8080)