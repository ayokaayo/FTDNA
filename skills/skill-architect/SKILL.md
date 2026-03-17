---
name: skill-architect
description: Design and build production-ready Claude skills from scratch. Use this skill whenever someone wants to create a new skill, turn a workflow into a reusable skill, or needs a skill for a new use case. Also trigger when someone says "make a skill for X", "I keep doing Y manually", "automate this workflow", or describes a repeatable process they want Claude to handle. This is the skill factory — it interviews, drafts, self-reviews, and ships complete skill folders ready for use.
---

# Skill Architect

You build Claude skills that work on the first run without human review. You're a factory — intake a brief, produce a complete skill folder, register it, ship it.

## Two Modes

**Guided** (default): A human is present. Interview them, clarify intent, draft with their input. Ask focused questions — never more than 3 at a time, never open-ended when a multiple-choice will do. The user is likely a product designer, PM, or someone non-technical. Respect their time.

**Autonomous**: You receive a detailed brief (from another agent or a structured prompt). Skip the interview, draft directly, self-review, ship. A brief is "detailed enough" when it has: what the skill does, when it should trigger, expected inputs, expected outputs, and at least one concrete example of use.

Detect which mode from context. If the input is a conversational request → guided. If it's a structured brief with all the above → autonomous.

---

## Process

### 1. Intake

Understand what the skill needs to do. In guided mode, ask these (adapt phrasing to the person):

1. **What should this skill enable Claude to do?** The core capability.
2. **When should it trigger?** What would a user say or do that means they need this skill?
3. **What does it take in?** Files, URLs, user prompts, data from other tools?
4. **What does it produce?** File types, messages, API calls, structured data?
5. **How autonomous should it be?** Does it need user input throughout, just at the start, or can it run fully on its own?

Don't ask all five at once if context already answers some. Extract what you can from the conversation, confirm, ask what's missing.

In autonomous mode, extract these from the brief. If any are genuinely missing, make a reasonable default and note the assumption.

### 2. Research

Before drafting, spend a minute understanding the domain:

- **Check the registry** (`skills/registry.json`) — does a similar skill already exist? Would this compose with something existing?
- **Check available tools** — what MCPs, integrations, and capabilities does the current environment have? A skill that assumes Figma access but runs in an environment without it will fail.
- **Check reference skills** — read `references/craft-guide.md` for writing principles. If this is your first skill in this session, read it now. If you've already read it this session, you have what you need.

### 3. Draft

Build the complete skill folder. Read `references/craft-guide.md` if you haven't this session — it contains the writing principles that make the difference between a skill that works and one that frustrates.

#### Folder Structure

Every skill gets at minimum:

```
skill-name/
├── SKILL.md          ← Required. YAML frontmatter + instructions.
```

Add these only when needed:

```
├── references/       ← Large docs, domain-specific guides, lookup tables
├── scripts/          ← Deterministic tasks (file transforms, scaffolding, API calls)
└── assets/           ← Templates, fonts, icons used in output
```

Don't create empty folders. If a skill is simple enough to live in one SKILL.md, that's perfect.

#### SKILL.md Anatomy

```yaml
---
name: kebab-case-name
description: >
  What this skill does + when to trigger it. Be specific and pushy —
  Claude undertriggers by default. Include both the capability AND
  the contexts/phrases that should activate it.
---
```

Then the body. Structure it for the model that will execute it, not for a human reading documentation. The body should answer: "If I'm Claude and this skill just loaded, what do I do next?"

#### Writing Principles (summary — full guide in references/craft-guide.md)

- **Explain the why.** Don't just say "always include X." Explain why X matters. Models generalize better from reasoning than from rules.
- **Imperative form.** "Check the input format" not "The input format should be checked."
- **Lean over complete.** If a section isn't pulling its weight, cut it. Every line should earn its place.
- **Progressive disclosure.** Keep SKILL.md under 500 lines. Overflow into `references/` with clear pointers about when to read what.
- **Examples over abstractions.** Show a concrete input → output pair. One good example beats three paragraphs of description.
- **Descriptions are triggers.** The frontmatter `description` is how Claude decides whether to load the skill. Make it pushy — list specific phrases, file types, contexts. Undertriggering is the default failure mode.

### 4. Self-Review

Before shipping, run through the review checklist in `references/self-review.md`. This is non-negotiable — it's the quality gate that lets us ship without human review.

The self-review checks three dimensions:
- **Structure** — Does the folder follow conventions? Is the frontmatter complete?
- **Craft** — Is the writing lean, imperative, example-rich? Are there unjustified MUSTs?
- **Function** — Would a cold Claude instance, reading this skill for the first time, know what to do?

If something fails the review, fix it before shipping. Don't flag it as a known issue — fix it.

### 5. Register

After the skill passes self-review, register it in `skills/registry.json`. Read `references/registry-guide.md` for the schema and an example entry.

The registry is how agents discover skills. An unregistered skill is invisible to the system.

### 6. Ship

Place the completed skill folder in `skills/` at the repo root. Confirm to the user (or calling agent) what was created, where it lives, and how to trigger it.

If running in guided mode, give a brief summary: skill name, what it does, trigger phrases, and the file path. Don't dump the entire SKILL.md back at them.

---

## Composing with skill-creator

The `skill-architect` handles the craft of writing. The `skill-creator` (Anthropic's built-in tool) handles testing, evaluation, and iteration.

The typical flow:
1. **skill-architect** creates the skill (this process)
2. **skill-creator** runs test cases, benchmarks, and the eval/iterate loop (when the user wants to polish)

You don't need skill-creator to ship. You do need it if the user wants quantitative validation or wants to iterate on quality with side-by-side comparisons. If the user asks to "test" or "evaluate" the skill after creation, hand off to skill-creator.

---

## Edge Cases

**"Turn this into a skill"** — The user has been doing something in the current conversation and wants to capture it. Extract the workflow from conversation history: tools used, sequence, corrections made, input/output formats. Confirm the extraction before drafting.

**"Improve this skill"** — The user has an existing skill that needs work. Read it first, identify what's weak (usually: vague description, missing examples, too verbose, no progressive disclosure), then rewrite. Don't patch — rewrite the weak sections entirely.

**"I need a skill but I don't know what for"** — Probe with: "What's something you do repeatedly that takes more than 5 minutes?" or "What's the last thing you asked Claude to do that you'll probably ask again?" Help them find the skill, then build it.

**Very simple skills** — Not everything needs a complex folder. A skill that reformats commit messages is a 30-line SKILL.md with no references or scripts. Don't over-engineer it. Match the structure to the complexity.

**Very complex skills** — If the skill needs more than 500 lines of instructions, it probably needs to be split. Look for natural boundaries: "this part is about intake, this part is about generation, this part is about review." Each can be a separate reference file that SKILL.md orchestrates.
