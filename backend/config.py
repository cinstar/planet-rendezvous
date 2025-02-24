import mysql.connector
import os

# Replace the placeholder values with your actual SingleStore connection details.
db_config = {
    'host': 'svc-e5f4c927-22c8-44ff-a41a-6130b17c0b0c-dml.aws-oregon-4.svc.singlestore.com',
    'user': 'admin',
    'password': 'ykjlkjyX7Jq2zVWeuXFosmeR87Vu0A1y',
    'database': 'activities',
    'port': 3306  # adjust if necessary
}

# # returns a MySQL database connection object
# def connect_to_db():
#     """Connect to the SingleStore database."""
#     return mysql.connector.connect(
#         host='svc-e5f4c927-22c8-44ff-a41a-6130b17c0b0c-dml.aws-oregon-4.svc.singlestore.com',
#         user='admin',
#         password='ykjlkjyX7Jq2zVWeuXFosmeR87Vu0A1y',
#         database='activities'
#     )