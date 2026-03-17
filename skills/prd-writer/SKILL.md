---
name: prd-writer
description: Write, review, or refactor Product Requirements Documents (PRDs) for product teams. Use this skill whenever the user mentions PRD, product requirements, feature specs, task specs, writing requirements for a feature, ClickUp task descriptions, or wants to turn rough notes into a structured product document. Also trigger when the user asks to review or improve an existing PRD. This skill adapts its output density to the task's complexity — from a lightweight task brief for a button color change to a full-blown PRD for a new system feature. Always assess complexity first before writing.
---

# PRD Writer

## Philosophy

A PRD is a decision document, not a specification. Its job is to align stakeholders on what we're building, why it matters, and what success looks like — with just enough on the how to unblock engineering and design.

Everything that doesn't serve that alignment is noise. Cut it.

The corollary — and this is where most PRD templates fail — is that not every task needs the same level of documentation. A component color change and a search relevance model are both "tasks," but they live on entirely different planes of complexity. Treating them the same produces either bloated busywork for small changes or dangerously thin specs for complex ones.

This skill adapts. The first move is always to assess what kind of task we're dealing with, then deliver exactly the documentation it needs. No more, no less.

### Core Principles

1. **Signal over ceremony.** No section exists to fill a template. Every section must earn its place by answering a question someone will actually ask.
2. **Decisions > descriptions.** A PRD should record choices made and trade-offs accepted, not restate obvious context.
3. **One source of truth.** Never say the same thing twice. If context explains the pain point, don't repeat it in a separate Pain Points section.
4. **Scope is a weapon.** The Out of Scope section is as important as the requirements. Be explicit and aggressive.
5. **Assumptions are risks in disguise.** Every assumption should link to what breaks if it's wrong.

---

## Adaptive Complexity System

### Classification Heuristic

Before writing anything, assess the task on two axes:

1. **Blast radius** — If we get this wrong, what breaks?
   - Low: Visual regression, single component
   - Medium: One flow or feature affected, reversible
   - High: Multiple flows, data model, or external integrations
   - Critical: Platform-level, multi-team, architectural

2. **Ambiguity** — Can the engineer start right now with what they know?
   - Low: Clear spec, no open questions
   - Medium: Some design decisions needed, bounded unknowns
   - High: Multiple valid approaches, significant unknowns
   - Critical: Research needed, cross-team alignment required

### Tier Matrix

| Tier | Blast Radius | Ambiguity | Output | Length |
|------|-------------|-----------|--------|--------|
| **T1 — Tweak** | Low | Low | Task Brief | 5-15 lines |
| **T2 — Enhancement** | Low-Medium | Low-Medium | Task Spec | 20-50 lines |
| **T3 — Feature** | Medium-High | Medium-High | Feature PRD | 80-200 lines |
| **T4 — System** | High-Critical | High-Critical | System PRD | 150-400 lines |

**Classification signals:**

- T1: Copy change, color update, spacing fix, icon swap, typo fix
- T2: New filter option, validation rule change, component variant, sort order change, minor flow adjustment
- T3: New feature, new screen/view, workflow redesign, experiment with metrics, integration with existing system
- T4: New data model, platform migration, design system overhaul, multi-service integration, ML model integration

**When in doubt:** Ask the two questions directly. Don't guess up.

---

## Templates by Tier

### T1 — Task Brief

Minimal. The point is to be unambiguous, not comprehensive.

```
## What
[One sentence. What's changing.]

## Why
[One sentence. Why it matters or what triggered it.]

## Acceptance Criteria
- [Testable condition]
- [Testable condition]

## Notes (optional)
[Only if there's a non-obvious constraint, dependency, or gotcha.]
```

**Total length:** 5-15 lines. That's it. If you're writing more for a T1, you're overcomplicating things.

**Example:**
```
## What
Update the primary CTA button in the deposit flow from #1A73E8 to #0D47A1.

## Why
Brand refresh — aligning with updated color tokens from the design system.

## Acceptance Criteria
- Button color is #0D47A1 in default, hover, and focus states.
- No visual regression on adjacent elements.
- Passes WCAG AA contrast ratio against the background.
```

---

### T2 — Task Spec

More structure, but still lean. Context matters here because the change touches a flow, and edge cases need calling out.

```
# [Task Name]

## Context
[2-4 sentences. What exists, what's changing, why.]

## Requirements
### REQ-XX — [Title]
[What the system must do.]

**Acceptance Criteria:**
1. [Testable condition]
2. [Testable condition]

## Edge Cases
- [Scenario] → [Expected behavior]

## UX Notes (optional)
[Interaction details, link to Figma if relevant.]

## Open Questions (optional)
- [Question] — @[owner]
```

**Total length:** 20-50 lines. Enough to unblock work and handle the non-obvious cases.

---

### T3 — Feature PRD

The full structure. This is where sections earn their keep — context, metrics, assumptions, scope boundaries. Most product work lives here.

```
# [Feature Name] — PRD

## 1. Context & Problem
## 2. Objective & Expected Outcomes
## 3. Success Metrics
## 4. Assumptions & Risks
## 5. Requirements
## 6. UX & Interaction Notes
## 7. Scope Boundaries
## 8. Open Questions
## 9. Appendix (optional)
```

Read `references/section-guide.md` for detailed instructions on each section.

**Total length:** 80-200 lines. Dense, not bloated.

---

### T4 — System PRD

T3 structure plus additional sections that address cross-cutting concerns. These documents need to survive review by multiple teams and inform architectural decisions.

Extend the T3 structure with:

```
## 4b. Dependencies & Integration Points
[What other systems, teams, or services are affected. Who needs to be in the room.]

## 4c. Migration & Rollback Strategy
[How we get from current state to new state. What happens if we need to reverse.]

## 10. Decision Log
[Key decisions made during planning, with rationale and date. Prevents re-litigation.]
```

**Total length:** 150-400 lines. The extra density is justified because ambiguity at this scale is expensive.

---

## Writing Rules

These apply across all tiers — scale the detail, not the standards.

### What to kill (always)
- **User stories as filler.** "As a user, I want X so Y" adds nothing when acceptance criteria says it better. Use them only when the persona distinction genuinely matters.
- **Decorative persona tables.** If they don't drive a decision, cut them. Name the user type inline.
- **Pain points that restate context.** If the Context section already explains the problem, don't create a separate Pain Points section.
- **Future enhancements mixed into scope.** P2 items belong in scope boundaries as "out of scope," not alongside P0 requirements.
- **Empty appendix references.** If it's not linked, it doesn't exist. Don't mention it.
- **Vague success metrics.** "Should improve" is not a metric. State expected direction and reasoning.

### What to include (scaled by tier)
- **T1:** What, why, acceptance criteria. Done.
- **T2:** Add context, edge cases, and optional UX notes.
- **T3:** Full section structure. Every section earns its place.
- **T4:** T3 plus dependencies, migration strategy, decision log.

### Quality checks by tier
- For T1: verify acceptance criteria are testable.
- For T2: review edge cases, check that context is sufficient for someone unfamiliar.
- For T3: stress-test assumptions, verify metrics hierarchy, confirm scope boundaries.
- For T4: verify cross-team dependencies are named, rollback strategy exists, decision log captures key trade-offs.

---

## Process: How to Use This Skill

### Step 1 — Classify
Read the task input. Ask the two questions (blast radius, ambiguity). Assign a tier. State it explicitly: "This is a T[X] — [reason]."

If classification is ambiguous, ask the user the two questions directly. Never guess up — defaulting to a higher tier wastes everyone's time.

### Step 2 — Write
Apply the tier template. For T3/T4, load `references/section-guide.md` for section-level guidance.

### Step 3 — Review
Check against the writing rules. For T2: review edge cases. For T1: verify acceptance criteria are testable.

### Step 4 — Log & Learn
After delivering the output, log the run. This is how the skill evolves.

1. **Log the run** to `references/evolution-log.md` using the entry format defined there.
2. **Flag anomalies** — anything that felt off during classification or writing. Boundary cases, sections that felt forced, user corrections.
3. **Check for patterns** — before each new run, read the evolution log. If 3+ entries show the same friction point, surface it as a recommendation to update the skill.

The log is the skill's memory. Read it before writing. Write to it after delivering. Let it compound.

### Adapting for ClickUp
- **T1:** Paste the brief directly as the task description.
- **T2:** Task description contains the full spec. Acceptance criteria become the checklist.
- **T3/T4:** Create as a ClickUp Doc linked from the parent task. Each P0/P0.5 requirement becomes a subtask prefixed with its REQ-XX ID. Open questions become a checklist with assignees on the parent.

---

## Evolution System

This skill is not static. It improves through use.

### How It Works

Every time this skill produces output, the run gets logged in `references/evolution-log.md`. The log captures what tier was assigned, whether it fit, what got adjusted, and what the user corrected. Over time, patterns emerge — boundary cases clarify, domain-specific heuristics crystallize, templates get refined.

Read `references/evolution-log.md` before every run. Write to it after every delivery.

### What Gets Logged
- Task summary, assigned tier, and whether the tier was adjusted
- Sections added, removed, or modified from the template
- User feedback or corrections (verbatim when possible)
- Friction points — anything that didn't fit the model cleanly

### What Triggers a Skill Update
When a pattern appears across 3+ entries, it graduates from observation to recommendation. Surface the pattern to the user with a specific proposed change.

Examples:
- T2 tasks in iGaming consistently need a "Regulatory Notes" section → propose adding it to T2 template
- Classification keeps misclassifying API changes as T2 when they're T3 → propose refining the heuristic
- "Edge Cases" in T2 is consistently empty → propose making it optional or merging into AC
- Users keep adding a section that's not in the template → the template is missing something

### What Does NOT Change Without Explicit Approval
- Tier definitions and boundaries
- Core principles
- Section structures for T3/T4
- The classification heuristic

These are load-bearing walls. Propose changes, present the evidence from the log, but never apply silently.

### Review Cadence
- **Every run:** Read the log, check for emerging patterns.
- **Every 5th run:** Surface a brief synthesis — what's working, what's friction, any recommendations.
- **On request:** Full retrospective with proposed skill modifications.

---

## Tone

Problem → Analysis → Solution structure. Direct, professional, warm. Quantified claims where possible. Honest about trade-offs. No corporate filler — no "leverage," "innovative," "passionate," "utilize." State claims directly. Hedge only when genuine uncertainty exists, and make the uncertainty explicit rather than vague.
