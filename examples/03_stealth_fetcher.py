"""
Stealth & Dynamic Fetcher Example
====================================
Demonstrates StealthySession for bypassing anti-bot protections (e.g.
Cloudflare) and DynamicSession for full browser automation via Playwright.

Requirements:
    pip install "scrapling[fetchers]"
    scrapling install
"""

from scrapling.fetchers import StealthySession, DynamicSession


def stealth_scrape():
    """
    Use StealthySession to bypass Cloudflare and similar protections.

    StealthySession uses a real browser under the hood with anti-detection
    patches, making it very difficult for sites to distinguish from a
    real user.
    """
    with StealthySession(headless=True, solve_cloudflare=True) as session:
        page = session.fetch(
            "https://quotes.toscrape.com/",
            google_search=False,
        )
        quotes = page.css(".quote .text::text").getall()
        print(f"Stealth fetched {len(quotes)} quotes")
        for q in quotes[:3]:
            print(f"  {q}")


def dynamic_scrape():
    """
    Use DynamicSession for JavaScript-heavy pages that require full
    browser rendering. Powered by Playwright.
    """
    with DynamicSession(headless=True, network_idle=True) as session:
        page = session.fetch(
            "https://quotes.toscrape.com/js/",
            load_dom=False,
        )
        # This page loads quotes via JavaScript — standard HTTP won't work
        quotes = page.xpath('//span[@class="text"]/text()').getall()
        print(f"Dynamic fetched {len(quotes)} JS-rendered quotes")
        for q in quotes[:3]:
            print(f"  {q}")


if __name__ == "__main__":
    print("=== Stealth Fetcher (Anti-Bot Bypass) ===\n")
    stealth_scrape()

    print("\n=== Dynamic Fetcher (JS Rendering) ===\n")
    dynamic_scrape()
