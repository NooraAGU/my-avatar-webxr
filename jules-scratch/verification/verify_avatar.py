from playwright.sync_api import sync_playwright, expect

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()

        # Listen for console messages and wait for the specific one
        try:
            with page.expect_console_message(timeout=15000) as console_info:
                page.goto("http://localhost:8000")
            console_message = console_info.value
            print(f"Browser console: {console_message.text}")
            while "GLB model loaded successfully" not in console_message.text:
                console_message = page.wait_for_event("console")
                print(f"Browser console: {console_message.text}")

        except Exception as e:
            print(f"Did not receive console message: {e}")


        # Wait for the canvas to be rendered
        canvas = page.locator("canvas")
        try:
            expect(canvas).to_be_visible(timeout=1000)
            print("Canvas is visible.")
            page.wait_for_timeout(1000) # Give it a second to render
            page.screenshot(path="jules-scratch/verification/verification.png")
            print("Screenshot taken.")
        except Exception as e:
            print(f"Error: {e}")
            print("Canvas not found or not visible.")

        browser.close()

if __name__ == "__main__":
    run()
