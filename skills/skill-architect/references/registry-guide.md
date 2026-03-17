# Registry Guide

The registry (`skills/registry.json`) is how agents discover skills. Every skill must be registered after creation.

---

## Schema

Each entry in the `skills` array:

```json
{
  "name": "kebab-case-name",
  "path": "skills/kebab-case-name",
  "description": "What the skill does + when to trigger. Same as SKILL.md frontmatter description.",
  "author": "author-name",
  "domain": ["tag-1", "tag-2"],
  "autonomy": "guided | semi-auto | autonomous",
  "inputs": ["user-prompt", ".csv file", "figma-url"],
  "outputs": [".md file", "clickup-task", ".docx file"],
  "complexity": "simple | moderate | complex",
  "created": "YYYY-MM-DD",
  "updated": "YYYY-MM-DD",
  "status": "draft | active | deprecated"
}
```

## Field Guide

**name**: Matches the folder name exactly. Kebab-case, no spaces.

**path**: Relative from repo root. Always `skills/{name}`.

**description**: Copy from SKILL.md frontmatter. Keep them in sync — if one changes, update the other.

**author**: Who created or owns the skill. Use a consistent identifier.

**domain**: Tags for categorization. Common values:
- `product-management`, `product-design`, `engineering`, `documentation`
- `operations`, `analytics`, `communication`, `meta` (for skills about skills)
- Use existing tags when possible. Invent new ones sparingly.

**autonomy**:
- `guided` — Needs user input at multiple points during execution
- `semi-auto` — Needs an initial brief or a few upfront questions, then runs independently
- `autonomous` — Can trigger and complete without any user interaction

**inputs**: What the skill expects. Be specific about types: `user-prompt`, `.csv file`, `figma-url`, `slack-thread`, `rough-notes`, `existing-skill`.

**outputs**: What the skill produces. Be specific: `.md file`, `.docx file`, `clickup-task`, `slack-message`, `skill-folder`.

**complexity**:
- `simple` — Straightforward transform or generation, minimal reasoning
- `moderate` — Requires analysis, multiple steps, or domain judgment
- `complex` — Requires research, multi-step workflows, or cross-domain reasoning

**status**:
- `draft` — In development, not ready for general use
- `active` — Production-ready
- `deprecated` — Superseded or no longer maintained

## Example

```json
{
  "name": "prd-writer",
  "path": "skills/prd-writer",
  "description": "Write, review, or refactor Product Requirements Documents (PRDs) for product teams. Trigger on: PRD, product requirements, feature specs, task specs, ClickUp task descriptions, rough notes to structured docs.",
  "author": "miguel-angelo",
  "domain": ["product-management", "documentation"],
  "autonomy": "semi-auto",
  "inputs": ["user-prompt", "rough-notes", "feature-description"],
  "outputs": [".md file", "clickup-task-description"],
  "complexity": "moderate",
  "created": "2026-03-12",
  "updated": "2026-03-13",
  "status": "active"
}
```

## Updating the Registry

When creating a new skill, add the entry to the `skills` array and update the root `updated` date. When modifying an existing skill, update its `updated` date.

Read the existing registry before writing to avoid overwriting other entries. Append, don't replace.
