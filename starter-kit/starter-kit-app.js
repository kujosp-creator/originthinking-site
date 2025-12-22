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
      /* ignore bad URLs, etc. */
    }
  }

  /* --- 2. Main Logic --- */
  function initSite() {
    jumpToSlug();

    // --- Strict Filter Logic ---
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.card');

    if (chips.length > 0 && cards.length > 0) {
      chips.forEach(function(chip){
        chip.addEventListener('click', function(e) {
          e.preventDefault();
          const selectedStep = this.getAttribute('data-step');
          if (!selectedStep) return;

          // Visual update
          chips.forEach(function(c) {
            c.removeAttribute('data-active');
            c.setAttribute('aria-pressed', 'false');
          });
          this.setAttribute('data-active', 'true');
          this.setAttribute('aria-pressed', 'true');

          // Card filtering (strict mode on primary step)
          cards.forEach(function(card) {
            if (selectedStep === 'all') {
              card.style.display = 'flex';
            } else {
              if (card.getAttribute('data-step') === selectedStep) {
                card.style.display = 'flex';
              } else {
                card.style.display = 'none';
              }
            }
          });
        });
      });
    }

    // --- Mobile Menu ---
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
        if (isOpen) {
          closeNav();
        } else {
          openNav();
        }
      });

      // Close when clicking any nav link
      nav.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
          closeNav();
        });
      });

      // Close on Escape for accessibility
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
