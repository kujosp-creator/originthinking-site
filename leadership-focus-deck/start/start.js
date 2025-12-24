// FILE: /ops-focus-deck/start/start.js
(function () {
  var btn = document.getElementById('printBtn');
  if (btn) {
    btn.addEventListener('click', function () { window.print(); });
  }
})();
