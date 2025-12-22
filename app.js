// app.js - Global logic for Origin Problem Solving™ site
// Responsibilities:
// - Seasonal theme switch (Christmas -> New Year -> Default)
// - "Just Do It" (JDI) gate helper
// - PWA service worker registration
// - Install prompt handler
// - Mobile navigation menu

document.addEventListener('DOMContentLoaded', function () {
  initSeasonalTheme();
  initJDI();
  initServiceWorker();
  initInstallPrompt();
  initMobileMenu();
});


/* =========================================
 * 0. Seasonal theme switch (Christmas -> New Year -> Default)
 * =========================================
 * Rules:
 * - OPS Tools™ (/starter-kit/) is excluded.
 * - Force for previews:
 *     ?theme=newyear2026
 *     ?theme=christmas2025
 *     ?theme=off
 * - Schedule (local time):
 *     Christmas: through 2025-12-26
 *     New Year:  2025-12-27 through 2026-01-31
 *     Default:   2026-02-01 onward
 */
function initSeasonalTheme() {
  var body = document.body;
  if (!body) return;

  var path = window.location.pathname || '/';
  if (path.indexOf('/starter-kit/') === 0) {
    return;
  }

  var params = new URLSearchParams(window.location.search);
  var forced = (params.get('theme') || '').toLowerCase();

  function clearThemes() {
  body.classList.remove('theme-christmas-2025');
  body.classList.remove('theme-newyear-2026');
  body.classList.remove('theme-stpatricks');
  body.classList.remove('theme-july4');
  body.classList.remove('theme-halloween');
}

  function setBanner(html) {
    var banner = document.querySelector('.holiday-banner');
    if (!banner) return;
    banner.innerHTML = html;
  }

  function applyChristmas() {
    clearThemes();
    body.classList.add('theme-christmas-2025');
    setBanner('🎄 Merry Christmas from Origin Thinking™ 🎄');
  }

  function applyNewYear() {
    clearThemes();
    body.classList.add('theme-newyear-2026');
    setBanner(
      '<span class="seasonal-head">Start the New Year With Clear Direction</span>' +
      '<span class="seasonal-sub">Build systems that last beyond January.</span>'
    );
  }
function applyStPatricks() {
  clearThemes();
  body.classList.add('theme-stpatricks');
  setBanner(
    '<span class="seasonal-head">Luck Is Not a Strategy</span>' +
    '<span class="seasonal-sub">Standards beat superstition. Every time.</span>'
  );
}

function applyJuly4() {
  clearThemes();
  body.classList.add('theme-july4');
  setBanner(
    '<span class="seasonal-head">Freedom Comes From Clarity.</span>' +
    '<span class="seasonal-sub">Evidence beats opinion.</span>'
  );
}

function applyHalloween() {
  clearThemes();
  body.classList.add('theme-halloween');
  setBanner(
    '<span class="seasonal-head">The Scariest Problems Are the Ones You Can’t See</span>' +
    '<span class="seasonal-sub">Expose the cause. Eliminate it.</span>'
  );
}

  // Forced modes for Cloudflare preview testing
  if (forced === 'off') {
    clearThemes();
    setBanner('');
    return;
  }
  if (forced === 'christmas2025') {
    applyChristmas();
    return;
  }
  if (forced === 'newyear2026') {
    applyNewYear();
    return;
  }
  if (forced === 'stpatricks') {
  applyStPatricks();
  return;
}
if (forced === 'july4') {
  applyJuly4();
  return;
}
if (forced === 'halloween') {
  applyHalloween();
  return;
}

  // Scheduled modes (local time)
  var now = new Date();

  // Year-robust windows (local time)
var y = now.getFullYear();

// Christmas: through Dec 26 of the current year (matches your current behavior)
var endChristmas = new Date(y, 11, 26, 23, 59, 59);

// New Year: Dec 27 of current year through Jan 31 of next year (matches your current behavior)
var startNewYear = new Date(y, 11, 27, 0, 0, 0);
var endNewYear   = new Date(y + 1, 0, 31, 23, 59, 59);

  if (now <= endChristmas) {
    applyChristmas();
    return;
  }
  if (now >= startNewYear && now <= endNewYear) {
    applyNewYear();
    return;
  }
// Additional scheduled themes (do not change Christmas/New Year logic above)

// Helper: month is 0-based (0=Jan). Local time.
function inWindow(mStart, dStart, mEnd, dEnd) {
  var y = now.getFullYear();
  var start = new Date(y, mStart, dStart, 0, 0, 0);
  var end   = new Date(y, mEnd, dEnd, 23, 59, 59);
  return now >= start && now <= end;
}

// St. Patrick’s: 2 weeks leading up + day of (Mar 3–Mar 17)
if (inWindow(2, 3, 2, 17)) {
  applyStPatricks();
  return;
}

// July 4: 2 weeks leading up + the entire week of celebrations (Jun 20–Jul 7)
if (inWindow(5, 20, 6, 7)) {
  applyJuly4();
  return;
}

// Halloween: entire month of October (Oct 1–Oct 31)
if (inWindow(9, 1, 9, 31)) {
  applyHalloween();
  return;
}

  // Default: no seasonal theme
  clearThemes();
  setBanner('');
}

/* =========================================
 * 1. JDI Tool Logic
 * =========================================
 * If the JDI elements do not exist on the page, this
 * function returns early and does nothing.
 */
function initJDI() {
  var newBox     = document.getElementById('jdi-new');
  var clearBox   = document.getElementById('jdi-clear');
  var obviousBox = document.getElementById('jdi-obvious');
  var agreeBox   = document.getElementById('jdi-agree');

  var labelEl = document.getElementById('jdi-result-label');
  var textEl  = document.getElementById('jdi-result-text');

  if (!newBox || !clearBox || !obviousBox || !agreeBox || !labelEl || !textEl) {
    return;
  }

  function updateJDI() {
    var allChecked = newBox.checked && clearBox.checked && obviousBox.checked && agreeBox.checked;

    if (allChecked) {
      labelEl.textContent = 'Just Do It';
      textEl.textContent  = 'You passed all four gates. Go fix it now, close the loop, and move on.';
      labelEl.style.color = '#22c55e'; // green
    } else {
      labelEl.textContent = 'Use the full method';
      textEl.textContent  = 'One or more gates are not checked. Use the full Origin Problem Solving™ method.';
      labelEl.style.color = '';
    }
  }

  [newBox, clearBox, obviousBox, agreeBox].forEach(function (box) {
    box.addEventListener('change', updateJDI);
  });

  // Set initial state
  updateJDI();
}

/* =========================================
 * 2. Service worker registration
 * =========================================
 * Kept intentionally simple; if /service-worker.js exists it
 * will be registered, otherwise the error is logged and ignored.
 */
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('/service-worker.js')
        .then(function (registration) {
          console.log('Service worker registered with scope:', registration.scope);
        })
        .catch(function (err) {
          console.log('Service worker registration failed:', err);
        });
    });
  }
}

/* =========================================
 * 3. Install prompt (PWA "Install the App" button)
 * =========================================
 * Uses #installAppButton in index.html if present.
 */
function initInstallPrompt() {
  var deferredPrompt = null;
  var installButton = document.getElementById('installAppButton');
  if (installButton) {
    installButton.hidden = true;
  }

  window.addEventListener('beforeinstallprompt', function (e) {
    // Prevent the mini-infobar from appearing
    e.preventDefault();
    deferredPrompt = e;

    if (installButton) {
      installButton.hidden = false;

      installButton.addEventListener('click', function () {
        if (!deferredPrompt) return;

        installButton.disabled = true;
        deferredPrompt.prompt();

        deferredPrompt.userChoice
          .then(function (choiceResult) {
            deferredPrompt = null;
            installButton.disabled = false;
            if (choiceResult.outcome !== 'accepted') {
              // User dismissed; keep the button visible for later tries
              console.log('PWA install dismissed');
            } else {
              console.log('PWA install accepted');
            }
          })
          .catch(function () {
            deferredPrompt = null;
            installButton.disabled = false;
          });
      }, { once: true });
    }
  });
}

/* =========================================
 * 4. Mobile Navigation
 * =========================================
 * Works with the header markup used on all non-starter-kit pages,
 * where a button with class "menu-toggle" sits next to a
 * <nav class="main-nav"> block.
 *
 * On mobile we apply .is-open to .main-nav and .is-active to the
 * button, and lock body scrolling while the menu is open.
 */
function initMobileMenu() {
  var menuToggle = document.querySelector('.menu-toggle');
  var mainNav    = document.querySelector('.main-nav');
  var body       = document.body;

  if (!menuToggle || !mainNav) {
    return;
  }

  function closeMenu() {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.classList.remove('is-active');
    mainNav.classList.remove('is-open');
    body.style.overflow = '';
  }

  function openMenu() {
    menuToggle.setAttribute('aria-expanded', 'true');
    menuToggle.classList.add('is-active');
    mainNav.classList.add('is-open');
    body.style.overflow = 'hidden';
  }

  menuToggle.addEventListener('click', function () {
    var isOpen = mainNav.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Close when clicking any nav link (including hash links)
  var navLinks = mainNav.querySelectorAll('a');
  for (var i = 0; i < navLinks.length; i++) {
    navLinks[i].addEventListener('click', function () {
      closeMenu();
    });
  }

  // Close on Escape
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (mainNav.classList.contains('is-open')) {
        closeMenu();
        menuToggle.focus();
      }
    }
  });

  // Defensive: if viewport is resized to desktop widths while menu is open,
  // clear the mobile-specific state.
  window.addEventListener('resize', function () {
    if (window.innerWidth > 900 && mainNav.classList.contains('is-open')) {
      closeMenu();
    }
  });
}


// Origin Thinking™ Assistant button safety hook
(function () {
  const btn = document.querySelector('.ot-assistant-btn');
  if (!btn) return;

  // Keep keyboard behavior predictable
  btn.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') btn.click();
  });
})();
