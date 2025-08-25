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
        # Fetch ALL mails and take only the latest 5
        all_mails = list(mailbox.fetch('(ALL)', reverse=True))  # reverse=True = newest first
        last_5 = all_mails[:5]  # pick top 5
        
        for msg in last_5:
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
        # Loop through recipients
        for recipient in email.to:
            msg = MIMEText(email.message)
            msg["From"] = settings.email_user
            msg["To"] = recipient
            msg["Subject"] = email.subject

            await aiosmtplib.send(
                msg,
                hostname=settings.email_smtp_host,
                port=587,
                start_tls=True,
                username=settings.email_user,
                password=settings.email_pass,
            )

        return {"status": "success", "message": f"Emails sent to {', '.join(email.to)}"}

    except Exception as e:
        return {"status": "error", "message": str(e)}
