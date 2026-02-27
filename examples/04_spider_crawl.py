"""
Spider-Based Crawling Example
================================
Demonstrates Scrapling's Scrapy-like Spider API for structured, concurrent
web crawling with automatic pagination and data export.
"""

from scrapling.spiders import Spider, Response


class QuotesSpider(Spider):
    """Crawl all pages of quotes.toscrape.com concurrently."""

    name = "quotes"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 5

    async def parse(self, response: Response):
        """Parse a page of quotes and follow pagination links."""
        for quote in response.css(".quote"):
            yield {
                "text": quote.css(".text::text").get(),
                "author": quote.css(".author::text").get(),
                "tags": quote.css(".tag::text").getall(),
            }

        # Follow the "next" pagination link
        next_page = response.css("li.next a")
        if next_page:
            yield response.follow(next_page[0].attrib["href"])


class AuthorSpider(Spider):
    """Crawl quotes and then follow links to each author's detail page."""

    name = "authors"
    start_urls = ["https://quotes.toscrape.com/"]
    concurrent_requests = 10

    async def parse(self, response: Response):
        """Extract author links and follow them."""
        for quote in response.css(".quote"):
            author_url = quote.css(".author + a::attr(href)").get()
            if author_url:
                yield response.follow(author_url, callback=self.parse_author)

        next_page = response.css("li.next a")
        if next_page:
            yield response.follow(next_page[0].attrib["href"])

    async def parse_author(self, response: Response):
        """Parse author detail page."""
        yield {
            "name": response.css(".author-title::text").get("").strip(),
            "born_date": response.css(".author-born-date::text").get("").strip(),
            "born_location": response.css(".author-born-location::text").get("").strip(),
            "bio": response.css(".author-description::text").get("").strip()[:200],
        }


if __name__ == "__main__":
    print("=== Quotes Spider ===\n")
    result = QuotesSpider().start()
    print(f"Scraped {len(result.items)} quotes")
    for item in result.items[:3]:
        print(f"  {item}")

    print("\n=== Author Spider ===\n")
    result = AuthorSpider().start()
    print(f"Scraped {len(result.items)} authors")
    for item in result.items[:3]:
        print(f"  {item}")
