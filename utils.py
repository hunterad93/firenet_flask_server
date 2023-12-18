from google.cloud import bigquery

# Create a BigQuery client
bigquery_client = bigquery.Client()

# Initialize geojson_data as a dictionary
geojson_data = {}

def update_geojson(table_dict):
    global geojson_data
    # Use the authenticated BigQuery client to fetch the row
    for table_id, column_name in table_dict.items():
        geojson_data[table_id] = download_blob(table_id, column_name, bigquery_client)

def get_geojson_data(table_dict):
    global geojson_data
    for table_id in table_dict:
        if table_id not in geojson_data:
            update_geojson(table_dict)
            break
    return geojson_data

def download_blob(table_id, column_name, bigquery_client):
    """Fetches a row with the latest prediction_date from the BigQuery table."""
    query = f"""
    SELECT `{column_name}`
    FROM `{table_id}`
    ORDER BY prediction_date DESC
    LIMIT 1
    """
    query_job = bigquery_client.query(query)  # API request

    results = query_job.result()  # Waits for job to complete.

    for row in results:
        return row[column_name]