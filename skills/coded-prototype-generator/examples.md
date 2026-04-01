# Prototype Examples

> Living examples in `backoffice-v2/src/components/pages/Prototypes/`. Read these files — don't rely on this index for implementation details.

## Clone path (real data from Vuex)

| Example | Layout | File | Key patterns |
|---|---|---|---|
| All Activities | LIST-FULL | `AllActivities.vue` | BoardWrapper, Tabs, ActivityGroup, toolbar toggles, tag filter, 5 view modes |
| Communication Profiles | LIST-SIMPLE | `CommunicationProfiles.vue` | Raw HTML table, flag images via CDN, status icons, side panel (read-only), zebra CSS |
| Activity Builder | SLIDEIN | `ActivityBuilder.vue` | Bus event to BoardWrapper, auto-open on mount, zero custom components |

## Build path (mock JSON data)

| Example | Layout | File | Key patterns |
|---|---|---|---|
| Triggers | LIST-SIMPLE | `Triggers.vue` | `<script setup>`, Board, FTTable with #row slot, FTPaging, mock JSON import |

## Production pages used as sources

| Prototype | Source |
|---|---|
| AllActivities.vue | `pages/Activities.vue` |
| CommunicationProfiles.vue | `pages/CommunicationProfiles.vue` |
| ActivityBuilder.vue | `UI/BoardWrapper.vue` (panel host) |
| Triggers.vue | `pages/Triggers.vue` (structure reference) |
