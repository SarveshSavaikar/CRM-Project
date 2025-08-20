from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
import time
import tempfile
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from webdriver_manager.chrome import ChromeDriverManager

app = FastAPI()

def fetch_whatsapp_chats(limit=20):
    # Configure Chrome options
    options = Options()
    # Use a temporary user profile to avoid conflicts
    options.add_argument(f"--user-data-dir={tempfile.mkdtemp()}")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--disable-extensions")
    options.add_argument("--disable-blink-features=AutomationControlled")
    options.add_argument("--remote-debugging-port=9222")
    options.add_argument("--start-maximized")
    # options.add_argument("--headless=new")  # Optional: headless mode

    service = Service(ChromeDriverManager().install())
    driver = webdriver.Chrome(service=service, options=options)

    try:
        driver.get("https://web.whatsapp.com")
        print("Please scan QR code if not already logged in...")
        time.sleep(120)  # Wait for QR scan or page load

        def get_chats(limit):
            # Use grid role for WhatsApp Web's new layout
            chat_list_panel = driver.find_element(By.XPATH, '//div[@aria-label="Chat list"]')
            chats = chat_list_panel.find_elements(By.XPATH, './/div[contains(@role,"grid")]')

            print(f"Number of chats found initially: {len(chats)}")

            last_height = driver.execute_script("return arguments[0].scrollHeight", chat_list_panel)
            while len(chats) < limit:
                driver.execute_script("arguments[0].scrollTop = arguments[0].scrollHeight", chat_list_panel)
                time.sleep(2)
                chats = chat_list_panel.find_elements(By.XPATH, './/div[contains(@role,"grid")]')
                print(f"Number of chats after scrolling: {len(chats)}")
                new_height = driver.execute_script("return arguments[0].scrollHeight", chat_list_panel)
                if new_height == last_height:
                    break
                last_height = new_height
            return chats[:limit]

        chat_elements = get_chats(limit)
        print(f"Total chats to process: {len(chat_elements)}")

        all_chats = {}

        for i, chat in enumerate(chat_elements):
            try:
                driver.execute_script("arguments[0].scrollIntoView();", chat)
                chat.click()
                time.sleep(3)
                try:
                    contact_name = driver.find_element(By.XPATH, '//header//span[@dir="auto"]').text
                except Exception:
                    contact_name = f"Contact_{i}"

                message_panel = driver.find_element(By.XPATH, '//div[@data-tab="8"]')
                driver.execute_script("arguments[0].scrollTop = 0", message_panel)
                time.sleep(1)

                messages = driver.find_elements(By.XPATH, '//div[contains(@class, "message-in") or contains(@class, "message-out")]')
                chat_history = []
                for msg in messages:
                    try:
                        text = msg.find_element(By.XPATH, './/span[contains(@class,"selectable-text")]').text
                        chat_history.append(text)
                    except Exception:
                        continue

                all_chats[contact_name] = chat_history

            except Exception:
                continue  # Skip problematic chats

        print(f"Total chats fetched: {len(all_chats)}")
        return all_chats

    finally:
        driver.quit()

@app.get("/whatsapp/chats")
def get_whatsapp_chats(limit: int = 20):
    try:
        chats = fetch_whatsapp_chats(limit=limit)
        return JSONResponse(content=chats)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
