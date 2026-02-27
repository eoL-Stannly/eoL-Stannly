"""
Session-Based Fetching Example
================================
Demonstrates FetcherSession for persistent cookies/state across multiple
requests, with TLS fingerprint impersonation and stealth headers.
"""

from scrapling.fetchers import FetcherSession


def scrape_with_session():
    """Use a persistent session to scrape multiple pages."""
    with FetcherSession(impersonate="chrome") as session:
        # First request — session cookies are stored automatically
        page1 = session.get(
            "https://quotes.toscrape.com/",
            stealthy_headers=True,
        )
        print(f"Page 1 title: {page1.css('title::text').get()}")

        quotes_page1 = page1.css(".quote .text::text").getall()
        print(f"Quotes on page 1: {len(quotes_page1)}")

        # Follow pagination link using the same session
        next_link = page1.css("li.next a::attr(href)").get()
        if next_link:
            page2 = session.get(
                f"https://quotes.toscrape.com{next_link}",
                stealthy_headers=True,
            )
            quotes_page2 = page2.css(".quote .text::text").getall()
            print(f"Quotes on page 2: {len(quotes_page2)}")


def scrape_all_pages():
    """Iterate through all paginated pages."""
    all_quotes = []

    with FetcherSession(impersonate="chrome") as session:
        url = "https://quotes.toscrape.com/"

        while url:
            page = session.get(url, stealthy_headers=True)

            for quote_el in page.css(".quote"):
                all_quotes.append({
                    "text": quote_el.css(".text::text").get(),
                    "author": quote_el.css(".author::text").get(),
                    "tags": quote_el.css(".tag::text").getall(),
                })

            # Check for next page
            next_link = page.css("li.next a::attr(href)").get()
            url = f"https://quotes.toscrape.com{next_link}" if next_link else None

    print(f"\nTotal quotes scraped: {len(all_quotes)}")
    for q in all_quotes[:5]:
        print(f"  {q['text'][:60]}... — {q['author']}")
    if len(all_quotes) > 5:
        print(f"  ... and {len(all_quotes) - 5} more")


if __name__ == "__main__":
    print("=== Session-Based Multi-Page Scraping ===\n")
    scrape_with_session()

    print("\n=== Full Pagination Crawl ===\n")
    scrape_all_pages()
