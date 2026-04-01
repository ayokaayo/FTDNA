---
name: coded-prototype-generator
description: Generate interactive Vue prototypes deployed on Cloudflare Pages. Trigger on "build a prototype", "code this page", "prototype this screen", "add a coded prototype". Outputs a Vue page in backoffice-v2 on the prototype branch with real or mock data.
---

# Coded Prototype Generator

Build Vue prototype pages in `backoffice-v2` on branch `feature/DEV-0000-FTDNA-prototypes`. Deployed automatically via CF Pages.

## Decision: Clone or Build?

```
Does the page already exist in backoffice-v2/src/components/pages/?
  YES → Clone path (real data)
  NO  → Build path (mock data)
```

---

## Clone Path (existing page)

1. **Find the production page** in `backoffice-v2/src/components/pages/`
2. **Read the entire file** — template, script, style
3. **Copy to** `src/components/pages/Prototypes/{Name}.vue`
4. **Strip:**
   - Permission checks (`hasPermission()` v-if guards → remove or replace with `true`)
   - `InfoLink` components and imports
   - Product tracking (`useProductTracking`)
   - Direct API calls for write operations (save/delete) — keep reads
   - Route-based state management (`handleRouteChange`, `$route.params`)
   - i18n `$t()` calls → replace with plain English strings
5. **Keep:**
   - Template structure, components, slots — exactly as production
   - Vuex `mapGetters` and store getters
   - Store `dispatch` calls in `mounted()` — data won't load without them
   - Component imports (Board, Tabs, ActivityGroup, Panel, etc.)
   - Computed properties for filtering/sorting/pagination
   - All CSS/LESS — copy verbatim including `@import` statements
6. **Wire it** (see Wiring section below)

### Side panels and slide-ins

If the page uses side panels managed by a parent component (BoardWrapper, Layout):
- **Don't rebuild the panel.** Just emit the correct bus event.
- Read how the real page triggers it (search for `bus.$emit` in the source).
- Match the exact event name and params — don't simplify or default values.
- BoardWrapper handles: Activity Builder (`showActivityPanel`), QA panel (`selectQAActivity`), Pending Bonuses (`showPendingBonuses`).

### Key components to know

| Production uses | Don't replace with | Notes |
|---|---|---|
| `Tabs` (`@/components/UI/Tabs.vue`) | FTTabs | Different API: `name`/`key`/`@tabSelected` |
| `Board` (`@/components/UI/Board.vue`) | FTPanel | Board is the standard panel in backoffice-v2 |
| `BoardWrapper` | `div.board-wrapper` | Use BoardWrapper when page needs Activity Builder or other global panels |
| Raw `<table class="table-list-view">` | FTTable | Most production pages use raw tables with `@import '~@/styles/table-list-view.less'` |
| `paginateArray` utility | — | Used with raw tables; FTPaging works with both |
| `EmptyState` component | — | Standard empty state, not FTPlaceholder |

---

## Build Path (new page)

1. **Find the closest existing prototype** by layout type:
   - Table page → read `Prototypes/Triggers.vue` (mock data pattern)
   - Complex list → read `Prototypes/AllActivities.vue`
   - Side panel page → read `Prototypes/CommunicationProfiles.vue`
   - Slide-in → read `Prototypes/ActivityBuilder.vue`
2. **Find the closest production page** by layout type — use its component patterns, NOT briefs or reference docs
3. **Create mock data** in `src/mocks/prototypes/{name}.json`
4. **Build the Vue page** using `<script setup lang="ts">`, importing mock data
5. **Wire it** (see Wiring section below)

---

## Wiring (both paths)

Every prototype needs 3 changes:

### 1. Route (`src/router/index.js`)

Add import at the top (with other prototype imports):
```js
import Prototype{Name} from '@/components/pages/Prototypes/{Name}.vue';
```

Add route (inside the prototype routes section):
```js
{
  path: `${PUBLIC_PATH}prototype/{kebab-name}`,
  name: 'Prototype{Name}',
  component: Prototype{Name},
},
```

### 2. Index entry (`src/components/pages/Prototypes/PrototypeIndex.vue`)

Add to the `allPrototypes` array:
```js
{
  name: '{Display Name}',
  layout: '{LAYOUT-TYPE}',
  description: '{One line — data source + key patterns}',
  status: 'Ready',
  lastEdit: '{YYYY-MM-DD}',
  route: '/prototype/{kebab-name}',
},
```

### 3. Commit and push

```
git add src/components/pages/Prototypes/{Name}.vue [src/mocks/prototypes/{name}.json] src/router/index.js src/components/pages/Prototypes/PrototypeIndex.vue
git commit -m "prototype: add {Name} ({LAYOUT-TYPE})"
git push
```

CF Pages auto-deploys. URL: `https://feature-dev-0000-ftdna-proto.backoffice-v2.pages.dev/prototype/{kebab-name}`

---

## Rules

1. **Production source is the spec.** Read the real `.vue` file. Never build from briefs, Figma docs, or pattern references.
2. **Keep the template identical.** Don't swap components for "better" alternatives. If production uses `Tabs`, use `Tabs`.
3. **Match bus event params exactly.** Copy from the real page's emit call. Wrong params = broken panels.
4. **Store dispatches are load-bearing.** If the real page dispatches on mount, the prototype must too.
5. **Strip writes, keep reads.** The prototype shows data, it doesn't modify it (unless intentional).
6. **No new abstractions.** Don't create helpers, composables, or shared utils for prototypes. Each page is self-contained.
