# LinkedIn OAuth setup: one-time steps for Darek

Goal: give the site's sync script (`scripts/sync-linkedin.py`) read access to your own LinkedIn posts, so the "From LinkedIn, clipped" section of the homepage can refresh automatically. LinkedIn's developer platform changes names, product lists, and token lifetimes often, so anything marked **verify against current LinkedIn docs** should be double-checked on the LinkedIn developer site at the time you do this.

You do these steps once. They take about 20 minutes. No coding is needed for steps 1 to 4; step 5 is one command run on the machine that hosts the site.

---

## 1. Create a LinkedIn app

1. Go to https://developer.linkedin.com/ and sign in with your LinkedIn account.
2. Open **My Apps** and click **Create app**.
3. Fill in the app name (e.g. "Darek Anderson site sync"), the LinkedIn page it belongs to (your company page, or your personal page if you have one), and agree to the terms.

## 2. Request the product that lets you read posts

LinkedIn gates API access behind "products" you add to your app. Reading your own posts lives under the community management / sharing products.

1. In your app's dashboard, open the **Products** tab.
2. Request access to **Share on LinkedIn** (this covers posting and managing your own content).
3. If you only want read access, also check whether LinkedIn currently offers a separate community-management product with read-only scopes; **verify against current LinkedIn docs**, the product names change.

Approval is usually automatic for your own content, but LinkedIn can take a few days to review.

## 3. Create OAuth 2.0 credentials with a redirect URL

1. In the app's **Auth** tab, note your **Client ID** and **Client Secret**. Treat the secret like a password.
2. Under **Authorized redirect URLs**, add the URL where you will receive the authorization code. For a local one-time run this can be a simple localhost URL such as `http://localhost:8000/callback`. **Verify against current LinkedIn docs** whether localhost redirects are still allowed.

## 4. Run the authorization code flow

This is the "log in with LinkedIn and approve" step. It gives you a short-lived code that you trade for the real token.

**Step A: open the authorize URL.** Replace CLIENT_ID and REDIRECT_URL with your values (the redirect URL must be URL-encoded, e.g. `http%3A%2F%2Flocalhost%3A8000%2Fcallback`):

```
https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=CLIENT_ID&redirect_uri=REDIRECT_URL&scope=r_basicprofile%20w_member_social
```

Scopes: `r_basicprofile` identifies you; `w_member_social` covers reading and managing your own posts. **Verify against current LinkedIn docs** which scopes the posts endpoint currently requires; LinkedIn has been splitting read and write scopes into product-specific ones, and the exact scope list is version-sensitive.

**Step B: approve and copy the code.** LinkedIn redirects your browser to your redirect URL with `?code=AUTHORIZATION_CODE` appended. Copy that code value.

**Step C: trade the code for a token.** Run this in a terminal (replace the four placeholders):

```bash
curl -X POST https://www.linkedin.com/oauth/v2/accessToken \
  -d grant_type=authorization_code \
  -d code=AUTHORIZATION_CODE \
  -d client_id=CLIENT_ID \
  -d client_secret=CLIENT_SECRET \
  -d redirect_uri=REDIRECT_URL
```

The response contains `access_token` (valid 60 days) and `expires_in`. **Verify against current LinkedIn docs** that the token endpoint URL and the 60-day lifetime are still current.

## 5. Set the environment where the sync script runs

The sync script reads two environment variables:

```bash
export LINKEDIN_ACCESS_TOKEN="the_access_token_from_step_4"
export LINKEDIN_AUTHOR_URN="urn:li:person:YOUR_PERSON_ID"
```

Your person URN is the `id` field returned by `GET https://api.linkedin.com/v2/userinfo` with the same token, formatted as `urn:li:person:<id>`. Then run the sync:

```bash
python3 scripts/sync-linkedin.py
```

If `LINKEDIN_ACCESS_TOKEN` is not set, the script exits 0 and leaves the seeded `assets/linkedin-posts.json` untouched, so the site always works with or without a token.

## 6. Token refresh (every 60 days)

LinkedIn access tokens expire after 60 days and LinkedIn does not issue a separate long-lived refresh token for this flow (**verify against current LinkedIn docs**; if they have added refresh-token rotation for your app type, use it instead).

Until then, the refresh is manual:

1. Repeat step 4 (authorize URL, approve, curl the token exchange). You can reuse the same app and redirect URL.
2. Replace `LINKEDIN_ACCESS_TOKEN` where the sync runs with the new value.
3. Re-run `python3 scripts/sync-linkedin.py` to confirm it works.

Set a calendar reminder for day 55 so the clippings never go stale.

---

## Security notes

- The client secret and access token are secrets. Never paste them into chat, email, or a file that gets committed. They live only as environment variables on the machine that runs the sync.
- The sync script never prints or stores the token; it only sends it as a Bearer header to LinkedIn's API.
