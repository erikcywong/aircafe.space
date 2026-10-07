/* AIRCAFE x AIRCAFE — small progressive-enhancement chrome helpers */
(function () {
  /* Hover-intent + keyboard support for the grouped navigation.
     CSS already opens the menu on :hover; this only adds click-to-toggle
     (touch devices) and Escape-to-close. */
  function init() {
    var drops = document.querySelectorAll('.navdrop');
    if (!drops.length) return;

    function closeAll(except) {
      drops.forEach(function (d) { if (d !== except) d.classList.remove('open'); });
    }

    drops.forEach(function (d) {
      var trigger = d.querySelector('a');
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        /* On touch / narrow screens the parent link acts as a disclosure toggle
           when the pointer type makes hover unreliable. Otherwise follow the link. */
        var narrow = window.matchMedia('(max-width: 900px)').matches;
        if (!narrow) return;
        var isOpen = d.classList.contains('open');
        if (!isOpen) { e.preventDefault(); closeAll(d); d.classList.add('open'); }
      });
    });

    document.addEventListener('click', function (e) {
      if (!e.target.closest('.navdrop')) closeAll(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAll(null);
    });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
