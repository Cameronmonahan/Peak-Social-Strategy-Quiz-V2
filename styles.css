/* ==========================================================================
   Peak Exposure Media — Attention/Identity Strategy Finder (V2)
   Diagnostic-model variant. Same brand palette as V1, distinct UI treatment
   built around the four-signal (Awareness/Relevance/Perception/Maturity)
   framing from the V2 spec.
   ========================================================================== */

:root{
  --navy-deep:   #1B1F28;
  --navy:        #2D3340;
  --navy-soft:   #3A4152;
  --navy-line:   rgba(255,255,255,0.10);
  --gold:        #D4BC85;
  --gold-light:  #E6D7B2;
  --gold-dim:    rgba(212,188,133,0.14);
  --white:       #FFFFFF;
  --ink:         #20242E;
  --muted:       #A6ACBB;
  --muted-2:     #7C8296;
  --signal-off:  rgba(255,255,255,0.14);

  --font-display: 'Bebas Neue', sans-serif;
  --font-body: 'Montserrat', sans-serif;

  --radius-lg: 20px;
  --radius-md: 14px;
  --radius-sm: 10px;
  --ease: cubic-bezier(.22,.9,.32,1);
}

*{box-sizing:border-box;}
html,body{margin:0;padding:0;}

/* Guards against any class-based `display` rule silently overriding the
   native `hidden` attribute (a common CSS gotcha — e.g. `.lead-form{
   display:flex }` would otherwise beat the browser's default `[hidden]{
   display:none }` and the element stays visible even when JS sets
   `.hidden = true`). */
[hidden]{ display: none !important; }

body{
  background: var(--navy-deep);
  color: var(--white);
  font-family: var(--font-body);
  font-weight: 400;
  -webkit-font-smoothing: antialiased;
  min-height: 100vh;
  overflow-x: hidden;
}

::selection{ background: var(--gold); color: var(--navy-deep); }

:focus-visible{
  outline: 2px solid var(--gold);
  outline-offset: 3px;
  border-radius: 4px;
}

/* Diagnostic scan-line motif — distinct signature from V1's mountain horizon.
   A slow gold scan line + soft radial glow behind the logo, echoing the
   circular lens shape of the brand icon rather than the peak silhouette. */
.scan-bg{
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background:
    radial-gradient(circle 640px at 50% 6%, rgba(212,188,133,0.10), transparent 65%),
    radial-gradient(circle 900px at 100% 100%, rgba(212,188,133,0.05), transparent 60%);
}
.scan-bg::after{
  content:"";
  position:absolute;
  left:0; right:0;
  top:0;
  height:2px;
  background: linear-gradient(90deg, transparent, var(--gold), transparent);
  opacity: 0.55;
  animation: scanline 7s linear infinite;
}
@keyframes scanline{
  0%{ top: -2%; opacity: 0; }
  8%{ opacity: 0.55; }
  50%{ opacity: 0.35; }
  92%{ opacity: 0.55; }
  100%{ top: 100%; opacity: 0; }
}
@media (prefers-reduced-motion: reduce){
  .scan-bg::after{ animation: none; display: none; }
}

/* ==========================================================================
   Layout shell
   ========================================================================== */

.app{
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 20px 80px;
}

.app-header{
  width: 100%;
  max-width: 640px;
  display: flex;
  justify-content: center;
  margin-bottom: 6px;
}
.header-logo{
  height: 30px;
  width: auto;
  opacity: 0.95;
}

.app-footer{
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 22px 20px 30px;
  color: var(--muted-2);
  font-size: 12px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
}
.footer-icon{ height: 16px; width: auto; opacity: 0.7; }

/* ---------------- Signal tracker + progress ---------------- */
.tracker-wrap{
  width: 100%;
  max-width: 460px;
  margin: 10px auto 4px;
}
.signal-tracker{
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}
.signal-chip{
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 10.5px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--muted-2);
  background: rgba(255,255,255,0.04);
  border: 1px solid var(--navy-line);
  border-radius: 999px;
  padding: 6px 12px;
  transition: color 0.35s var(--ease), border-color 0.35s var(--ease), background 0.35s var(--ease);
}
.signal-dot{
  width: 6px; height: 6px;
  border-radius: 50%;
  background: var(--signal-off);
  transition: background 0.35s var(--ease), box-shadow 0.35s var(--ease);
}
.signal-chip.is-active{
  color: var(--gold-light);
  border-color: rgba(212,188,133,0.4);
  background: var(--gold-dim);
}
.signal-chip.is-active .signal-dot{
  background: var(--gold);
  box-shadow: 0 0 8px rgba(212,188,133,0.7);
}

.progress-track{
  height: 4px;
  border-radius: 4px;
  background: rgba(255,255,255,0.08);
  overflow: hidden;
}
.progress-fill{
  height: 100%;
  width: 12%;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  border-radius: 4px;
  transition: width 0.5s var(--ease);
}

/* ==========================================================================
   Screens
   ========================================================================== */

.screen{
  width: 100%;
  max-width: 640px;
  flex: 1;
  display: none;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 26px 0;
}
.screen[data-active="true"]{
  display: flex;
  animation: screenIn 0.5s var(--ease);
}
@keyframes screenIn{
  from{ opacity: 0; transform: translateY(14px); }
  to{ opacity: 1; transform: translateY(0); }
}

.eyebrow{
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--gold);
  margin: 0 0 14px;
}

/* ---------------- Intro ---------------- */
.intro-screen{ min-height: 60vh; }
.intro-inner{ max-width: 560px; }

.intro-title{
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(34px, 6vw, 52px);
  line-height: 1.06;
  letter-spacing: 0.01em;
  margin: 0 0 20px;
  color: var(--white);
}

.intro-sub{
  font-size: 16px;
  line-height: 1.65;
  color: var(--muted);
  max-width: 480px;
  margin: 0 auto 34px;
}
.intro-sub strong{ color: var(--gold-light); font-weight: 600; }

.intro-meta{
  margin-top: 18px;
  font-size: 12.5px;
  color: var(--muted-2);
  letter-spacing: 0.02em;
}

/* ---------------- Buttons ---------------- */
.btn{
  font-family: var(--font-body);
  font-weight: 700;
  font-size: 15px;
  letter-spacing: 0.03em;
  border: none;
  cursor: pointer;
  border-radius: 999px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: transform 0.2s var(--ease), box-shadow 0.2s var(--ease), background 0.2s var(--ease), opacity 0.2s var(--ease);
}
.btn-primary{
  background: linear-gradient(135deg, var(--gold-light), var(--gold));
  color: var(--navy-deep);
  padding: 16px 30px;
  box-shadow: 0 10px 30px rgba(212,188,133,0.18);
}
.btn-primary:hover{ transform: translateY(-2px); box-shadow: 0 14px 36px rgba(212,188,133,0.28); }
.btn-primary:active{ transform: translateY(0); }
.btn-primary:disabled{ opacity: 0.55; cursor: not-allowed; transform:none; }
.btn-large{ font-size: 15.5px; }
.btn-full{ width: 100%; }

.btn-ghost{
  background: transparent;
  color: var(--muted);
  padding: 10px 18px;
  font-weight: 600;
  font-size: 13px;
  margin-top: 26px;
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-color: rgba(255,255,255,0.25);
}
.btn-ghost:hover{ color: var(--gold-light); }

.back-link{
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: var(--muted-2);
  font-family: var(--font-body);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: 0.02em;
  cursor: pointer;
  padding: 6px 4px;
  margin-bottom: 6px;
  transition: color 0.2s;
}
.back-link:hover{ color: var(--gold-light); }

/* ---------------- Question ---------------- */
.question-screen{ min-height: 58vh; align-items: stretch; }
.question-inner{ width: 100%; }

.question-title{
  font-family: var(--font-display);
  font-weight: 400;
  font-size: clamp(25px, 4.4vw, 36px);
  line-height: 1.16;
  margin: 0 0 30px;
  color: var(--white);
}

.options-grid{
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
@media (max-width: 560px){
  .options-grid{ grid-template-columns: 1fr; }
}

.option-card{
  position: relative;
  text-align: left;
  background: linear-gradient(180deg, var(--navy-soft), var(--navy));
  border: 1.5px solid var(--navy-line);
  border-radius: var(--radius-lg);
  padding: 26px 22px;
  cursor: pointer;
  font-family: var(--font-body);
  color: var(--white);
  transition: border-color 0.2s var(--ease), transform 0.18s var(--ease), background 0.2s var(--ease);
  display: flex;
  flex-direction: column;
  gap: 14px;
  min-height: 132px;
}
.option-card:hover{
  border-color: rgba(212,188,133,0.55);
  transform: translateY(-3px);
  background: linear-gradient(180deg, var(--navy-soft), #333a4a);
}
.option-card:active{ transform: translateY(-1px); }

.option-letter{
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: var(--gold-dim);
  color: var(--gold);
  font-family: var(--font-display);
  font-size: 15px;
  letter-spacing: 0.02em;
}

.option-text{
  font-size: 15.5px;
  line-height: 1.5;
  font-weight: 500;
  color: var(--white);
}

.option-stats{
  margin-top: auto;
  padding-top: 12px;
  border-top: 1px solid var(--navy-line);
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.option-stats li{
  list-style: none;
  font-size: 12.5px;
  color: var(--muted);
  display: flex;
  gap: 8px;
  align-items: baseline;
}
.option-stats li::before{
  content: "";
  width: 4px; height: 4px;
  border-radius: 50%;
  background: var(--gold);
  flex: none;
  transform: translateY(-2px);
}

/* ---------------- Result ---------------- */
.result-screen{ align-items: center; }
.result-inner{ width: 100%; max-width: 620px; }

.result-headline{
  font-family: var(--font-display);
  font-size: clamp(28px, 5vw, 40px);
  font-weight: 400;
  line-height: 1.08;
  margin: 0 0 4px;
}
.result-band-name{
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--muted-2);
  margin: 0 0 26px;
}

.spectrum-card{
  background: linear-gradient(180deg, var(--navy-soft), var(--navy));
  border: 1.5px solid var(--navy-line);
  border-radius: var(--radius-lg);
  padding: 26px 26px 22px;
  margin-bottom: 26px;
}
.spectrum-labels{
  display: flex;
  justify-content: space-between;
  gap: 12px;
  font-size: 10.5px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 700;
  margin-bottom: 10px;
  text-align: left;
}
.spectrum-labels span:last-child{ text-align: right; }
.spectrum-labels em{ display:block; font-style: normal; text-transform: none; font-weight: 500; letter-spacing: 0; color: var(--muted-2); font-size: 10.5px; margin-top: 2px; }
.spectrum-track{
  position: relative;
  height: 8px;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  margin-bottom: 18px;
}
.spectrum-fill{
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 50%;
  border-radius: 8px;
  background: linear-gradient(90deg, var(--gold), var(--gold-light));
  transition: width 0.9s var(--ease);
}
.spectrum-marker{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-62%);
  color: var(--white);
  filter: drop-shadow(0 2px 6px rgba(0,0,0,0.5));
  transition: left 0.9s var(--ease);
}
.spectrum-split{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;
}
.split-item{ display: flex; flex-direction: column; align-items: center; gap: 2px; }
.split-pct{
  font-family: var(--font-display);
  font-size: 34px;
  color: var(--gold-light);
  line-height: 1;
}
.split-label{
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 700;
}
.split-divider{ color: var(--muted-2); font-size: 20px; font-weight: 300; }

.result-body{ text-align: left; margin-bottom: 8px; }
.result-lede{
  font-size: 16.5px;
  line-height: 1.7;
  color: var(--muted);
  margin: 0 0 26px;
}
.result-lede strong{ color: var(--white); }

.section-label{
  font-size: 11px;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--muted-2);
  font-weight: 700;
  margin: 0 0 12px;
}
.mix-heading{ margin-top: 6px; }

.priority-block{ margin-bottom: 28px; }
.priority-pills{ display: flex; flex-wrap: wrap; gap: 8px; }
.priority-pill{
  font-size: 12.5px;
  font-weight: 600;
  color: var(--gold-light);
  background: var(--gold-dim);
  border: 1px solid rgba(212,188,133,0.3);
  border-radius: 999px;
  padding: 7px 14px;
}

.result-columns{ display: grid; gap: 14px; margin-bottom: 10px; }
.result-columns.two-col{ grid-template-columns: 1fr 1fr; }
@media (max-width: 560px){
  .result-columns.two-col{ grid-template-columns: 1fr; }
}

.mix-card{
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--navy-line);
  border-radius: var(--radius-md);
  padding: 20px 20px 18px;
}
.mix-card h4{
  font-family: var(--font-display);
  font-weight: 400;
  letter-spacing: 0.06em;
  font-size: 16px;
  color: var(--gold-light);
  margin: 0 0 12px;
  text-transform: uppercase;
}
.mix-card ul{ margin: 0; padding: 0; display: flex; flex-direction: column; gap: 8px; }
.mix-card li{
  list-style: none;
  font-size: 14px;
  color: var(--muted);
  padding-left: 16px;
  position: relative;
  line-height: 1.5;
}
.mix-card li::before{
  content: "";
  position: absolute;
  left: 0; top: 8px;
  width: 5px; height: 5px;
  border-radius: 50%;
  background: var(--gold);
}

.mix-note{
  font-size: 13px;
  color: var(--muted-2);
  font-style: italic;
  line-height: 1.6;
  margin: 18px 0 4px;
}

.cadence-block{ margin-top: 30px; }
.cadence-card{
  background: rgba(255,255,255,0.03);
  border: 1px solid var(--navy-line);
  border-radius: var(--radius-md);
  padding: 22px 24px;
}
.cadence-value{
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 26px;
  letter-spacing: 0.01em;
  color: var(--gold-light);
  margin: 0 0 8px;
}
.cadence-note{
  font-size: 14px;
  line-height: 1.65;
  color: var(--muted);
  margin: 0;
}

/* ---------------- Lead capture ---------------- */
.lead-card{
  margin-top: 34px;
  background: linear-gradient(165deg, #37342A, var(--navy));
  border: 1.5px solid rgba(212,188,133,0.28);
  border-radius: var(--radius-lg);
  padding: 30px;
  text-align: left;
}
.lead-card h3{
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 24px;
  letter-spacing: 0.01em;
  margin: 0 0 8px;
  color: var(--white);
}
.lead-card > p{
  font-size: 14.5px;
  color: var(--muted);
  line-height: 1.6;
  margin: 0 0 22px;
}

.lead-form{ display: flex; flex-direction: column; gap: 14px; }
.field-row{ display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 480px){ .field-row{ grid-template-columns: 1fr; } }

.field{ display: flex; flex-direction: column; gap: 7px; }
.field span{
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--muted-2);
}
.field span em{
  font-style: normal;
  font-weight: 500;
  text-transform: none;
  letter-spacing: 0;
  opacity: 0.75;
}
.field input{
  font-family: var(--font-body);
  font-size: 15px;
  color: var(--white);
  background: rgba(0,0,0,0.22);
  border: 1.5px solid var(--navy-line);
  border-radius: var(--radius-sm);
  padding: 12px 14px;
  transition: border-color 0.2s;
}
.field input:focus{
  border-color: var(--gold);
  outline: none;
}
.field input::placeholder{ color: var(--muted-2); }

.lead-form .btn-primary{ margin-top: 8px; }
.form-note{
  text-align: center;
  font-size: 11.5px;
  color: var(--muted-2);
  margin: 4px 0 0;
}

.lead-success{
  text-align: center;
  padding: 20px 10px;
  color: var(--gold-light);
}
.lead-success h3{
  font-family: var(--font-display);
  font-weight: 400;
  font-size: 22px;
  color: var(--white);
  margin: 14px 0 8px;
}
.lead-success p{ color: var(--muted); font-size: 14px; margin: 0; }

/* Responsive tightening */
@media (max-width: 480px){
  .app{ padding: 20px 16px 70px; }
  .spectrum-card{ padding: 22px 18px 18px; }
  .lead-card{ padding: 24px 20px; }
  .signal-chip{ font-size: 9.5px; padding: 5px 9px; }
}
