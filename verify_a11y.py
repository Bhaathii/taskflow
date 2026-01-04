from playwright.sync_api import sync_playwright
import json
import time

def run():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Bypass Login
        auth_data = {
            "user": json.dumps({"_id": "test-user-id", "name": "Test User", "email": "test@example.com"}),
            "userId": "test-user-id",
            "authToken": "mock-token"
        }

        page.add_init_script(f"""
            Object.assign(localStorage, {{
                'user': '{auth_data["user"]}',
                'userId': '{auth_data["userId"]}',
                'authToken': '{auth_data["authToken"]}'
            }});
        """)

        print("Navigating to http://localhost:3000 ...")
        try:
            page.goto("http://localhost:3000")
        except Exception as e:
            print(f"Navigation failed: {e}")
            return

        try:
            # Wait for form
            print("Waiting for task form...")
            page.wait_for_selector(".task-form", state="visible", timeout=15000)
            print("Task form visible")

            # 1. Check Smart Add Button Attributes (Initial State)
            print("Looking for button with name='Switch to smart input mode'...")
            btn_initial = page.get_by_role("button", name="Switch to smart input mode")

            if btn_initial.count() == 0:
                print("⚠️ Accessible name not found. Trying visible text 'Smart Add'...")
                btn_initial = page.get_by_role("button", name="Smart Add")

            if btn_initial.count() > 0:
                print("✅ Smart Add button found.")
                expanded = btn_initial.get_attribute("aria-expanded")
                pressed = btn_initial.get_attribute("aria-pressed")
                print(f"  aria-expanded: {expanded}")
                print(f"  aria-pressed: {pressed}")

                if expanded == "false" and pressed == "false":
                    print("  ✅ Initial state correct (false/false).")
                else:
                    print("  ❌ Initial state INCORRECT.")

                # Toggle it
                print("Clicking button...")
                btn_initial.click()

                # 2. Check Smart Add Button Attributes (Toggled State)
                # The label changes, so we need a NEW locator
                print("Looking for button with name='Switch to simple input mode'...")
                btn_toggled = page.get_by_role("button", name="Switch to simple input mode")
                btn_toggled.wait_for()

                expanded = btn_toggled.get_attribute("aria-expanded")
                label = btn_toggled.get_attribute("aria-label")
                print(f"  Post-click aria-expanded: {expanded}")
                print(f"  Post-click aria-label: {label}")

                if expanded == "true":
                    print("  ✅ Toggled state correct (expanded=true).")
                else:
                    print(f"  ❌ Toggled state INCORRECT. Got {expanded}")

                # 3. Check Smart Input association
                print("Checking Smart Input associations...")
                # The input should now be visible
                smart_input = page.get_by_label("Smart Input")
                if smart_input.count() > 0:
                    described_by = smart_input.get_attribute("aria-describedby")
                    print(f"  Smart Input aria-describedby: {described_by}")

                    if described_by:
                        # Check if the element exists
                        helper = page.locator(f"#{described_by}")
                        if helper.count() > 0:
                            print(f"  ✅ Helper text found linked via ID: {described_by}")
                            print(f"  Helper text content: {helper.text_content().strip()}")
                        else:
                            print("  ❌ Helper element ID not found in DOM.")
                    else:
                        print("  ❌ aria-describedby attribute missing.")
                else:
                    print("  ❌ Smart Input field not found (did it toggle?).")

            else:
                print("❌ Smart Add button not found at all.")

            # 4. Check Error Alert Role
            # Force an error
            print("Triggering error (submit empty)...")
            submit_btn = page.get_by_role("button", name="Add Task")
            submit_btn.click()

            error_msg = page.get_by_role("alert")
            # Wait briefly for error to appear
            time.sleep(0.5)
            if error_msg.count() > 0:
                print("✅ Error message with role='alert' found.")
                print(f"  Content: {error_msg.text_content()}")
            else:
                print("❌ Error message not found or missing role='alert'.")

        except Exception as e:
            print(f"Error during verification: {e}")
            import traceback
            traceback.print_exc()
            page.screenshot(path="verification_failure.png")

        browser.close()

if __name__ == "__main__":
    run()
