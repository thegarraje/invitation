(function () {
  function done(cb) { if (typeof cb === 'function') { cb(); } }
  window.grecaptcha = window.grecaptcha || {
    ready: done,
    execute: function () { return Promise.resolve('local-disabled-recaptcha-token'); }
  };
})();
