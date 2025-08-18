from fastapi import APIRouter, Request
from app.schemas.email import Email
from typing import List
from fastapi import FastAPI
from imap_tools import MailBox

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)

@app.get("/emails/new", response_model=List[Email])
def get_new_emails():
    emails = []

    with MailBox(EMAIL_HOST).login(EMAIL_USER, EMAIL_PASS) as mailbox:
        # Fetch *unread emails only*
        for msg in mailbox.fetch('(UNSEEN)'):
            emails.append(Email(
                sender=msg.from_,
                subject=msg.subject,
                body=msg.text or msg.html,
                date=msg.date.strftime("%Y-%m-%d %H:%M:%S")
            ))
    return emails