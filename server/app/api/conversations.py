from fastapi import APIRouter, Depends
from databases import Database
from app.database.connection import get_db
from app.schemas.conversation import ConversationCreate, ConversationUpdate, ConversationResponse
from app.services import conversation_service
from datetime import date, datetime

router = APIRouter(prefix="/conversations", tags=["Conversations"])

@router.post("/create-conversation", response_model=ConversationResponse)
async def create_conversation( conversation: ConversationCreate, db: Database = Depends(get_db)):
    return await conversation_service.create_conversation(db, conversation)

@router.get("/", response_model=list[ConversationResponse])
async def get_conversation(
    title: str = None,
    due_date: datetime = None,
    status: str = None,
    priority: str = None,
    user_id: int = None,
    opportunity_id: int = None,
    before: bool = True, 
    db: Database = Depends(get_db)
):
    return await conversation_service.get_conversations(db,title ,  due_date, status, priority, user_id, opportunity_id, before)


@router.get("/conversation-{conversation_id}", response_model=ConversationResponse)
async def get_conversation(conversation_id: int, db: Database = Depends(get_db)):
    return await conversation_service.get_conversation(db, conversation_id)


@router.put("/{conversation_id}", response_model=ConversationResponse)
async def update_conversation(conversation_id: int, conversation: ConversationUpdate, db: Database = Depends(get_db)):    
    return await conversation_service.update_conversation(db, conversation_id, conversation)  # service function to be implemented

@router.delete("/{conversation_id}", response_model=ConversationResponse)
async def delete_conversation(conversation_id: int, db: Database = Depends(get_db)):
    return await conversation_service.delete_conversation(db, conversation_id)

