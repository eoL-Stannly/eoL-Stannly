"""
Reusable scraper utilities built on Scrapling.

This module provides helper functions that wrap common Scrapling patterns
into a clean, importable interface for your own scraping projects.
"""

from scrapling.fetchers import Fetcher, FetcherSession


def fetch_page(url: str, impersonate: str = "chrome"):
    """Fetch a single page and return the parsed response."""
    return Fetcher.get(url, impersonate=impersonate)


def fetch_all_pages(start_url: str, next_selector: str = "li.next a::attr(href)"):
    """
    Iterate through paginated pages using a session.

    Args:
        start_url: The first page URL.
        next_selector: CSS selector for the "next page" link's href.

    Yields:
        Parsed page responses, one per page.
    """
    with FetcherSession(impersonate="chrome") as session:
        url = start_url
        while url:
            page = session.get(url, stealthy_headers=True)
            yield page
            next_href = page.css(next_selector).get()
            if next_href:
                # Handle both absolute and relative URLs
                if next_href.startswith("http"):
                    url = next_href
                else:
                    # Build absolute URL from base
                    from urllib.parse import urljoin
                    url = urljoin(url, next_href)
            else:
                url = None


def extract_table(page, table_selector: str = "table"):
    """
    Extract data from an HTML table into a list of dicts.

    Args:
        page: A Scrapling parsed page/element.
        table_selector: CSS selector for the target table.

    Returns:
        List of dicts with header names as keys.
    """
    table = page.css(table_selector)
    if not table:
        return []

    table = table[0]
    headers = table.css("th::text").getall()
    rows = []
    for tr in table.css("tbody tr"):
        cells = tr.css("td::text").getall()
        if headers and len(cells) == len(headers):
            rows.append(dict(zip(headers, cells)))
        else:
            rows.append({"cells": cells})

    return rows
