(function () {
  const logoSvg =
    "url('data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 82 27%22 overflow=%22visible%22><text x=%2241%22 y=%2218%22 text-anchor=%22middle%22 font-family=%22VFutura Bold,VFutura Medium,Arial,sans-serif%22 font-size=%228.8%22 font-weight=%22700%22 fill=%22rgb(0,0,0)%22>ABG MEETING</text></svg>')";

  const FULL_COPY = {
    action:
      "If you received an invitation, continue using your unique access code to confirm your presence and complete the NDA signature process.",
    meetingHeadline: "JOIN THIS MEETING AND BE APART OF THE BIGGEST INFRASTRUCTURES.",
    daysLabel: "DASY LEFT TO CONFIRM",
    pickColorLabel: "JOIN THIS MEETING",
    author: "YOUNES DIOURI"
  };

  const normalize = (text) =>
    (text || "")
      .toLowerCase()
      .replace(/["“”'‘’]/g, "")
      .replace(/[^a-z0-9]+/g, " ")
      .trim();

  function setTextByMatch(matchText, newText) {
    const target = normalize(matchText);
    document.querySelectorAll(".framer-text").forEach((el) => {
      if (normalize(el.textContent) === target) {
        el.textContent = newText;
      }
    });
  }

  function setTextByIncludes(needle, newText) {
    const target = normalize(needle);
    document.querySelectorAll(".framer-text").forEach((el) => {
      const current = normalize(el.textContent);
      if (!current || !current.includes(target)) return;
      el.textContent = newText;
    });
  }

  function replacePrimaryParagraph() {
    document.querySelectorAll("h1.framer-text, h2.framer-text").forEach((el) => {
      const current = normalize(el.textContent);
      if (current.includes("choosing colours should not be a gamble")) {
        el.innerHTML =
          'If you received an invitation, continue using your unique access code to confirm your presence and complete the <strong class="framer-text">NDA signature process</strong>.';
      }
    });
  }

  function applyLogo() {
    const selectors = [".framer-j3szy7", ".framer-130wko2"];
    selectors.forEach((sel) => {
      document.querySelectorAll(sel).forEach((el) => {
        if (el && el.style) {
          el.style.backgroundImage = logoSvg;
        }
      });
    });
  }

  function run() {
    replacePrimaryParagraph();
    setTextByIncludes("the winning colours of this iconic", FULL_COPY.meetingHeadline);
    setTextByMatch("days left to vote", FULL_COPY.daysLabel);
    setTextByMatch("pick your colour", FULL_COPY.pickColorLabel);
    setTextByMatch("verner panton", FULL_COPY.author);
    applyLogo();
  }

  const schedule = () => {
    run();
    setTimeout(run, 400);
    setTimeout(run, 1200);
    setTimeout(run, 2600);
    setTimeout(run, 4200);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", schedule, { once: true });
  } else {
    schedule();
  }

  const observer = new MutationObserver(() => run());
  observer.observe(document.documentElement, { childList: true, subtree: true });
  setTimeout(() => observer.disconnect(), 12000);
})();
