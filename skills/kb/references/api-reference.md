# GitBook API Reference — KB Skill

## IDs

| Resource | ID |
|----------|----|
| Organization | `-M4K87X3xYU8WYb5Uxiy` |
| Space (primary) | `-MGrxN2ttYCb8JwJc2TS` |

## Base URL

```
https://api.gitbook.com/v1
```

## Authentication

```
Authorization: Bearer $GITBOOK_API_TOKEN
```

Token inherits the access level of the user who created it. No scopes.

---

## Endpoints

### 1. AI Ask (primary)

Synthesized answer from GitBook AI across all org spaces.

```
POST /v1/orgs/{organizationId}/ask?format=markdown
```

**Request:**
```json
{
  "query": "string (max 512 chars)"
}
```

**Response (200):**
```json
{
  "answer": {
    "answer": { "markdown": "synthesized answer text" },
    "followupQuestions": ["question 1", "question 2", "question 3"],
    "sources": [
      {
        "type": "page",
        "page": "page-id",
        "space": "space-id",
        "revision": "revision-id",
        "sections": ["section-id"]
      }
    ]
  }
}
```

**Building source URLs from response:**
```
https://app.gitbook.com/o/-M4K87X3xYU8WYb5Uxiy/s/{space}/content/page/{page}
```

Or use the Space Search endpoint (below) to get `urls.app` directly.

---

### 2. Space Search (fallback)

Keyword search within a single space. Returns matching pages with sections.

```
GET /v1/spaces/{spaceId}/search?query={query}
```

**Query params:**
- `query` (required) — search text, max 512 chars
- `page` — pagination cursor
- `limit` — results per page

**Response (200):**
```json
{
  "items": [
    {
      "id": "page-id",
      "title": "Page Title",
      "path": "section/page-slug",
      "score": 25.7,
      "sections": [
        {
          "id": "section-id",
          "title": "Section Title",
          "body": "section content text",
          "path": "section/page-slug#anchor",
          "urls": { "app": "https://app.gitbook.com/o/.../s/.../path#anchor" }
        }
      ],
      "ancestors": [{ "title": "Parent Section" }],
      "urls": { "app": "https://app.gitbook.com/o/.../s/.../path" }
    }
  ],
  "next": { "page": "1" }
}
```

---

### 3. Get Page Content (expansion)

Full page content by ID. Use when user asks to expand on a source.

```
GET /v1/spaces/{spaceId}/content/page/{pageId}?documentFormat=markdown
```

**Response:** `RevisionPage` object with `title`, `path`, `markdown` content, child pages.

---

### 4. Get Page by Path

Alternative to get-by-ID when you have the path from search results.

```
GET /v1/spaces/{spaceId}/content/path/{pagePath}?documentFormat=markdown
```

---

## Rate Limits

- Headers on every response: `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`
- On 429: wait 60 seconds, then retry
- Estimated limit: ~60 requests per window

## Error Codes

| Code | Meaning |
|------|---------|
| 200 | Success |
| 400 | Bad request (query too long, missing params) |
| 401 | Invalid or expired token |
| 404 | Space or page not found |
| 429 | Rate limit exceeded |
