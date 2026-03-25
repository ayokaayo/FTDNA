# Knowledge Retrieval

How to fetch grounded content for tutoring. Three sources, in priority order.

## 1. GitBook KB (Primary)

The Fast Track knowledgebase is the source of truth for all core product knowledge.

### Token

```bash
export GITBOOK_API_TOKEN=$(grep GITBOOK_API_TOKEN .env | cut -d= -f2)
```

Read from `GITBOOK_API_TOKEN` env var. If not set, check `.env` at the repo root.

### AI Ask — synthesized answer

Use this first. It returns a synthesized answer with source references.

```bash
curl -s -X POST "https://api.gitbook.com/v1/orgs/-M4K87X3xYU8WYb5Uxiy/ask?format=markdown" \
  -H "Authorization: Bearer $GITBOOK_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"query": "<question — max 512 chars>"}'
```

Parse the response:
- `answer.answer.markdown` — the synthesized answer text
- `answer.followupQuestions` — suggested follow-ups (useful for "suggest next" step)
- `answer.sources` — page IDs and space IDs for citation links

Build source URLs:
```
https://app.gitbook.com/o/-M4K87X3xYU8WYb5Uxiy/s/{space}/content/page/{page}
```

### Space Search — keyword fallback

If AI Ask returns no useful answer, try keyword search:

```bash
curl -s "https://api.gitbook.com/v1/spaces/-MGrxN2ttYCb8JwJc2TS/search?query=<keywords>" \
  -H "Authorization: Bearer $GITBOOK_API_TOKEN"
```

Parse: `items[].title`, `items[].sections[].body`, `items[].urls.app`

### Get Full Page — deep expansion

When you need the full page content (e.g., learner asks to go deeper):

```bash
curl -s "https://api.gitbook.com/v1/spaces/{spaceId}/content/page/{pageId}?documentFormat=markdown" \
  -H "Authorization: Bearer $GITBOOK_API_TOKEN"
```

### Reframing questions for the KB

The learner's question may use casual language. Reframe it for the API:

- "What does the triggers page do?" → "What are triggers and how do they work?"
- "How do I target VIP players?" → "How does the segmentation rule builder work?"
- "What happens when a player gets two bonuses?" → "How does bonus stacking work?"

Keep under 512 characters.

### Rate limits

If you get a 429 response, tell the learner to wait 60 seconds. Don't retry silently.

## 2. Slack Channels — Live Search (Secondary)

Search approved Slack channels for practical context, edge cases, and real-world
Q&As that enrich KB knowledge. This is a live search — no pre-curation needed.

### Approved channels

| Channel | ID | Use for |
|---|---|---|
| #howwouldyou | `C01N7JJJW2F` | Solution design, "how would you handle X?", creative CRM approaches |
| #product-questions | `C08N9FPSHL0` | Product behavior questions, partner edge cases, feature clarifications |

### How to search

Use the Slack MCP search tool to query the approved channels:

```
slack_search_public_and_private(
  query="<topic keywords> in:#howwouldyou OR in:#product-questions",
  limit=10,
  sort="score"
)
```

For threaded conversations (where the real answers live), read the full thread:

```
slack_read_thread(channel_id="<channel_id>", message_ts="<parent_ts>")
```

### When to search Slack

- The KB answer is thin or missing practical context
- The learner asks "how would you" or "what's the best approach" questions
- You need real partner examples to build a scenario exercise
- The learner asks about edge cases or uncommon configurations

### Processing Slack results for teaching

Slack messages are raw, informal, and may contain incorrect information. Before
teaching from Slack content:

1. **Cross-check with KB** — if Slack contradicts the KB, the KB wins
2. **Extract the core insight** — don't quote raw Slack messages verbatim.
   Synthesize the useful knowledge into a clear teaching point.
3. **Cite the channel** — `[Source: #howwouldyou]` or `[Source: #product-questions]`
4. **Flag uncertainty** — if a Slack answer seems plausible but you can't verify
   it against the KB, tell the learner: "Based on internal discussion, though
   not confirmed in the official docs..."

### Do NOT search Slack for

- Basic definitions (use KB)
- Standard workflows (use KB)
- Feature existence questions (use KB)
- Anything the KB covers well — Slack is supplementary, not primary

## 3. Curated Scenarios (Supplementary)

Stored in `references/scenarios/` as per-topic markdown files.
Each scenario has: context, difficulty, expected approach, common mistakes, source.

Use these for scenario-mode exercises and quiz generation.

Cite as: `[Source: Curated scenario — topic-name]`

## Citation format

Every substantive claim in a tutoring response must have a source label:

```
Triggers fire based on real-time player events like login, deposit, or
game round completion. [Source: KB — Triggers]
```

```
A common approach is to use lifecycle exclusions to prevent campaign overlap.
[Source: Curated Q&A — #howwouldyou]
```

If you generate content that isn't directly from an approved source, label it:
```
[AI-generated — not from approved source]
```
