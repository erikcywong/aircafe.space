/* AIRCAFE × AIRCAFE — EN / ZH toggle, persisted in localStorage. Default: zh */
(function () {
  var KEY = "napell_lang";
  var DEFAULT = "zh";
  function saved() {
    try { return localStorage.getItem(KEY) || DEFAULT; } catch (e) { return DEFAULT; }
  }
  function apply(lang) {
    document.documentElement.setAttribute("data-lang", lang);
    document.documentElement.lang = lang === "zh" ? "zh-CN" : "en";
    var t = document.getElementById("langToggle");
    if (t) t.textContent = lang === "zh" ? "English" : "中文";
    try { localStorage.setItem(KEY, lang); } catch (e) {}
    window.NAP_LANG_CURRENT = lang;
    window.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  window.NAP_LANG = function () {
    return document.documentElement.getAttribute("data-lang") || DEFAULT;
  };
  window.FEC_LANG = window.NAP_LANG; /* back-compat with chart helpers */
  window.addEventListener("DOMContentLoaded", function () {
    apply(saved());
    var btn = document.getElementById("langToggle");
    if (btn) btn.addEventListener("click", function () {
      apply(window.NAP_LANG() === "zh" ? "en" : "zh");
    });
  });
  apply(saved());
})();
