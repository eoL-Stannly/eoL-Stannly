"""
Basic Scrapling Fetcher Example
================================
Demonstrates simple HTTP requests and CSS/XPath selectors using Scrapling's
Fetcher class with TLS fingerprint impersonation.
"""

from scrapling.fetchers import Fetcher


def scrape_quotes():
    """Scrape quotes from quotes.toscrape.com using basic Fetcher."""
    page = Fetcher.get("https://quotes.toscrape.com/", impersonate="chrome")

    # CSS selectors (Scrapy-style pseudo-elements supported)
    quotes = page.css(".quote .text::text").getall()
    authors = page.css(".quote .author::text").getall()

    for quote, author in zip(quotes, authors):
        print(f"{quote}\n  — {author}\n")


def scrape_with_xpath():
    """Same scrape using XPath selectors."""
    page = Fetcher.get("https://quotes.toscrape.com/", impersonate="chrome")

    quotes = page.xpath('//span[@class="text"]/text()').getall()
    authors = page.xpath('//small[@class="author"]/text()').getall()

    for quote, author in zip(quotes, authors):
        print(f"{quote}\n  — {author}\n")


def scrape_with_find():
    """BeautifulSoup-style selection."""
    page = Fetcher.get("https://quotes.toscrape.com/", impersonate="chrome")

    quote_divs = page.find_all("div", class_="quote")
    for div in quote_divs:
        text = div.css(".text::text").get()
        author = div.css(".author::text").get()
        tags = div.css(".tag::text").getall()
        print(f"{text}\n  — {author}  Tags: {', '.join(tags)}\n")


if __name__ == "__main__":
    print("=== CSS Selector Approach ===\n")
    scrape_quotes()

    print("\n=== XPath Approach ===\n")
    scrape_with_xpath()

    print("\n=== BeautifulSoup-style Approach ===\n")
    scrape_with_find()
