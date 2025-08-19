from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json, re, random
from rapidfuzz import process, fuzz

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

with open('faq.json', 'r') as f:
    faq = json.load(f)

with open('badwords.json', 'r') as f:
    BAD_WORDS = json.load(f)

context_memory = {"last_topic": None}

CHITCHAT_KEYS = {
    "hi","hello","hey","good morning","good evening","how are you",
    "thanks","thank you","bye","goodbye","who are you"
}
TASK_KEYWORDS = {
    "reset","change","add","create","update","edit","delete",
    "import","export","connect","integrate","sync","assign",
    "cancel","upgrade","downgrade","pricing","price","cost",
    "invoice","billing","payment","subscribe","trial","report",
    "opportunity","lead","contact","task","pipeline","dashboard","plans","password"
}
STOPWORDS = {
    "the","is","a","an","to","for","of","and","or","in","on","with",
    "do","does","did","i","you","we","they","it","that","this","my",
    "your","their","our","can","how","what","where","when","why","please"
}

response_templates = [
    "Thank you for reaching out! Your request is being processed, and we truly appreciate your patience.",
    "We’re grateful for your query. Our team is already working on it for you!",
    "Your request has been received successfully. We're thankful for your trust in us.",
    "Thanks a lot! We’ve got your request, and it’s now in progress.",
    "We appreciate your message. Rest assured, your request is being taken care of."
]

def tokens(text: str):
    return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOPWORDS]

def best_faq_match(query: str, candidate_keys):
    results = process.extract(query, candidate_keys, scorer=fuzz.token_set_ratio, limit=5)
    return results[0] if results else (None, 0, None)

def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r'(.)\1+', r'\1', text)  # collapse consecutive repeated chars
    return text

def contains_badword(message: str, badwords: list) -> bool:
    words = re.findall(r"\w+", message.lower())  # split into words
    for word in words:
        for bad in badwords:
            # ✅ exact match
            if word == bad:
                return True
            # ✅ fuzzy match (avoid false positives with a higher threshold)
            if fuzz.ratio(word, bad) > 85:
                return True
    return False

@app.get("/chat/{query}")
def chat(query: str):
    best_key, score, _ = best_faq_match(query, list(faq.keys()))
    if best_key and score >= 70:
        return {"response": faq[best_key]}
    return {"response": "Sorry, I don't have an answer for that."}

@app.post("/bot/respond")
def respond(msg: Message):
    user_raw = msg.message
    user_message = user_raw.lower()
    normalized_message = normalize_text(user_raw)
    
    if contains_badword(normalized_message, BAD_WORDS):
        return {"reply": " Please avoid using offensive language. Your response is being recorded."}
    
    if context_memory["last_topic"] and any(p in normalized_message.split() for p in ["they","it","that","those","them","this"]):
        topic = context_memory["last_topic"]
        reply = f"You're asking about {topic}. {faq.get(topic, 'I don’t have more details on that.')}"
        return {"reply": reply}

    tok = set(tokens(normalized_message))
    looks_tasky = len(tok & TASK_KEYWORDS) > 0 or normalized_message.startswith(
        ("how to", "how do i", "where do i", "can i", "how can i")
    )   

    candidate_keys = [k for k in faq.keys() if not (looks_tasky and k in CHITCHAT_KEYS)]
    if not candidate_keys:
        candidate_keys = list(faq.keys())

    best_key, score, _ = best_faq_match(normalized_message, candidate_keys)

    if best_key and score >= 70:
        reply = faq[best_key]
        context_memory["last_topic"] = best_key
    # If weak FAQ match → use generic gratitude template
    elif best_key and score >= 50:
        reply = random.choice(response_templates)
        context_memory["last_topic"] = best_key
    else:
        reply = "Sorry, I don’t have an answer for that."
        context_memory["last_topic"] = None

    return {"reply": reply}