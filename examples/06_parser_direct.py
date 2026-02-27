"""
Direct Parser Usage Example
==============================
Demonstrates using Scrapling's Selector/parser directly on HTML strings,
without making any HTTP requests. Useful for parsing saved HTML or
integrating with other HTTP libraries.
"""

from scrapling.parser import Selector

SAMPLE_HTML = """
<!DOCTYPE html>
<html>
<head><title>Sample Products</title></head>
<body>
    <div class="products">
        <div class="product" data-id="1">
            <h2 class="name">Wireless Mouse</h2>
            <span class="price">$29.99</span>
            <p class="description">Ergonomic wireless mouse with USB receiver.</p>
            <ul class="features">
                <li>2.4GHz wireless</li>
                <li>1600 DPI</li>
                <li>6-month battery</li>
            </ul>
        </div>
        <div class="product" data-id="2">
            <h2 class="name">Mechanical Keyboard</h2>
            <span class="price">$79.99</span>
            <p class="description">Full-size mechanical keyboard with RGB.</p>
            <ul class="features">
                <li>Cherry MX switches</li>
                <li>RGB backlight</li>
                <li>USB-C</li>
            </ul>
        </div>
        <div class="product" data-id="3">
            <h2 class="name">USB-C Hub</h2>
            <span class="price">$49.99</span>
            <p class="description">7-in-1 USB-C hub with HDMI output.</p>
            <ul class="features">
                <li>HDMI 4K@60Hz</li>
                <li>USB 3.0 ports</li>
                <li>SD card reader</li>
            </ul>
        </div>
    </div>
</body>
</html>
"""


def parse_products():
    """Parse product data from an HTML string."""
    page = Selector(SAMPLE_HTML)

    print(f"Page title: {page.css('title::text').get()}\n")

    products = []
    for product in page.css(".product"):
        products.append({
            "id": product.attrib.get("data-id"),
            "name": product.css(".name::text").get(),
            "price": product.css(".price::text").get(),
            "description": product.css(".description::text").get(),
            "features": product.css(".features li::text").getall(),
        })

    for p in products:
        print(f"[{p['id']}] {p['name']} — {p['price']}")
        print(f"    {p['description']}")
        print(f"    Features: {', '.join(p['features'])}")
        print()


def xpath_on_html():
    """Use XPath queries on parsed HTML."""
    page = Selector(SAMPLE_HTML)

    prices = page.xpath('//span[@class="price"]/text()').getall()
    print(f"All prices: {prices}")

    expensive = page.xpath(
        '//div[@class="product"][.//span[@class="price"][contains(text(), "79")]]'
        '//h2/text()'
    ).getall()
    print(f"Products around $79: {expensive}")


if __name__ == "__main__":
    print("=== Parse HTML String ===\n")
    parse_products()

    print("=== XPath Queries ===\n")
    xpath_on_html()
