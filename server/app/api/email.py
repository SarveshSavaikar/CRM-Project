from fastapi import FastAPI , APIRouter
from imap_tools import MailBox
from pydantic import BaseModel
from typing import List
from app.schemas.email import Email , EmailRequest
from app.core.config import settings
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel, EmailStr
import aiosmtplib
from email.mime.text import MIMEText
import os


router = APIRouter(prefix="/Email", tags=["Email"])

@router.get("/emails/new", response_model=List[Email])
def get_new_emails():
    emails = []

    with MailBox(settings.email_imap_host).login(settings.email_user, settings.email_pass) as mailbox:
        # Fetch *unread emails only*
        for msg in mailbox.fetch('(UNSEEN)'):
            emails.append(Email(
                sender=msg.from_,
                subject=msg.subject,
                body=msg.text or msg.html,
                date=msg.date.strftime("%Y-%m-%d %H:%M:%S")
            ))
    return emails

@router.post("/send")
async def send_email(email: EmailRequest):
    try:
        # Prepare email
        msg = MIMEText( email.message)
        msg["From"] = settings.email_user
        msg["To"] = email.to
        msg["Subject"] = email.subject

        # Send email
        await aiosmtplib.send(
            msg,
            # hostname=settings.email_host,
            hostname=settings.email_smtp_host,
            # port=int(os.getenv("SMTP_PORT", 587)),
            port = 587,
            start_tls=True,
            username=settings.email_user,
            password=settings.email_pass,
        )

        return {"status": "success", "message": f"Email sent to {email.to}"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))