# Attention–Identity Strategy Finder — V2 (Diagnostic Model)
### Peak Exposure Media — Interactive lead-gen questionnaire

This is a from-scratch build of the **V2 Developer Spec** — hidden scoring,
adaptive branching, guardrails, four-signal diagnosis, and a full CRM
payload. It's a separate, self-contained project from V1, meant to sit in
its own repo so you can run both side-by-side and compare conversion.

Like V1, it's plain HTML/CSS/JS — no build step, no framework — so it runs
directly on GitHub Pages.

---

## 1. Files

```
index.html   → page structure
styles.css   → styling (same PEM navy/gold palette as V1, distinct layout —
               see "How V2 looks different" below)
script.js    → scoring engine, branching logic, guardrails, analytics, form
assets/      → logo files
```

## 2. How the scoring actually works

Every answer carries `attn` / `ident` point values exactly as specified in
section 3 of your spec. Two running totals are kept, invisibly:

- **Full score** (all 6 answers, including the Q6 calibration question)
- **Pre-calibration score** (Q1–Q5 only, excluding Q6)

Both get converted to an Attention percentage and mapped to one of your five
bands using the exact thresholds from section 4 (70%+ → 80/20, 55–69% →
60/40, 45–54% → 50/50, 31–44% → 40/60, ≤30% → 20/80).

**The guardrail** (section 4: *"Strong Awareness + Relevance should prevent
an Identity-heavy result based only on Q6... Strong Perception + established
Maturity should prevent an Attention-heavy result based solely on preference
for reach"*): I implemented this as a clamp — the final band is not allowed
to sit more than one band-step away from the pre-calibration band. So if
someone's Q1–Q5 answers put them solidly in Attention Heavy territory, Q6
can nudge them down to Attention Led at most — it can never singlehandedly
flip them all the way to Identity Heavy. This is a general rule rather than
a hardcoded exception, so it protects against edge cases beyond just the
two examples named in the spec, without needing special-casing.

I stress-tested this against **all 128 possible answer combinations** plus
your 5 named QA paths — every one lands in the band you'd expect, and the
guardrail never fires unexpectedly. (It only matters in genuine edge cases
where Q1–Q5 land right on a boundary and Q6 would tip it further than one
band — none of your 5 QA paths happen to hit that edge, which is expected
since they're not adversarial cases.)

## 3. Where the spec left room for judgment calls

A few things in the spec are directional rather than fully mechanical. Here's
exactly what I built and why, so you can sanity-check or adjust:

- **"Top three strategic priorities"** — the spec lists seven possible
  priority tags but doesn't say how to pick three. I tag each answer option
  with the priority label it most directly supports (e.g. "Increase
  Discovery," "Improve Perception"), sum the point-weight behind each label
  across the answers given, and surface the top 3 by weight. This means the
  priorities shown are always drawn from *this person's actual answers*, not
  a static list per band.
- **"Personalized explanation based on dominant diagnostic signals"** — each
  result starts from a base paragraph per band (using your language,
  including the exact 60/40 example text from the spec), then appends one
  sentence built from whichever Q1–Q5 answer carried the most points. Q6 is
  deliberately excluded from this — since the spec is explicit that
  calibration should never drive the diagnosis, it shouldn't drive the
  explanation either.
- **Recommended content mix proportioning** — rather than a fixed list per
  band, the number of Attention vs. Identity content items shown scales with
  the actual ratio (e.g. an 80/20 result shows ~5 Attention items and 1
  Identity item; a 50/50 result shows 3 and 3). Every result always shows at
  least one item from each list, since your Content Translation section is
  explicit that production level isn't the strategy — even an
  Attention-heavy business still needs some Identity content, and vice versa.

None of this changes your scoring model or bands — it only fills in *how* to
turn the diagnosis into a page, where the spec intentionally left room.

## 4. How V2 looks different from V1

Same brand system (navy `#2D3340`, gold `#D4BC85`, Bebas Neue + Montserrat),
but a distinct visual identity so the two are easy to tell apart at a glance
and worth comparing:

- **Four-signal tracker** — a persistent Awareness / Relevance / Perception
  / Maturity strip at the top that lights up as each signal is diagnosed,
  making the "consultation" framing from your spec visible rather than
  abstract.
- **Scan-line motif** instead of V1's mountain-horizon graphic — a slow gold
  line and soft circular glow, echoing the lens shape in your icon rather
  than the peak shape. Feels closer to "diagnostic tool" than "campaign
  page."
- **Result page** follows your exact 7-part order (label → spectrum → ratio
  → explanation → priorities → content mix → CTA), with priority pills and
  a two-engine Attention/Identity content layout on every result, not just
  the Hybrid one.

## 5. Connect the lead form to your email (Formspree)

Same approach as V1 — a static site needs a form backend since there's no
server to send email from.

1. Go to **[formspree.io](https://formspree.io)**, create a free account (or
   reuse the one from V1 if you made one).
2. **New Form** → name it "PEM Strategy Finder Leads — V2" so it's easy to
   tell apart from V1's submissions.
3. Set the notification email to **Cameron@peakexposuremedia.com** and
   verify it.
4. Copy the endpoint (`https://formspree.io/f/xxxxxxx`).
5. Open `script.js`, near the top, replace:
   ```js
   const FORM_ENDPOINT = "https://formspree.io/f/YOUR_FORM_ID";
   ```
6. Commit and push.

**Use a separate Formspree form from V1** (not the same endpoint) — that
way your two dashboards stay cleanly split, which matters if you're
comparing conversion between the two versions.

## 6. What gets sent with each lead

Every field named in spec section 7's "Suggested fields" list is included in
the submission:

`session_id, started_at, completed_at, q1_answer, q2_variant, q2_answer,
q2c_answer_if_shown, q3_answer, q4_answer, q5_answer, q6_answer,
attention_score, identity_score, attention_pct, identity_pct, result_band,
dominant_signals, lead_name, lead_company, lead_email`

— plus a `full_answer_path` field with the complete question/answer text,
same as V1, so you don't need to decode answer letters by hand.

## 7. Analytics

The spec calls for tracking start, each answer, abandonment, completion,
result, CTA click, and lead submission. All seven fire as events (`quiz_
start`, `question_answered`, `quiz_abandoned`, `quiz_completed`, `result_
shown`, `cta_click`, `lead_submitted`) via a small `trackEvent()` helper in
`script.js`. Right now that pushes to `window.dataLayer` (the standard
format Google Tag Manager and GA4 both read) and logs to the browser
console — there's no analytics account built in, since that's a business
decision for you to make, not something to fabricate.

**To make these events show up somewhere real:**
- If you use Google Tag Manager: add the GTM snippet to `index.html`'s
  `<head>`, and set up triggers on the custom events listed above. No
  changes needed in `script.js`.
- If you use GA4 directly: add the GA4 config snippet, and either configure
  it to auto-pick-up the `dataLayer` pushes or add `gtag('event', ...)`
  calls alongside the existing `trackEvent()` calls.
- Abandonment tracking uses the page's `visibilitychange` event as a proxy
  for someone leaving mid-quiz — it's a reasonable signal but not perfectly
  reliable (e.g. someone switching tabs briefly will also fire it). If you
  want stricter abandonment tracking, a `beforeunload`-based ping to a
  logging endpoint would be more precise but needs a backend to receive it.

## 8. Host it on GitHub Pages

Same steps as V1 — as a **new, separate repository**:

1. Create a new GitHub repo, e.g. `pem-strategy-finder-v2`.
2. Push all files in this folder (keep `assets/` intact).
3. Settings → Pages → Deploy from branch → `main` → `/ (root)`.
4. You'll get a live URL like
   `https://yourusername.github.io/pem-strategy-finder-v2/`.

That's a separate, independent link from V1 — you can send different traffic
to each and compare completion/lead rates directly.

## 9. QA — verified against your test paths

All 5 named test paths from spec section 8 were run against the scoring
engine before this was handed off, and all 5 land in the exact band your
spec expects:

| Path | Expected | Actual |
|---|---|---|
| New local business needing growth | Attention Heavy | Attention Heavy (100% attn) |
| Established premium brand | Identity Heavy | Identity Heavy (0% attn) |
| Known consumer brand needing daily relevance | Attention Led / Heavy | Attention Heavy (85.7% attn) |
| Growing brand with perception gap | Hybrid / Identity Led | Hybrid (50% attn) |
| Established business needing both | Hybrid | Hybrid (46.2% attn) |

I also exhaustively simulated all 128 possible answer combinations to
confirm every path reaches a result in 6–7 questions with no dead ends —
none did.

## 10. Local preview

```bash
python3 -m http.server 8000
```
then visit `http://localhost:8000`.
