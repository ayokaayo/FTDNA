# Scenarios — Triggers

Real-world exercises based on actual partner situations. Each scenario presents a
problem the learner must solve using their understanding of triggers and related
CRM features.

## Format

```
### S[number] — [difficulty]
**Context:** The situation
**Question:** What the learner must solve
**Strong approach:** What a good answer looks like
**Common mistakes:** What learners typically get wrong
**Key concepts tested:** What this scenario validates
**Source:** Where the scenario was derived from
```

---

### S1 — beginner
**Context:** A new partner has just launched on Fast Track. They want to send a welcome email to every player who registers for the first time.

**Question:** What type of trigger would you use, and why?

**Strong approach:** Use a real-time trigger on the Registration event. This fires immediately when a new player registers, ensuring they get the welcome email right away. The segment can be simple — all players who triggered the registration event. The action is an email send.

**Common mistakes:**
- Using an SDT trigger that runs daily — this creates a delay (up to 24 hours) before the welcome email arrives, which is a poor onboarding experience.
- Forgetting that the trigger type determines when the activity evaluates, not just which event it listens to.

**Key concepts tested:** Real-time vs. SDT trigger selection, trigger-event mapping.
**Source:** Common onboarding pattern [KB — Triggers, Activities]

---

### S2 — intermediate
**Context:** A partner's team reports that their "deposit thank you" push notification is being received by some players 3-4 times per day. The activity uses a real-time trigger on the Deposit event, a segment with no special conditions (all depositors qualify), and a push notification action.

**Question:** What's causing the repeated notifications, and how would you fix it?

**Strong approach:** The real-time trigger fires every time any player makes a deposit. Players who deposit multiple times in a day receive the notification each time. Fix: add a cooldown/deduplication setting on the trigger (e.g., max 1 fire per player per 24 hours), or add a segment condition that excludes players who already received this notification today.

**Common mistakes:**
- Suggesting to switch to an SDT trigger — this changes the campaign's behavior fundamentally (batch vs. real-time) and may not match the partner's intent.
- Only addressing the symptom (multiple sends) without explaining why it happens (trigger fires per event, no deduplication).

**Key concepts tested:** Trigger deduplication, cooldown configuration, real-time trigger behavior.
**Source:** Derived from real partner feedback patterns [KB — Triggers]

---

### S3 — intermediate
**Context:** A partner wants to send an email to all players who haven't logged in for 7 days. They're debating between two approaches:
1. A real-time trigger on Login event with "7 days since last login" as a condition
2. An SDT trigger running daily with a segment filtering players whose last login was 7+ days ago

**Question:** Which approach is correct, and why doesn't the other one work?

**Strong approach:** Approach 2 (SDT + segment) is correct. A real-time trigger on Login fires when a player *does* log in — it cannot detect the *absence* of an event. You can't trigger on something that didn't happen in real-time. An SDT trigger runs on a schedule and the segment evaluates all players, allowing you to filter for those whose last login was 7+ days ago.

**Common mistakes:**
- Choosing approach 1 — this is the most common misconception about real-time triggers. They respond to events, not to the absence of events.
- Not understanding that "7 days since last login" requires a scheduled check, not an event-driven one.

**Key concepts tested:** Fundamental difference between event-driven (real-time) and schedule-driven (SDT) triggers. Understanding that real-time triggers require a positive event.
**Source:** Repeated confusion pattern from internal Q&A [KB — Triggers]

---

### S4 — advanced
**Context:** A partner runs multiple brands from a single Fast Track instance using Player Origins. They have:
- Brand A: a real-time trigger on Deposit that credits a 10% cashback bonus
- Brand B: a real-time trigger on Deposit that sends a "thank you" email only

A player who plays on both brands makes a deposit on Brand A.

**Question:** What happens? Does the player receive the Brand B email too? How does origin-based filtering work with triggers?

**Strong approach:** Player Origins determine which brand context a player event belongs to. When the player deposits on Brand A, only Brand A's activities evaluate that event. Brand B's trigger won't fire because the deposit event carries Brand A's origin context. The segment in each activity should include origin-based filtering to ensure only the correct brand's players qualify. This is a platform-level separation — activities are typically scoped to an origin.

**Common mistakes:**
- Assuming both triggers fire because the player exists in both brands
- Not understanding that events carry origin context
- Confusing player existence in the system with event origin scoping

**Key concepts tested:** Player Origins, multi-brand event handling, origin-based segment filtering.
**Source:** Multi-brand configuration pattern [KB — Player Management, Triggers]

---

### S5 — advanced
**Context:** A partner's Success Manager asks: "We have a lifecycle for onboarding (sends 5 emails over 14 days after registration) and a standalone campaign that sends a weekend deposit bonus every Saturday using an SDT trigger. Some newly registered players are getting both the onboarding emails AND the weekend bonus email on the same Saturday. The partner wants onboarding players to only get the lifecycle emails, not the weekend campaign."

**Question:** How would you prevent the overlap? What are the trade-offs of your approach?

**Strong approach:** Add a segment exclusion to the weekend campaign that excludes players currently in the onboarding lifecycle. This means the weekend campaign's segment would include conditions like "is NOT in lifecycle: Onboarding" or "registration date is more than 14 days ago." Trade-off: the player misses weekend bonuses during their first 2 weeks, which could reduce early engagement. Alternative: let both run but ensure the messaging is complementary, not competing. The right answer depends on the partner's strategy — prioritize onboarding focus or maximize early touchpoints.

**Common mistakes:**
- Only thinking about the technical solution without considering the strategic trade-off
- Suggesting to modify the lifecycle (more disruptive) instead of adding an exclusion to the standalone campaign (simpler)
- Not recognizing that lifecycle exclusions are the standard pattern for this problem

**Key concepts tested:** Lifecycle exclusions, campaign overlap management, strategic thinking about competing campaigns.
**Source:** Derived from #howwouldyou discussion on campaign prioritization [Curated Q&A — #howwouldyou, KB — Lifecycles]
