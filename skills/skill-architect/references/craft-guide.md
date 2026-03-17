# Craft Guide — Writing Skills That Work

This is the reference document for writing high-quality Claude skills. Read it once per session, then internalize it. Don't reference it mid-draft — absorb the principles and apply them.

---

## The Core Insight

A skill is a set of instructions for a model that hasn't seen your conversation. It will be loaded cold into a Claude instance that knows nothing about why the skill exists, what you tried before, or what the user really means. Everything the model needs to succeed must be in the skill or reachable from it.

This means: be explicit about intent, not just procedure. A model that understands *why* it's doing something will handle edge cases you didn't anticipate. A model that only has a checklist will break the moment reality deviates from the script.

---

## Principles

### 1. Explain the Why

Bad:
```
ALWAYS include a summary section at the top.
```

Good:
```
Start with a summary section. Readers scan documents top-down, and
stakeholders often read only the first section. If the key takeaway
is buried in page 3, it won't land.
```

The model is smart. When it understands the reasoning, it can adapt the instruction to novel contexts. When it only has a rule, it follows the rule even when the rule doesn't apply.

ALL-CAPS directives (ALWAYS, NEVER, MUST) are yellow flags. They suggest the author is trying to force compliance instead of building understanding. Sometimes they're necessary — but usually, if you can't explain why something matters, maybe it doesn't.

### 2. Lean Over Complete

Every line in a skill costs tokens and attention. Instructions that aren't pulling their weight actively hurt — they dilute the important stuff.

After writing a draft, re-read it and ask: "If I deleted this paragraph, would the output get worse?" If the answer is no or maybe, delete it.

Common bloat patterns:
- Restating what the description already says
- Listing obvious edge cases the model would handle anyway
- Meta-commentary about the skill itself ("This skill is designed to...")
- Defensive instructions for unlikely scenarios

### 3. Progressive Disclosure

```
Level 1: Metadata (name + description)     — Always in context (~100 words)
Level 2: SKILL.md body                     — When skill triggers (< 500 lines)
Level 3: references/, scripts/, assets/    — On demand (unlimited)
```

Keep SKILL.md under 500 lines. If you're approaching that limit, look for content that doesn't need to be in active context:

- Large lookup tables → `references/`
- Domain-specific guides → `references/`
- Deterministic transforms → `scripts/`
- Multi-step examples → `references/examples.md`

Point to these from SKILL.md with clear guidance on when to read them:
```
For T3/T4 PRDs, read `references/section-guide.md` for detailed
instructions on each section.
```

### 4. Examples Over Abstractions

One concrete example communicates more than three paragraphs of description.

Bad:
```
The output should be structured in a way that's easy to scan,
with clear hierarchy and appropriate use of headings, making sure
that the most important information is surfaced first.
```

Good:
```
## Output Format

**Example:**
Input: "We need to add dark mode to the settings page"
Output:
## What
Add a dark mode toggle to the Settings page, persisting the
user's preference across sessions.

## Why
Third most-requested feature in Q4 user feedback (127 mentions).
Current workaround (browser extension) breaks custom theming.

## Acceptance Criteria
- Toggle is visible in Settings > Appearance
- Preference persists via localStorage
- All components in the settings view respect the theme
```

### 5. Descriptions Are Triggers

The `description` field in YAML frontmatter is how Claude decides whether to load a skill. It's not documentation — it's a trigger mechanism.

Make it pushy. Claude undertriggers by default — it tends not to use skills when it could handle things directly. Counter this by being explicit about when to activate:

Bad:
```
description: Helps create documents.
```

Good:
```
description: >
  Write, review, or refactor Product Requirements Documents (PRDs)
  for product teams. Trigger on: PRD, product requirements, feature
  specs, task specs, ClickUp task descriptions, rough notes to
  structured docs. Also trigger when the user asks to review or
  improve an existing PRD.
```

List specific phrases users would say. List file types. List adjacent concepts that should also trigger the skill.

### 6. Imperative Voice

Write instructions as commands, not descriptions.

Bad: "The model should check whether the input file exists."
Good: "Check whether the input file exists."

Bad: "It's important to validate the output format."
Good: "Validate the output format before returning."

Imperative voice is shorter, clearer, and matches how models process instructions.

### 7. Structure for the Executor, Not the Reader

A SKILL.md is not documentation. It's not a README. It's an instruction set for a model that just loaded it cold.

Organize by workflow, not by concept:
```
## Process
### 1. Intake
### 2. Research
### 3. Draft
### 4. Review
### 5. Ship
```

Not:
```
## Overview
## Key Concepts
## Architecture
## Configuration
## API Reference
```

The model needs to know "what do I do first?" — not "what's the theoretical foundation?"

---

## Anti-Patterns

| Pattern | Problem | Fix |
|---------|---------|-----|
| Wall of MUSTs | Model follows rules rigidly, breaks on edge cases | Explain reasoning instead |
| Empty structure | Folders/sections created "just in case" | Only create what's needed |
| Restated description | SKILL.md body repeats what frontmatter says | Start the body with the first actionable thing |
| Kitchen sink | Every possible scenario covered | Handle the 80% case well; trust the model on the rest |
| Defensive coding | "If X is missing, do Y. If Y is missing, do Z..." | Handle the expected path; let the model reason about edge cases |
| Over-specified output | Every heading, bullet, and line break prescribed | Show one good example; let the model match the pattern |

---

## Domain Organization

When a skill supports multiple domains or frameworks, don't cram everything into SKILL.md. Organize by variant:

```
cloud-deploy/
├── SKILL.md              ← Workflow + selection logic
└── references/
    ├── aws.md
    ├── gcp.md
    └── azure.md
```

SKILL.md contains the shared workflow and the logic for choosing which reference to read. Each reference file contains domain-specific instructions. Claude reads only the relevant one.

---

## The Readback Test

After drafting a skill, do this mental exercise:

> Imagine a Claude instance that has never seen this skill before. It loads the SKILL.md. A user gives it a task that matches the description. Does the model know:
> 1. What to do first?
> 2. What the output should look like?
> 3. When it's done?

If any answer is "not clearly," revise.
