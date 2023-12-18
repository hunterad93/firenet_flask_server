from flask import Flask, render_template, Response, jsonify
from utils import get_geojson_data

app = Flask(__name__)

# Define your table_dict here
table_dict = {
    "goesmask": "goesmask_geojson",
    "viirs_mask": "viirs_mask_geojson"
}

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/geojson')
def serve_geojson():
    geojson_data = get_geojson_data(table_dict)
    return jsonify(geojson_data)

if __name__ == '__main__':
    # Run the Flask app
    app.run(debug=True)