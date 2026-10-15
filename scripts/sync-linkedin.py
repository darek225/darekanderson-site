#!/usr/bin/env python3
"""Sync Darek's latest LinkedIn posts into assets/linkedin-posts.json.

Usage:
    python3 scripts/sync-linkedin.py

Reads two environment variables:
    LINKEDIN_ACCESS_TOKEN  OAuth 2.0 access token (60-day lifespan; refresh per
                           scripts/linkedin-oauth-setup.md)
    LINKEDIN_AUTHOR_URN    e.g. urn:li:person:abc123 (Darek's own person URN)

Behavior:
  - No token set: prints a notice and exits 0, leaving the seeded file untouched.
  - Token set: GET https://api.linkedin.com/rest/posts?author=<URN>, parses the
    newest posts, and writes assets/linkedin-posts.json as a list of
    {"id", "date", "label"} entries, newest first, deduped by activity id,
    capped at 20. If the request fails or returns no posts, the file is left
    untouched and the script exits non-zero only on a transport/API failure.
  - Stdlib only. The token is never printed, logged, or written anywhere.
"""

import datetime
import json
import os
import sys
import urllib.parse
import urllib.request

API_URL = "https://api.linkedin.com/rest/posts"
LINKEDIN_API_VERSION = "202601"  # verify against current LinkedIn docs
OUT_PATH = os.path.join(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__))),
    "assets",
    "linkedin-posts.json",
)
MAX_POSTS = 20

MONTHS = [
    "JAN", "FEB", "MAR", "APR", "MAY", "JUN",
    "JUL", "AUG", "SEP", "OCT", "NOV", "DEC",
]


def label_for(dt):
    # "LINKEDIN · JUN 4, 2026"
    return "LINKEDIN \u00b7 %s %d, %d" % (MONTHS[dt.month - 1], dt.day, dt.year)


def main():
    token = os.environ.get("LINKEDIN_ACCESS_TOKEN")
    if not token:
        print("sync-linkedin: LINKEDIN_ACCESS_TOKEN is not set; "
              "leaving assets/linkedin-posts.json untouched.")
        return 0

    author = os.environ.get("LINKEDIN_AUTHOR_URN")
    if not author:
        print("sync-linkedin: LINKEDIN_AUTHOR_URN is not set "
              "(e.g. urn:li:person:abc123). See scripts/linkedin-oauth-setup.md; "
              "leaving assets/linkedin-posts.json untouched.", file=sys.stderr)
        return 0

    params = urllib.parse.urlencode({"author": author, "count": MAX_POSTS})
    req = urllib.request.Request(
        API_URL + "?" + params,
        headers={
            "Authorization": "Bearer " + token,
            "LinkedIn-Version": LINKEDIN_API_VERSION,
            "X-Restli-Protocol-Version": "2.0.0",
            "User-Agent": "darekanderson-site-sync/1.0",
        },
    )
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.load(resp)
    except Exception as exc:  # network, auth, or API error: never touch the file
        print("sync-linkedin: request failed (%s); "
              "leaving assets/linkedin-posts.json untouched."
              % type(exc).__name__, file=sys.stderr)
        return 1

    entries = []
    seen = set()
    for element in data.get("elements", []):
        urn = element.get("id", "")
        # urn looks like "urn:li:share:12345" or "urn:li:activity:12345"
        activity_id = urn.rsplit(":", 1)[-1]
        if not activity_id or activity_id in seen:
            continue
        published_at = element.get("publishedAt") or element.get("createdAt")
        try:
            dt = datetime.datetime.fromtimestamp(
                int(published_at) / 1000, tz=datetime.timezone.utc
            )
        except (TypeError, ValueError):
            continue
        seen.add(activity_id)
        entries.append(
            {
                "id": activity_id,
                "date": dt.strftime("%Y-%m-%d"),
                "label": label_for(dt),
            }
        )

    entries.sort(key=lambda e: e["date"], reverse=True)
    entries = entries[:MAX_POSTS]

    if not entries:
        print("sync-linkedin: API returned no posts; "
              "leaving assets/linkedin-posts.json untouched.")
        return 0

    with open(OUT_PATH, "w", encoding="utf-8") as fh:
        json.dump(entries, fh, indent=2)
        fh.write("\n")
    print("sync-linkedin: wrote %d post(s) to %s" % (len(entries), OUT_PATH))
    return 0


if __name__ == "__main__":
    sys.exit(main())
