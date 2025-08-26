import os
import tempfile
from app.s3_bucket import s3_utlities

async def upload_file_to_s3(file):
    # Save the uploaded file to a temporary location
    suffix = f"_{file.filename}"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    file_url = s3_utlities.upload_file_to_s3(tmp_path, file.filename)
    os.remove(tmp_path)
    return file_url

def generate_presigned_url(object_name, expiration=3600):
    from app.s3_bucket.s3_utlities import generate_presigned_url, BUCKET_NAME
    return generate_presigned_url(BUCKET_NAME, object_name, expiration)