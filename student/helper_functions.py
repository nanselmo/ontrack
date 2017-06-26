import pandas
from django.db import connection

# function takes a SQL query, a list of parameters, and a connection, and returns a pandas dataframe

def df_from_query(query, params, **kwargs):
    conn = kwargs.get('connection')
    if conn == None:
        conn = connection

    cursor = conn.cursor()
    if params == None:
        cursor.execute(query)
    else:
        cursor.execute(query, params)
    columns = [x[0] for x in cursor.description]
    df = pandas.DataFrame(cursor.fetchall(), columns=columns)
    cursor.close()
    return df
