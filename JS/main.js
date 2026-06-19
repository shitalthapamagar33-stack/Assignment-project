/* ============================================================
   CET138 ePortfolio — main.js
   Author: Shital Thapa Magar
   ============================================================ */

/* --- Loading Screen --------------------------------------- */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) {
    setTimeout(() => loader.classList.add('hidden'), 600);
  }
});

/* --- Scroll Progress Bar ---------------------------------- */
const progressBar = document.getElementById('progress-bar');
if (progressBar) {
  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    progressBar.style.width = pct + '%';
  }, { passive: true });
}

/* --- Theme Toggle (persisted) ------------------------------ */
(function initThemeToggle() {
  const STORAGE_KEY = 'cet138-theme';
  const root = document.documentElement;

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
    } else {
      root.removeAttribute('data-theme');
    }
    document.querySelectorAll('.theme-toggle').forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'light' ? 'true' : 'false');
      btn.setAttribute('aria-label', theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme');
    });
  }

  // Determine initial theme: saved preference > system preference > dark default
  let saved;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { saved = null; }

  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  const initial = saved || (prefersLight ? 'light' : 'dark');
  applyTheme(initial);

  document.querySelectorAll('.theme-toggle').forEach(btn => {
    btn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
      const next = current === 'light' ? 'dark' : 'light';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage unavailable, ignore */ }
    });
  });
})();

/* --- Mobile Navigation ------------------------------------ */
const hamburger  = document.querySelector('.hamburger');
const mobileNav  = document.querySelector('.mobile-nav');

if (hamburger && mobileNav) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.classList.toggle('open');
    mobileNav.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on link click
  mobileNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileNav.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
}

/* --- Active Nav Link -------------------------------------- */
(function markActiveLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(link => {
    const href = link.getAttribute('href').split('/').pop();
    if (href === path) link.classList.add('active');
  });
})();

/* --- Typing Animation ------------------------------------- */
(function initTyping() {
  const el = document.getElementById('typing');
  if (!el) return;

  const phrases = [
    'Future Full Stack Developer',
    'Frontend Enthusiast',
    'UI/UX Learner',
    'Problem Solver'
  ];

  let phraseIdx = 0;
  let charIdx   = 0;
  let deleting  = false;

  function tick() {
    const current = phrases[phraseIdx];

    if (!deleting) {
      el.textContent = current.slice(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(tick, 2000);
        return;
      }
      setTimeout(tick, 90);
    } else {
      el.textContent = current.slice(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        setTimeout(tick, 400);
        return;
      }
      setTimeout(tick, 45);
    }
  }

  tick();
})();

/* --- IntersectionObserver Reveal -------------------------- */
(function initReveal() {
  const targets = document.querySelectorAll(
    '.topic-card, .feature-card, .advantage-item, .reveal, .outcome-item, .stat-card'
  );

  if (!targets.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach((el, i) => {
    // Stagger siblings
    el.style.transitionDelay = (i % 4) * 0.08 + 's';
    io.observe(el);
  });
})();

/* --- Navbar scroll shadow --------------------------------- */
(function initNavShadow() {
  const nav = document.querySelector('.navbar');
  if (!nav) return;
  window.addEventListener('scroll', () => {
    nav.style.boxShadow = window.scrollY > 10
      ? '0 4px 32px rgba(0,0,0,0.5)'
      : 'none';
  }, { passive: true });
})();

/* ============================================================
   LIVE DEMO WIDGETS
   Each demo is self-contained and only runs if its elements
   exist on the current page.
   ============================================================ */

/* --- HTML PAGE: live semantic tag inspector ---------------- */
(function initTagInspector() {
  const boxes = document.querySelectorAll('.html-demo-box[data-tag]');
  if (!boxes.length) return;
  boxes.forEach(box => {
    box.addEventListener('click', () => {
      const tag = box.dataset.tag;
      const out = document.getElementById('tag-inspector-output');
      if (out) {
        out.innerHTML = `<span class="ok">✓</span> You clicked the <strong style="color:var(--clr-gold)">${tag}</strong> region — open DevTools and inspect it to see this maps to a real <code>${tag.replace(/[<>]/g,'')}</code> element.`;
      }
    });
  });
})();

/* --- HTML PAGE: live form validation demo ------------------ */
(function initFormDemo() {
  const form = document.getElementById('demo-html-form');
  if (!form) return;
  const email = document.getElementById('demo-email');
  const name  = document.getElementById('demo-name');
  const output = document.getElementById('form-demo-output');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    let valid = true;

    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value);
    email.classList.toggle('invalid', !emailValid);
    document.getElementById('email-error').classList.toggle('show', !emailValid);
    if (!emailValid) valid = false;

    const nameValid = name.value.trim().length > 1;
    name.classList.toggle('invalid', !nameValid);
    document.getElementById('name-error').classList.toggle('show', !nameValid);
    if (!nameValid) valid = false;

    if (valid) {
      output.innerHTML = `<span class="ok">✓ Valid submission</span> — Hello, ${name.value.trim()}! In a real app this would now POST to a backend API.`;
    } else {
      output.innerHTML = `<span class="err">✗ Validation failed</span> — fix the highlighted fields above.`;
    }
  });

  [email, name].forEach(input => {
    input.addEventListener('input', () => {
      input.classList.remove('invalid');
      output.innerHTML = '';
    });
  });
})();

/* --- CSS PAGE: box model live demo --------------------------*/
(function initBoxModelDemo() {
  const marginSlider  = document.getElementById('bm-margin');
  const paddingSlider = document.getElementById('bm-padding');
  const borderSlider  = document.getElementById('bm-border-width');
  const outer  = document.getElementById('box-model-outer');
  const border = document.getElementById('box-model-border');

  if (!marginSlider || !outer) return;

  function update() {
    const m = marginSlider.value;
    const p = paddingSlider.value;
    const b = borderSlider.value;
    outer.style.padding = m + 'px';
    border.style.padding = p + 'px';
    border.style.borderWidth = b + 'px';
    document.getElementById('bm-margin-val').textContent = m + 'px';
    document.getElementById('bm-padding-val').textContent = p + 'px';
    document.getElementById('bm-border-val').textContent = b + 'px';
  }
  [marginSlider, paddingSlider, borderSlider].forEach(s => s.addEventListener('input', update));
  update();
})();

/* --- CSS PAGE: flexbox playground --------------------------*/
(function initFlexDemo() {
  const demo = document.getElementById('flex-demo');
  if (!demo) return;

  const directionSelect = document.getElementById('flex-direction');
  const justifySelect   = document.getElementById('flex-justify');
  const alignSelect     = document.getElementById('flex-align');
  const wrapToggle      = document.getElementById('flex-wrap-toggle');

  function update() {
    demo.style.flexDirection = directionSelect.value;
    demo.style.justifyContent = justifySelect.value;
    demo.style.alignItems = alignSelect.value;
    demo.style.flexWrap = wrapToggle.classList.contains('active') ? 'wrap' : 'nowrap';
    document.getElementById('flex-code-output').textContent =
      `display: flex;\nflex-direction: ${directionSelect.value};\njustify-content: ${justifySelect.value};\nalign-items: ${alignSelect.value};\nflex-wrap: ${wrapToggle.classList.contains('active') ? 'wrap' : 'nowrap'};`;
  }

  [directionSelect, justifySelect, alignSelect].forEach(s => s.addEventListener('change', update));
  wrapToggle.addEventListener('click', () => {
    wrapToggle.classList.toggle('active');
    update();
  });
  update();
})();

/* --- CSS PAGE: grid playground ------------------------------*/
(function initGridDemo() {
  const demo = document.getElementById('grid-demo');
  if (!demo) return;
  const colsSlider = document.getElementById('grid-cols');
  const gapSlider  = document.getElementById('grid-gap');

  function update() {
    const cols = colsSlider.value;
    const gap  = gapSlider.value;
    demo.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
    demo.style.gap = gap + 'px';
    document.getElementById('grid-cols-val').textContent = cols;
    document.getElementById('grid-gap-val').textContent = gap + 'px';
    document.getElementById('grid-code-output').textContent =
      `display: grid;\ngrid-template-columns: repeat(${cols}, 1fr);\ngap: ${gap}px;`;
  }
  [colsSlider, gapSlider].forEach(s => s.addEventListener('input', update));
  update();
})();

/* --- BOOTSTRAP PAGE: grid column simulator ------------------*/
(function initBsGridDemo() {
  const row = document.getElementById('bs-grid-row');
  if (!row) return;
  const slider = document.getElementById('bs-col-count');
  const output = document.getElementById('bs-grid-output');

  function render() {
    const n = parseInt(slider.value, 10);
    const colSize = Math.floor(12 / n);
    row.innerHTML = '';
    for (let i = 0; i < n; i++) {
      const col = document.createElement('div');
      col.className = 'bs-col';
      const width = (colSize / 12) * 100;
      col.style.flex = `0 0 ${width}%`;
      col.style.maxWidth = `${width}%`;
      col.textContent = `col-${colSize}`;
      row.appendChild(col);
    }
    document.getElementById('bs-col-count-val').textContent = n;
    output.textContent = `<div class="row">\n${Array.from({length:n}).map(()=>`  <div class="col-${colSize}">...</div>`).join('\n')}\n</div>`;
  }
  slider.addEventListener('input', render);
  render();
})();

/* --- BOOTSTRAP PAGE: dismissible alert + badge demo ---------*/
(function initBsComponents() {
  document.querySelectorAll('.bs-alert button[data-dismiss]').forEach(btn => {
    btn.addEventListener('click', () => {
      const alert = btn.closest('.bs-alert');
      alert.style.opacity = '0';
      alert.style.transform = 'translateY(-6px)';
      setTimeout(() => alert.remove(), 200);
    });
  });

  const triggerBtn = document.getElementById('bs-trigger-alert');
  const alertContainer = document.getElementById('bs-alert-container');
  if (triggerBtn && alertContainer) {
    triggerBtn.addEventListener('click', () => {
      const div = document.createElement('div');
      div.className = 'bs-alert bs-alert--success';
      div.style.marginTop = '10px';
      div.innerHTML = `<span>✓ New alert created dynamically with JavaScript!</span><button data-dismiss aria-label="Dismiss">×</button>`;
      div.querySelector('button').addEventListener('click', () => div.remove());
      alertContainer.appendChild(div);
    });
  }
})();

/* --- JS PAGE: live mini console / playground -----------------*/
(function initJsConsoleDemo() {
  const runBtn = document.getElementById('js-run-btn');
  const consoleEl = document.getElementById('js-console-output');
  if (!runBtn || !consoleEl) return;

  function log(msg, cls) {
    const line = document.createElement('div');
    line.className = 'line' + (cls ? ' ' + cls : '');
    line.textContent = msg;
    consoleEl.appendChild(line);
    consoleEl.scrollTop = consoleEl.scrollHeight;
  }

  runBtn.addEventListener('click', () => {
    consoleEl.innerHTML = '';
    log('> let total = 0;', 'muted');
    log('> for (let i = 1; i <= 5; i++) total += i;', 'muted');
    let total = 0;
    for (let i = 1; i <= 5; i++) total += i;
    log('> console.log(total);', 'muted');
    log(String(total));
    log('> typeof total', 'muted');
    log(typeof total);
  });
})();

/* --- JS PAGE: DOM manipulation live demo ----------------------*/
(function initDomDemo() {
  const list = document.getElementById('dom-demo-list');
  const input = document.getElementById('dom-demo-input');
  const addBtn = document.getElementById('dom-demo-add');
  if (!list || !input) return;

  function addItem(text) {
    const li = document.createElement('li');
    const span = document.createElement('span');
    span.textContent = text;
    const btn = document.createElement('button');
    btn.textContent = '✕';
    btn.setAttribute('aria-label', 'Remove item');
    btn.addEventListener('click', () => li.remove());
    li.appendChild(span);
    li.appendChild(btn);
    list.appendChild(li);
  }

  addBtn.addEventListener('click', () => {
    const val = input.value.trim();
    if (!val) return;
    addItem(val);
    input.value = '';
    input.focus();
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') addBtn.click();
  });

  ['Learn HTML', 'Learn CSS', 'Build this portfolio'].forEach(addItem);
})();

/* --- JS PAGE: theme switcher live demo ------------------------*/
(function initThemeSwitcherDemo() {
  const card = document.getElementById('theme-demo-card');
  if (!card) return;
  const buttons = document.querySelectorAll('.theme-demo-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      card.dataset.theme = btn.dataset.theme;
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
})();

/* --- Click counter (event delegation) ----------------------*/
(function initClickCounterDemo() {
  const container = document.getElementById('click-counter-demo');
  if (!container) return;
  const countEl = document.getElementById('click-counter-value');
  let count = 0;

  // Single listener on the parent — event delegation
  container.addEventListener('click', (e) => {
    if (e.target.matches('button[data-inc]')) {
      count += parseInt(e.target.dataset.inc, 10);
      countEl.textContent = count;
      countEl.style.transform = 'scale(1.3)';
      setTimeout(() => { countEl.style.transform = 'scale(1)'; }, 150);
    }
  });
})();

/* --- FULLSTACK PAGE: request lifecycle simulator -------------*/
(function initArchSimulator() {
  const btn = document.getElementById('arch-simulate-btn');
  const output = document.getElementById('arch-simulate-output');
  if (!btn) return;

  const steps = [
    { id: 'arch-node-0', msg: '👤 User clicks "Submit" on the page.' },
    { id: 'arch-node-1', msg: '🖥️ Frontend packages the form data and sends an HTTP request.' },
    { id: 'arch-node-2', msg: '⚙️ Backend receives the request and validates the data.' },
    { id: 'arch-node-3', msg: '🗄️ Database saves the record and confirms success.' },
    { id: 'arch-node-4', msg: '📱 Response flows back through the backend to the frontend, and the UI updates.' }
  ];

  let running = false;

  btn.addEventListener('click', () => {
    if (running) return;
    running = true;
    btn.disabled = true;
    btn.textContent = 'Simulating...';

    document.querySelectorAll('.arch-node').forEach(n => n.classList.remove('active'));

    steps.forEach((step, i) => {
      setTimeout(() => {
        document.querySelectorAll('.arch-node').forEach(n => n.classList.remove('active'));
        const node = document.getElementById(step.id);
        if (node) node.classList.add('active');
        output.innerHTML = `<span class="ok">Step ${i + 1}/${steps.length}</span> — ${step.msg}`;

        if (i === steps.length - 1) {
          setTimeout(() => {
            document.querySelectorAll('.arch-node').forEach(n => n.classList.remove('active'));
            btn.disabled = false;
            btn.textContent = '▶ Simulate a Request';
            running = false;
          }, 900);
        }
      }, i * 900);
    });
  });
})();

(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

function applyTheme(theme) {
  if (theme === "light") {
    root.setAttribute("data-theme", "light");
  } else {
    root.removeAttribute("data-theme");
  }
}

btn.addEventListener("click", () => {
  const next = current === "light" ? "dark" : "light";
  applyTheme(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch(e) {}
});

(function initTyping() {
  const el = document.getElementById("typing");
  if (!el) return;  // Only runs on pages with this element
  // ... widget logic
})();




