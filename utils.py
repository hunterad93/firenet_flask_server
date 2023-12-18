from google.cloud import bigquery



def get_geojson_data(table_dict):
    """
    Given a dictionary of table IDs and column names, return a dictionary of geojson data for each table.
    Fetches the most recent geojson data from each table and updates the geojson_data dictionary.

    :param table_dict: Dictionary where keys are BigQuery table IDs and values are column names
    :return: Dictionary where keys are BigQuery table IDs and values are geojson data
    """
    # Create a BigQuery client
    bigquery_client = bigquery.Client()
    geojson_data = {}
    for table_id, column_name in table_dict.items():
        # Use the authenticated BigQuery client to fetch the row
        geojson_data[table_id] = query_most_recent_geojson(table_id, column_name, bigquery_client)
    return geojson_data

def query_most_recent_geojson(table_id, column_name, bigquery_client):
    """
    Fetches a row with the latest prediction_date from the specified BigQuery table and returns the value of the specified column.

    :param table_id: The ID of the BigQuery table to fetch data from
    :param column_name: The name of the column to return the value from
    :param bigquery_client: The authenticated BigQuery client to use for fetching data
    :return: The value of the specified column from the row with the latest prediction_date in the specified table
    """
    # Specify the project and dataset
    project = "firenet-99"
    dataset = "geojson_predictions"

    # Determine the column to order by based on the table_id
    order_by_column = "datetime_added"

    query = f"""
    SELECT `{column_name}`
    FROM `{project}.{dataset}.{table_id}`
    ORDER BY {order_by_column} DESC
    LIMIT 1
    """
    query_job = bigquery_client.query(query)  # API request

    results = query_job.result()  # Waits for job to complete.

    for row in results:
        return row[column_name]