(() => {
  const TARGET_PATH = "/confirm/";
  const FORM_ID = "69e6c64b8c8898e1dd0c8b9f";
  const FORM_HOST = "https://8ncrc15q.forms.app";
  const EMBED_SRC = "https://forms.app/cdn/embed.js";

  function normalize(value) {
    return (value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
  }

  function isTargetLabel(text) {
    const clean = normalize(text);
    return clean === "vote" || clean === "confirm" || clean === "vote colour" || clean === "vote color";
  }

  function redirectTop() {
    if (window.top && window.top !== window) {
      window.top.location.href = TARGET_PATH;
      return;
    }
    window.location.href = TARGET_PATH;
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
      element.setAttribute("href", TARGET_PATH);
      element.setAttribute("target", "_top");
    }

    const textNodes = element.querySelectorAll(".framer-text");
    if (textNodes.length > 0) {
      textNodes.forEach((node) => {
        if (isTargetLabel(node.textContent || "")) {
          node.textContent = "CONFIRM";
        }
      });
      return;
    }

    element.textContent = "CONFIRM";
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
    new window.formsapp(FORM_ID, "fullscreen", { opacity: 0 }, FORM_HOST);
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

    const existing = document.querySelector(`script[src=\"${EMBED_SRC}\"]`);
    if (!existing) {
      const script = document.createElement("script");
      script.src = EMBED_SRC;
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
