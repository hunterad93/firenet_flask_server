from flask import Flask, render_template, Response, jsonify
from utils import get_geojson_data

import logging

app = Flask(__name__)

# Set up logging
app.logger.setLevel(logging.DEBUG)
handler = logging.StreamHandler()
handler.setLevel(logging.DEBUG)
app.logger.addHandler(handler)


# table_dict here, form is {table_id: column_name}. serve_geojson will
# fetch the value from latest row from the tables with the corresponding column name and return
# The geojson as a dict, where each key's associated geojson is a layer in the leaflet map
table_dict = {
    "goes_mask": "goes_mask_geojson",
    "viirs_mask": "viirs_mask_geojson",
    "unet": "unet_geojson",
    "modis_mask": "modis_mask_geojson"
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