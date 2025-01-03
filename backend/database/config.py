# config.py
import urllib.parse

DB_CONFIG = {
    'driver': 'ODBC Driver 17 for SQL Server',
    'server': '',
    'database': '',
    'username': '',
    'password': '',
}

params = urllib.parse.quote_plus(
    f"DRIVER={DB_CONFIG['driver']};SERVER={DB_CONFIG['server']};"
    f"DATABASE={DB_CONFIG['database']};UID={DB_CONFIG['username']};PWD={DB_CONFIG['password']}"
)
SQLALCHEMY_DATABASE_URI = f"mssql+pyodbc:///?odbc_connect={params}"
