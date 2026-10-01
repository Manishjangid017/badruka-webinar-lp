/*==================================================
  PREMIUM SCROLL ANIMATIONS (BSM Masterclass LP)
  - Koi library nahi, IntersectionObserver + Web Animations API
  - HTML / CSS layout ko touch nahi karta
  - Animation khatam hote hi element apni original CSS state par wapas
    (hover transforms pehle jaise hi kaam karte hain)
  - Ek baar play hota hai (scroll up/down par repeat nahi)
==================================================*/
(function () {
  'use strict';

  var root = document.documentElement;
  // Gate script (head) ne sa-on nahi lagaya => reduced motion / unsupported browser
  if (!root.classList.contains('sa-on')) return;
  window.__saReady = true;

  var EASE = 'cubic-bezier(0.22, 1, 0.36, 1)'; // easeOutQuint, smooth premium feel

  function isMobile() {
    return window.innerWidth < 768;
  }

  /* ---------- Effects (keyframes) ---------- */
  var fx = {
    up: function (d) {
      d = d || 40;
      return [
        { opacity: 0, transform: 'translate3d(0,' + d + 'px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ];
    },
    down: function (d) {
      d = d || 20;
      return [
        { opacity: 0, transform: 'translate3d(0,-' + d + 'px,0)' },
        { opacity: 1, transform: 'translate3d(0,0,0)' }
      ];
    },
    // heading: fade + rise + halka blur clear hota hua
    blurUp: function (d) {
      d = d || 32;
      return [
        { opacity: 0, transform: 'translate3d(0,' + d + 'px,0)', filter: 'blur(6px)' },
        { opacity: 1, transform: 'translate3d(0,0,0)', filter: 'blur(0px)' }
      ];
    },
    scale: function (d) {
      d = d || 36;
      return [
        { opacity: 0, transform: 'translate3d(0,' + d + 'px,0) scale(0.95)' },
        { opacity: 1, transform: 'translate3d(0,0,0) scale(1)' }
      ];
    },
    // desktop: right se slide, mobile: neeche se
    sideIn: function () {
      return isMobile()
        ? fx.up(48)
        : [
          { opacity: 0, transform: 'translate3d(70px,0,0)' },
          { opacity: 1, transform: 'translate3d(0,0,0)' }
        ];
    },
    // accent lines: width grow
    line: function () {
      return [
        { opacity: 1, transform: 'scaleX(0)' },
        { opacity: 1, transform: 'scaleX(1)' }
      ];
    },
    lineLeft: function () {
      return [
        { opacity: 1, transform: 'scaleX(0)', transformOrigin: 'left center' },
        { opacity: 1, transform: 'scaleX(1)', transformOrigin: 'left center' }
      ];
    },
    // image card: neeche se upar clip-reveal
    clip: function () {
      return [
        { opacity: 1, clipPath: 'inset(0 0 100% 0 round 16px)' },
        { opacity: 1, clipPath: 'inset(0 0 0% 0 round 16px)' }
      ];
    }
  };

  /* ---------- Rules: selector -> effect ---------- */
  // base = starting delay (ms), stagger = same batch me har next element ka extra delay
  var rules = [
    // Header + Hero
    { s: '.site-header', fx: 'down', d: 20, dur: 700, base: 0 },
    { s: '.webinar-tag', fx: 'up', d: 24, dur: 800, base: 100 },
    { s: '.webinar-heading', fx: 'blurUp', d: 36, dur: 300, base: 200 },
    { s: '.webinar-desc', fx: 'up', d: 28, dur: 900, base: 350 },
    { s: '.webinar-speaker', fx: 'scale', d: 48, dur: 1100, base: 350 },
    { s: '.webinar-strip-item', fx: 'up', d: 28, dur: 800, base: 450, stagger: 120 },
    { s: '.webinar-cta-wrap', fx: 'up', d: 30, dur: 900, base: 700 },

    // Why this conversation matters
    { s: '.conversation-eyebrow', fx: 'up', d: 20, dur: 800, base: 0 },
    { s: '.conversation-heading', fx: 'blurUp', d: 32, dur: 1000, base: 100 },
    { s: '.conversation-actions', fx: 'up', d: 24, dur: 900, base: 260 },
    { s: '.conversation-description p', fx: 'up', d: 28, dur: 900, base: 150, stagger: 130 },
    { s: '.conversation-proof-card', fx: 'up', d: 36, dur: 900, base: 80, stagger: 130 },

    // Section heads (outcomes + audience)
    { s: '.outcomes-eyebrow', fx: 'up', d: 18, dur: 800, base: 0 },
    { s: '.outcomes-title', fx: 'blurUp', d: 30, dur: 1000, base: 100 },
    { s: '.audience-sub', fx: 'up', d: 20, dur: 900, base: 230 },
    { s: '.outcomes-line', fx: 'line', dur: 900, base: 340 },

    // Outcomes cards
    {
      s: '.outcome-img',
      fx: 'clip',
      dur: 1100,
      base: 0,
      stagger: 130,
      extra: function (el, delay) {
        var img = el.querySelector('img');
        if (img) {
          img.animate([{ transform: 'scale(1.25)' }, { transform: 'scale(1)' }], {
            duration: 1500,
            delay: delay,
            easing: EASE,
            fill: 'backwards'
          });
        }
      }
    },
    { s: '.outcome-card', fx: 'up', d: 44, dur: 900, base: 260, stagger: 130 },
    { s: '.outcomes-cta', fx: 'up', d: 28, dur: 900, base: 0 },

    // Speaker
    { s: '.speaker-heading', fx: 'up', d: 28, dur: 900, base: 0 },
    { s: '.speaker-text', fx: 'up', d: 28, dur: 900, base: 140 },
    { s: '.speaker-line', fx: 'lineLeft', dur: 900, base: 320 },
    { s: '.speaker-image', fx: 'sideIn', dur: 1200, base: 150 },

    // Audience cards
    { s: '.audience-card', fx: 'up', d: 40, dur: 900, base: 0, stagger: 120 },

    // Bottom CTA card
    { s: '.pgdm-card', fx: 'scale', d: 40, dur: 1000, base: 0 },
    { s: '.pgdm-content h3', fx: 'blurUp', d: 28, dur: 900, base: 220 },
    { s: '.pgdm-content p', fx: 'up', d: 24, dur: 900, base: 340 },
    { s: '.pgdm-btn', fx: 'up', d: 24, dur: 900, base: 460 },
    { s: '.pgdm-student', fx: 'up', d: 90, dur: 1200, base: 300 }
  ];

  /* ---------- Play ---------- */
  function play(el, rule, delay) {
    el.classList.add('sa-in');
    try {
      el.animate(fx[rule.fx](rule.d), {
        duration: rule.dur || 900,
        delay: delay,
        easing: EASE,
        fill: 'backwards' // delay ke time start-frame hold, end par natural CSS state
      });
      if (rule.extra) rule.extra(el, delay);
    } catch (e) {
      /* animation fail ho to element bas visible rahe */
    }
  }

  /* ---------- Observer ---------- */
  var map = new Map();

  var io = new IntersectionObserver(
    function (entries) {
      var batches = {};

      entries.forEach(function (entry) {
        var el = entry.target;
        var rule = map.get(el);
        if (!rule) return;

        var r = entry.boundingClientRect;

        if (entry.isIntersecting) {
          (batches[rule.i] = batches[rule.i] || []).push(el);
          io.unobserve(el);
        } else if (r.width === 0 && r.height === 0) {
          // display:none (jaise hidden speaker image variant) — jab visible hoga tab observer phir fire karega
          return;
        } else if (r.bottom <= 0) {
          // refresh / anchor jump ke baad jo sections upar nikal chuke hain: bina animation visible
          el.classList.add('sa-in');
          io.unobserve(el);
        }
      });

      Object.keys(batches).forEach(function (k) {
        var rule = rules[k];
        var list = batches[k];
        // DOM order me sort, taaki stagger left-to-right / top-to-bottom ho
        list.sort(function (a, b) {
          return a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;
        });
        list.forEach(function (el, idx) {
          play(el, rule, (rule.base || 0) + idx * (rule.stagger || 0));
        });
      });
    },
    {
      threshold: 0.12,
      rootMargin: '0px 0px -6% 0px'
    }
  );

  rules.forEach(function (rule, i) {
    rule.i = i;
    document.querySelectorAll(rule.s).forEach(function (el) {
      map.set(el, rule);
      io.observe(el);
    });
  });
})();
