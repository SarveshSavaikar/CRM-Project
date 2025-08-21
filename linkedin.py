from fastapi import APIRouter, HTTPException
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
import time, random

from app.core.config import settings

LOGIN_URL = "https://www.linkedin.com/login"
MESSAGING_URL = "https://www.linkedin.com/messaging/"

# Router instance
router = APIRouter(prefix="/linkedin", tags=["LinkedIn Scraper"])


def init_driver():
    """Initialize Chrome WebDriver with options."""
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless=new")  # Uncomment for headless mode
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)
    return driver


def linkedin_login(driver):
    """Login to LinkedIn using credentials from settings"""
    driver.get(LOGIN_URL)

    WebDriverWait(driver, 15).until(EC.presence_of_element_located((By.ID, "username")))

    driver.find_element(By.ID, "username").send_keys(settings.linkedin_email)
    driver.find_element(By.ID, "password").send_keys(settings.linkedin_password, Keys.RETURN)

    WebDriverWait(driver, 30).until(EC.url_contains("feed"))
    return True


def scrape_messages(driver):
    """Scrape message previews from LinkedIn Messaging"""
    driver.get(MESSAGING_URL)

    # Wait for conversation list to load
    WebDriverWait(driver, 30).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, "li.msg-conversation-listitem"))
    )

    messages = []

    # Scroll to load more conversations (LinkedIn lazy loads)
    last_height = driver.execute_script("return document.querySelector('.msg-conversations-container__conversations-list').scrollHeight")
    while True:
        driver.execute_script("document.querySelector('.msg-conversations-container__conversations-list').scrollTo(0, document.querySelector('.msg-conversations-container__conversations-list').scrollHeight);")
        time.sleep(2)

        new_height = driver.execute_script("return document.querySelector('.msg-conversations-container__conversations-list').scrollHeight")
        if new_height == last_height:
            break
        last_height = new_height

    # Now fetch all loaded conversations
    conversations = driver.find_elements(By.CSS_SELECTOR, "li.msg-conversation-listitem")

    for conv in conversations:
        try:
            name_elem = conv.find_element(By.CSS_SELECTOR, "h3.msg-conversation-listitem__participant-names")
            msg_elem = conv.find_element(By.CSS_SELECTOR, "p.msg-conversation-card__message-snippet")

            name_text = name_elem.text.strip()
            msg_text = msg_elem.text.strip()

            if name_text:
                messages.append({
                    "name": name_text,
                    "message": msg_text
                })
        except:
            continue

        time.sleep(random.uniform(0.2, 0.6))  # mimic human behavior

    return messages


@router.get("/messages")
def get_linkedin_messages():
    """API endpoint to fetch LinkedIn messages"""
    driver = init_driver()
    try:
        linkedin_login(driver)
        messages = scrape_messages(driver)
        return {"messages": messages}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        driver.quit()
