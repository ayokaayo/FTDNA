# Topic Map

Structured taxonomy of what the tutor can teach. Each topic has a domain, difficulty
range, prerequisites, and learning objectives. Use this to validate learner topic
requests and suggest logical next steps.

## How to use this map

- When a learner requests a topic, find it here to confirm it exists and check
  its prerequisites
- When suggesting "next step" after a lesson, follow the suggested-next links
- When building a quiz, use the learning objectives as the basis for questions
- Topics marked [future] don't have curated content yet — teach from KB only

---

## CRM Core

### triggers
- **Domain:** CRM
- **Difficulty:** beginner → advanced
- **Prerequisites:** none (entry point)
- **Learning objectives:**
  - Explain what a trigger is and its role in an activity
  - Distinguish SDT triggers from real-time triggers
  - List common real-time trigger events (login, deposit, game round, etc.)
  - Explain firing conditions and how they filter trigger evaluation
  - [Advanced] Describe trigger deduplication and cooldown behavior
- **Suggested next:** segments, activities

### segments
- **Domain:** CRM
- **Difficulty:** beginner → advanced
- **Prerequisites:** triggers (recommended)
- **Learning objectives:**
  - Explain what a segment is and how it targets players
  - Describe the rule builder and how conditions combine (AND/OR)
  - Distinguish real-time segments from calculated segments
  - Explain how Player Features (Singularity) appear as segment criteria
  - [Advanced] Upload-based segments, segment exclusions, smart segments
- **Suggested next:** activities, player-features

### activities
- **Domain:** CRM
- **Difficulty:** beginner → advanced
- **Prerequisites:** triggers, segments
- **Learning objectives:**
  - Explain the trigger → segment → action flow
  - Describe action groups and A/B testing
  - Explain control groups and uplift measurement
  - Explain conversion tracking and how it measures campaign success
  - [Advanced] Activity scheduling, priority, overlapping campaigns
- **Suggested next:** actions, lifecycles

### actions
- **Domain:** CRM
- **Difficulty:** beginner → intermediate
- **Prerequisites:** activities
- **Learning objectives:**
  - List available action types (email, SMS, push, on-site, inbox, webhook)
  - Explain the CreditReward action and how it bridges CRM and Rewards
  - Describe Communication Profiles and multi-language content
  - Explain translation workflows and fallback behavior
- **Suggested next:** lifecycles, bonuses

### lifecycles
- **Domain:** CRM
- **Difficulty:** intermediate → advanced
- **Prerequisites:** activities, segments, actions
- **Learning objectives:**
  - Explain what a lifecycle is and when to use one vs. standalone activities
  - Describe lifecycle events, transitions, and the player journey graph
  - Explain entry conditions and re-entry rules
  - [Advanced] Lifecycle versioning, lifecycle exclusions, multi-lifecycle strategy
- **Suggested next:** player-management, churn-prevention

### player-management
- **Domain:** CRM
- **Difficulty:** beginner → intermediate
- **Prerequisites:** none
- **Learning objectives:**
  - Explain the player profile and what data it contains
  - Describe Player Origins and multi-brand management
  - Explain blocked players, compliance flags, and GDPR handling
  - Describe consent management and unsubscribe flows
- **Suggested next:** segments, origins

### crm-organization
- **Domain:** CRM
- **Difficulty:** beginner → intermediate
- **Prerequisites:** none
- **Learning objectives:**
  - Explain projects and how they organize CRM work
  - Describe the QA workflow (draft → review → live)
  - Explain email templates and the media library
  - Describe user roles and permissions
- **Suggested next:** activities, actions

---

## Singularity (AI & Personalization)

### player-features
- **Domain:** Singularity
- **Difficulty:** intermediate → advanced
- **Prerequisites:** segments (recommended)
- **Learning objectives:**
  - Explain what Player Features are and how they classify players
  - Describe Feature Types and Feature Type Classes
  - List key Player Features (Active State, Lifestage, Preferred Product, etc.)
  - Explain how Player Features power segment criteria
  - [Advanced] Computations, real-time vs. batch classification
- **Suggested next:** movements, content-matching

### movements [future]
- **Domain:** Singularity
- **Difficulty:** advanced
- **Prerequisites:** player-features
- **Learning objectives:**
  - Explain real-time movements vs. ClickHouse batch queries
  - Describe how movements update Player Feature classifications
- **Suggested next:** content-matching

### content-matching [future]
- **Domain:** Singularity
- **Difficulty:** advanced
- **Prerequisites:** player-features, activities
- **Learning objectives:**
  - Explain 1:1 Experiences and content libraries
  - Describe Smart Time of Day and Smart Channel
  - Explain how content matching integrates with activities
- **Suggested next:** activities (advanced)

---

## Rewards

### bonuses
- **Domain:** Rewards
- **Difficulty:** beginner → intermediate
- **Prerequisites:** actions (recommended)
- **Learning objectives:**
  - Explain the bonus-first principle
  - List bonus types (free spins, cash bonus, etc.)
  - Describe how bonuses are created and configured
  - Explain the CreditReward bridge between CRM and Rewards
- **Suggested next:** challenges, mini-games

### challenges
- **Domain:** Rewards
- **Difficulty:** intermediate → advanced
- **Prerequisites:** bonuses
- **Learning objectives:**
  - Explain challenges (missions) and their types (wager, spin, deposit, login)
  - Describe milestones and task completion logic
  - Explain how challenges release reward bonuses
  - [Advanced] Challenge scheduling, complex milestone chains
- **Suggested next:** mini-games, levels

### mini-games [future]
- **Domain:** Rewards
- **Difficulty:** intermediate
- **Prerequisites:** bonuses
- **Learning objectives:**
  - Explain Wheels, Pick & Win, and Plinko
  - Describe deterministic sequences and token economy
- **Suggested next:** levels, calendars

### levels [future]
- **Domain:** Rewards
- **Difficulty:** intermediate → advanced
- **Prerequisites:** bonuses
- **Learning objectives:**
  - Explain XP-based progression and tier systems
  - Describe virtual currencies and the Shop
  - Explain game contribution models
- **Suggested next:** calendars

### calendars [future]
- **Domain:** Rewards
- **Difficulty:** intermediate
- **Prerequisites:** bonuses
- **Learning objectives:**
  - Explain promotional calendars and seasonal campaigns
  - Describe date-based reward sequencing

---

## Insights & Analytics

### dashboards [future]
- **Domain:** Insights
- **Difficulty:** beginner → intermediate
- **Prerequisites:** none
- **Learning objectives:**
  - Explain dashboard types (System, Brand, Private)
  - Describe widgets and chart types
  - Explain Explore for ad-hoc analysis
  - Describe measures and dimensions

### fast-track-ai [future]
- **Domain:** Insights
- **Difficulty:** intermediate
- **Prerequisites:** dashboards
- **Learning objectives:**
  - Explain natural language analytics
  - Describe report generation and anomaly detection
  - Explain cohort creation from AI queries

---

## Advanced

### churn-prevention [future]
- **Domain:** Advanced
- **Difficulty:** advanced
- **Prerequisites:** lifecycles, player-features
- **Learning objectives:**
  - Explain basic (rule-based) vs. AI-powered churn prevention
  - Describe how churn models integrate with segments and lifecycles
