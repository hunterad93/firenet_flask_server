# Flask Server README

## Overview
This Flask server is designed to serve a Leaflet map, which displays geojson data sourced from Google BigQuery. The data is associated with several fire prediction products, including VIIRS, GOES, and a proprietary model named Firenet, which is currently under development in collaboration with my team.

VIIRS and GOES data, which are publicly available in cloud storage, are fetched and preprocessed into geojson format through cloud functions developed in a separate [repository](https://github.com/hunterad93/firenet). The processed data is then stored in Google BigQuery (GBQ) by prediction date.

For reference, VIIRS data can be accessed [here](https://firms.modaps.eosdis.nasa.gov/usfs/api/area/) and GOES data can be found [here](https://console.cloud.google.com/storage/browser/gcp-public-data-goes-16).

The primary objective of displaying these diverse satellite projects is to showcase the effectiveness of the Firenet model. Geostationary products from GOES suffer from low spatial resolution, while VIIRS struggles with low temporal resolution. Firenet, on the other hand, is a neural network model trained on VIIRS data using GOES data as its input. This unique approach allows Firenet to make predictions with temporal resolution equivalent to GOES and accuracy that can potentially match or even surpass VIIRS[1], given sufficient resources to continue enhancing the model.

[1] While VIIRS data serves as the ground truth for Firenet, its ability to make accurate real-time predictions can be compromised by cloud cover. This is where Firenet's use of GOES data as input becomes advantageous. Given that GOES maintains a constant view of the entire US, it can capture data even when cloud cover obstructs VIIRS' view. For instance if VIIRS passed over a fire while clouds were obscuring it, it would not come back around in its orbit to the same region for 12 hours, but firenet using GOES data could classify the fire as soon as the cloud moved. This is a bit of a simplification but hopefully it demonstrates the value of having a temporally resolute model that is also reasonably accurate.

The data is fetched from specified tables and columns, defined in `main.py`.

The server has two routes: the root route which serves the map, and the `/geojson` route which returns the geojson data as a JSON object.

Find more info and view the map at the project's webpage: https://sites.google.com/view/firenet-/home

## Requirements
The server requires Python 3.9 and the packages listed in `requirements.txt`.

## Deployment
The server is configured for deployment on Google Cloud using the `app.yaml` file. Files to be ignored during deployment are specified in `.gcloudignore`.

## Map
The map is initialized in `map.js`. It fetches the geojson data from the `/geojson` route and adds it as layers to the map.

## Data Fetching
The `get_geojson_data` function in `utils.py` fetches the geojson data from BigQuery. It uses the table and column names specified in `main.py` to fetch the most recent row from each table and return the geojson data.