import re
import json
import random
from collections import deque
from rapidfuzz import fuzz, process
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Message(BaseModel):
    message: str

# Load FAQ
with open("faq.json", "r") as f:
    faq = json.load(f)

# Load bad words
with open("badwords.json", "r") as f:
    badwords = json.load(f)

# Multi-turn context memory (last 5 turns)
conversation_history = deque(maxlen=5)

# Synonym dictionary
synonyms = {
    "subscription": ["plan", "plans", "package", "membership"],
    "cost": ["price", "charges", "fees"],
    "support": ["help", "assistance", "service"],
    "cancel": ["terminate", "stop", "end"],
    "billing": ["invoice", "payment"],
}

# Stopwords
STOPWORDS = {
    "the","is","a","an","to","for","of","and","or","in","on","with",
    "do","does","did","i","you","we","they","it","that","this","my",
    "your","their","our","can","how","what","where","when","why","please"
}

# Normalize text
def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"(.)\1+", r"\1", text)  # collapse repeated letters ("shitttt" -> "shit")
    return text

# Expand with synonyms
def expand_with_synonyms(text: str) -> str:
    for canonical, syn_list in synonyms.items():
        for syn in syn_list:
            if syn in text:
                text = text.replace(syn, canonical)
    return text

# Tokenizer
def tokens(text: str):
    return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOPWORDS]

# Best FAQ Match
def best_faq_match(query: str, candidate_keys):
    expanded_query = expand_with_synonyms(query)
    results = process.extract(expanded_query, candidate_keys, scorer=fuzz.token_set_ratio, limit=5)
    return results[0] if results else (None, 0, None)

# Bad word detection
def contains_badword(message: str, badwords: list) -> bool:
    words = re.findall(r"\w+", message.lower())
    for word in words:
        for bad in badwords:
            # exact match
            if word == bad:
                return True
            # fuzzy match with higher threshold (to catch "BiTcH", "shitttt")
            if fuzz.ratio(word, bad) > 80:
                return True
    return False

@app.post("/bot/respond")
def respond(msg: Message):
    user_raw = msg.message
    normalized_message = normalize_text(user_raw)
    normalized_message = expand_with_synonyms(normalized_message)

    # Check bad words
    if contains_badword(normalized_message, badwords):
        return {"reply": "Please avoid offensive language. Your response is being recorded."}

    # Match FAQ
    best_key, score, _ = best_faq_match(normalized_message, list(faq.keys()))
    reply = None

    if best_key and score >= 70:
        # strong match → direct answer
        reply = faq[best_key]
        conversation_history.append(best_key)
    elif best_key and score >= 50:
        # weak match → return FAQ answer (no gratitude templates)
        reply = faq.get(best_key, "Sorry, I don't have enough info on that.")
        conversation_history.append(best_key)
    else:
        # No strong match → try to infer from past context
        if conversation_history:
            last_topic = conversation_history[-1]
            reply = f"You're asking in relation to {last_topic}. {faq.get(last_topic, 'I don’t have more info on that.')}"
        else:
            reply = "Sorry, I don’t have an answer for that."

    return {"reply": reply}
