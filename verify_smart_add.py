from playwright.sync_api import sync_playwright
import time
import os
import json
import datetime

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        try:
            print("Navigating to app...")
            page.goto("http://localhost:3000")

            # Bypass login
            print("Injecting login token...")
            user_data = {
                "sub": "test-user-id",
                "name": "Test User",
                "email": "test@example.com",
                "picture": ""
            }
            user_json = json.dumps(user_data)
            page.evaluate(f"localStorage.setItem('user', '{user_json}');")
            page.evaluate("localStorage.setItem('userId', 'test-user-id');")
            page.evaluate("localStorage.setItem('authToken', 'fake-token');")

            print("Reloading to apply login...")
            page.reload()

            # Wait for task list
            print("Waiting for task list...")
            page.wait_for_selector("div.task-list", timeout=10000)
            print("Logged in successfully (bypassed).")

            # Click Smart Add button
            print("Clicking Smart Add...")
            page.click("button:has-text('Smart Add')")

            # Wait for Smart Input
            page.wait_for_selector("input[placeholder*='Call Mom tomorrow']", timeout=5000)
            print("Smart Input visible.")

            # Type natural language command
            # We use a date relative to now so it works whenever run
            # "Buy groceries next Friday at 5pm"
            print("Typing natural language command...")
            page.fill("input[placeholder*='Call Mom tomorrow']", "Buy groceries next Friday at 5pm")

            # Wait a moment for parsing logic
            time.sleep(1)

            # Check if Title input is populated
            title_value = page.input_value("input[placeholder='What needs to be done? *']")
            print(f"Title populated as: {title_value}")

            if title_value != "Buy groceries next Friday at 5pm":
                 raise Exception("Title was not populated correctly from Smart Input")

            # Check if Due Date is populated
            # The input type=datetime-local value format is YYYY-MM-DDTHH:mm
            due_date_value = page.input_value("input[type='datetime-local']")
            print(f"Due Date populated as: {due_date_value}")

            if not due_date_value:
                 raise Exception("Due date was not populated from Smart Input")

            # Take screenshot
            if not os.path.exists("/home/jules/verification"):
                os.makedirs("/home/jules/verification")
            page.screenshot(path="/home/jules/verification/smart_add.png")
            print("Screenshot taken: smart_add.png")

            # Click Add Task
            page.click("button:has-text('Add Task')")

            # Verify task added to list
            print("Waiting for task in list...")
            page.wait_for_selector("div.task-title:has-text('Buy groceries next Friday at 5pm')", timeout=10000)

            print("Smart Task added successfully!")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/smart_add_error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
