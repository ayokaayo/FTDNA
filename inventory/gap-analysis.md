# FastTrack Component Inventory Gap Analysis

**Generated:** February 6, 2026
**Source:** DSP-Master Figma Design System + Vue Playbook Analysis

---

## Executive Summary

FastTrack's design system shows **good alignment between Figma and Vue**, with all 20 Vue components having corresponding Figma sections. However, there are significant gaps:

- **839 Figma components** across 29 sections
- **20 Vue components** + 1 composable
- **72.7% coverage** of Figma variants in Vue implementation
- **9 Figma-only sections** with no Vue counterparts
- **All 20 Vue components need audit** for variant alignment with Figma

### Key Finding
The Vue library provides core functionality but lacks the comprehensive variant coverage defined in Figma, particularly for:
- State/status variants
- Size and layout options
- Specialized dropdown types
- Tags and status indicators

---

## 1. Coverage Analysis

### Overall Metrics

| Metric | Value | Assessment |
|--------|-------|-----------|
| Total Figma Components | 839 | Comprehensive |
| Total Figma Sections | 29 | Well-organized |
| Total Vue Components | 20 | Minimal but focused |
| Vue Coverage of Figma | 610/839 (72.7%) | Good core coverage |
| Unmapped Figma Components | 229 (27.3%) | Needs investigation |

### Component Distribution by Type

| Category | Figma Count | Vue Component | Coverage | Status |
|----------|------------|---------------|----------|--------|
| **Core UI Components** | ~300 | 15 | High | Needs audit |
| **Utility/Helper** | ~250 | 3 | Medium | Partial |
| **Assets/Icons** | 261 | 0 | None | Asset-based |
| **Domain-Specific** | ~28 | 2 | Low | Evaluate need |

### Component Breakdown

#### Fully Mapped Components (20)
1. Alert (7 variants) → FTAlert
2. Button (40 variants) → FTButton
3. Checkbox → FTCheckbox
4. Confirm → FTConfirm
5. Datepicker → FTDatepicker
6. Dropdown (54 + 17 variants) → FTSelect
7. Input (38 variants) → FTInput
8. Floating Label → FTFloatingLabel
9. Navigation Bar (39 variants) → FTNavbar
10. Modal (3 variants) → FTModal
11. Options Selector (76 variants) → FTOptionsSelector
12. Pagination (6 variants) → FTPaging
13. Panel (13 variants) → FTPanel
14. Radio → FTRadio
15. Sliding Panel → FTSlidingPanel
16. Split View → FTSplitView
17. Spinner (10 variants) → FTSpinner
18. Table (25 variants) → FTTable
19. Tabs (32 variants) → FTTabs
20. Tooltip (41 variants) → FTTooltip

#### Partially Mapped Components
- **Notification:** Alert section (7) + useNotification composable

#### Unmapped Figma Sections (9)
1. **Flags** (261) - Country/region assets
2. **Image Picker** (40) - No Vue equivalent
3. **Tag** (49) - No standalone Vue component
4. **Toggle** (12) - No Vue equivalent
5. **Card** (17) - No Vue component
6. **Placeholder** (6) - No skeleton loader component
7. **Activity Conversion** (utility) - Domain-specific
8. **Dynamic Variables** (utility) - Config-driven
9. **Filter by Tags** (utility) - Composition potential

---

## 2. Priority Breakdown

### Critical Priority (3 items)
Must align immediately - core to design system integrity

| Component | Figma Variants | Issue | Action |
|-----------|----------------|-------|--------|
| **Button** | 40 | Comprehensive variant coverage needed | Audit all Type, Status, Size, Leading icon combinations |
| **Dropdown** | 54 + 17 | Multiple dropdown types | Verify FTSelect handles all variants + specialized types |
| **Input** | 38 | Full input type coverage | Ensure all input types (text, email, number, password, select) present |

**Effort:** ~40 hours
**Impact:** High - Core to form interactions

---

### High Priority (15 items)
Should be audited and aligned - commonly used components

| Component | Figma Variants | Gap Description | Recommended Action |
|-----------|----------------|-----------------|-------------------|
| **Table** | 25 | State, column, sorting variants | Audit for sortable/paginated/row-action support |
| **Tabs** | 32 | Horizontal/vertical, disabled, badge | Verify all layout and state variants |
| **Tooltip** | 41 | Positioning and content variants | Ensure all positioning options, triggers, data balloon types |
| **Navigation Bar** | 39 | Responsive and layout variants | Verify mobile/desktop, fixed/sticky variants |
| **Checkbox** | 53 | State and size variants | Audit indeterminate, disabled, required states |
| **Radio** | 53 | State variants | Verify all state combinations |
| **Alert** | 7 | Status variants (success, error, warning, info) | Ensure all alert types implemented |
| **Modal** | 3 | Limited variants - may need more | Evaluate if needs alert/confirm/custom variants |
| **Panel** | 13 | Layout and positioning variants | Verify collapsible, header variants |
| **Datepicker** | 38 | Input types - date/time/range | Ensure date range, time picker support |
| **Pagination** | 6 | Page state variants | Verify disabled, active, hover states |
| **Floating Label** | 38 | Input-related floating label states | Verify integration with all input types |
| **Options Selector** | 76 | Quick access item variants | Ensure all item types and selection patterns |
| **Confirm** | 3 | Modal variant | Verify if distinct from Modal or variant |
| **Spinner** | 10 | Animation variants | Verify all size and animation types |

**Effort:** ~80 hours
**Impact:** Very High - Regular use components

---

### Medium Priority (9 items)
Should be addressed in next phase - less common or specialized

| Component | Status | Recommendation |
|-----------|--------|----------------|
| Image Picker (40) | Figma-only | Evaluate if needed; if yes, create component |
| Tag (49) | Figma-only | Design Tag component or integrate into Confirm component |
| Toggle (12) | Figma-only | Create toggle component for modal/form use |
| Card (17) | Figma-only | Consider as Panel composition |
| Sliding Panel (13) | Partial | Audit drawer behavior implementation |
| Split View (13) | Partial | Verify resizable layout support |
| Filter by Tags (utility) | Figma-only | Evaluate if needed; composition of Input + Tag + Options |
| Widget Dropdown (utility) | Figma-only | Specialized dropdown variant |
| Dynamic Variables (utility) | Figma-only | Likely config-driven, not component |

**Effort:** ~40 hours
**Impact:** Medium - Specialized use cases

---

### Low Priority (4 items)
Future consideration - may be assets or config-based

| Component | Status | Notes |
|-----------|--------|-------|
| Flags (261) | Figma-only | Likely image/icon assets, not Vue components |
| Placeholder (6) | Figma-only | Skeleton loaders - evaluate if needed for UX |
| Activity Conversion | Utility | Domain-specific business logic |
| Translations | Utility | i18n configuration, not UI components |
| Local Timezone | Utility | Config-driven, not component |
| Player Origins | Utility | Domain-specific feature |

**Effort:** ~10 hours
**Impact:** Low - Non-core or infrastructure

---

## 3. Implementation Roadmap

### Phase 1: Core Audit (Weeks 1-2)
**Effort:** 40 hours | **Focus:** Critical components

1. **Button Component**
   - Audit all 40 Figma variants
   - Map to FTButton props
   - Create variant matrix
   - Document prop combinations

2. **Input Components**
   - Audit 38 Input Field variants
   - Verify type coverage (text, email, number, password, select)
   - Audit 38 Floating Label variants
   - Create comprehensive example gallery

3. **Dropdown/Select**
   - Audit Dropdown-base (54 variants)
   - Audit Specific Dropdown (17 variants)
   - Document FTSelect prop requirements
   - Identify missing variant types

**Deliverables:**
- Component audit reports for each
- Variant coverage matrices
- Missing implementation list

---

### Phase 2: High Priority Audit (Weeks 3-4)
**Effort:** 80 hours | **Focus:** Commonly used components

1. **Data Presentation**
   - Audit Table (25 variants)
   - Audit Tabs (32 variants)
   - Audit Pagination (6 variants)

2. **Navigation & Disclosure**
   - Audit Navigation Bar (39 variants)
   - Audit Tooltip (41 variants)
   - Audit Modal (3 variants)

3. **Form Controls**
   - Audit Checkbox (53 variants)
   - Audit Radio (53 variants)
   - Audit Alert (7 variants)

4. **Specialized Components**
   - Audit Options Selector (76 variants)
   - Audit Datepicker (38 variants)
   - Audit Confirm (3 variants)

**Deliverables:**
- Component audit reports
- Implementation gap list
- Priority implementation queue

---

### Phase 3: Variant Implementation (Weeks 5-8)
**Effort:** 120 hours | **Focus:** Closing critical gaps

1. **Update High-Impact Components**
   - Implement missing Button variants
   - Enhance Input type support
   - Expand Dropdown capabilities
   - Improve Table features (sort, page, actions)

2. **Standardize Across Components**
   - Consistent size prop handling (S, M, L, XL)
   - Consistent state/status handling
   - Consistent disabled/loading patterns

3. **Create Component Documentation**
   - Visual variant gallery for each component
   - Prop documentation
   - Usage examples

**Deliverables:**
- Updated Vue components
- Component library documentation
- Storybook/design token updates

---

### Phase 4: Medium Priority Components (Weeks 9-10)
**Effort:** 40 hours | **Focus:** Specialized needs

1. **Create New Components** (if needed)
   - Tag component
   - Toggle component
   - Image Picker (optional)

2. **Enhance Existing**
   - Sliding Panel drawer behavior
   - Split View resizing
   - Card composition patterns

3. **Utility Components**
   - Evaluate filter-by-tags composition
   - Confirm widget dropdown variants

**Deliverables:**
- New component implementations
- Composition pattern documentation

---

### Phase 5: Assets & Utilities (Week 11)
**Effort:** 10 hours | **Focus:** Non-component items

1. **Asset Management**
   - Document Flag (261) approach - SVG or icon library
   - Placeholder patterns

2. **Configuration**
   - Document utility sections (translations, dynamic variables, etc.)
   - Localization implementation

---

## 4. Component Audit Checklist Template

Use this template to audit each component:

```markdown
## Component: [ComponentName]

### Figma Details
- **Section:** [Section name]
- **Total Variants:** [N]
- **Parameters:** [List parameters]
- **Example Variants:** [List 3-5 examples]

### Vue Implementation
- **Component Name:** [FTComponentName]
- **Current Props:** [List props]
- **Current Slots:** [List slots]
- **Current Events:** [List events]

### Variant Coverage Analysis

| Figma Variant | Vue Prop | Status | Notes |
|---------------|----------|--------|-------|
| Example | prop-name | ✓ Covered / ✗ Missing | Details |

### Gaps Identified
1. [Gap 1]
2. [Gap 2]
...

### Recommended Actions
1. [Action 1]
2. [Action 2]
...

### Priority
- **Urgency:** High/Medium/Low
- **Effort:** [Hours]
- **Impact:** [Description]

### Sign-off
- Auditor: [Name]
- Date: [Date]
- Status: [Draft/Complete]
```

---

## 5. Variant Parameter Standardization

### Recommended Vue Props Standards

Based on Figma audit findings, establish these standard props:

#### Size
```
Prop: size
Values: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
Figma Mapping: S | M | L | XL
```

#### State/Status
```
Prop: state
Values: 'default' | 'hover' | 'focused' | 'disabled' | 'error'

Prop: status
Values: 'default' | 'success' | 'error' | 'warning' | 'info'
```

#### Type/Variant
```
Prop: variant or type
Values: Component-specific
Examples:
  - Button: 'primary' | 'secondary' | 'tertiary' | 'action'
  - Input: 'text' | 'email' | 'number' | 'password' | 'select'
  - Alert: 'success' | 'error' | 'warning' | 'info'
```

#### Position/Alignment
```
Prop: position
Values: Component-specific
Examples:
  - Tooltip: 'top' | 'bottom' | 'left' | 'right'
  - Nav: 'top' | 'bottom' | 'left' | 'right'
```

#### Icons/Leading Elements
```
Prop: icon (or leading-icon, trailing-icon)
Type: String | VNode | Component
Values: Icon name or component
```

---

## 6. Risk Assessment

### High Risk Areas

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|-----------|
| Button variants incomplete | High | High | Audit immediately, add missing variants |
| Dropdown complexity underestimated | High | High | Review all 71 dropdown variants for FTSelect coverage |
| Input type coverage gaps | Medium | High | Verify all 5 input types fully supported |
| State/status handling inconsistent | Medium | Medium | Standardize prop names across components |

### Low Risk Areas
- Vue components exist for all major Figma sections
- No deprecated components identified
- Clear 1:1 mapping for most core components

---

## 7. Recommendations Summary

### Immediate Actions (Week 1)
1. Audit Button, Input, and Dropdown components
2. Create variant coverage matrices
3. Schedule component deep-dives with product team
4. Establish variant naming standards

### Short-term (Weeks 1-4)
1. Complete Phase 1 & 2 audits
2. Identify top 5 missing variants
3. Create implementation task backlog
4. Update component documentation

### Medium-term (Weeks 5-10)
1. Implement critical variant gaps
2. Create new components if needed (Tag, Toggle)
3. Enhance documentation with visual examples
4. Update Storybook/component library

### Long-term (Ongoing)
1. Maintain Figma ↔ Vue sync process
2. Regular audit cycles (quarterly)
3. Variant governance and approval process
4. Cross-team design system reviews

---

## 8. Success Metrics

### Coverage Metrics
- **Goal:** 95% variant coverage by end of Phase 3
- **Current:** 72.7% mapped
- **Delta:** 22.3% additional coverage needed

### Quality Metrics
- **Zero critical component gaps** after Phase 1
- **100% documented variants** for each component
- **100% test coverage** for variant combinations
- **<1% developer complaints** about missing variants in surveys

### Timeline Metrics
- Complete Phases 1-2: Week 4
- Complete Phase 3: Week 8
- Complete Phase 4: Week 10
- Project close: Week 11

---

## 9. Next Steps

1. **Schedule kickoff meeting** with design and engineering leads
2. **Assign audit owners** for each component family
3. **Create detailed audit task cards** in project management
4. **Set up variant testing framework** for validation
5. **Plan communication strategy** for documentation updates

---

**Document Status:** Complete
**Version:** 1.0
**Review Schedule:** Update after each phase completion
**Owner:** Design Systems Team
