import sqlite3
import os

db_path = r"c:\Users\amith\OneDrive\Desktop\intelliJobs\intelliJobs.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

try:
    cursor.execute("ALTER TABLE users ADD COLUMN github_username VARCHAR;")
    print("Added github_username column.")
except sqlite3.OperationalError as e:
    if "duplicate column name" in str(e):
        print("Column already exists.")
    else:
        print(f"Error: {e}")

conn.commit()
conn.close()
