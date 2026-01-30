/* ==================================================================
   Starter Kit - Logic (Strict Filters & Mobile Menu)
   Save as: starter-kit-app.js
   ================================================================== */

(function(){

  /* --- 1. Deep Link / Scroll Helper --- */
  function jumpToSlug(){
    try {
      const url = new URL(window.location.href);
      const slug = url.hash ? url.hash.slice(1) : (url.searchParams.get('tool') || "");
      if (slug) {
        const el = document.getElementById(slug);
        if (el) {
          if (!url.hash) {
            history.replaceState(null, "", window.location.pathname + window.location.search + "#" + slug);
          }
          const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          el.scrollIntoView({ block: "center", behavior: prefersReduced ? "auto" : "smooth" });
          el.setAttribute("tabindex", "-1");
          el.focus({ preventScroll: true });
        }
      }
    } catch(e) {
      /* ignore */
    }
  }

  /* --- 2. Main Logic --- */
  function initSite() {
    jumpToSlug();

    // Strict filter logic (all steps behave the same)
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.card');
    const toolGrid = document.getElementById('toolGrid');

    // Preserve original DOM order
    if (toolGrid && cards.length > 0) {
      Array.prototype.forEach.call(cards, function(card, idx) {
        if (!card.dataset.origIndex) {
          card.dataset.origIndex = String(idx);
        }
      });
    }

    function restoreOriginalOrder() {
      if (!toolGrid) return;
      const ordered = Array.prototype.slice.call(cards).sort(function(a, b) {
        const ai = parseInt(a.dataset.origIndex || '0', 10);
        const bi = parseInt(b.dataset.origIndex || '0', 10);
        return ai - bi;
      });
      ordered.forEach(function(card) {
        toolGrid.appendChild(card);
      });
    }

    function setActiveChip(activeChip) {
      chips.forEach(function(c) {
        c.removeAttribute('data-active');
        c.setAttribute('aria-pressed', 'false');
      });
      activeChip.setAttribute('data-active', 'true');
      activeChip.setAttribute('aria-pressed', 'true');
    }

    function applyFilter(selectedStep) {
      restoreOriginalOrder();

      if (selectedStep === 'all') {
        cards.forEach(function(card) {
          card.style.display = 'flex';
        });
        return;
      }

      // Strict filter: primary step only (Step 7 included)
      cards.forEach(function(card) {
        card.style.display = (card.getAttribute('data-step') === selectedStep) ? 'flex' : 'none';
      });
    }

    if (chips.length > 0 && cards.length > 0) {
      chips.forEach(function(chip){
        chip.addEventListener('click', function(e) {
          e.preventDefault();
          const selectedStep = this.getAttribute('data-step');
          if (!selectedStep) return;

          setActiveChip(this);
          applyFilter(selectedStep);
        });
      });
    }

    // Mobile menu
    const toggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.main-nav');

    if (toggle && nav) {
      function closeNav() {
        nav.classList.remove('is-open');
        toggle.classList.remove('is-active');
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
      }

      function openNav() {
        nav.classList.add('is-open');
        toggle.classList.add('is-active');
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
      }

      toggle.addEventListener('click', function(e) {
        e.stopPropagation();
        e.preventDefault();
        const isOpen = nav.classList.contains('is-open');
        if (isOpen) closeNav();
        else openNav();
      });

      nav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          closeNav();
        });
      });

      document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          closeNav();
        }
      });
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initSite);
  } else {
    initSite();
  }

})();

