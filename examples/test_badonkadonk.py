"""Test Scrapling against https://www.badonkadonk.xyz/"""

from scrapling.fetchers import Fetcher


def test_scrape():
    print("Fetching https://www.badonkadonk.xyz/ ...")
    page = Fetcher.get("https://www.badonkadonk.xyz/", impersonate="chrome")

    print(f"Status: {page.status}")
    print(f"Title: {page.css('title::text').get()}")
    print()

    # Extract all text content
    headings = page.css("h1::text, h2::text, h3::text").getall()
    if headings:
        print("Headings found:")
        for h in headings:
            print(f"  - {h.strip()}")

    # Extract all links
    links = page.css("a::attr(href)").getall()
    if links:
        print(f"\nLinks found ({len(links)}):")
        for link in links[:20]:
            text = page.css(f'a[href="{link}"]::text').get() or ""
            print(f"  {text.strip():30s} -> {link}")

    # Extract paragraphs
    paragraphs = page.css("p::text").getall()
    if paragraphs:
        print(f"\nParagraphs ({len(paragraphs)}):")
        for p in paragraphs[:10]:
            print(f"  {p.strip()[:100]}")

    # Extract images
    images = page.css("img::attr(src)").getall()
    if images:
        print(f"\nImages ({len(images)}):")
        for img in images[:10]:
            alt = page.css(f'img[src="{img}"]::attr(alt)').get() or ""
            print(f"  [{alt}] {img}")

    # Raw element count
    all_elements = page.css("*")
    print(f"\nTotal DOM elements: {len(all_elements)}")


if __name__ == "__main__":
    test_scrape()
