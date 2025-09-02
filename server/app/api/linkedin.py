from fastapi import APIRouter, HTTPException
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time, random
from app.core.config import settings

LOGIN_URL = "https://www.linkedin.com/login"
MESSAGING_URL = "https://www.linkedin.com/messaging/"

router = APIRouter(prefix="/linkedin", tags=["LinkedIn Scraper"])

def init_driver():
    options = webdriver.ChromeOptions()
    # options.add_argument("--headless=new")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--start-maximized")
    return webdriver.Chrome(options=options)

def linkedin_login(driver):
    driver.get(LOGIN_URL)
    WebDriverWait(driver, 10).until(EC.presence_of_element_located((By.ID, "username")))

    driver.find_element(By.ID, "username").send_keys(settings.linkedin_email)
    driver.find_element(By.ID, "password").send_keys(settings.linkedin_password, Keys.RETURN)

    WebDriverWait(driver, 30).until(EC.url_contains("feed"))
    return True

def scrape_message_metadata(driver, max_conversations=10, max_messages=20):
    """Scrape LinkedIn messages with metadata"""
    driver.get(MESSAGING_URL)
    WebDriverWait(driver, 20).until(
        EC.presence_of_all_elements_located((By.CSS_SELECTOR, ".msg-conversation-listitem"))
    )

    conversations = driver.find_elements(By.CSS_SELECTOR, ".msg-conversation-listitem")
    all_conversations = []

    for index, convo in enumerate(conversations[:max_conversations]):
        try:
            driver.execute_script("arguments[0].scrollIntoView(true);", convo)
            convo.click()
            opened_at = time.strftime("%Y-%m-%d %H:%M:%S")
            time.sleep(random.uniform(2, 3))

            # Conversation details
            try:
                participant = driver.find_element(By.CSS_SELECTOR, ".msg-thread__thread-heading h2").text.strip()
            except:
                participant = "Unknown"

            # Detect if unread
            try:
                unread_flag = "unread" in convo.get_attribute("class").lower()
            except:
                unread_flag = False

            # Collect messages
            msgs = driver.find_elements(By.CSS_SELECTOR, ".msg-s-message-list__event")
            convo_msgs = []

            # Scroll up to load more history
            msg_panel = driver.find_element(By.CSS_SELECTOR, ".msg-s-message-list-content")
            for _ in range(2):
                driver.execute_script("arguments[0].scrollTop = 0;", msg_panel)
                time.sleep(1.5)

            for msg in msgs[-max_messages:]:
                try:
                    sender = msg.find_element(By.CSS_SELECTOR, ".msg-s-message-group__profile-link").text.strip()
                except:
                    sender = "You"

                try:
                    content = msg.find_element(By.CSS_SELECTOR, ".msg-s-event-listitem__body").text.strip()
                except:
                    content = "[Media/Attachment]"

                try:
                    timestamp = msg.find_element(By.TAG_NAME, "time").get_attribute("datetime")
                except:
                    timestamp = ""

                try:
                    status = msg.find_element(By.CSS_SELECTOR, ".msg-s-event-status__text").text.strip()
                except:
                    status = "Sent"

                convo_msgs.append({
                    "sender": sender,
                    "message": content,
                    "timestamp": timestamp,
                    "status": status
                })

            all_conversations.append({
                "participant": participant,
                "opened_at": opened_at,
                "unread": unread_flag,
                "total_messages": len(convo_msgs),
                "last_message": convo_msgs[-1] if convo_msgs else None,
                "messages": convo_msgs
            })

            time.sleep(random.uniform(1.5, 2.5))

        except Exception as e:
            print(f"Error in conversation {index}: {e}")
            continue

    return all_conversations

@router.get("/messages/details")
def get_linkedin_message_details():
    driver = init_driver()   
    try:
        linkedin_login(driver)
        conversations = scrape_message_metadata(driver)
        return {"status": "success", "conversations": conversations}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        driver.quit()
