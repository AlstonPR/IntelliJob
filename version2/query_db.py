import sqlite3

db_path = r"c:\Users\amith\OneDrive\Desktop\intelliJobs\intelliJobs.db"
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

cursor.execute("SELECT * FROM projects")
print("PROJECTS:", cursor.fetchall())

cursor.execute("SELECT * FROM skills")
print("SKILLS:", cursor.fetchall())

conn.close()
