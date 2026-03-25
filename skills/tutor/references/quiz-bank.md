# Quiz Bank

Curated quiz questions by topic and difficulty. Each question has been reviewed
for accuracy against the GitBook knowledgebase.

## Format

```
### Q[number] — [topic] — [difficulty]
**Type:** multiple-choice | open-text
**Question:** ...
**Options:** (for MC only)
a) ...
b) ...
c) ...
d) ...
**Correct:** [letter or expected answer]
**Explanation:** Why the correct answer is correct + source
**Hint:** What to say if the learner gets it wrong (directional, not the answer)
```

---

## Triggers

### Q1 — triggers — beginner
**Type:** multiple-choice
**Question:** What is the role of a trigger in a Fast Track activity?
**Options:**
a) It defines which players receive the action
b) It defines when the activity fires
c) It sends the email or SMS
d) It tracks conversion metrics
**Correct:** b
**Explanation:** A trigger defines the "when" — the event or schedule that causes an activity to evaluate. The segment defines the "who," and the action defines the "what." [Source: KB — Triggers]
**Hint:** Think about timing. What tells the activity to wake up and start evaluating?

### Q2 — triggers — beginner
**Type:** multiple-choice
**Question:** What are the two main types of triggers in Fast Track?
**Options:**
a) Manual and automatic
b) Specific Date & Time (SDT) and real-time
c) One-off and recurring
d) Player-based and system-based
**Correct:** b
**Explanation:** SDT triggers fire on a schedule (date/time). Real-time triggers fire in response to player events like login, deposit, or game round completion. [Source: KB — Triggers]
**Hint:** One type runs on a schedule, the other responds to something a player does.

### Q3 — triggers — intermediate
**Type:** multiple-choice
**Question:** A partner wants to send a welcome bonus to players exactly 24 hours after their first deposit. Which trigger type should they use?
**Options:**
a) Real-time trigger on the deposit event
b) SDT trigger running daily
c) Real-time trigger on the login event with a 24-hour delay
d) SDT trigger with a segment filtering first-deposit date
**Correct:** d
**Explanation:** An SDT trigger running daily combined with a segment that filters for players whose first deposit was exactly 24 hours ago is the standard approach. A real-time deposit trigger would fire immediately, not after 24 hours. [Source: KB — Triggers, Activities]
**Hint:** Think about what fires at a specific time vs. what fires in response to an event. Which one lets you control the delay precisely?

### Q4 — triggers — intermediate
**Type:** open-text
**Question:** Explain the difference between how an SDT trigger and a real-time trigger evaluate their segment. When does each check which players qualify?
**Expected:** SDT triggers evaluate the segment at the scheduled time — they check all players against the segment conditions at that moment. Real-time triggers evaluate the segment only for the specific player who caused the trigger event — they check whether that individual player matches the segment right when the event occurs.
**Explanation:** This is a fundamental architectural difference. SDT is batch-like (evaluate everyone at time X), real-time is event-driven (evaluate one player when they act). [Source: KB — Triggers, Segments]
**Hint:** Think about how many players each trigger type evaluates at once. Does it check everyone, or just one player?

### Q5 — triggers — advanced
**Type:** open-text
**Question:** A partner has a real-time trigger on the Deposit event that sends a "thank you for depositing" push notification. Players complain they receive multiple notifications when they make several deposits in one session. How would you solve this?
**Expected:** Use firing conditions or cooldown/deduplication settings on the trigger to limit how often it can fire per player within a time window. For example, set a cooldown of 24 hours per player so the trigger only fires on the first deposit in that window. Alternatively, adjust the segment to exclude players who already received the notification recently.
**Explanation:** Trigger deduplication and cooldowns prevent over-communication. This is a common real-world configuration issue. [Source: KB — Triggers]
**Hint:** There's a way to tell the trigger "don't fire again for this player if you already fired recently." Where would you configure that?

---

## Segments

### Q6 — segments — beginner
**Type:** multiple-choice
**Question:** What does a segment do in a Fast Track activity?
**Options:**
a) It schedules when the activity runs
b) It defines which players qualify for the action
c) It sends the communication to players
d) It tracks whether the campaign was successful
**Correct:** b
**Explanation:** A segment defines the "who" — the targeting criteria that determine which players qualify. It sits between the trigger (when) and the action (what). [Source: KB — Segments]
**Hint:** In the trigger → ? → action flow, the segment fills the gap. What role does that middle step play?

### Q7 — segments — intermediate
**Type:** multiple-choice
**Question:** A partner wants to target players who deposited more than €100 in the last 30 days AND are classified as "at risk" by the Singularity model. Which segment approach is correct?
**Options:**
a) Create two separate segments and use both in the activity
b) Create one segment with both conditions combined using AND logic
c) Use a lifecycle to chain the two conditions
d) Use an A/B test with one condition per group
**Correct:** b
**Explanation:** The segment rule builder supports combining multiple conditions with AND/OR logic. Deposit amount is a player data condition, and Singularity classification (Player Feature) is available as a segment criterion. Both go in one segment with AND logic. [Source: KB — Segments, Singularity Model]
**Hint:** The rule builder lets you combine different types of conditions in a single segment. How would you combine them?

### Q8 — segments — advanced
**Type:** open-text
**Question:** What's the difference between a real-time segment and a calculated segment? When would you choose one over the other?
**Expected:** Real-time segments evaluate conditions at the moment of trigger evaluation — they check current player state. Calculated segments are pre-computed on a schedule (e.g., daily) and store a list of qualifying players. Use real-time for conditions that need to reflect the latest player state (e.g., current balance). Use calculated for complex queries that would be too expensive to run in real-time (e.g., aggregate behavior over 90 days).
**Explanation:** This is an architecture and performance trade-off. Real-time is accurate but expensive per-evaluation. Calculated is pre-baked but may be slightly stale. [Source: KB — Segments]
**Hint:** Think about when the segment does its work — at the moment the trigger fires, or ahead of time on a schedule. What are the trade-offs of each?

---

## Activities

### Q9 — activities — beginner
**Type:** multiple-choice
**Question:** What is the correct order of evaluation in a Fast Track activity?
**Options:**
a) Segment → Trigger → Action
b) Action → Segment → Trigger
c) Trigger → Segment → Action
d) Trigger → Action → Segment
**Correct:** c
**Explanation:** The trigger fires first (the "when"), then the segment evaluates which players qualify (the "who"), then the action executes for qualifying players (the "what"). [Source: KB — Activities]
**Hint:** Think about it chronologically. What needs to happen first before you can check who qualifies?

### Q10 — activities — intermediate
**Type:** open-text
**Question:** Explain what a control group is in the context of a Fast Track activity, and why you would use one.
**Expected:** A control group is a percentage of qualifying players who are deliberately excluded from receiving the action. They qualify for the segment but don't get the communication or bonus. By comparing the behavior of the control group (no action) with the test group (received the action), you can measure the true uplift — whether the campaign actually changed player behavior or whether they would have acted the same way regardless.
**Explanation:** Control groups enable uplift measurement, which is critical for proving campaign ROI. Without a control group, you can't distinguish correlation from causation. [Source: KB — Activities]
**Hint:** It's related to measurement. How do you prove that your campaign actually changed player behavior?
