(() => {
  // Centralized legacy CTA settings.
  // Edit this object when you need to change the confirm button behavior.
  const SETTINGS = {
    targetPath: "/confirm/",
    buttonLabel: "CONFIRM",
    acceptedLabels: ["vote", "confirm", "vote colour", "vote color"],
    legacyCopy: {
      enabled: true,
      manifestPath: "/legacy-site/assets/custom/legacy-copy.json",
      maxObserveMs: 12000
    },
    brandLogo: {
      enabled: true,
      src: "/assets/brand/american-medical-board.svg",
      alt: "American Medical Board"
    },
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

  function toArray(value) {
    if (Array.isArray(value)) {
      return value;
    }
    if (value == null) {
      return [];
    }
    return [value];
  }

  function normalizeAcceptedLabels(values) {
    return toArray(values)
      .map((value) => normalize(value))
      .filter((value) => value.length > 0);
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

  function patchAnyVoteTextNode(node) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    const label = node.textContent || "";
    if (!isTargetLabel(label)) {
      return;
    }

    node.textContent = SETTINGS.buttonLabel;

    const action = node.closest("a, button, [role='button']");
    if (action instanceof HTMLAnchorElement) {
      action.setAttribute("href", SETTINGS.targetPath);
      action.setAttribute("target", "_top");
    }
  }

  function patchVoteLabelsEverywhere() {
    document.querySelectorAll(".framer-text").forEach((node) => {
      patchAnyVoteTextNode(node);
    });
  }

  function runPatchOnce() {
    document.querySelectorAll("a, button, [role='button']").forEach((node) => {
      replaceLabelOnce(node);
    });

    patchVoteLabelsEverywhere();
    patchLegacyBrandLogo();
    ensureBrandPatchWatcher();
  }

  function isLegacyBrandAnchor(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return false;
    }

    const text = (anchor.textContent || "").replace(/\s+/g, " ").trim();
    if (text.length > 0) {
      return false;
    }

    const href = anchor.getAttribute("href") || "";
    const cleanHref = href.split("#")[0];
    if (!cleanHref.startsWith("/")) {
      return false;
    }

    if (cleanHref !== "/" && cleanHref !== "/old-home") {
      return false;
    }

    const hasGraphic = Boolean(anchor.querySelector('[data-framer-component-type="SVG"], svg, img'));
    if (!hasGraphic) {
      return false;
    }

    return true;
  }

  function patchLegacyBrandLogo() {
    if (!SETTINGS.brandLogo.enabled) {
      return;
    }

    const anchors = Array.from(document.querySelectorAll("a"))
      .filter((anchor) => isLegacyBrandAnchor(anchor));

    for (const anchor of anchors) {
      if (anchor.getAttribute("data-abg-logo-patched") === "1") {
        continue;
      }

      anchor.setAttribute("data-abg-logo-patched", "1");
      anchor.setAttribute("aria-label", SETTINGS.brandLogo.alt);
      anchor.textContent = "";
      anchor.style.display = "inline-flex";
      anchor.style.alignItems = "center";
      anchor.style.justifyContent = "center";

      const image = document.createElement("img");
      image.src = SETTINGS.brandLogo.src;
      image.alt = SETTINGS.brandLogo.alt;
      image.decoding = "async";
      image.loading = "eager";
      image.draggable = false;
      image.style.width = "100%";
      image.style.height = "100%";
      image.style.objectFit = "contain";
      image.style.display = "block";
      anchor.appendChild(image);
    }
  }

  let brandPatchWatcherStarted = false;

  function ensureBrandPatchWatcher() {
    if (brandPatchWatcherStarted || !SETTINGS.brandLogo.enabled) {
      return;
    }

    brandPatchWatcherStarted = true;
    const startedAt = Date.now();

    const observer = new MutationObserver(() => {
      patchLegacyBrandLogo();
      if (document.querySelector("[data-abg-logo-patched='1']")) {
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    const interval = window.setInterval(() => {
      patchLegacyBrandLogo();

      const isPatched = Boolean(document.querySelector("[data-abg-logo-patched='1']"));
      const isTimedOut = Date.now() - startedAt > SETTINGS.legacyCopy.maxObserveMs;

      if (isPatched || isTimedOut) {
        window.clearInterval(interval);
        observer.disconnect();
      }
    }, 300);
  }

  function getTextNodes(root) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node = walker.nextNode();

    while (node) {
      const parentTag = node.parentElement?.tagName;
      const text = node.nodeValue ?? "";
      if (parentTag !== "SCRIPT" && parentTag !== "STYLE" && text.trim().length > 0) {
        nodes.push(node);
      }
      node = walker.nextNode();
    }

    return nodes;
  }

  function setTextPreserveStructure(element, nextText) {
    const nodes = getTextNodes(element);

    if (nodes.length === 0) {
      element.textContent = nextText;
      return;
    }

    let cursor = 0;
    for (let i = 0; i < nodes.length; i += 1) {
      if (cursor >= nextText.length) {
        nodes[i].nodeValue = "";
        continue;
      }

      const isLast = i === nodes.length - 1;
      if (isLast) {
        nodes[i].nodeValue = nextText.slice(cursor);
        cursor = nextText.length;
        continue;
      }

      nodes[i].nodeValue = nextText[cursor];
      cursor += 1;
    }
  }

  function getCopyTargets(entry) {
    if (entry.selector) {
      return Array.from(document.querySelectorAll(entry.selector));
    }

    if (entry.name) {
      const escaped = String(entry.name).replace(/"/g, '\\"');
      return Array.from(document.querySelectorAll(`[data-framer-name="${escaped}"]`));
    }

    return [];
  }

  function targetMatchesEntry(target, entry) {
    const filters = toArray(entry.matchTextIncludes)
      .map((value) => String(value || "").trim())
      .filter((value) => value.length > 0);

    if (filters.length === 0) {
      return true;
    }

    const text = (target.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    if (!text) {
      return false;
    }

    return filters.every((filter) => text.includes(filter.toLowerCase()));
  }

  function applyCopyEntry(entry) {
    if (!entry || typeof entry.text !== "string") {
      return;
    }

    const targets = getCopyTargets(entry).filter((target) => targetMatchesEntry(target, entry));
    if (targets.length === 0) {
      return;
    }

    if (entry.applyToAll === true) {
      for (const target of targets) {
        setTextPreserveStructure(target, entry.text);
      }
      return;
    }

    const requestedIndex = typeof entry.index === "number" && entry.index >= 0 ? entry.index : 0;
    const target = targets[requestedIndex] || targets[0];

    if (!target) {
      return;
    }

    setTextPreserveStructure(target, entry.text);
  }

  async function fetchLegacyCopyManifest() {
    if (!SETTINGS.legacyCopy.enabled) {
      return null;
    }

    try {
      const response = await fetch(SETTINGS.legacyCopy.manifestPath, {
        credentials: "same-origin",
        cache: "no-store"
      });

      if (!response.ok) {
        return null;
      }

      return await response.json();
    } catch (error) {
      console.warn("legacy-copy: failed to load manifest", error);
      return null;
    }
  }

  function resolvePageEntries(manifest) {
    if (!manifest || typeof manifest !== "object") {
      return [];
    }

    const entries = [];
    if (Array.isArray(manifest.global)) {
      entries.push(...manifest.global);
    }

    const pathname = window.location.pathname;
    if (manifest.pages && Array.isArray(manifest.pages[pathname])) {
      entries.push(...manifest.pages[pathname]);
    }

    return entries;
  }

  function applyManifestCtaSettings(manifest) {
    if (!manifest || typeof manifest !== "object" || !manifest.cta || typeof manifest.cta !== "object") {
      return;
    }

    const cta = manifest.cta;

    if (typeof cta.targetPath === "string" && cta.targetPath.trim().length > 0) {
      SETTINGS.targetPath = cta.targetPath.trim();
    }

    if (typeof cta.buttonLabel === "string" && cta.buttonLabel.trim().length > 0) {
      SETTINGS.buttonLabel = cta.buttonLabel.trim();
    }

    const nextAccepted = normalizeAcceptedLabels(cta.acceptedLabels);
    if (nextAccepted.length > 0) {
      SETTINGS.acceptedLabels = nextAccepted;
    }
  }

  async function applyLegacyCopyAdapter() {
    const manifest = await fetchLegacyCopyManifest();
    if (!manifest) {
      return;
    }

    applyManifestCtaSettings(manifest);
    runPatchOnce();

    const entries = resolvePageEntries(manifest);
    if (entries.length === 0) {
      return;
    }

    const applyAll = () => {
      for (const entry of entries) {
        applyCopyEntry(entry);
      }
    };

    applyAll();
    window.setTimeout(applyAll, 1000);

    const observer = new MutationObserver(() => {
      applyAll();
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true
    });

    window.setTimeout(() => observer.disconnect(), SETTINGS.legacyCopy.maxObserveMs);
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
    document.addEventListener("DOMContentLoaded", () => {
      runPatchOnce();
      applyLegacyCopyAdapter();
    }, { once: true });
  } else {
    runPatchOnce();
    applyLegacyCopyAdapter();
  }

  window.setTimeout(runPatchOnce, 1000);
})();
