/* Darstac chat widget — self-contained, no dependencies.
   Scripted brain (intent matching + guided chips) with lead capture via FormSubmit.
   Drop-in: <script src="chatbot.js" defer></script> */
(function () {
  'use strict';

  var LEAD_ENDPOINT = 'https://formsubmit.co/ajax/darstac1@gmail.com';
  var PHONE_DISPLAY = '(929) 670-9555';
  var PHONE_TEL = '+19296709555';

  /* ---------- styles ---------- */
  var css = [
    '.dcb-launcher{position:fixed;right:20px;bottom:20px;z-index:9990;width:60px;height:60px;border-radius:50%;border:0;cursor:pointer;',
    'background:linear-gradient(135deg,#6366f1 0%,#8b5cf6 50%,#06b6d4 100%);color:#fff;display:flex;align-items:center;justify-content:center;',
    'box-shadow:0 8px 30px rgba(99,102,241,.45);transition:transform .25s ease,box-shadow .25s ease}',
    '.dcb-launcher:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 14px 40px rgba(99,102,241,.6)}',
    '.dcb-launcher svg{width:28px;height:28px}',
    '.dcb-launcher .dcb-ico-close{display:none}',
    '.dcb-open .dcb-launcher .dcb-ico-chat{display:none}',
    '.dcb-open .dcb-launcher .dcb-ico-close{display:block}',
    '.dcb-ring{position:absolute;inset:0;border-radius:50%;border:2px solid rgba(99,102,241,.6);animation:dcbring 2.4s ease-out infinite;pointer-events:none}',
    '@keyframes dcbring{0%{transform:scale(1);opacity:.8}100%{transform:scale(1.6);opacity:0}}',
    '.dcb-panel{position:fixed;right:20px;bottom:92px;z-index:9991;width:min(380px,calc(100vw - 40px));max-height:min(600px,calc(100vh - 120px));',
    'display:none;flex-direction:column;overflow:hidden;border-radius:20px;border:1px solid rgba(255,255,255,.1);',
    'background:#0f1424;box-shadow:0 24px 70px rgba(0,0,0,.6);font-family:Inter,system-ui,sans-serif;color:#e8eaf2}',
    '.dcb-open .dcb-panel{display:flex;animation:dcbpop .3s cubic-bezier(.22,.61,.36,1)}',
    '@keyframes dcbpop{from{opacity:0;transform:translateY(16px) scale(.97)}to{opacity:1;transform:none}}',
    '.dcb-head{display:flex;align-items:center;gap:12px;padding:16px 18px;background:linear-gradient(135deg,rgba(99,102,241,.18),rgba(6,182,212,.12));border-bottom:1px solid rgba(255,255,255,.08)}',
    '.dcb-avatar{width:40px;height:40px;border-radius:12px;flex:none;background:linear-gradient(135deg,#6366f1,#06b6d4);display:flex;align-items:center;justify-content:center;font-weight:700;font-size:1.05rem;color:#fff}',
    '.dcb-head-t{flex:1;min-width:0}',
    '.dcb-head-t b{display:block;font-size:.95rem}',
    '.dcb-head-t span{display:flex;align-items:center;gap:6px;font-size:.72rem;color:#9ca3b8}',
    '.dcb-dot{width:7px;height:7px;border-radius:50%;background:#34d399;flex:none}',
    '.dcb-x{background:none;border:0;color:#9ca3b8;cursor:pointer;padding:6px;border-radius:8px;line-height:0}',
    '.dcb-x:hover{color:#fff;background:rgba(255,255,255,.08)}',
    '.dcb-msgs{flex:1;overflow-y:auto;padding:18px 16px;display:flex;flex-direction:column;gap:10px;scrollbar-width:thin}',
    '.dcb-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:.88rem;line-height:1.55;white-space:pre-line;overflow-wrap:break-word}',
    '.dcb-msg a{color:#7dd3fc;text-decoration:underline}',
    '.dcb-bot{align-self:flex-start;background:#151a2e;border:1px solid rgba(255,255,255,.07);border-bottom-left-radius:4px}',
    '.dcb-user{align-self:flex-end;background:linear-gradient(135deg,#6366f1,#4f46e5);color:#fff;border-bottom-right-radius:4px}',
    '.dcb-typing{align-self:flex-start;display:flex;gap:5px;padding:12px 16px;background:#151a2e;border:1px solid rgba(255,255,255,.07);border-radius:14px;border-bottom-left-radius:4px}',
    '.dcb-typing i{width:7px;height:7px;border-radius:50%;background:#6b7280;animation:dcbb 1.2s ease-in-out infinite}',
    '.dcb-typing i:nth-child(2){animation-delay:.15s}.dcb-typing i:nth-child(3){animation-delay:.3s}',
    '@keyframes dcbb{0%,60%,100%{transform:translateY(0);opacity:.5}30%{transform:translateY(-5px);opacity:1}}',
    '.dcb-chips{display:flex;flex-wrap:wrap;gap:8px;align-self:flex-start;max-width:95%}',
    '.dcb-chip{background:rgba(99,102,241,.12);border:1px solid rgba(99,102,241,.45);color:#c7d2fe;font-size:.8rem;font-weight:600;',
    'padding:8px 14px;border-radius:999px;cursor:pointer;transition:background .2s,transform .2s;font-family:inherit}',
    '.dcb-chip:hover{background:rgba(99,102,241,.28);transform:translateY(-1px)}',
    '.dcb-foot{display:flex;gap:8px;padding:12px;border-top:1px solid rgba(255,255,255,.08);background:#0c1120}',
    '.dcb-in{flex:1;background:#151a2e;border:1px solid rgba(255,255,255,.1);border-radius:12px;color:#e8eaf2;font-size:16px;padding:11px 14px;outline:none;font-family:inherit}',
    '.dcb-in:focus{border-color:rgba(99,102,241,.6)}',
    '.dcb-send{width:44px;height:44px;flex:none;border:0;border-radius:12px;cursor:pointer;background:linear-gradient(135deg,#6366f1,#06b6d4);color:#fff;display:flex;align-items:center;justify-content:center}',
    '.dcb-send:hover{filter:brightness(1.15)}',
    '.dcb-brand{text-align:center;font-size:.66rem;color:#6b7280;padding:0 0 8px;background:#0c1120}',
    '@media(max-width:480px){.dcb-panel{right:10px;left:10px;width:auto;bottom:84px;max-height:calc(100dvh - 104px)}.dcb-launcher{right:16px;bottom:16px}}',
    '@media(prefers-reduced-motion:reduce){.dcb-ring{animation:none}.dcb-open .dcb-panel{animation:none}.dcb-typing i{animation:none}}'
  ].join('');

  /* ---------- content ---------- */
  var T = {
    greet: "Hey! 👋 I'm the Darstac assistant.\nWe build websites, AI voice agents and chatbots (like me) for local businesses.\n\nWhat can I help with?",
    services: "Three things, built to work together:\n\n🌐 Websites — hand-built, mobile-first, SEO-ready\n📞 AI Voice Agents — an AI that answers your business phone 24/7, takes bookings and captures every lead\n💬 Website Chatbots — like this one, trained on your business, turning visitors into customers\n\nWant pricing, or a free demo?",
    pricing: "Straightforward:\n\n• Free demo — $0, see your site before paying anything\n• Business Site — $500–$1,000 one-time\n• Build + Care — $1,000–$2,000, first care month free\n• Care plans — $150–$500/mo (hosting, updates, local SEO)\n\nAI voice agents & chatbots are quoted per business — depends on call volume and what they need to handle. Leave your number and we'll give you an exact figure.",
    demo: "The free demo works like this: tell us about your business, and we build a working mockup of your site — your branding, your content — before you pay anything. If you love it, we finish it. If not, no charge, no hard feelings.\n\nWant to start? I just need a couple details.",
    voiceai: "Our AI voice agent picks up your business phone 24/7 — even at 3 AM, even mid-rush. It answers questions, takes bookings, and texts you the lead. You never miss another customer because you couldn't get to the phone.\n\nPricing depends on call volume — leave your number and we'll quote it for your business.",
    chatbot: "You're talking to one right now 🙂 We train a chatbot on your business — services, prices, hours — and put it on your site to answer visitors instantly and capture leads while you work.\n\nWant one on your site? Leave your details and we'll set it up.",
    portfolio: "Take a look at recent work — restaurantimereti.com (Georgian restaurant, custom domain) and our other builds are in the portfolio: <a href='#portfolio'>View our work ↓</a>\n\nEvery site there is live and real.",
    process: "Simple: (1) you tell us about your business, (2) we build a free demo so you see it first, (3) if you love it we finish and launch it — usually within days, not months. Sites live on fast, secure hosting and we can handle everything monthly after launch.",
    human: "Sure — you can reach Illia directly:\n\n📞 <a href='tel:" + PHONE_TEL + "'>" + PHONE_DISPLAY + "</a>\n✉️ <a href='https://mail.google.com/mail/?view=cm&fs=1&to=darstac1%40gmail.com&su=Chat+Inquiry'>Email us</a>\n\nOr leave your number here and we'll call you — usually same day.",
    fallback: "Good question — I'm a scripted assistant, so I'll keep it honest: I don't have an answer for that one. A human does though!\n\nLeave your name and number and we'll get back to you, usually same day. Or ask me about services, pricing, or the free demo.",
    leadName: "Great — what's your name?",
    leadBiz: "Nice to meet you, {name}! What's your business called (and what kind of business is it)?",
    leadContact: "Perfect. Best phone number (or email) to reach you?",
    leadDone: "Done ✅ Thanks {name} — we'll reach out shortly, usually same day.\n\nIn the meantime, feel free to browse <a href='#portfolio'>our work</a>.",
    leadFail: "Hmm, that didn't send. You can reach us directly instead:\n📞 <a href='tel:" + PHONE_TEL + "'>" + PHONE_DISPLAY + "</a>\n✉️ darstac1@gmail.com",
    thanks: "Any time! Anything else I can help with?",
    hi: "Hey! What can I help with — websites, AI voice agents, or chatbots?"
  };

  var CHIPS_MAIN = [
    ['Our services', 'services'],
    ['Pricing', 'pricing'],
    ['Free demo', 'lead_demo'],
    ['AI voice agents', 'voiceai'],
    ['Talk to a human', 'human']
  ];
  var CHIPS_AFTER = [
    ['Get a free demo', 'lead_demo'],
    ['Get a quote', 'lead_quote'],
    ['Talk to a human', 'human']
  ];

  var INTENTS = [
    { k: /voice|call|phone.*ai|ai.*phone|answer.*phone|miss.*call|receptionist/i, r: 'voiceai' },
    { k: /chat\s?bot|bot for|this bot|assistant/i, r: 'chatbot' },
    { k: /price|pricing|cost|how much|rates?|fee|charge|expensive|cheap/i, r: 'pricing' },
    { k: /demo|free|try|mockup|sample/i, r: 'demo' },
    { k: /service|what do you|offer|help with|do you (do|make|build)/i, r: 'services' },
    { k: /portfolio|work|example|previous|built|projects?|clients?/i, r: 'portfolio' },
    { k: /process|how (does|do) (it|this|you)|how long|timeline|steps|start/i, r: 'process' },
    { k: /human|person|someone|talk|speak|call you|contact|reach|email|number/i, r: 'human' },
    { k: /website|web ?site|site for|web design|seo|maintenance/i, r: 'services' },
    { k: /thank|thanks|great|awesome|perfect|cool|ok(ay)?$/i, r: 'thanks' },
    { k: /^(hi|hey|hello|yo|sup|good (morning|afternoon|evening))\b/i, r: 'hi' }
  ];

  /* ---------- widget ---------- */
  var root, msgs, input, leadState = null, lead = {};

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  }

  function scrollDown() { msgs.scrollTop = msgs.scrollHeight; }

  function addMsg(text, who) {
    var m = el('div', 'dcb-msg ' + (who === 'user' ? 'dcb-user' : 'dcb-bot'));
    if (who === 'user') { m.textContent = text; } else { m.innerHTML = text; }
    msgs.appendChild(m);
    scrollDown();
  }

  function addChips(list) {
    var old = msgs.querySelector('.dcb-chips');
    if (old) old.remove();
    var wrap = el('div', 'dcb-chips');
    list.forEach(function (c) {
      var b = el('button', 'dcb-chip', c[0]);
      b.type = 'button';
      b.addEventListener('click', function () {
        addMsg(c[0], 'user');
        wrap.remove();
        route(c[1]);
      });
      wrap.appendChild(b);
    });
    msgs.appendChild(wrap);
    scrollDown();
  }

  function botSay(text, chips, cb) {
    var t = el('div', 'dcb-typing', '<i></i><i></i><i></i>');
    msgs.appendChild(t);
    scrollDown();
    setTimeout(function () {
      t.remove();
      addMsg(text, 'bot');
      if (chips) addChips(chips);
      if (cb) cb();
    }, 500 + Math.min(text.length * 3, 700));
  }

  function startLead(kind) {
    leadState = 'name';
    lead = { kind: kind === 'lead_demo' ? 'Free demo request' : 'Quote request' };
    botSay(T.leadName);
  }

  function handleLead(text) {
    if (leadState === 'name') {
      lead.name = text;
      leadState = 'biz';
      botSay(T.leadBiz.replace('{name}', text.split(' ')[0]));
    } else if (leadState === 'biz') {
      lead.business = text;
      leadState = 'contact';
      botSay(T.leadContact);
    } else if (leadState === 'contact') {
      lead.contact = text;
      leadState = null;
      submitLead();
    }
  }

  function submitLead() {
    var payload = {
      _subject: 'Chatbot lead — ' + lead.kind,
      name: lead.name,
      business: lead.business,
      contact: lead.contact,
      type: lead.kind,
      page: location.href
    };
    var t = el('div', 'dcb-typing', '<i></i><i></i><i></i>');
    msgs.appendChild(t);
    scrollDown();
    fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    }).then(function (r) {
      t.remove();
      if (!r.ok) throw new Error('bad status');
      addMsg(T.leadDone.replace('{name}', lead.name.split(' ')[0]), 'bot');
      addChips(CHIPS_MAIN);
    }).catch(function () {
      t.remove();
      addMsg(T.leadFail, 'bot');
      addChips(CHIPS_MAIN);
    });
  }

  function route(key) {
    if (key === 'lead_demo' || key === 'lead_quote') { startLead(key); return; }
    var text = T[key] || T.fallback;
    var chips = (key === 'human' || key === 'thanks' || key === 'hi') ? CHIPS_MAIN : CHIPS_AFTER;
    if (key === 'fallback') chips = CHIPS_MAIN;
    botSay(text, chips);
  }

  function handleFree(text) {
    if (leadState) { handleLead(text); return; }
    for (var i = 0; i < INTENTS.length; i++) {
      if (INTENTS[i].k.test(text)) { route(INTENTS[i].r); return; }
    }
    route('fallback');
  }

  function send() {
    var v = input.value.trim();
    if (!v) return;
    addMsg(v, 'user');
    input.value = '';
    var chips = msgs.querySelector('.dcb-chips');
    if (chips) chips.remove();
    handleFree(v);
  }

  function toggle(open) {
    var isOpen = root.classList.contains('dcb-open');
    var next = open != null ? open : !isOpen;
    root.classList.toggle('dcb-open', next);
    var l = root.querySelector('.dcb-launcher');
    l.setAttribute('aria-expanded', next ? 'true' : 'false');
    if (next) {
      if (!msgs.childElementCount) botSay(T.greet, CHIPS_MAIN);
      setTimeout(function () { input.focus(); }, 320);
    }
  }

  function build() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    root = el('div');
    root.innerHTML =
      '<button class="dcb-launcher" type="button" aria-label="Chat with Darstac" aria-expanded="false">' +
      '<span class="dcb-ring"></span>' +
      '<svg class="dcb-ico-chat" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>' +
      '<svg class="dcb-ico-close" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
      '</button>' +
      '<div class="dcb-panel" role="dialog" aria-label="Darstac chat assistant">' +
      '<div class="dcb-head">' +
      '<div class="dcb-avatar">D</div>' +
      '<div class="dcb-head-t"><b>Darstac Assistant</b><span><span class="dcb-dot"></span>Replies instantly</span></div>' +
      '<button class="dcb-x" type="button" aria-label="Close chat"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg></button>' +
      '</div>' +
      '<div class="dcb-msgs" aria-live="polite"></div>' +
      '<div class="dcb-foot">' +
      '<input class="dcb-in" type="text" placeholder="Type a message…" aria-label="Type a message" maxlength="300">' +
      '<button class="dcb-send" type="button" aria-label="Send"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg></button>' +
      '</div>' +
      '<div class="dcb-brand">AI chat by Darstac — <a href="#services" style="color:inherit">get one for your site</a></div>' +
      '</div>';
    document.body.appendChild(root);

    msgs = root.querySelector('.dcb-msgs');
    input = root.querySelector('.dcb-in');
    root.querySelector('.dcb-launcher').addEventListener('click', function () { toggle(); });
    root.querySelector('.dcb-x').addEventListener('click', function () { toggle(false); });
    root.querySelector('.dcb-send').addEventListener('click', send);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') send(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && root.classList.contains('dcb-open')) toggle(false);
    });

    // in-page links inside bot messages should close the panel so the user sees the target
    msgs.addEventListener('click', function (e) {
      var a = e.target.closest('a');
      if (a && a.getAttribute('href') && a.getAttribute('href').charAt(0) === '#') toggle(false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build);
  } else {
    build();
  }
})();
