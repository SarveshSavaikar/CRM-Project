from fastapi import APIRouter, UploadFile, File, HTTPException
from app.services import upload_service

router = APIRouter(prefix="/upload", tags=["Upload"])

@router.post("/file")
async def upload_file(file: UploadFile = File(...)):
    file_url = await upload_service.upload_file_to_s3(file)
    if not file_url:
        raise HTTPException(status_code=500, detail="File upload failed")
    return {"file_url": file_url}

@router.get("/presigned-url")
async def get_presigned_url(object_name: str):
    url = upload_service.generate_presigned_url(object_name)
    if not url:
        raise HTTPException(status_code=500, detail="Could not generate presigned URL")
    return {"url": url}