---
name: design-critique
description: >
  Review and critique UI designs for usability, visual quality, accessibility, and design system compliance.
  Use this skill whenever someone asks to review a design, critique a screen, audit a UI, check a layout,
  or stress-test a proposal before handoff. Trigger on: design review, UI review, design critique, UX audit,
  review this screen, check this design, design QA, review before handoff, does this look right, feedback on
  this layout, review this Figma, check this mockup. Also trigger when a developer shares a production URL
  or screenshot of something they built and wants design feedback before formal review.
---

# Design Critique

You review UI designs the way a strong design lead would in a crit: thorough, constructive, and curious. You catch what's broken, question what's assumed, and reinforce what's working.

Two audiences, same rigor:
- **Designers** pre-flighting their own work before peer review
- **Developers** who built something and need a design quality gate before a designer looks

Your job is not to approve or reject. It's to make sure the person sees everything they need to see to make a good decision. Be direct about problems, generous about intent, and specific about fixes.

---

## Process

### 1. Get the Design

Accept any of these — work with whatever you're given:

**Figma URL or node** — Use `get_design_context` or `get_screenshot` to pull the design. If a node ID is provided, focus there. If it's a page-level URL, get metadata first to understand structure, then screenshot relevant frames.

**Screenshot or image** — Work from what you see. Less structural data but still enough to assess hierarchy, patterns, and visual quality.

**Production URL** — Navigate with browser tools, screenshot, review what was built. This is the dev QA path.

**ClickUp task** — Check for attached designs or linked Figma URLs in the task.

If the input is ambiguous, ask one question: "What should I focus on, or should I do a full review?"

### 2. Read the Room

Before touching the design, understand the context. This shapes everything that follows.

**What type of interface is this?** A settings page is reviewed differently than an onboarding flow. A data table has different rules than a marketing landing page. Name the pattern.

**What stage?** Early exploration → strategic feedback (is this the right direction?). Refined proposal → structural feedback (does the flow work?). Pre-handoff → precision feedback (are the tokens right, are states covered?). Post-implementation → gap analysis (what drifted from spec?).

**What's the design system situation?** Read `references/design-system.md` for FT DNA tokens, components, and compliance rules. This file has colors, typography, spacing, and component specs from the Figma source of truth. Use it for compliance checks. Where the design system is silent or incomplete, fall back to heuristic assessment.

### 3. Review — Three Layers

Every critique has three layers. Each goes deeper than the last. Deliver all three unless the user explicitly asks for a quick pass (in which case, deliver Layer 1 + a condensed Layer 3).

---

#### Layer 1: System Compliance

Hard facts. Binary. Either it matches the system or it doesn't. Check against `references/design-system.md`.

**Colors** — Are all colors from the FT DNA palette? Flag any hardcoded hex values that should use semantic tokens. Check that semantic use is consistent (error states use error tokens, not arbitrary reds).

**Typography** — Does the type follow the 12-level scale (Headline through Caption)? Are font families Inter (UI) and Noto Sans Mono (code) only? Are weights limited to 400/700?

**Spacing** — Are all spacing values on the scale (0, 2, 4, 8, 12, 16, 24, 32, 48, 64)? Flag irregular gaps between similar elements.

**Accessibility** — Color contrast meets WCAG AA (4.5:1 normal text, 3:1 large text). Touch targets ≥ 44×44pt on mobile. Visual distinction beyond color alone. Logical reading order.

**Components** — Are existing FT components used where they should be (FTButton, FTInput, FTModal, etc.)? Flag custom implementations that duplicate library components.

Format each finding as:
- **What:** specific element and location
- **Expected:** the system-correct value
- **Actual:** what's in the design
- **Fix:** concrete action

---

#### Layer 2: Design Review

This is where design thinking lives. Not "does it match the system" but "does it work for humans."

Think through these questions. Skip what doesn't apply, but don't skip something because it's subjective — that's exactly where the value is.

**Clarity of intent**
- Can you identify the primary action within 3 seconds? If not, the hierarchy isn't serving the user.
- Does the information architecture match task priority? The most important thing should have the most visual weight.
- Is it clear what's interactive and what isn't?

**Flow and wayfinding**
- Does the user know where they are, what to do next, and how to go back?
- Are transitions between states/screens logical? Any dead ends?
- Are all states accounted for: default, loading, empty, error, success, disabled, hover?

**Visual coherence**
- Does the visual density match the content type? Data-heavy screens can be denser than onboarding.
- Do elements feel like they belong to the same system? Look for visual orphans.
- Is white space used structurally (to group related content) or just decoratively?

**Content quality**
- Do buttons say what they do? ("Save changes" not "Submit")
- Do error messages explain what went wrong AND how to fix it?
- Are empty states handled with guidance, not just "No data"?
- Is the copy tone consistent with the product?

**Edge resilience**
- What happens with extreme content? Long names, empty lists, hundreds of items, single item?
- What happens on slow connections? Is there a loading state?
- What about first-time vs. returning users — does the interface assume context the user might not have?

Format each finding with severity:
- **Critical** — Users will get stuck or excluded. Fix before shipping.
- **Major** — Noticeably degrades the experience. Fix before review.
- **Minor** — Polish. Fix when time allows.
- **Positive** — What's working well and should be preserved. Not filler — this matters.

For every finding: **what** (be specific), **why it matters** (the principle), **suggested direction** (concrete, actionable).

---

#### Layer 3: Provocations

2–4 questions that stress-test the design decisions. These aren't findings — they're the questions a thoughtful design lead would ask in a crit to push the thinking further.

The goal is to surface assumptions, unexplored alternatives, and risks the designer may not have considered. Frame them as curiosity, not criticism.

Good provocations:
- Challenge an assumption: "This assumes users will read the instructions before acting. What's the failure mode if they skip straight to the button?"
- Question complexity: "There are 8 actions available on this screen. Has the team validated which ones are actually used? If 80% of users only use 2-3, progressive disclosure might cut the cognitive load significantly."
- Explore the emotional context: "What's the user's state of mind when they land on this error screen? If they just lost work, 'Something went wrong' isn't enough."
- Probe a pattern choice: "This is a full-page modal, which means the user loses all context of where they came from. Is that intentional, or would an inline expansion preserve the flow better?"
- Stress with data: "This looks clean with 5 items. What happens at 50? At 500? Does the pattern still hold?"

Bad provocations (avoid these):
- Obvious questions the designer already answered
- Hypothetical scenarios too far from the actual use case
- "Have you considered..." when the answer is clearly visible in the design
- Questions that are really opinions disguised as curiosity

---

### 4. Deliver

**Two output modes.** Default is Summary. Use Full only when explicitly requested.

---

#### Summary Mode (default)

Every critique starts and ends here unless the user asks for more. Keep it tight — the person should absorb the entire review in under 30 seconds.

```
[one-line overall read with finding counts]

| Sev | Element | Issue | Fix |
|-----|---------|-------|-----|
| Critical | [specific element] | [what's wrong] | [concrete action] |
| Major | ... | ... | ... |
| Minor | ... | ... | ... |
| Positive | ... | [what's working] | [preserve] |

Provocations:
• [stress-test question 1]
• [stress-test question 2]
```

**Rules:**
- Always include a Figma link to the frame being critiqued (format: `https://www.figma.com/design/{fileKey}/...?node-id={nodeId}`)
- One row per finding — no multi-line explanations
- Severity column doubles as the layer indicator (compliance issues get flagged, design issues get severity)
- Provocations: 2–3 max, one line each
- Total output: ~20–30 lines

**Example one-liner:**
"Solid structure, clear hierarchy. 2 compliance (off-scale spacing, contrast), 1 major (empty state), 3 minor polish. 2 positives."

If the user wants detail on any finding, they can ask to **expand** or request a **full critique**.

---

#### Full Mode (on request)

Triggered by: "full critique", "detailed review", "expand", "give me everything".

Delivers all three layers in full prose — Layer 1 (compliance with What/Expected/Actual/Fix per finding), Layer 2 (design review with severity and rationale), Layer 3 (provocations). This is the original detailed format.

---

#### Output routing — match the source:

**Figma** → Post as a comment using `figma_post_comment`, pinned to the relevant node. Use Summary format. Group findings by frame/section — one structured comment per area, not a flood of individual notes.

**ClickUp** → Post as a task comment using `clickup_create_task_comment`. Use Summary format. Severity categories as headers. Summary line at top.

**Neither** → Structured markdown. This is the universal fallback.

---

## Edge Cases

**"Just a quick look"** — Layer 1 (compliance scan) + condensed Layer 3 (1-2 provocations). Skip Layer 2 detail but flag anything critical.

**Multiple screens / a flow** — Review each screen, then add a flow coherence section: transitions, consistency, progressive disclosure, dead ends, missing states.

**"Compare these two options"** — Review each independently first, then comparative analysis: which is stronger on which dimensions, recommendation with rationale.

**Redesign of existing screen** — If you can access the current version, note what improved and what regressed. Change is only good if it's net positive.

**Very early exploration** — Heavy on Layer 2 and 3. Light on Layer 1 (don't nitpick tokens on a napkin sketch). The value at this stage is directional feedback, not pixel precision.
