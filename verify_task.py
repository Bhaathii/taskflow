from playwright.sync_api import sync_playwright
import time
import os
import json

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Capture console logs
        page.on("console", lambda msg: print(f"Browser Console: {msg.text}"))

        try:
            print("Navigating to app...")
            page.goto("http://localhost:3000")

            # Bypass login by setting localStorage
            print("Injecting login token...")
            user_data = {
                "sub": "test-user-id",
                "name": "Test User",
                "email": "test@example.com",
                "picture": ""
            }
            # json.dumps produces double quotes, which we need to escape for the JS string if we insert directly
            # but page.evaluate can take args.

            # Using evaluate with args is cleaner but let's just use string interpolation carefully
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

            # Take a screenshot of the form
            time.sleep(1)
            if not os.path.exists("/home/jules/verification"):
                os.makedirs("/home/jules/verification")
            page.screenshot(path="/home/jules/verification/task_form.png")
            print("Screenshot taken: task_form.png")

            # Add a new task with due date
            print("Adding a new task...")
            task_title = "Test Task with Due Date"
            page.fill("input[placeholder='What needs to be done? *']", task_title)

            # Set due date (tomorrow at 10:00 AM)
            # datetime-local format: YYYY-MM-DDTHH:mm
            page.fill("input[type='datetime-local']", "2024-12-31T10:00")

            # Check reminder
            page.check("input[type='checkbox']")

            # Click add
            page.click("button:has-text('Add Task')")

            # Wait for task to appear
            print("Waiting for task to appear in list...")
            page.wait_for_selector(f"div.task-title:has-text('{task_title}')", timeout=30000)

            print("Task added successfully!")

            # Verify due date is displayed
            page.screenshot(path="/home/jules/verification/task_list.png")
            print("Screenshot taken: task_list.png")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path="/home/jules/verification/error_state.png")
            print("Screenshot taken: error_state.png")
        finally:
            browser.close()

if __name__ == "__main__":
    run()
