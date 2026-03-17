# Self-Review Checklist

Run this against every skill before shipping. Three dimensions: Structure, Craft, Function. All items must pass.

---

## Structure

- [ ] **Folder name** is kebab-case and matches the `name` field in frontmatter
- [ ] **SKILL.md exists** and has valid YAML frontmatter with `name` and `description`
- [ ] **Description is pushy** — lists specific trigger phrases, file types, and contexts beyond just "what it does"
- [ ] **No empty folders** — every subfolder (references/, scripts/, assets/) contains files
- [ ] **SKILL.md is under 500 lines** — if over, content has been moved to references/ with clear pointers
- [ ] **References have context** — SKILL.md explains when and why to read each reference file

## Craft

- [ ] **Starts with action** — the body's first section tells the model what to do, not what the skill is about
- [ ] **Imperative voice** — instructions are commands ("Check the format") not descriptions ("The format should be checked")
- [ ] **Why over what** — key instructions explain reasoning, not just rules. Minimal use of ALL-CAPS directives
- [ ] **At least one concrete example** — input → output pair that shows what good looks like
- [ ] **No bloat** — no restated descriptions, no empty sections, no defensive edge-case ladders
- [ ] **No kitchen sink** — handles the 80% case well rather than covering every possible scenario

## Function (The Readback Test)

- [ ] **Cold start clarity** — a model loading this for the first time knows what to do first
- [ ] **Output is defined** — the model knows what the output looks like (format, structure, file type)
- [ ] **Completion is clear** — the model knows when it's done
- [ ] **Dependencies are stated** — if the skill needs specific tools/MCPs/files, it says so
- [ ] **Autonomy matches intent** — if the skill should work without user input, the instructions don't require it (and vice versa)

---

## How to Use

Read each item. If it fails, fix it — don't annotate it as a known issue.

If you're unsure about an item, err on the side of fixing it. The cost of an unnecessary revision is small. The cost of shipping a broken skill that gets used 1000 times is large.
