#!/usr/bin/env python3
"""
Script to open a browser and navigate to Twitter/X login page.
"""

from playwright.sync_api import sync_playwright


def open_twitter_login():
    """Opens a browser and navigates to Twitter login page."""
    with sync_playwright() as p:
        # Launch browser (you can change 'chromium' to 'firefox' or 'webkit' if needed)
        browser = p.chromium.launch(headless=False)  # headless=False to see the browser
        
        # Create a new page
        page = browser.new_page()
        
        # Navigate to Twitter login
        print("Navigating to Twitter login page...")
        page.goto("https://twitter.com/i/flow/login")
        
        print("Browser opened! Please log in manually.")
        print("Press Enter in the terminal when you're done...")
        
        # Wait for user to press Enter before closing
        input()
        
        # Keep browser open for a few more seconds, or close immediately
        print("Closing browser...")
        browser.close()


if __name__ == "__main__":
    open_twitter_login()
