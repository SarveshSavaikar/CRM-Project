import re
import json
import random
import os
from datetime import datetime
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

# --- Logging setup ---
LOGS_DIR = "logs"
os.makedirs(LOGS_DIR, exist_ok=True)
INTERACTIONS_PATH = os.path.join(LOGS_DIR, "interactions.jsonl")
MISSED_PATH = os.path.join(LOGS_DIR, "missed_queries.json")

def log_interaction(user_raw, normalized, best_key, score, reply, matched):
    """Append one interaction as JSONL."""
    try:
        record = {
            "ts": datetime.utcnow().isoformat() + "Z",
            "user_raw": user_raw,
            "normalized": normalized,
            "best_key": best_key,
            "score": score,
            "matched": matched,
            "reply": reply
        }
        with open(INTERACTIONS_PATH, "a", encoding="utf-8") as f:
            f.write(json.dumps(record, ensure_ascii=False) + "\n")
    except Exception:
        pass  # don’t break bot if logging fails

def record_missed_query(user_raw):
    """Keep a deduplicated list of missed queries in JSON."""
    try:
        if os.path.exists(MISSED_PATH):
            with open(MISSED_PATH, "r", encoding="utf-8") as f:
                missed = json.load(f)
        else:
            missed = []

        key = user_raw.strip().lower()
        if key and key not in (q.strip().lower() for q in missed):
            missed.append(user_raw.strip())

        with open(MISSED_PATH, "w", encoding="utf-8") as f:
            json.dump(missed, f, ensure_ascii=False, indent=2)
    except Exception:
        pass

# Load FAQ
with open("faq.json", "r") as f:
    faq = json.load(f)

# Load bad words
with open("badwords.json", "r") as f:
    badwords = json.load(f)

# Multi-turn context memory (last 5 turns)
conversation_history = deque(maxlen=5)

synonyms = {
    "subscription": ["plan", "plans", "package", "membership"],
    "cost": ["price", "charges", "fees"],
    "support": ["help", "assistance", "service"],
    "cancel": ["terminate", "stop", "end"],
    "billing": ["invoice", "payment"],
    "change": ["switch", "modify", "update"],
    "language": ["lang", "locale", "idiom"],
    "timezone": ["time zone", "tz", "clock settings"],
    "deactivate": ["disable", "pause", "suspend"],
    "invoice": ["bill", "receipt", "statement"],
    "cancel": ["quit", "terminate", "stop", "end plan"],
    "subscription": ["plan", "membership", "subs"],
    "delete": ["remove", "erase", "permanently remove"]
}

STOPWORDS = {
    "the", "is", "a", "an", "to", "for", "of", "and", "or", "in", "on", "with",
    "do", "does", "did", "i", "you", "we", "they", "it", "that", "this", "my",
    "your", "their", "our", "can", "how", "what", "where", "when", "why", "please"
}

IMPORTANT_WORDS = ["cancel", "delete", "update", "change", "remove"]

def boost_scores(query, candidates):
    boosted = []
    query_tokens = re.findall(r"[a-z0-9]+", query.lower())  # tokenize cleanly
    for key, score, _ in candidates:
        key_tokens = re.findall(r"[a-z0-9]+", key.lower())
        # Check if any important word is in BOTH query and key
        if any(word in query_tokens and word in key_tokens for word in IMPORTANT_WORDS):
            bonus = 15   # give extra weight to critical actions
        else:
            bonus = 0
        boosted.append((key, score + bonus, _))
    return sorted(boosted, key=lambda x: x[1], reverse=True)

# Normalize text
def normalize_text(text: str) -> str:
    text = text.lower()
    text = re.sub(r"(.)\1+", r"\1", text)  # collapse repeated letters
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

    if not results:
        return (None, 0, None)

    query_tokens = set(re.findall(r"[a-z0-9]+", expanded_query.lower()))

    # Give super-high score if any IMPORTANT_WORD is in both query and FAQ key
    for i, (key, score, _) in enumerate(results):
        key_tokens = set(re.findall(r"[a-z0-9]+", key.lower()))
        if any(word in query_tokens and word in key_tokens for word in IMPORTANT_WORDS):
            results[i] = (key, score + 50, _)  # large boost

    # Sort after boosting
    results.sort(key=lambda x: x[1], reverse=True)
    return results[0]

# Bad word detection
def contains_badword(message: str, badwords: list) -> bool:
    words = re.findall(r"\w+", message.lower())
    for word in words:
        for bad in badwords:
            if word == bad:
                return True
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
        reply = "Please avoid offensive language. Your response is being recorded."
        log_interaction(user_raw, normalized_message, best_key=None, score=None, reply=reply, matched=False)
        return {"reply": reply}

    # Match FAQ
    best_key, score, _ = best_faq_match(normalized_message, list(faq.keys()))
    reply = None
    matched = False

    if best_key and score >= 80:
        reply = faq[best_key]
        conversation_history.append(best_key)
        matched = True
    elif best_key and score >= 60:
        reply = faq.get(best_key, "Sorry, I don't have enough info on that.")
        conversation_history.append(best_key)
        matched = True
    else:
        if conversation_history:
            last_topic = conversation_history[-1]
            reply = f"You're asking in relation to {last_topic}. {faq.get(last_topic, 'I don’t have more info on that.')}"
        else:
            reply = "Sorry, I don't have an answer for that."
        record_missed_query(user_raw)

    log_interaction(user_raw, normalized_message, best_key, score, reply, matched)
    return {"reply": reply}


#import re import json import random from collections import deque from rapidfuzz import fuzz, process from fastapi import FastAPI from pydantic import BaseModel from fastapi.middleware.cors import CORSMiddleware app = FastAPI() # Enable CORS app.add_middleware( CORSMiddleware, allow_origins=["http://localhost:3000"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"], ) class Message(BaseModel): message: str # Load FAQ with open("faq.json", "r") as f: faq = json.load(f) # Load bad words with open("badwords.json", "r") as f: badwords = json.load(f) # Multi-turn context memory (last 5 turns) conversation_history = deque(maxlen=5) synonyms = { "subscription": ["plan", "plans", "package", "membership"], "cost": ["price", "charges", "fees"], "support": ["help", "assistance", "service"], "cancel": ["terminate", "stop", "end"], "billing": ["invoice", "payment"], "change": ["switch", "modify", "update"], "language": ["lang", "locale", "idiom"], "timezone": ["time zone", "tz", "clock settings"], "deactivate": ["disable", "pause", "suspend"], "invoice": ["bill", "receipt", "statement"] } STOPWORDS = { "the", "is", "a", "an", "to", "for", "of", "and", "or", "in", "on", "with", "do", "does", "did", "i", "you", "we", "they", "it", "that", "this", "my", "your", "their", "our", "can", "how", "what", "where", "when", "why", "please" } # Normalize text def normalize_text(text: str) -> str: text = text.lower() text = re.sub(r"(.)\1+", r"\1", text) # collapse repeated letters ("shitttt" -> "shit") return text # Expand with synonyms def expand_with_synonyms(text: str) -> str: for canonical, syn_list in synonyms.items(): for syn in syn_list: if syn in text: text = text.replace(syn, canonical) return text # Tokenizer def tokens(text: str): return [w for w in re.findall(r"[a-z0-9]+", text.lower()) if w not in STOPWORDS] # Best FAQ Match def best_faq_match(query: str, candidate_keys): expanded_query = expand_with_synonyms(query) results = process.extract(expanded_query, candidate_keys, scorer=fuzz.token_set_ratio, limit=5) return results[0] if results else (None, 0, None) # Bad word detection def contains_badword(message: str, badwords: list) -> bool: words = re.findall(r"\w+", message.lower()) for word in words: for bad in badwords: # exact match if word == bad: return True # fuzzy match with higher threshold (to catch "shitttt") if fuzz.ratio(word, bad) > 80: return True return False @app.post("/bot/respond") def respond(msg: Message): user_raw = msg.message normalized_message = normalize_text(user_raw) normalized_message = expand_with_synonyms(normalized_message) # Check bad words if contains_badword(normalized_message, badwords): return {"reply": "Please avoid offensive language. Your response is being recorded."} # Match FAQ best_key, score, _ = best_faq_match(normalized_message, list(faq.keys())) reply = None if best_key and score >= 70: # strong match → direct answer reply = faq[best_key] conversation_history.append(best_key) elif best_key and score >= 50: # weak match → return FAQ answer (no gratitude templates) reply = faq.get(best_key, "Sorry, I don't have enough info on that.") conversation_history.append(best_key) else: # No strong match → try to infer from past context if conversation_history: last_topic = conversation_history[-1] reply = f"You're asking in relation to {last_topic}. {faq.get(last_topic, "I don't have more info on that.")}" else: reply = "Sorry, I don't have an answer for that." return {"reply": reply}