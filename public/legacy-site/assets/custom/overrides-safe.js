(function () {
  const MAP = {
    welcome:
      'Welcome to the <strong class="framer-text">First Assembly</strong> of the <strong class="framer-text">American New Board</strong>. A secure invitation-only meeting for trusted physician participation.',
    explaining:
      'This <strong class="framer-text">private one-time meeting</strong> brings <strong class="framer-text">invited physicians</strong> together to confirm attendance and complete the <strong class="framer-text">NDA signature process</strong>.',
    action:
      'If you received an invitation, <strong class="framer-text">continue using your unique access code</strong> to confirm your presence and complete the <strong class="framer-text">NDA signature process</strong>.',
    meetingHeadline:
      'JOIN THIS MEETING AND BE APART OF THE BIGGEST <strong class="framer-text">INFRASTRUCTURES.</strong>',
    pickLabel: 'JOIN THIS MEETING',
    daysLabel: '<strong class="framer-text">DASY</strong> LEFT TO CONFIRM',
    author: 'YOUNES DIOURI'
  };

  const normalize = (text) =>
    (text || '')
      .toLowerCase()
      .replace(/["“”'‘’]/g, '')
      .replace(/[^a-z0-9]+/g, ' ')
      .trim();

  const setByIncludes = (needle, html) => {
    const n = normalize(needle);
    document.querySelectorAll('.framer-text').forEach((el) => {
      const current = normalize(el.textContent);
      if (!current || !current.includes(n)) return;
      el.innerHTML = html;
    });
  };

  const setByExact = (needle, html) => {
    const n = normalize(needle);
    document.querySelectorAll('.framer-text').forEach((el) => {
      if (normalize(el.textContent) === n) {
        el.innerHTML = html;
      }
    });
  };

  const applyLogoText = () => {
    const logoSvg =
      "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 82 27%22><text x=%2241%22 y=%2218%22 text-anchor=%22middle%22 font-family=%22VFutura Bold,VFutura Medium,Arial,sans-serif%22 font-size=%228.8%22 font-weight=%22700%22 fill=%22rgb(0,0,0)%22>ABG MEETING</text></svg>')";

    document.querySelectorAll('.framer-j3szy7, .framer-130wko2').forEach((el) => {
      if (el && el.style) el.style.backgroundImage = logoSvg;
    });
  };

  const apply = () => {
    setByIncludes('the edition is based on the colour palette', MAP.welcome);
    setByIncludes('to celebrate the 100th anniversary', MAP.explaining);
    setByIncludes('2026 marks the 100th anniversary', MAP.explaining);
    setByIncludes('choosing colours should not be a gamble', MAP.action);

    setByIncludes('the winning colours of this iconic', MAP.meetingHeadline);
    setByExact('pick your colour', MAP.pickLabel);
    setByIncludes('left to vote', MAP.daysLabel);
    setByExact('verner panton', MAP.author);

    applyLogoText();
  };

  const run = () => {
    apply();
    setTimeout(apply, 1200);
    setTimeout(apply, 2800);
    setTimeout(apply, 5000);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', run, { once: true });
  } else {
    run();
  }
})();
