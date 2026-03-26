# FT DNA — Todo List

> Persistent task list. Checked at the start of each session.
> Mark tasks `[x]` when done. Add date completed.

## MCP Plugin Upgrade (v1.19.0) — 2026-03-25

- [ ] **Batch `analyze_component_set` across core components**
  Run on Input (91:6537), Button (91:8299), Tag (91:10023), Alert (92:40484), Toggle (91:8647), Checkbox (91:8542), Radio (91:8595), Panel (92:46583), Panel Header (92:46640), Tab (91:19098). Extract variant state machines + CSS pseudo-class mappings. Save to `inventory/`.

- [ ] **Generate component docs for top 10 components**
  Run `figma_generate_component_doc` (systemName: "FT DNA") on the same core sets. Structured markdown with anatomy, tokens, typography, states. Save to `inventory/` as our DIY Code Connect docs layer.

- [x] **Run design parity check on FTButton** *(2026-03-26)*
  Completed via meta.json population + `npm run audit:parity`. FTButton coverage: 88% (1 Figma-only gap: Size, 11 Vue-only props). Parity report script established for ongoing checks.

- [ ] **Address design system audit findings (score: 61/100)**
  Weakest areas: Accessibility 37/100 (contrast), Token Architecture 53/100 (hardcoded values), Component Metadata 57/100. Priority: fix contrast at component level (pink button 3.2:1, input icons 2.9:1, gray subtext 3.0:1) — these cascade to all composed pages.

- [ ] **Lint all 24 composed pages for WCAG + design quality**
  Pastebin test found 22 critical contrast issues, 78 warnings (hardcoded colors, missing text styles). Most originate in component definitions. Triage: fix components first, then page-level hardcoded values.

## Page Composition (ongoing)

> See `inventory/composition-tracker.md` for full page-by-page status.

- [ ] Content Variables (GRID pattern)
- [ ] Manage Unsubscribe Pages (LIST-NESTED pattern)
- [ ] Remaining page briefs + screenshots
- [ ] Navigation card component (needed for HUB pattern)
