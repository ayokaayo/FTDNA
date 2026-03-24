# Page Brief: Manage Action Types

> Layout: LIST-SIMPLE
> Inventory #: 9
> Tier: T1
> Figma node: `134:92934`
> Last verified against live: 2026-03-18

## Shell

| Element | Value |
|---|---|
| Side Menu section | CRM |
| Breadcrumb | Single-level (Nav/1): "Action Type Management" |
| Page title | Action Type Management |
| Main CTA | Add Action Type |
| Right-side icons | Hidden |

## Content

**Search:** Yes (in Panel Header, HUG sizing)
**Tabs:** None
**Toolbar:** None
**Pagination:** None visible

**Panel Header:**
- Title: "Action Type Management"
- Subtitle: None (hidden)
- Search: enabled (HUG)

**Columns:**

| # | Header | Width | Cell Type | Notes |
|---|---|---|---|---|
| 1 | Preview | 100px FIXED | `action icons solo` | Single colored circle button. Toggle visibility, set fill color + FA icon. |
| 2 | Id | 60px FIXED | Text | Numeric ID |
| 3 | Name | FILL | Text | Action name |
| 4 | Notification Type | FILL | Text | CamelCase identifier |
| 5 | Enabled | 80px FIXED | Text (colored) | Green "✓" or red "x" |

**Row styling:**
- Zebra striping: EVEN/ODD alternation
- Row height: 75px (component default)

**Preview icon colors (approximate):**
- Purple `{r:0.56, g:0.27, b:0.68}` → lifecycle actions
- Gray `{r:0.47, g:0.53, b:0.6}` → assignment/valuables
- Blue `{r:0.25, g:0.47, b:0.85}` → calls/automation
- Green `{r:0.30, g:0.69, b:0.31}` → bonuses/credits
- Red `{r:0.90, g:0.30, b:0.24}` → cashback/deposits

**Sample rows:**

| Preview Color | Id | Name | Notification Type | Enabled |
|---|---|---|---|---|
| purple | 22 | Add to Lifecycle | AddUserToLifecycle | ✓ |
| gray | 24 | Assign Promotion | AssignPromotion | x |
| blue | 17 | Automated Call | AutomatedCall | ✓ |
| blue | 10 | Callback | TriggerCallback | ✓ |
| green | 5 | Credit Bonus | CreditBonus | ✓ |
| red | 28 | Credit CashBack | CB | x |
| gray | 27 | Credit Valuable | CreditValuable | x |
| green | 3 | Credit VC | CreditVC | x |
| red | 14 | Deposit Bonus | PendingDepositBonus | x |
| blue | 26 | Enteractive Close Lead | EnteractiveCloseLead | x |

## Construction Notes

- **Preview column**: Use `Type=action icons` Row variant. Detach, hide all buttons except one, resize to 32×32, set fill color and icon text (FA name). Center with `primaryAxisAlignItems: CENTER`, `counterAxisAlignItems: CENTER`. Icon names: arrow-right (lifecycle), gift (bonus/promo), phone (calls), message (VC/chat), envelope (email/lead).
- **Enabled column**: Uses same red/green text pattern as Triggers' Activities column.
- **No subtitle**: Set Sub-Title text node to `visible: false`.
- **No sort icons**: Hide sort icon on all header cells.
- **Search HUG**: Same fix as Triggers — set Input Fields instance to HUG.
- **Panel 1700px FIXED**: Standard canvas width.
- **Content area**: 32px padding + gray fill (#F5F5F5).
