(() => {
  // Centralized legacy CTA settings.
  // Edit this object when you need to change the confirm button behavior.
  const SETTINGS = {
    targetPath: "/confirm/",
    buttonLabel: "CONFIRM",
    acceptedLabels: ["vote", "confirm", "vote colour", "vote color"],
    form: {
      id: "69e6c64b8c8898e1dd0c8b9f",
      host: "https://8ncrc15q.forms.app",
      embedSrc: "https://forms.app/cdn/embed.js"
    }
  };

  function normalize(value) {
    return (value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function isTargetLabel(text) {
    const clean = normalize(text);
    return SETTINGS.acceptedLabels.includes(clean);
  }

  function redirectTop() {
    if (window.top && window.top !== window) {
      window.top.location.href = SETTINGS.targetPath;
      return;
    }
    window.location.href = SETTINGS.targetPath;
  }

  function replaceLabelOnce(element) {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    const label = element.textContent || "";
    if (!isTargetLabel(label)) {
      return;
    }

    if (element.tagName === "A") {
      element.setAttribute("href", SETTINGS.targetPath);
      element.setAttribute("target", "_top");
    }

    const textNodes = element.querySelectorAll(".framer-text");
    if (textNodes.length > 0) {
      textNodes.forEach((node) => {
        if (isTargetLabel(node.textContent || "")) {
          node.textContent = SETTINGS.buttonLabel;
        }
      });
      return;
    }

    element.textContent = SETTINGS.buttonLabel;
  }

  function runPatchOnce() {
    document.querySelectorAll("a, button, [role='button']").forEach((node) => {
      replaceLabelOnce(node);
    });
  }

  function tryOpenFormNow() {
    if (typeof window.formsapp !== "function") {
      return false;
    }

    if (window.__abgFormOpening) {
      return true;
    }

    window.__abgFormOpening = true;
    new window.formsapp(SETTINGS.form.id, "fullscreen", { opacity: 0 }, SETTINGS.form.host);
    return true;
  }

  function openFullscreenForm() {
    if (window.top && window.top !== window) {
      redirectTop();
      return;
    }

    if (tryOpenFormNow()) {
      return;
    }

    const existing = document.querySelector(`script[src=\"${SETTINGS.form.embedSrc}\"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = SETTINGS.form.embedSrc;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        if (!tryOpenFormNow()) {
          redirectTop();
        }
      };
      script.onerror = () => redirectTop();
      document.head.appendChild(script);
      return;
    }

    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (tryOpenFormNow()) {
        window.clearInterval(timer);
        return;
      }

      if (attempts >= 20) {
        window.clearInterval(timer);
        redirectTop();
      }
    }, 150);
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const actionElement = target.closest("a,button,[role='button']");
      if (!actionElement) {
        return;
      }

      if (!isTargetLabel(actionElement.textContent || "")) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      openFullscreenForm();
    },
    true
  );

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", runPatchOnce, { once: true });
  } else {
    runPatchOnce();
  }

  window.setTimeout(runPatchOnce, 1000);
})();
