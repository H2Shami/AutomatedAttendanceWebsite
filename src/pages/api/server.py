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
S3_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")
ACCESS_KEY = os.getenv("AWS_ACCESS_KEY")
SECRET_KEY = os.getenv("AWS_SECRET_KEY")
SESSION_TOKEN = os.getenv("AWS_SESSION_TOKEN")
REGION = os.getenv("AWS_REGION")


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
    allow_headers=["*"],
)


# test endpoint
@app.get("/status")
async def check_status():
    return "Hello World!"


@app.get("/students", response_model=List[StudentModel])
async def get_all_students():
    # connect to psql db
    conn = psycopg2.connect(
        database=os.getenv("PGDATABASE"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT"),
    )

    cur = conn.cursor()
    cur.execute("SELECT * FROM students ORDER BY studentid DESC")
    rows = cur.fetchall()

    formatted_students = []
    for row in rows:
        formatted_students.append(
            StudentModel(
                studentid=row[0], first_name=row[1], last_name=row[2], email=row[3]
            )
        )

    cur.close()
    conn.close()
    return formatted_students


@app.put("/students", status_code=201)
async def add_photo(student_id: int, file: UploadFile):
    s3 = boto3.resource(
        "s3",
        aws_access_key_id=ACCESS_KEY,
        aws_secret_access_key=SECRET_KEY,
        aws_session_token=SESSION_TOKEN,
    )
    bucket = s3.Bucket(S3_BUCKET_NAME)
    bucket.upload_fileobj(file.file, str(student_id), ExtraArgs={"ACL": "public-read"})

    uploaded_file_url = f"https://{S3_BUCKET_NAME}.s3.amazonaws.com/{student_id}"

    # Store URL in db
    conn = psycopg2.connect(
        database=os.getenv("PGDATABASE"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT"),
    )

    cur = conn.cursor()
    cur.execute(
        f"UPDATE students SET photo_url = '{uploaded_file_url}' WHERE studentid = {student_id};"
    )
    conn.commit()
    cur.close()
    conn.close()
    print("Photo insertion successful")


@app.post("/attendance_record", status_code=201)
async def add_attendance_record(attendanceid: str, student_id: str, class_id: str, timestamp: str):
    # Store URL in db
    conn = psycopg2.connect(
        database=os.getenv("PGDATABASE"),
        user=os.getenv("PGUSER"),
        password=os.getenv("PGPASSWORD"),
        host=os.getenv("PGHOST"),
        port=os.getenv("PGPORT"),
    )

    cur = conn.cursor()
    cur.execute(
        f"INSERT INTO attendance (attendanceid, classid, studentid, entry_timestamp) VALUES ('{attendanceid}', '{class_id}', '{student_id}', '{timestamp}');"
    )
    conn.commit()
    cur.close()
    conn.close()
    print("Attendance Record insertion successful")

    # Signal that a DB re-check is required
    return "Check DB"



if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000, reload=False)
