from fastapi import APIRouter, HTTPException
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, os, random
from app.core.config import settings
# from dotenv import load_dotenv

# # Load .env credentials
# load_dotenv()
# LINKEDIN_EMAIL = os.getenv("LINKEDIN_EMAIL")
# LINKEDIN_PASSWORD = os.getenv("LINKEDIN_PASSWORD")
LOGIN_URL = "https://www.linkedin.com/login"
MESSAGING_URL = "https://www.linkedin.com/messaging/"

# Router instance
router = APIRouter(prefix="/linkedin", tags=["LinkedIn Scraper"])

def init_driver():
    """Initialize Chrome WebDriver with options."""
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless=new")  # run without opening browser
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    return webdriver.Chrome(options=options)

def linkedin_login(driver):
    """Login to LinkedIn using credentials from .env"""
    driver.get(LOGIN_URL)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))

    driver.find_element(By.ID, "username").send_keys(settings.linkedin_email)
    driver.find_element(By.ID, "password").send_keys(settings.linkedin_password, Keys.RETURN)

    WebDriverWait(driver, 50).until(EC.url_contains("feed"))
    return True

def scrape_messages(driver):
    """Scrape message previews from LinkedIn Messaging"""
    driver.get(MESSAGING_URL)
    WebDriverWait(driver, 50).until(
        EC.presence_of_all_elements_located((By.CLASS_NAME, "list-style-none msg-conversations-container__conversations-list"))
    )
    
    names = driver.find_elements(By.CLASS_NAME, "msg-conversation-listitem_participant-names msg-conversation-card_participant-names truncate pr1 t-16 t-blackt-normal")
    snippets = driver.find_elements(By.CLASS_NAME, "msg-conversation-card__message-snippet m0 t-14")

    messages = []
    for name, msg in zip(names, snippets):
        name_text = name.text.strip()
        msg_text = msg.text.strip()
        if name_text and msg_text:
            messages.append({"name": name_text, "message": msg_text})
        time.sleep(random.uniform(0.8, 1.5))  # mimic human behavior

    return messages

@router.get("/messages")
def get_linkedin_messages():
    """API endpoint to fetch LinkedIn messages"""
    driver = init_driver()
    print("Inint successfull")
    try:
        linkedin_login(driver)
        messages = scrape_messages(driver)
        return {"status": "success", "messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        driver.quit()