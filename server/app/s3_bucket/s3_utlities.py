import boto3
from botocore.exceptions import NoCredentialsError
import os
from app.core.config import settings

# Load from environment
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_REGION")
BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")

s3_client = boto3.client(
    "s3",
    aws_access_key_id=settings.aws_access_key_id,
    aws_secret_access_key=settings.aws_secret_access_key,
    region_name=settings.aws_region
)

def upload_file_to_s3(file_path, object_name=None):
    """Upload file from local path to S3"""
    if object_name is None:
        object_name = file_path

    try:
        s3_client.upload_file(file_path, BUCKET_NAME, object_name)
        file_url = f"https://{settings.aws_bucket_name}.s3.{AWS_REGION}.amazonaws.com/{object_name}"
        return file_url
    except NoCredentialsError:
        return "Error: AWS credentials not available"

def generate_presigned_url(bucket_name, object_name, expiration=3600):
    try:
        url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": bucket_name, "Key": object_name},
            ExpiresIn=expiration  # link valid for 1 hour
        )
        return url
    except NoCredentialsError:
        return None