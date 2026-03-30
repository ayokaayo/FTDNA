# Page Brief: Content Variables

> Layout: GRID
> Inventory #: —
> Tier: Cold Verification

## Shell

| Element | Value |
|---|---|
| Side Menu section | SINGULARITY |
| Breadcrumb L1 | Singularity Model |
| Breadcrumb L2 | Content Variables |
| Page title | Content Variables |
| Main CTA | New Variable |

## Content

### GRID layout:

**Panel title:** Content Variables
**Panel subtitle:** Manage personalised content variables for player communications.
**Search:** Yes

**Card type:** card-markets (default variant)
**Card count:** 6
**Card width:** 397px FIXED (wrapping grid)

**Cards:**

| # | Title | Description | Tag |
|---|---|---|---|
| 1 | Favourite Game | Player's most played game title | 12 players |
| 2 | Last Deposit Amount | Amount of the player's last deposit | 8 players |
| 3 | Preferred Channel | Player's most responsive communication channel | 24 players |
| 4 | VIP Tier Name | Current VIP tier label for personalisation | 15 players |
| 5 | Birthday Month | Player's birth month for seasonal offers | 31 players |
| 6 | Registration Source | Channel through which the player registered | 19 players |

## Construction Notes

- Card grid uses wrapping horizontal layout: `layoutWrap: 'WRAP'`, `itemSpacing: 16`, `counterAxisSpacing: 16`
- Cards are FIXED width (397px), NOT FILL — wrap handles column distribution
- Hide main Flag on cards (not relevant for content variables)
- Override title (Bold node in Frame 1388), description, and Tag text
- Pagination not needed (6 cards fits single view)
- Search enabled in panel header (requires panelHeader detach)

## Clone Source

| Template | Node ID | Customization needed |
|---|---|---|
| — | — | Build from components (no clone available) |
