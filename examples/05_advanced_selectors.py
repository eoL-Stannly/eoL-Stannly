"""
Advanced Selectors & Element Navigation
==========================================
Demonstrates Scrapling's powerful element selection capabilities including
text search, sibling/parent navigation, similarity matching, and spatial
element discovery.
"""

from scrapling.fetchers import Fetcher


def text_based_selection():
    """Find elements by their text content."""
    page = Fetcher.get("https://quotes.toscrape.com/", impersonate="chrome")

    # Find elements containing specific text
    love_quotes = page.find_by_text("love", tag="span")
    print(f"Quotes mentioning 'love': {len(love_quotes)}")
    for el in love_quotes:
        print(f"  {el.text[:80]}...")


def element_navigation():
    """Navigate DOM using parent, sibling, and spatial methods."""
    page = Fetcher.get("https://quotes.toscrape.com/", impersonate="chrome")

    first_quote = page.css(".quote")[0]
    print(f"First quote text: {first_quote.css('.text::text').get()[:60]}...")

    # Navigate to parent
    parent = first_quote.parent
    print(f"Parent tag: <{parent.tag}>")

    # Find similar elements (other quotes with the same structure)
    similar = first_quote.find_similar()
    print(f"Similar elements found: {len(similar)}")


def css_pseudo_selectors():
    """Use Scrapy-compatible CSS pseudo-element selectors."""
    page = Fetcher.get("https://quotes.toscrape.com/", impersonate="chrome")

    # ::text extracts text content
    first_author = page.css(".author::text").get()
    print(f"First author: {first_author}")

    # ::attr(name) extracts attribute values
    first_link = page.css("a::attr(href)").get()
    print(f"First link href: {first_link}")

    # getall() returns all matches as a list
    all_tags = page.css(".tag::text").getall()
    unique_tags = sorted(set(all_tags))
    print(f"Unique tags: {', '.join(unique_tags)}")


if __name__ == "__main__":
    print("=== Text-Based Selection ===\n")
    text_based_selection()

    print("\n=== Element Navigation ===\n")
    element_navigation()

    print("\n=== CSS Pseudo-Selectors ===\n")
    css_pseudo_selectors()
