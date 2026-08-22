/* ==========================================================================
   Peak Exposure Media — Attention/Identity Strategy Finder (V2)
   Diagnostic model: hidden scoring, adaptive branching, guardrails.
   Built from "Peak Exposure Questionnaire V2 — Developer Spec".
   ========================================================================== */

/* --------------------------------------------------------------------------
   1. CONFIG
   -------------------------------------------------------------------------- */
const FORM_ENDPOINT = "https://formspree.io/f/mdenypey";

/* --------------------------------------------------------------------------
   2. QUESTION TREE + HIDDEN SCORING (spec section 2 & 3)
   Each option carries: attn/ident point deltas, a diagnostic tag, the
   four-signal category it belongs to, and a strategic-priority label used
   to build the "Top 3 priorities" on the result page.
   -------------------------------------------------------------------------- */
const QUESTIONS = {
  q1: {
    signal: "awareness",
    prompt: "If social media could solve one problem for your business right now, which would be more valuable?",
    options: [
      { id: "A", text: "More of the right people discovering us.", next: "q2a", attn: 3, ident: 0, tag: "awareness_pressure", priority: "Increase Discovery" },
      { id: "B", text: "People understanding why we're different and worth choosing.", next: "q2b", attn: 0, ident: 3, tag: "perception_pressure", priority: "Improve Perception" }
    ]
  },
  q2a: {
    signal: "awareness",
    prompt: "If twice as many of the right people discovered your business next month, what would happen?",
    options: [
      { id: "A", text: "It would directly create more opportunities, customers, leads, or growth.", next: "q3", attn: 3, ident: 0, tag: "discovery_helps", priority: "Increase Discovery" },
      { id: "B", text: "We'd still need to improve how people understand or perceive us before extra reach mattered.", next: "q2c", attn: 0, ident: 2, tag: "perception_first", priority: "Improve Perception" }
    ]
  },
  q2b: {
    signal: "perception",
    prompt: "When an ideal customer chooses a competitor instead of you, which explanation feels more accurate?",
    options: [
      { id: "A", text: "They were simply more visible or top-of-mind at the right time.", next: "q3", attn: 2, ident: 0, tag: "competitor_visible", priority: "Increase Discovery" },
      { id: "B", text: "The competitor felt more trusted, established, premium, or clearly differentiated.", next: "q3", attn: 0, ident: 3, tag: "competitor_trusted", priority: "Differentiate" }
    ]
  },
  q2c: {
    signal: "perception",
    prompt: "What is the bigger issue once someone finds your business?",
    options: [
      { id: "A", text: "They usually understand the value — we mainly need more opportunities to get in front of people.", next: "q3", attn: 2, ident: 0, tag: "need_opportunities", priority: "Increase Discovery" },
      { id: "B", text: "Our marketing doesn't fully communicate our quality, story, value, or difference.", next: "q3", attn: 0, ident: 3, tag: "marketing_undersells", priority: "Improve Perception" }
    ]
  },
  q3: {
    signal: "relevance",
    prompt: "If your business stopped posting and showing up socially for three months, what would concern you more?",
    options: [
      { id: "A", text: "We'd lose momentum, attention, engagement, or top-of-mind awareness.", next: "q4", attn: 3, ident: 0, tag: "relevance_high", priority: "Stay Relevant" },
      { id: "B", text: "It wouldn't hurt daily relevance much, but we'd lose an important way to represent our brand.", next: "q4", attn: 0, ident: 2, tag: "relevance_low_identity", priority: "Build Brand Recognition" }
    ]
  },
  q4: {
    signal: "maturity",
    prompt: "Which statement best describes your business today?",
    options: [
      { id: "A", text: "We are still building awareness, reputation, market share, or a recognizable name.", next: "q5", attn: 2, ident: 0, tag: "still_building", priority: "Build Brand Recognition" },
      { id: "B", text: "We are established and recognized; our bigger challenge is strengthening or protecting what the brand means.", next: "q5", attn: 0, ident: 2, tag: "established_protect", priority: "Protect Premium Positioning" }
    ]
  },
  q5: {
    signal: "purchase",
    prompt: "What matters more in the customer's decision to choose you?",
    options: [
      { id: "A", text: "Being visible, useful, relevant, and easy to remember when they need us.", next: "q6", attn: 2, ident: 0, tag: "visibility_drives_choice", priority: "Stay Relevant" },
      { id: "B", text: "Trusting our specific brand, believing in our quality, or wanting to identify with what we represent.", next: "q6", attn: 0, ident: 2, tag: "trust_drives_choice", priority: "Build Trust" }
    ]
  },
  q6: {
    signal: "calibration",
    prompt: "Assume both videos reach real potential customers. Which outcome would be more valuable?",
    options: [
      {
        id: "A", text: "A casual, social-native video reaches 500,000 people and creates conversation.", next: "RESULT",
        attn: 1, ident: 0, tag: "native_reach_pref", priority: "Increase Discovery",
        stats: ["500,000 people reached", "Casual, social-native format", "Sparks conversation and shares"]
      },
      {
        id: "B", text: "A highly intentional story reaches 50,000 people but makes ideal customers strongly prefer our brand.", next: "RESULT",
        attn: 0, ident: 1, tag: "story_preference", priority: "Differentiate",
        stats: ["50,000 people reached", "Highly intentional, story-driven", "Builds strong brand preference"]
      }
    ]
  }
};

/* --------------------------------------------------------------------------
   3. RESULT BANDS (spec section 4)
   Band index 0 = most Attention-heavy … 4 = most Identity-heavy.
   -------------------------------------------------------------------------- */
const BANDS = [
  {
    attn: 80, ident: 20, name: "Attention Heavy",
    summary: "Discovery, reach, frequency, relevance, and top-of-mind presence dominate.",
    base: "Right now, getting seen matters more than almost anything else. Your biggest opportunity is consistent discovery — more of the right people finding you, staying aware of you, and thinking of you first."
  },
  {
    attn: 60, ident: 40, name: "Attention Led",
    summary: "Growth and relevance lead, while brand-building reinforces trust and differentiation.",
    base: "Your brand still has meaningful growth and awareness opportunities, and staying visible is important to the way customers choose you. At the same time, perception matters enough that reach alone is not the goal. Use frequent, social-native content to earn attention while consistently reinforcing the quality and personality of your brand."
  },
  {
    attn: 50, ident: 50, name: "Hybrid",
    summary: "Discovery/relevance and perception are both meaningful constraints.",
    base: "Your business has two real jobs on social media right now: get discovered, and become memorable once you are. Neither can carry the strategy on its own — you need a content engine built for reach running alongside one built for meaning."
  },
  {
    attn: 40, ident: 60, name: "Identity Led",
    summary: "Awareness exists, but differentiation, trust, perception, or premium positioning are the larger opportunity.",
    base: "Awareness isn't your core problem — people generally find you. The bigger opportunity is making sure they understand exactly who you are, what you represent, and why you're worth choosing over the alternative sitting right next to you."
  },
  {
    attn: 20, ident: 80, name: "Identity Heavy",
    summary: "Protecting and elevating brand perception matters more than maximizing volume.",
    base: "Your social presence functions as an extension of the product or experience itself. For a business at your stage, how people perceive the brand matters more than how many people see any single post."
  }
];

/* --------------------------------------------------------------------------
   3b. RECOMMENDED POSTING FREQUENCY — keyed to the same 5 bands, since the
   band already reflects the hidden score. More Attention weight generally
   supports higher frequency (native, fast content compounds); more Identity
   weight favors fewer, higher-intent pieces over raw volume.
   -------------------------------------------------------------------------- */
const POSTING_FREQUENCY = [
  {
    cadence: "Daily — ideally 1–2x per day",
    note: "At an 80/20 mix, frequency is doing most of the work. Treat daily (or twice-daily) posting as the floor, not the ceiling — momentum compounds fast in an Attention-led strategy, and gaps cost you visibility quickly."
  },
  {
    cadence: "5–6x per week (near-daily)",
    note: "A 60/40 mix still needs frequent, social-native content to stay visible, with a bit more room to slot in the occasional brand-building piece without falling off the radar."
  },
  {
    cadence: "4–5x per week, across two content types",
    note: "At 50/50, run two cadences at once: post fast, native Attention content 3–4x a week, and layer in 1–2 more intentional Identity pieces on top. Don't let one type crowd out the other."
  },
  {
    cadence: "3–4x per week",
    note: "With a 40/60 mix, fewer, more deliberate posts serve you better than daily volume. Protect the time it takes for each piece to communicate who you are — consistency matters more than raw frequency here."
  },
  {
    cadence: "1–3x per week, prioritizing quality over frequency",
    note: "At 20/80, posting less — but better — is the strategy, not a compromise. Each piece is doing brand work; publishing before it's ready costs you more than posting less often."
  }
];

/* --------------------------------------------------------------------------
   4. TAG → PERSONALIZATION COPY
   Used to build the one dynamic sentence added to each result's explanation.
   Calibration (q6) tags are intentionally excluded from "dominant signal"
   selection — per the spec, calibration should never override diagnosis.
   -------------------------------------------------------------------------- */
const TAG_COPY = {
  awareness_pressure: "not enough of the right people know you exist yet",
  perception_pressure: "people don't yet understand why you're different",
  discovery_helps: "more reach would translate directly into growth",
  perception_first: "reach alone wouldn't fix how you're currently perceived",
  competitor_visible: "visibility is often the deciding factor against competitors",
  competitor_trusted: "trust and differentiation are what separate you from competitors",
  need_opportunities: "you mainly need more chances to get in front of people",
  marketing_undersells: "your marketing isn't fully communicating your value",
  relevance_high: "staying visible and top-of-mind is critical to your momentum",
  relevance_low_identity: "your bigger risk is losing brand representation, not daily relevance",
  still_building: "you're still building awareness and a recognizable name",
  established_protect: "your challenge now is protecting and strengthening what your brand means",
  visibility_drives_choice: "customers choose you largely because you're visible and easy to remember",
  trust_drives_choice: "customers choose you because they trust and identify with your brand"
};

/* --------------------------------------------------------------------------
   5. CONTENT LIBRARY (spec section 6)
   Ordered so proportional selection surfaces the most versatile items first.
   -------------------------------------------------------------------------- */
const ATTENTION_CONTENT = [
  "Social-native short-form video",
  "High-frequency posting",
  "Trends and cultural moments",
  "Quick education / tips",
  "Behind the scenes",
  "Humor and personality",
  "Timely reactions",
  "Community interaction",
  "iPhone / lo-fi content"
];
const IDENTITY_CONTENT = [
  "Brand stories",
  "Cinematic video",
  "Founder / customer / athlete stories",
  "Professional photography",
  "Narrative testimonials",
  "Lifestyle and culture",
  "Documentary-style pieces",
  "Craftsmanship / process",
  "Evergreen hero assets"
];

/* --------------------------------------------------------------------------
   6. ANALYTICS (spec section 7 — start, answer, abandonment, completion,
   result, CTA click, lead submission). Pushes to window.dataLayer if a
   tag manager is present; always logs to console for local visibility.
   -------------------------------------------------------------------------- */
function trackEvent(name, data = {}){
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: name, ...data });
  console.debug("[PEM V2 event]", name, data);
}

/* --------------------------------------------------------------------------
   7. STATE
   -------------------------------------------------------------------------- */
let history = [];        // stack of { qid, option } for back-navigation
let currentQid = "q1";
let attnScore = 0, identScore = 0;
let attnScoreExclQ6 = 0, identScoreExclQ6 = 0;
let sessionId = null;
let startedAt = null;
let completed = false;
const APPROX_TOTAL_STEPS = 6.5; // used only to animate the progress bar

function makeSessionId(){
  if (window.crypto && crypto.randomUUID) return crypto.randomUUID();
  return "sess_" + Date.now() + "_" + Math.random().toString(36).slice(2, 10);
}

/* --------------------------------------------------------------------------
   8. DOM REFS
   -------------------------------------------------------------------------- */
const screens = {
  intro: document.getElementById("screen-intro"),
  question: document.getElementById("screen-question"),
  result: document.getElementById("screen-result")
};
const trackerWrap = document.getElementById("trackerWrap");
const progressFill = document.getElementById("progressFill");
const questionTitle = document.getElementById("questionTitle");
const questionEyebrow = document.getElementById("questionEyebrow");
const optionsGrid = document.getElementById("optionsGrid");
const backBtn = document.getElementById("backBtn");
const signalChips = Array.from(document.querySelectorAll(".signal-chip"));

/* --------------------------------------------------------------------------
   9. NAVIGATION
   -------------------------------------------------------------------------- */
function showScreen(name){
  Object.values(screens).forEach(s => s.removeAttribute("data-active"));
  screens[name].setAttribute("data-active", "true");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function startQuiz(){
  history = [];
  currentQid = "q1";
  attnScore = 0; identScore = 0;
  attnScoreExclQ6 = 0; identScoreExclQ6 = 0;
  completed = false;
  sessionId = makeSessionId();
  startedAt = new Date().toISOString();

  trackEvent("quiz_start", { session_id: sessionId });

  trackerWrap.hidden = false;
  renderQuestion();
  showScreen("question");
}

function renderQuestion(){
  const q = QUESTIONS[currentQid];
  questionEyebrow.textContent = "Diagnosis";
  questionTitle.textContent = q.prompt;

  optionsGrid.innerHTML = "";
  q.options.forEach(opt => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "option-card";
    card.setAttribute("aria-label", opt.text);

    const letter = document.createElement("span");
    letter.className = "option-letter";
    letter.textContent = opt.id;
    card.appendChild(letter);

    const text = document.createElement("span");
    text.className = "option-text";
    text.textContent = opt.text;
    card.appendChild(text);

    if (opt.stats){
      const ul = document.createElement("ul");
      ul.className = "option-stats";
      opt.stats.forEach((s, i) => {
        const li = document.createElement("li");
        if (i === 0){
          const strong = document.createElement("strong");
          strong.textContent = s;
          li.appendChild(strong);
        } else {
          li.textContent = s;
        }
        ul.appendChild(li);
      });
      card.appendChild(ul);
    }

    card.addEventListener("click", () => selectOption(currentQid, q, opt));
    optionsGrid.appendChild(card);
  });

  backBtn.hidden = history.length === 0;
  updateProgress();
  updateSignalTracker();
}

function selectOption(qid, question, opt){
  attnScore += opt.attn;
  identScore += opt.ident;
  if (qid !== "q6"){
    attnScoreExclQ6 += opt.attn;
    identScoreExclQ6 += opt.ident;
  }
  history.push({ qid, option: opt });

  trackEvent("question_answered", {
    session_id: sessionId, question: qid, answer: opt.id, tag: opt.tag, signal: question.signal
  });

  if (opt.next === "RESULT"){
    finishQuiz();
    return;
  }

  currentQid = opt.next;
  screens.question.style.opacity = "0";
  setTimeout(() => {
    renderQuestion();
    screens.question.style.opacity = "1";
  }, 160);
}

function goBack(){
  if (history.length === 0) return;
  const last = history.pop();
  attnScore -= last.option.attn;
  identScore -= last.option.ident;
  if (last.qid !== "q6"){
    attnScoreExclQ6 -= last.option.attn;
    identScoreExclQ6 -= last.option.ident;
  }
  currentQid = last.qid;
  renderQuestion();
}

function updateProgress(){
  const step = history.length + 1;
  const pct = Math.min(100, Math.round((step / APPROX_TOTAL_STEPS) * 100));
  progressFill.style.width = pct + "%";
}

function updateSignalTracker(){
  const reached = new Set(history.map(h => QUESTIONS[h.qid].signal));
  // Treat the question about to be shown as "in progress" too, once relevant.
  signalChips.forEach(chip => {
    const sig = chip.getAttribute("data-signal");
    chip.classList.toggle("is-active", reached.has(sig));
  });
}

/* --------------------------------------------------------------------------
   10. SCORING → BAND (spec sections 3 & 4, including the calibration guardrail)
   -------------------------------------------------------------------------- */
function bandIndexFromPct(pct){
  if (pct >= 70) return 0; // 80/20 Attention Heavy
  if (pct >= 55) return 1; // 60/40 Attention Led
  if (pct >= 45) return 2; // 50/50 Hybrid
  if (pct >= 31) return 3; // 40/60 Identity Led
  return 4;                // 20/80 Identity Heavy (<=30)
}

function computeBand(){
  const totalIncl = attnScore + identScore;
  const totalExcl = attnScoreExclQ6 + identScoreExclQ6;
  const pctIncl = totalIncl === 0 ? 50 : (attnScore / totalIncl) * 100;
  const pctExcl = totalExcl === 0 ? 50 : (attnScoreExclQ6 / totalExcl) * 100;

  const bandIncl = bandIndexFromPct(pctIncl);
  const bandExcl = bandIndexFromPct(pctExcl);

  // Guardrail: Q6 (calibration) alone can shift the result by at most one
  // band step away from the pre-calibration diagnosis (Q1–Q5). This is what
  // prevents strong Awareness+Relevance signals from being overridden into
  // an Identity-heavy result by Q6 alone, and vice versa.
  let finalBand = bandIncl;
  if (bandIncl - bandExcl > 1) finalBand = bandExcl + 1;
  if (bandExcl - bandIncl > 1) finalBand = bandExcl - 1;

  return { finalBand, pctIncl, guardrailApplied: finalBand !== bandIncl };
}

function getDominantSignals(){
  // Excludes q6 (calibration) tags by design.
  const weighted = history
    .filter(h => h.qid !== "q6")
    .map(h => ({ tag: h.option.tag, weight: h.option.attn + h.option.ident }))
    .sort((a, b) => b.weight - a.weight);
  return weighted;
}

function getTopPriorities(){
  const totals = {};
  history.forEach(h => {
    const w = h.option.attn + h.option.ident;
    totals[h.option.priority] = (totals[h.option.priority] || 0) + w;
  });
  return Object.entries(totals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([label]) => label);
}

function pickProportional(list, count){
  count = Math.max(1, Math.min(list.length, Math.round(count)));
  return list.slice(0, count);
}

/* --------------------------------------------------------------------------
   11. RESULT RENDERING
   -------------------------------------------------------------------------- */
function finishQuiz(){
  completed = true;
  const completedAt = new Date().toISOString();
  const { finalBand, pctIncl } = computeBand();
  const band = BANDS[finalBand];

  trackEvent("quiz_completed", { session_id: sessionId, result_band: band.name });
  trackEvent("result_shown", {
    session_id: sessionId, result_band: band.name, attention_pct: band.attn, identity_pct: band.ident
  });

  progressFill.style.width = "100%";

  // ---- 1 & 2 & 3: label, spectrum, ratio ----
  document.getElementById("resultLabel").textContent = `${band.attn}% Attention / ${band.ident}% Identity`;
  document.getElementById("resultBandName").textContent = band.name;
  document.getElementById("pctAttention").textContent = band.attn + "%";
  document.getElementById("pctIdentity").textContent = band.ident + "%";
  document.getElementById("spectrumFill").style.width = band.attn + "%";
  document.getElementById("spectrumMarker").style.left = band.attn + "%";

  // ---- 4: personalized explanation ----
  const dominant = getDominantSignals();
  let lede = band.base;
  if (dominant.length){
    const top = dominant[0];
    const phrase = TAG_COPY[top.tag];
    if (phrase) lede += ` In your case, ${phrase}.`;
  }
  document.getElementById("resultLede").innerHTML = lede;

  // ---- 5: top three priorities ----
  const priorities = getTopPriorities();
  const priorityWrap = document.getElementById("priorityPills");
  priorityWrap.innerHTML = "";
  priorities.forEach(p => {
    const pill = document.createElement("span");
    pill.className = "priority-pill";
    pill.textContent = p;
    priorityWrap.appendChild(pill);
  });

  // ---- 6: recommended content mix, proportioned to the ratio ----
  const totalSlots = 6;
  const attnCount = pickProportional(ATTENTION_CONTENT, (band.attn / 100) * totalSlots);
  const identCount = pickProportional(IDENTITY_CONTENT, (band.ident / 100) * totalSlots);
  const attnList = document.getElementById("mixAttention");
  const identList = document.getElementById("mixIdentity");
  attnList.innerHTML = "";
  identList.innerHTML = "";
  attnCount.forEach(item => { const li = document.createElement("li"); li.textContent = item; attnList.appendChild(li); });
  identCount.forEach(item => { const li = document.createElement("li"); li.textContent = item; identList.appendChild(li); });

  // ---- posting frequency, keyed to the same band ----
  const frequency = POSTING_FREQUENCY[finalBand];
  document.getElementById("cadenceValue").textContent = frequency.cadence;
  document.getElementById("cadenceNote").textContent = frequency.note;

  // ---- 7: CTA / lead payload ----
  const byQid = id => history.find(h => h.qid === id);
  const q1 = byQid("q1"), q2a = byQid("q2a"), q2b = byQid("q2b"), q2c = byQid("q2c"),
        q3 = byQid("q3"), q4 = byQid("q4"), q5 = byQid("q5"), q6 = byQid("q6");
  const q2Variant = q2a ? "q2a" : (q2b ? "q2b" : "");
  const q2Answer = q2a ? q2a.option.id : (q2b ? q2b.option.id : "");
  const dominantLabels = dominant.slice(0, 3).map(d => TAG_COPY[d.tag] || d.tag);
  const answerPath = history
    .map((h, i) => `${i + 1}. ${QUESTIONS[h.qid].prompt}\n   → ${h.option.text}`)
    .join("\n\n");

  // Human-readable digest — this is what makes the email easy to scan.
  const summary = [
    `RESULT: ${band.attn}% Attention / ${band.ident}% Identity  (${band.name})`,
    ``,
    `WHY THEY LANDED HERE`,
    dominantLabels.length ? dominantLabels.map(d => `• ${d}`).join("\n") : "• No single signal dominated — answers were evenly split.",
    ``,
    `TOP PRIORITIES`,
    priorities.length ? priorities.map(p => `• ${p}`).join("\n") : "• N/A",
    ``,
    `RECOMMENDED POSTING FREQUENCY`,
    `${frequency.cadence}`,
    ``,
    `FULL ANSWER PATH`,
    answerPath,
    ``,
    `Session: ${sessionId}`,
    `Started:   ${startedAt}`,
    `Completed: ${completedAt}`
  ].join("\n");

  document.getElementById("hSummary").value = summary;
  document.getElementById("hBand").value = `${band.name} (${band.attn}/${band.ident})`;
  document.getElementById("hRatio").value = `${band.attn}% Attention / ${band.ident}% Identity`;

  document.getElementById("hSessionId").value = sessionId;
  document.getElementById("hStartedAt").value = startedAt;
  document.getElementById("hCompletedAt").value = completedAt;
  document.getElementById("hQ1").value = q1 ? q1.option.id : "";
  document.getElementById("hQ2Variant").value = q2Variant;
  document.getElementById("hQ2Answer").value = q2Answer;
  document.getElementById("hQ2c").value = q2c ? q2c.option.id : "";
  document.getElementById("hQ3").value = q3 ? q3.option.id : "";
  document.getElementById("hQ4").value = q4 ? q4.option.id : "";
  document.getElementById("hQ5").value = q5 ? q5.option.id : "";
  document.getElementById("hQ6").value = q6 ? q6.option.id : "";
  document.getElementById("hAttnScore").value = attnScore;
  document.getElementById("hIdScore").value = identScore;
  document.getElementById("hAttnPct").value = band.attn;
  document.getElementById("hIdPct").value = band.ident;
  document.getElementById("hBandRaw").value = band.name;
  document.getElementById("hDominant").value = dominant.slice(0, 3).map(d => d.tag).join(", ");
  document.getElementById("hPath").value = answerPath;

  document.getElementById("leadForm").hidden = false;
  document.getElementById("leadSuccess").hidden = true;
  document.getElementById("leadForm").reset();

  showScreen("result");
}

/* --------------------------------------------------------------------------
   12. LEAD FORM SUBMISSION
   -------------------------------------------------------------------------- */
const leadForm = document.getElementById("leadForm");
const submitLeadBtn = document.getElementById("submitLeadBtn");

leadForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  trackEvent("cta_click", { session_id: sessionId });

  // Build a scannable subject line now that we know who this is.
  const name = leadForm.querySelector('[name="lead_name"]').value.trim();
  const company = leadForm.querySelector('[name="lead_company"]').value.trim();
  const bandLabel = document.getElementById("hBandRaw").value;
  document.getElementById("hSubject").value =
    `New Lead: ${bandLabel} — ${company || name || "PEM Strategy Finder"}`;

  if (FORM_ENDPOINT.includes("YOUR_FORM_ID")){
    alert("Heads up: the lead form isn't connected yet. Set FORM_ENDPOINT in script.js — see README.md for setup steps.");
    return;
  }

  const originalText = submitLeadBtn.innerHTML;
  submitLeadBtn.disabled = true;
  submitLeadBtn.innerHTML = "<span>Sending…</span>";

  try{
    const res = await fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Accept": "application/json" },
      body: new FormData(leadForm)
    });

    if (res.ok){
      trackEvent("lead_submitted", { session_id: sessionId });
      leadForm.hidden = true;
      document.getElementById("leadSuccess").hidden = false;
    } else {
      throw new Error("Submission failed");
    }
  } catch (err){
    alert("Something went wrong sending your details. Please try again, or email Cameron@peakexposuremedia.com directly.");
    submitLeadBtn.disabled = false;
    submitLeadBtn.innerHTML = originalText;
  }
});

/* --------------------------------------------------------------------------
   13. ABANDONMENT TRACKING
   -------------------------------------------------------------------------- */
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && sessionId && !completed && history.length > 0){
    trackEvent("quiz_abandoned", { session_id: sessionId, last_question: currentQid, questions_answered: history.length });
  }
});

/* --------------------------------------------------------------------------
   14. EVENTS
   -------------------------------------------------------------------------- */
document.getElementById("startBtn").addEventListener("click", startQuiz);
backBtn.addEventListener("click", goBack);
document.getElementById("restartBtn").addEventListener("click", () => {
  trackerWrap.hidden = true;
  signalChips.forEach(c => c.classList.remove("is-active"));
  showScreen("intro");
});
