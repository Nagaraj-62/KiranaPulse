from sqlalchemy import create_engine, MetaData
from dotenv import load_dotenv
import os

load_dotenv()  # Load variables from .env file

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL environment variable not set")

engine = create_engine(DATABASE_URL)

metadata = MetaData()
metadata.reflect(bind=engine)

print("Tables in the database:")
for table_name in metadata.tables.keys():
    print(f"- {table_name}")

for table_name, table_obj in metadata.tables.items():
    print(f"\nColumns in table '{table_name}':")
    for column in table_obj.columns:
        print(f"  {column.name} - {column.type}")
