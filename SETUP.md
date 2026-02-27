# Scrapling Scraping Setup

Learn web scraping using [Scrapling](https://github.com/D4Vinci/Scrapling) — an adaptive framework that handles everything from simple requests to full-scale crawling with anti-bot bypass.

## Quick Start

```bash
# 1. Create a virtual environment
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# 2. Install Scrapling
pip install -r requirements.txt

# 3. (Optional) Install browser-based fetchers for stealth/dynamic scraping
pip install "scrapling[fetchers]"
scrapling install
```

## Project Structure

```
├── examples/
│   ├── 01_basic_fetcher.py       # Simple HTTP requests + CSS/XPath selectors
│   ├── 02_session_fetcher.py     # Persistent sessions + pagination
│   ├── 03_stealth_fetcher.py     # Anti-bot bypass + browser automation
│   ├── 04_spider_crawl.py        # Scrapy-like spider framework
│   ├── 05_advanced_selectors.py  # Text search, navigation, similarity
│   └── 06_parser_direct.py       # Parse HTML strings without HTTP
├── scrapling_project/
│   ├── __init__.py
│   └── scraper.py                # Reusable scraper utilities
├── requirements.txt
└── pyproject.toml
```

## Running Examples

```bash
# Basic fetching
python examples/01_basic_fetcher.py

# Session-based pagination
python examples/02_session_fetcher.py

# Stealth mode (requires fetchers extra)
python examples/03_stealth_fetcher.py

# Spider crawling
python examples/04_spider_crawl.py

# Advanced selectors
python examples/05_advanced_selectors.py

# Parse HTML directly (no network needed)
python examples/06_parser_direct.py
```

## Key Concepts

### Fetcher Types

| Fetcher | Use Case | Requires Browser? |
|---------|----------|-------------------|
| `Fetcher` | Basic HTTP with TLS impersonation | No |
| `FetcherSession` | Persistent cookies/state | No |
| `StealthySession` | Bypass Cloudflare, anti-bot | Yes |
| `DynamicSession` | JS-heavy pages (Playwright) | Yes |

### Selector Methods

```python
page.css('.class::text')           # CSS with pseudo-elements
page.xpath('//div/text()')         # XPath
page.find_all('div', class_='x')   # BeautifulSoup-style
page.find_by_text('keyword')       # Text content search
element.parent                      # DOM navigation
element.find_similar()              # Structural similarity
```

### Spider Framework

```python
from scrapling.spiders import Spider, Response

class MySpider(Spider):
    name = "my_spider"
    start_urls = ["https://example.com"]
    concurrent_requests = 10

    async def parse(self, response: Response):
        yield {"data": response.css("h1::text").get()}
        yield response.follow("/next-page")
```

## Resources

- [Scrapling Documentation](https://scrapling.readthedocs.io/)
- [Scrapling GitHub](https://github.com/D4Vinci/Scrapling)
