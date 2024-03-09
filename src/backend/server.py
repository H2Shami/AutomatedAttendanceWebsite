import os
from dotenv import load_dotenv

import boto3
import psycopg2

from typing import List
from pydantic import BaseModel

import uvicorn

from fastapi import FastAPI, UploadFile
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
S3_BUCKET_NAME = "test-photos-123"

class StudentModel(BaseModel):
    studentid: int
    first_name: str
    last_name: str
    email: str

app = FastAPI(debug=True)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# test endpoint
@app.get("/status")
async def check_status():
    return "Hello World!"

@app.get("/students", response_model=List[StudentModel])
async def get_all_students():
    #connect to psql db
    conn = psycopg2.connect(
        database=os.getenv("PGDATABASE"), 
        user=os.getenv("PGUSER"), 
        password=os.getenv("PGPASSWORD"), 
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT")
    )

    cur = conn.cursor()
    cur.execute("SELECT * FROM students ORDER BY studentid DESC")
    rows = cur.fetchall()

    formatted_students = []
    for row in rows:
        formatted_students.append(
            StudentModel(
                studentid = row[0],
                first_name=row[1],
                last_name=row[2],
                email=row[3]
            )
        )

    cur.close()
    conn.close()
    return formatted_students

@app.put("/students", status_code=201)
async def add_photo(student_id: int, file: UploadFile):
    print("Create endpoint hit!")

    s3 = boto3.resource("s3")
    bucket = s3.Bucket(S3_BUCKET_NAME)
    bucket.upload_fileobj(file.file, file.filename, ExtraArgs={"ACL": "public-read"})

    uploaded_file_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{student_id}"

    # Store URL in db
    conn = psycopg2.connect(
        database=os.getenv("PGDATABASE"), 
        user=os.getenv("PGUSER"), 
        password=os.getenv("PGPASSWORD"), 
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT")
    )

    cur = conn.cursor()
    cur.execute(f"UPDATE students SET photo_url = '{uploaded_file_url}' WHERE studentid = {student_id};")
    conn.commit()
    cur.close()
    conn.close()

if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000, reload=False)