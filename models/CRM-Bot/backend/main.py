from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import json, re
from rapidfuzz import process, fuzz

app = FastAPI()

# ✅ Enable CORS for frontend (React on port 3000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

# ✅ Load FAQ file
with open('faq.json', 'r') as f:
    faq = json.load(f)

# ---- Memory ----
context_memory = {"last_topic": None}
chat_history = []

# ---- Intent helpers ----
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

def tokens(text: str):
    return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOPWORDS]

def best_faq_match(query: str, candidate_keys):
    results = process.extract(query, candidate_keys, scorer=fuzz.token_set_ratio, limit=5)
    return results[0] if results else (None, 0, None)

# ---- Routes ----

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
    chat_history.append({"role": "user", "text": user_raw})

    # 1) Pronoun follow-up
    if context_memory["last_topic"] and any(p in user_message.split() for p in ["they","it","that","those","them","this"]):
        topic = context_memory["last_topic"]
        reply = f"You're asking about {topic}. {faq.get(topic, 'I don’t have more details on that.')}"
        chat_history.append({"role": "bot", "text": reply})
        return {"reply": reply, "chat_history": chat_history}

    # 2) Detect intent → task-like vs chitchat
    tok = set(tokens(user_message))
    looks_tasky = len(tok & TASK_KEYWORDS) > 0 or user_message.startswith(("how to","how do i","where do i","can i","how can i"))
    candidate_keys = [k for k in faq.keys() if not (looks_tasky and k in CHITCHAT_KEYS)]
    if not candidate_keys:
        candidate_keys = list(faq.keys())

    # 3) Match
    best_key, score, _ = best_faq_match(user_message, candidate_keys)

    # 4) Guardrail: don’t return chitchat when query looks tasky
    if best_key in CHITCHAT_KEYS and looks_tasky:
        results = process.extract(user_message, candidate_keys, scorer=fuzz.token_set_ratio, limit=5)
        alt = next((k for k, s, _ in results if k not in CHITCHAT_KEYS and s >= 60), None)
        if alt:
            best_key = alt
            score = next(s for k, s, _ in results if k == alt)

    # 5) Final answer
    if best_key and score >= 50:
        reply = faq[best_key]
        context_memory["last_topic"] = best_key
    else:
        reply = "Sorry, I don't have an answer for that."
        context_memory["last_topic"] = None

    chat_history.append({"role": "bot", "text": reply})
    return {"reply": reply, "chat_history": chat_history}
