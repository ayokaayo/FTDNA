# Contributing to FastTrack Design System

Thank you for contributing to the FastTrack Design System. Follow these guidelines to ensure consistency and quality.

## Token Naming Conventions

All tokens follow the W3C Design Tokens Format specification with a hierarchical naming structure:

```
{category}-{type}-{modifier}-{state}
```

Examples:
- `color-background-primary`
- `color-text-secondary-hover`
- `spacing-inset-medium`
- `typography-heading-large`

**Guidelines:**
- Use kebab-case (lowercase with hyphens)
- Use semantic names that describe function, not appearance
- Avoid color values in token names (e.g., use `color-primary`, not `color-blue`)
- Include state modifiers where applicable (hover, active, disabled, focus)

## Adding a New Color

1. **Define in token file:**
   ```json
   // tokens/colors.tokens.json
   {
     "color": {
       "brand": {
         "primary": { "value": "#0052CC" }
       }
     }
   }
   ```

2. **Add semantic mapping:**
   ```json
   // tokens/semantic.tokens.json
   {
     "color": {
       "button": {
         "primary": { "value": "{color.brand.primary}" }
       }
     }
   }
   ```

3. **Build tokens:**
   ```bash
   npm run build:tokens
   ```

4. **Verify output in `dist/`** and test in consuming applications.

## Adding a New Typography Style

1. **Define in token file:**
   ```json
   // tokens/typography.tokens.json
   {
     "typography": {
       "heading": {
         "extra-large": {
           "font-family": { "value": "Inter" },
           "font-size": { "value": "32px" },
           "font-weight": { "value": "700" },
           "line-height": { "value": "1.2" }
         }
       }
     }
   }
   ```

2. **Test in design tools** (Figma) and code (if applicable).

3. **Build tokens:**
   ```bash
   npm run build:tokens
   ```

4. **Document usage** in the component playbook (once available).

## Component Contribution Workflow

### Phase 1: Design (Figma)
- Design the component in Figma using current tokens
- Use semantic colors and typography from the design system
- Document component states (default, hover, active, disabled, focus)
- Create design specs with clear naming and documentation

### Phase 2: Code
- Implement the component using published tokens
- Ensure accessibility compliance (WCAG 2.1 AA minimum)
- Write unit tests for component behavior
- Document props and usage examples

### Phase 3: Playbook
- Add component to the inventory/
- Document usage patterns and dos/don'ts
- Include code examples
- Link to Figma component

## Code Review Checklist

When submitting changes to the design system, ensure:

- [ ] Token names follow W3C conventions and are semantic
- [ ] All tokens have clear, descriptive values
- [ ] Existing tokens are reused before creating new ones
- [ ] Documentation is updated (README, inventory, CONTRIBUTING)
- [ ] Token build passes without errors (`npm run build:tokens`)
- [ ] Changes are backward compatible (or breaking changes are documented)
- [ ] Color contrast meets WCAG AA standards for text
- [ ] Typography scales are accessible and readable
- [ ] New components are documented in inventory/
- [ ] Component examples include all relevant states

## Testing Your Changes

1. Build tokens locally:
   ```bash
   npm run build:tokens
   ```

2. Verify outputs in `dist/`:
   - Check file formats are correct
   - Validate JSON syntax
   - Confirm token values are as expected

3. Test in consuming applications:
   - Import updated tokens
   - Verify visual output matches design specs
   - Test responsive behavior and states

## Submitting Changes

1. Create a feature branch: `git checkout -b feature/add-new-component`
2. Make your changes and update documentation
3. Run `npm run build:tokens` to compile changes
4. Commit with clear messages describing what changed and why
5. Push and open a pull request
6. Address review feedback before merging

---

Questions? Reach out to the design system team or open an issue in the repository.
