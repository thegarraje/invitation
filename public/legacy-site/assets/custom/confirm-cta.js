(() => {
  // Centralized legacy CTA settings.
  // Edit this object when you need to change the confirm button behavior.
  const SETTINGS = {
    targetPath: "/confirm",
    buttonLabel: "CONFIRM",
    subjectsLabel: "SUBJECTS",
    acceptedLabels: ["vote", "confirm", "vote colour", "vote color", "early access"],
    legacyCopy: {
      enabled: true,
      manifestPath: "/legacy-site/assets/custom/legacy-copy.json",
      maxObserveMs: 3000
    },
    form: {
      id: "69e6c64b8c8898e1dd0c8b9f",
      host: "https://8ncrc15q.forms.app",
      embedSrc: "https://forms.app/cdn/embed.js"
    },
    social: {
      whatsappHref: "https://wa.me/17867786843",
      whatsappIconPath: "/assets/icons/whatsapp.svg?v=20260421a"
    },
    branding: {
      logoPath: "/assets/brand/american-medical-board.svg?v=20260421n",
      footerLogoPath: "/assets/brand/american-medical-board-white.svg?v=20260421n",
      fallbackWidth: 68,
      fallbackHeight: 23,
      defaultScale: 3.6,
      defaultMinWidth: 320,
      defaultMinHeight: 102,
      footerScale: 2.15,
      footerMinWidth: 190,
      footerMinHeight: 56
    },
    countdown: {
      durationDays: 15
    }
  };
  const INTRO_ROOT_SELECTOR = '[data-framer-name="D - intro"], [data-framer-name="T - intro"], [data-framer-name="M - intro"]';
  const COLOR_LABEL_REPLACEMENTS = new Map([
    ["flash red", "Beyond Systems"],
    ["deep magenta", "Deep Project"],
    ["deep era", "Deep Project"],
    ["ultra violet", "Global Scale"],
    ["strong purple", "New Positioning"],
    ["electric blue", "Private Meeting"],
    ["bright turquoise", "Selective Access"],
    ["bold orange", "A Rare\nMoment"],
    ["a rare moment", "A Rare\nMoment"]
  ]);
  const COLOR_LABEL_COMPACT_REPLACEMENTS = new Map(
    Array.from(COLOR_LABEL_REPLACEMENTS.entries()).map(([label, replacement]) => [label.replace(/\s+/g, ""), replacement])
  );
  const COUNTDOWN_VALUE_PATTERN = /^\d{1,4}:\d{2}:\d{2}:\d{2}$/;
  const COUNTDOWN_LABEL_PATTERN = /^\s*days?\s+left\s+to\s+(vote|confirm)\s*$/i;
  let countdownEndAtMs = null;
  let countdownTickTimer = null;

  function normalizePathname(pathname) {
    return String(pathname || "")
      .toLowerCase()
      .replace(/\/+$/, "");
  }

  function isLandingPage() {
    const path = normalizePathname(window.location.pathname);
    if (path === "" || path === "/") {
      return true;
    }
    return /(^|\/)(old-home|index)(\.html?|)$/.test(path);
  }

  function isWithinIntroRoot(element) {
    return element instanceof Element && Boolean(element.closest(INTRO_ROOT_SELECTOR));
  }

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

  function forceConfirmHref(element) {
    if (!(element instanceof HTMLElement)) {
      return;
    }

    if (element.tagName === "A") {
      element.setAttribute("href", SETTINGS.targetPath);
      element.setAttribute("target", "_top");
    }
  }

  function replaceLabelOnce(element) {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    if (!isWithinIntroRoot(element)) {
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

    if (element.children.length === 0) {
      element.textContent = SETTINGS.buttonLabel;
    }
  }

  function patchCtaActionElement(element) {
    if (!(element instanceof HTMLElement)) {
      return;
    }
    if (!isWithinIntroRoot(element)) {
      return;
    }

    if (element.tagName === "A") {
      element.setAttribute("href", SETTINGS.targetPath);
      element.setAttribute("target", "_top");
    }

    const textNodes = element.querySelectorAll(".framer-text");
    if (textNodes.length > 0) {
      let updatedAny = false;
      textNodes.forEach((node) => {
        if (isTargetLabel(node.textContent || "")) {
          node.textContent = SETTINGS.buttonLabel;
          updatedAny = true;
        }
      });
      if (updatedAny) {
        return;
      }
    }

    if (isTargetLabel(element.textContent || "") && element.children.length === 0) {
      element.textContent = SETTINGS.buttonLabel;
    }
  }

  function isPrimaryConfirmCtaElement(element) {
    if (!(element instanceof Element)) {
      return false;
    }

    const label = element.textContent || "";
    const href = (element.getAttribute("href") || "").toLowerCase();
    const isHighlighted = element.matches(
      'a[data-highlight="true"], button[data-highlight="true"], [role="button"][data-highlight="true"]'
    );
    const hasVoteLikeLabel = isTargetLabel(label) || /\b(vote|confirm)\b/i.test(label);
    const pointsToLegacyVoteFlow = /\/vote-phase\/home-back\b/.test(href) || /#panton2/.test(href);
    const pointsToLegacyPickColor = /#pickcolor/.test(href) || /pickcolor-container/.test(href);

    // Highlighted vote/confirm CTA or highlighted pickcolor CTA should open confirm form.
    if (isHighlighted && (hasVoteLikeLabel || pointsToLegacyPickColor)) {
      return true;
    }

    // Keep legacy fallback for old CTA route variants.
    return hasVoteLikeLabel && pointsToLegacyVoteFlow;
  }

  function patchAnyVoteTextNode(node) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    const isFramerText = node.classList.contains("framer-text");
    if (!isFramerText) {
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
      if (node instanceof HTMLElement) {
        patchAnyVoteTextNode(node);
      }
    });
  }

  function patchSubjectsLabelEverywhere() {
    document.querySelectorAll(".framer-text").forEach((node) => {
      if (!(node instanceof HTMLElement)) {
        return;
      }

      const label = normalize(node.textContent || "");
      if (label !== "colours" && label !== "colors") {
        return;
      }

      node.textContent = SETTINGS.subjectsLabel;
    });
  }

  function patchColorTitleLabelsEverywhere() {
    const textNodes = Array.from(document.querySelectorAll(".framer-text")).filter(
      (node) => node instanceof HTMLElement
    );
    const semanticTextNodes = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6, p, span")).filter(
      (node) => node instanceof HTMLElement && node.children.length === 0
    );

    function findColorReplacement(rawText) {
      const normalized = normalize(rawText || "");
      if (!normalized) {
        return null;
      }
      return COLOR_LABEL_REPLACEMENTS.get(normalized) || COLOR_LABEL_COMPACT_REPLACEMENTS.get(normalized.replace(/\s+/g, "")) || null;
    }

    function applyColorReplacement(node, replacement) {
      node.textContent = replacement;
      if (replacement.includes("\n")) {
        node.style.setProperty("white-space", "pre-line", "important");
      }
    }

    textNodes.forEach((node) => {
      const replacement = findColorReplacement(node.textContent || "");
      if (replacement) {
        applyColorReplacement(node, replacement);
      }
    });

    semanticTextNodes.forEach((node) => {
      if (node.classList.contains("framer-text")) {
        return;
      }
      const replacement = findColorReplacement(node.textContent || "");
      if (replacement) {
        applyColorReplacement(node, replacement);
      }
    });

    for (let index = 0; index < textNodes.length - 1; index += 1) {
      const first = textNodes[index];
      const second = textNodes[index + 1];
      if (!(first instanceof HTMLElement) || !(second instanceof HTMLElement)) {
        continue;
      }
      if (first.parentElement !== second.parentElement) {
        continue;
      }
      if (!first.textContent || !second.textContent) {
        continue;
      }

      const replacement = findColorReplacement(`${first.textContent} ${second.textContent}`);
      if (!replacement) {
        continue;
      }

      applyColorReplacement(first, replacement);
      second.textContent = "";
      second.style.setProperty("display", "none", "important");
    }
  }

  function getCountdownEndAtMs() {
    if (typeof countdownEndAtMs === "number") {
      return countdownEndAtMs;
    }

    const durationMs = Math.max(1, Number(SETTINGS.countdown.durationDays) || 15) * 24 * 60 * 60 * 1000;
    countdownEndAtMs = Date.now() + durationMs;
    return countdownEndAtMs;
  }

  function formatCountdownValue() {
    const remainingMs = Math.max(0, getCountdownEndAtMs() - Date.now());
    const totalSeconds = Math.floor(remainingMs / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const pad2 = (value) => String(Math.max(0, value)).padStart(2, "0");

    return `${pad2(days)}:${pad2(hours)}:${pad2(minutes)}:${pad2(seconds)}`;
  }

  function isCountdownValueNode(node) {
    if (!(node instanceof HTMLElement)) {
      return false;
    }
    const text = (node.textContent || "").trim();
    if (!COUNTDOWN_VALUE_PATTERN.test(text)) {
      return false;
    }

    const rect = node.getBoundingClientRect();
    if (rect.width <= 0 && rect.height <= 0) {
      return false;
    }

    const tag = node.tagName.toLowerCase();
    if (tag === "script" || tag === "style") {
      return false;
    }

    return true;
  }

  function patchCountdownLabelNode(node) {
    if (!(node instanceof HTMLElement)) {
      return;
    }

    const rawLabel = (node.textContent || "").replace(/\s+/g, " ").trim();
    if (!COUNTDOWN_LABEL_PATTERN.test(rawLabel)) {
      return;
    }

    const strong = node.querySelector("strong");
    if (strong instanceof HTMLElement) {
      strong.textContent = "days";
      const trailingTextNode = Array.from(node.childNodes).find(
        (child) => child.nodeType === Node.TEXT_NODE && String(child.textContent || "").trim().length > 0
      );
      if (trailingTextNode) {
        trailingTextNode.textContent = " left to confirm";
      } else {
        node.appendChild(document.createTextNode(" left to confirm"));
      }
      return;
    }

    node.textContent = "days left to confirm";
  }

  function patchRealtimeCountdown() {
    const countdownValue = formatCountdownValue();
    document.querySelectorAll("p, h5, h6, span, strong, b").forEach((node) => {
      if (node instanceof HTMLElement && isCountdownValueNode(node)) {
        node.textContent = countdownValue;
      }
    });

    document.querySelectorAll("h5, p, span").forEach((node) => {
      if (node instanceof HTMLElement) {
        patchCountdownLabelNode(node);
      }
    });
  }

  function ensureRealtimeCountdownTicker() {
    patchRealtimeCountdown();
    if (typeof countdownTickTimer === "number") {
      return;
    }

    countdownTickTimer = window.setInterval(() => {
      patchRealtimeCountdown();
    }, 1000);
  }

  function textIncludes(root, wantedLabel) {
    if (!(root instanceof HTMLElement)) {
      return false;
    }
    const wanted = normalize(wantedLabel);
    return Array.from(root.querySelectorAll(".framer-text, a, button, [role='button'], span"))
      .some((node) => normalize(node.textContent || "") === wanted);
  }

  let cachedBottomMenuElement = null;

  function isElementPatchVisible(element) {
    if (!(element instanceof HTMLElement)) {
      return false;
    }
    const style = window.getComputedStyle(element);
    return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || "1") > 0.02;
  }

  function hasBottomMenuLabelHints(root) {
    const hasIntro = textIncludes(root, "intro");
    const hasAbout = textIncludes(root, "about");
    const hasColours = textIncludes(root, "colours") || textIncludes(root, "colors") || textIncludes(root, "subjects");
    const hasAction = textIncludes(root, "confirm") || textIncludes(root, "vote") || textIncludes(root, "early access");
    return hasIntro && hasAbout && hasColours && hasAction;
  }

  function hasBottomMenuStructureHints(root) {
    if (!(root instanceof HTMLElement)) {
      return false;
    }

    const anchors = Array.from(root.querySelectorAll("a[href], a"))
      .filter((node) => node instanceof HTMLAnchorElement);
    if (anchors.length < 3) {
      return false;
    }

    const normalizedText = normalize(root.textContent || "");
    const hasActionText =
      normalizedText.includes("confirm") ||
      normalizedText.includes("vote") ||
      normalizedText.includes("early access");

    const hasActionHref = anchors.some((anchor) => {
      const href = (anchor.getAttribute("href") || "").toLowerCase();
      return (
        href.includes("/confirm") ||
        href.includes("/vote-phase/home-back") ||
        href.includes("#pickcolor") ||
        href.includes("#panton2") ||
        href.includes("cards-section2")
      );
    });

    const hasSocialOrBrand = anchors.some((anchor) => {
      const href = (anchor.getAttribute("href") || "").toLowerCase();
      const text = normalize(anchor.textContent || "");
      const hasSvg = Boolean(anchor.querySelector("svg, [data-framer-component-type='SVG']"));
      return (
        href.includes("wa.me") ||
        href.includes("instagram.com") ||
        href.includes("vitra.com") ||
        text.includes("intro") ||
        text.includes("about") ||
        text.includes("subject") ||
        text.includes("colour") ||
        text.includes("color") ||
        text.includes("confirm") ||
        text.includes("vote") ||
        hasSvg
      );
    });

    return (hasActionText || hasActionHref) && hasSocialOrBrand;
  }

  function getBottomMenuCandidate(root, options = {}) {
    if (!(root instanceof HTMLElement)) {
      return null;
    }
    if (root.id === "abg-mobile-top-bar" || root.closest("#abg-mobile-top-bar")) {
      return null;
    }

    const rect = root.getBoundingClientRect();
    const widthLimit = options.allowWider ? window.innerWidth + 180 : window.innerWidth + 48;
    if (rect.width < 220 || rect.height < 34 || rect.height > 260) {
      return null;
    }
    if (rect.width > widthLimit) {
      return null;
    }

    const linksCount = root.querySelectorAll("a").length;
    if (linksCount < 3) {
      return null;
    }

    const labelHints = hasBottomMenuLabelHints(root);
    const structureHints = hasBottomMenuStructureHints(root);
    if (!labelHints && !structureHints) {
      return null;
    }

    const visible = isElementPatchVisible(root);
    const bottomDistance = Math.abs((window.innerHeight - 12) - rect.bottom);
    const viewportOverlap = Math.max(0, Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0));
    const widthRatio = Math.min(1.35, Math.max(0, rect.width / Math.max(1, window.innerWidth)));
    const isLowerHalf = rect.top >= window.innerHeight * 0.5;
    const isTooHigh = rect.top < window.innerHeight * 0.25;
    const score =
      (labelHints ? 500 : 0) +
      (structureHints ? 320 : 0) +
      (visible ? 180 : 0) +
      Math.max(0, 130 - bottomDistance) +
      Math.min(linksCount * 14, 80) +
      Math.min(viewportOverlap, 120) +
      Math.round(widthRatio * 90) +
      (isLowerHalf ? 110 : 0) -
      (isTooHigh ? 160 : 0);

    return {
      root,
      rect,
      area: rect.width * rect.height,
      score,
      linksCount
    };
  }

  function pickBestBottomMenuAncestor(initialCandidate) {
    if (!initialCandidate) {
      return null;
    }

    let best = initialCandidate;
    let parent = initialCandidate.root.parentElement;
    let depth = 0;

    while (parent && depth < 6 && parent !== document.body) {
      const parentCandidate = getBottomMenuCandidate(parent, { allowWider: true });
      if (parentCandidate) {
        const nearlySameBottom = Math.abs(parentCandidate.rect.bottom - best.rect.bottom) <= 22;
        const wider = parentCandidate.rect.width >= best.rect.width * 1.08;
        const richerLinks = parentCandidate.linksCount >= best.linksCount;
        if ((nearlySameBottom && (wider || richerLinks)) || parentCandidate.score >= best.score + 70) {
          best = parentCandidate;
        }
      }
      parent = parent.parentElement;
      depth += 1;
    }

    return best;
  }

  function findBottomMenuContainer() {
    if (
      cachedBottomMenuElement instanceof HTMLElement &&
      cachedBottomMenuElement.isConnected &&
      !cachedBottomMenuElement.closest("#abg-mobile-top-bar")
    ) {
      return cachedBottomMenuElement;
    }

    const roots = Array.from(document.querySelectorAll("div, nav, section"))
      .filter((node) => node instanceof HTMLElement);

    const candidates = roots
      .map((root) => getBottomMenuCandidate(root))
      .filter((entry) => entry !== null);

    if (candidates.length === 0) {
      cachedBottomMenuElement = null;
      return null;
    }

    candidates.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      return a.area - b.area;
    });

    const refinedCandidate = pickBestBottomMenuAncestor(candidates[0]) || candidates[0];
    cachedBottomMenuElement = refinedCandidate?.root || null;
    return cachedBottomMenuElement;
  }

  function applyStickyMobileBottomMenu() {
    if (!window.matchMedia("(max-width: 809.98px)").matches) {
      return;
    }

    const bar = findBottomMenuContainer();
    if (!(bar instanceof HTMLElement)) {
      return;
    }

    if (bar.parentElement !== document.body) {
      document.body.appendChild(bar);
    }

    bar.dataset.abgMobileBottomNav = "1";
    const measuredHeight = Math.max(40, Math.round(bar.getBoundingClientRect().height || 0));
    if (window.getComputedStyle(bar).display === "none") {
      bar.style.setProperty("display", "flex", "important");
    }
    bar.style.setProperty("box-sizing", "border-box", "important");
    bar.style.setProperty("position", "fixed", "important");
    bar.style.setProperty("left", "max(12px, env(safe-area-inset-left, 0px))", "important");
    bar.style.setProperty("right", "max(12px, env(safe-area-inset-right, 0px))", "important");
    bar.style.setProperty("transform", "none", "important");
    bar.style.setProperty("bottom", "max(12px, env(safe-area-inset-bottom, 0px))", "important");
    bar.style.setProperty("top", "auto", "important");
    bar.style.setProperty("z-index", "100000", "important");
    bar.style.setProperty("opacity", "1", "important");
    bar.style.setProperty("visibility", "visible", "important");
    bar.style.setProperty("pointer-events", "auto", "important");
    bar.style.setProperty("transition", "none", "important");
    bar.style.setProperty("min-height", `${measuredHeight}px`, "important");
    bar.style.setProperty(
      "width",
      "calc(100vw - env(safe-area-inset-left, 0px) - env(safe-area-inset-right, 0px) - 24px)",
      "important"
    );
    bar.style.setProperty("max-width", "100vw", "important");
    bar.style.setProperty("min-width", "0", "important");
    bar.style.setProperty("margin", "0", "important");
  }

  function ensureMobileTopBar() {
    const existing = document.getElementById("abg-mobile-top-bar");
    const isMobile = window.matchMedia("(max-width: 809.98px)").matches;

    if (!isMobile) {
      if (existing) {
        existing.remove();
      }
      return;
    }

    if (existing) {
      return;
    }

    const topBar = document.createElement("div");
    topBar.id = "abg-mobile-top-bar";
    topBar.setAttribute(
      "style",
      [
        "position:fixed",
        "top:max(8px, env(safe-area-inset-top, 0px))",
        "left:max(12px, env(safe-area-inset-left, 0px))",
        "right:max(12px, env(safe-area-inset-right, 0px))",
        "transform:none",
        "z-index:100001",
        "width:auto",
        "max-width:none",
        "box-sizing:border-box",
        "height:58px",
        "border-radius:20px",
        "background:#ebf9fa",
        "display:flex",
        "align-items:center",
        "justify-content:space-between",
        "padding:0 14px",
        "box-shadow:0 8px 20px rgba(58,0,26,.18)"
      ].join(";")
    );

    const logoLink = document.createElement("a");
    logoLink.href = "/old-home";
    logoLink.setAttribute("aria-label", "American Medical Board");
    logoLink.setAttribute(
      "style",
      [
        "display:block",
        "width:128px",
        "height:36px",
        "background-image:url('/assets/brand/american-medical-board.svg')",
        "background-size:contain",
        "background-repeat:no-repeat",
        "background-position:center left",
        "text-decoration:none"
      ].join(";")
    );

    const confirmLink = document.createElement("a");
    confirmLink.href = SETTINGS.targetPath;
    confirmLink.textContent = SETTINGS.buttonLabel;
    confirmLink.setAttribute(
      "style",
      [
        "display:inline-flex",
        "align-items:center",
        "justify-content:center",
        "height:38px",
        "padding:0 18px",
        "border-radius:999px",
        "background:#ff6600",
        "color:#ebf9fa",
        "font-family:'VFutura Heavy','VFutura Heavy Placeholder','Inter',sans-serif",
        "font-size:14px",
        "font-weight:600",
        "letter-spacing:.11em",
        "line-height:95%",
        "text-transform:uppercase",
        "text-decoration:none"
      ].join(";")
    );

    topBar.appendChild(logoLink);
    topBar.appendChild(confirmLink);
    document.body.appendChild(topBar);
  }

  function nudgeMobileStoriesLineBelowTopBar() {
    const isMobile = window.matchMedia("(max-width: 809.98px)").matches;
    if (!isMobile) {
      return;
    }

    const topBar = document.getElementById("abg-mobile-top-bar");
    if (!(topBar instanceof HTMLElement)) {
      return;
    }

    const topBarBottom = topBar.getBoundingClientRect().bottom;
    const targetTop = topBarBottom + 6;

    const storyContainers = Array.from(
      document.querySelectorAll(
        '[data-framer-name*="stories" i], [data-framer-name*="ig bar" i], [data-framer-name*="timebar" i]'
      )
    )
      .filter((node) => node instanceof Element);

    const applyLineNudge = (node) => {
      if (!(node instanceof Element)) {
        return false;
      }

      let targetNode = node;
      const nodeTag = node.tagName.toLowerCase();
      if ((nodeTag === "path" || nodeTag === "line") && node.getBoundingClientRect().width < 20) {
        targetNode = node.closest("svg") || node;
      }

      if (!(targetNode instanceof Element)) {
        return false;
      }

      const rect = targetNode.getBoundingClientRect();
      const delta = Math.round(targetTop - rect.top);
      if (delta <= 0) {
        return false;
      }

      const key = "data-abg-stories-line-base-transform";
      const baseTransform = targetNode.getAttribute(key) ?? targetNode.style.transform ?? "";
      if (!targetNode.getAttribute(key)) {
        targetNode.setAttribute(key, baseTransform);
      }

      const normalizedBase = (targetNode.getAttribute(key) || "").trim();
      targetNode.style.setProperty(
        "transform",
        `${normalizedBase ? `${normalizedBase} ` : ""}translateY(${delta}px)`,
        "important"
      );
      targetNode.setAttribute("data-abg-stories-line-patched", "1");
      return true;
    };

    let patchedAny = false;
    for (const container of storyContainers) {
      const candidates = [container, ...Array.from(container.querySelectorAll("div, span, svg, path, line"))]
        .filter((node) => node instanceof Element);

      const storyLines = candidates.filter((node) => {
        const rect = node.getBoundingClientRect();
        const isThinLine = rect.height >= 0 && rect.height <= 8;
        const isWideEnough = rect.width >= Math.max(60, window.innerWidth * 0.14);
        const isNearTop = rect.top >= -4 && rect.top <= targetTop + 12;
        return isThinLine && isWideEnough && isNearTop;
      });

      if (storyLines.length === 0) {
        continue;
      }

      for (const storyLine of storyLines) {
        if (applyLineNudge(storyLine)) {
          patchedAny = true;
        }
      }
    }

    if (patchedAny) {
      return;
    }

    // Fallback: if "stories" container matching fails, nudge any wide thin top line below the top bar.
    const topLineFallback = Array.from(document.querySelectorAll("svg, path, line, hr, div, span"))
      .filter((node) => node instanceof Element)
      .find((node) => {
        const rect = node.getBoundingClientRect();
        const isThinLine = rect.height >= 0 && rect.height <= 8;
        const isWideEnough = rect.width >= Math.max(60, window.innerWidth * 0.14);
        const isNearTop = rect.top >= 0 && rect.top <= targetTop + 14;
        return isThinLine && isWideEnough && isNearTop;
      });

    if (topLineFallback instanceof Element) {
      applyLineNudge(topLineFallback);
    }
  }

  function isLikelyBrandLogoAnchor(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return false;
    }

    const href = (anchor.getAttribute("href") || "").toLowerCase();
    const pointsToBrandSite = href.includes("vitra.com/home") || href === "https://www.vitra.com" || href === "https://www.vitra.com/";
    if (!pointsToBrandSite) {
      return false;
    }

    const text = (anchor.textContent || "").replace(/\s+/g, " ").trim().toLowerCase();
    const hasSvgContent = Boolean(anchor.querySelector("svg, [data-framer-component-type='SVG']"));
    const hasFramerText = Boolean(anchor.querySelector(".framer-text, [data-framer-component-type='RichTextContainer']"));
    const isTextOnlyFooterLink = text.includes("privacy") || text.includes("vitra.com");

    if (isTextOnlyFooterLink) {
      return false;
    }

    if (hasFramerText && text.length > 0 && !hasSvgContent) {
      return false;
    }

    return hasSvgContent || text.length === 0 || text === "vitra.";
  }

  function isFooterBrandContext(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return false;
    }

    let container = anchor.parentElement;
    let depth = 0;

    while (container && depth < 7) {
      const links = Array.from(container.querySelectorAll("a[href]"));
      const hasPrivacyLink = links.some((link) => {
        const href = (link.getAttribute("href") || "").toLowerCase();
        const text = (link.textContent || "").toLowerCase();
        return href.includes("privacy") || text.includes("privacy");
      });
      const hasSiteLink = links.some((link) => {
        const href = (link.getAttribute("href") || "").toLowerCase();
        const text = (link.textContent || "").toLowerCase();
        return href.includes("vitra.com") || text.includes("vitra.com");
      });

      if (hasPrivacyLink && hasSiteLink) {
        return true;
      }

      container = container.parentElement;
      depth += 1;
    }

    return false;
  }

  function patchBrandLogoAnchor(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    const isFooterLogo = isFooterBrandContext(anchor);
    const bounds = anchor.getBoundingClientRect();
    const width = isFooterLogo
      ? Math.max(Math.round(bounds.width * SETTINGS.branding.footerScale), SETTINGS.branding.footerMinWidth)
      : Math.max(
          Math.round(bounds.width * SETTINGS.branding.defaultScale),
          SETTINGS.branding.defaultMinWidth,
          SETTINGS.branding.fallbackWidth
        );
    const height = isFooterLogo
      ? Math.max(Math.round(bounds.height * SETTINGS.branding.footerScale), SETTINGS.branding.footerMinHeight)
      : Math.max(
          Math.round(bounds.height * SETTINGS.branding.defaultScale),
          SETTINGS.branding.defaultMinHeight,
          SETTINGS.branding.fallbackHeight
        );
    const logoPath = isFooterLogo ? SETTINGS.branding.footerLogoPath : SETTINGS.branding.logoPath;

    anchor.dataset.abgLogoPatched = "1";
    anchor.dataset.abgLogoMode = isFooterLogo ? "footer" : "default";
    anchor.setAttribute("aria-label", "American Medical Board");

    anchor.style.position = "relative";
    anchor.style.display = "inline-block";
    anchor.style.width = `${width}px`;
    anchor.style.height = `${height}px`;
    anchor.style.minWidth = `${width}px`;
    anchor.style.minHeight = `${height}px`;
    anchor.style.backgroundImage = `url("${logoPath}")`;
    anchor.style.backgroundPosition = "center";
    anchor.style.backgroundRepeat = "no-repeat";
    anchor.style.backgroundSize = "contain";
    anchor.style.overflow = "hidden";

    anchor.querySelectorAll("*").forEach((node) => {
      if (node instanceof HTMLElement) {
        node.style.opacity = "0";
        node.style.pointerEvents = "none";
      }
    });
  }

  function patchBrandLogos() {
    document.querySelectorAll('a[href*="vitra.com"]').forEach((node) => {
      if (isLikelyBrandLogoAnchor(node)) {
        patchBrandLogoAnchor(node);
      }
    });
  }

  function isInstagramLink(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return false;
    }

    const href = (anchor.getAttribute("href") || "").toLowerCase();
    const aria = (anchor.getAttribute("aria-label") || "").toLowerCase();
    const text = (anchor.textContent || "").toLowerCase();

    return href.includes("instagram.com") || aria.includes("instagram") || text.includes("instagram");
  }

  const WHATSAPP_ICON_MARKUP =
    '<path d="M20.2 12.1c0 4.5-3.7 8.2-8.2 8.2a8.1 8.1 0 0 1-3.9-1l-4.3 1.3 1.4-4.2a8.2 8.2 0 1 1 15-4.3Z" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"></path>' +
    '<path d="M8.7 9.1c.2-.4.4-.4.6-.4h.5c.2 0 .4 0 .5.4l.3 1.1c.1.3 0 .5-.1.7l-.4.4c-.1.1-.2.3-.1.4a6 6 0 0 0 2.7 2.4c.2.1.3.1.4 0l.5-.5c.2-.2.4-.2.6-.1l1.1.6c.2.1.3.3.2.5l-.4 1a1 1 0 0 1-.8.6c-.7.1-1.7-.1-3-.7a8.8 8.8 0 0 1-3.3-3c-.8-1.2-1-2.3-1-3 0-.3.2-.6.4-.8l.3-.6Z" fill="currentColor"></path>';

  function applyWhatsAppSvg(svg) {
    if (!(svg instanceof SVGElement)) {
      return;
    }

    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("fill", "none");
    svg.innerHTML = WHATSAPP_ICON_MARKUP;
    svg.setAttribute("data-abg-whatsapp-svg", "1");
  }

  function replaceIconNodesWithWhatsApp(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return false;
    }

    const svgNodes = Array.from(anchor.querySelectorAll("svg"))
      .filter((node) => node instanceof SVGElement);

    if (svgNodes.length > 0) {
      svgNodes.forEach((svg) => applyWhatsAppSvg(svg));
      return true;
    }

    const svgHosts = Array.from(anchor.querySelectorAll('[data-framer-component-type="SVG"]'))
      .filter((node) => node instanceof HTMLElement);
    if (svgHosts.length > 0) {
      svgHosts.forEach((host) => {
        host.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" data-abg-whatsapp-svg="1" style="width:100%;height:100%;display:block;">${WHATSAPP_ICON_MARKUP}</svg>`;
      });
      return true;
    }

    return false;
  }

  function appendFallbackWhatsAppIcon(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    anchor.textContent = "";
    const iconWrap = document.createElement("span");
    iconWrap.setAttribute("data-abg-whatsapp-icon-fallback", "1");
    iconWrap.style.display = "inline-flex";
    iconWrap.style.alignItems = "center";
    iconWrap.style.justifyContent = "center";
    iconWrap.style.width = "22px";
    iconWrap.style.height = "22px";
    iconWrap.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" data-abg-whatsapp-svg="1" style="width:100%;height:100%;display:block;">${WHATSAPP_ICON_MARKUP}</svg>`;
    anchor.appendChild(iconWrap);
  }

  function isLikelyBottomMenuSocialAnchor(anchor, menuRect) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return false;
    }

    const rect = anchor.getBoundingClientRect();
    if (rect.width < 26 || rect.height < 20) {
      return false;
    }

    const href = (anchor.getAttribute("href") || "").toLowerCase();
    const text = normalize(anchor.textContent || "");
    const hasSvg = Boolean(anchor.querySelector("svg, [data-framer-component-type='SVG']"));
    const rightHalf = menuRect
      ? rect.left + rect.width / 2 >= menuRect.left + menuRect.width * 0.55
      : true;

    if (!rightHalf) {
      return false;
    }

    if (href.includes(SETTINGS.targetPath)) {
      return false;
    }

    if (text.includes("confirm") || text.includes("vote") || text.includes("early access")) {
      return false;
    }

    if (text.includes("intro") || text.includes("about") || text.includes("subject") || text.includes("colour") || text.includes("color")) {
      return false;
    }

    if (text.includes("american medical board") || text.includes("vitra")) {
      return false;
    }

    if (href.includes("instagram.com") || href.includes("wa.me/17867786843")) {
      return true;
    }

    if (href === "" || href === "#" || href === "./" || href === "/") {
      return hasSvg || text === "" || text.includes("instagram") || text.includes("whatsapp");
    }

    return hasSvg && text === "";
  }

  function patchWhatsAppLink(anchor) {
    if (!(anchor instanceof HTMLAnchorElement)) {
      return;
    }

    anchor.dataset.abgWhatsAppPatched = "1";
    anchor.dataset.abgSocial = "whatsapp";
    anchor.setAttribute("href", SETTINGS.social.whatsappHref);
    anchor.setAttribute("target", "_blank");
    anchor.setAttribute("rel", "noopener noreferrer");
    anchor.setAttribute("aria-label", "WhatsApp");
    anchor.style.removeProperty("background-image");
    anchor.style.removeProperty("background-repeat");
    anchor.style.removeProperty("background-position");
    anchor.style.removeProperty("background-size");

    // Clean up old overlay-based patch remnants.
    anchor.querySelectorAll('[data-abg-whatsapp-icon="1"]').forEach((node) => {
      node.remove();
    });

    // Always rewrite icon nodes, don't hide Instagram under an overlay.
    const replaced = replaceIconNodesWithWhatsApp(anchor);
    if (!replaced) {
      appendFallbackWhatsAppIcon(anchor);
    }

    // Normalize color so the rewritten SVG follows the existing maroon icon tone.
    if (!anchor.style.color) {
      anchor.style.color = "#3a001a";
    }
  }

  function patchFallbackBottomMenuSocial() {
    const menu = findBottomMenuContainer();
    if (!(menu instanceof HTMLElement)) {
      return;
    }

    const menuRect = menu.getBoundingClientRect();
    const anchors = Array.from(menu.querySelectorAll("a"))
      .filter((node) => node instanceof HTMLAnchorElement);

    if (anchors.length === 0) {
      return;
    }

    const directSocialCandidates = anchors
      .filter((anchor) => isLikelyBottomMenuSocialAnchor(anchor, menuRect));
    if (directSocialCandidates.length > 0) {
      directSocialCandidates.forEach((anchor) => patchWhatsAppLink(anchor));
      return;
    }

    const instagramCandidate = anchors.find((anchor) => isInstagramLink(anchor));
    if (instagramCandidate) {
      patchWhatsAppLink(instagramCandidate);
      return;
    }

    const ranked = anchors
      .map((anchor) => ({
        anchor,
        rect: anchor.getBoundingClientRect(),
        href: (anchor.getAttribute("href") || "").toLowerCase(),
        text: normalize(anchor.textContent || "")
      }))
      .filter(({ rect }) => rect.width > 10 && rect.height > 10)
      .filter(({ href }) => !href.includes(SETTINGS.targetPath))
      .filter(({ text, href }) => {
        if (text.includes("confirm") || text.includes("vote") || text.includes("early access")) {
          return false;
        }
        if (text.includes("intro") || text.includes("about") || text.includes("subject") || text.includes("colour") || text.includes("color")) {
          return false;
        }
        if (text.includes("american medical board") || text.includes("vitra")) {
          return false;
        }
        if (href.includes("wa.me")) {
          return true;
        }
        return true;
      });

    const rightHalf = ranked
      .filter(({ rect }) => rect.left + rect.width / 2 >= menuRect.left + menuRect.width * 0.5)
      .sort((a, b) => {
        const aArea = a.rect.width * a.rect.height;
        const bArea = b.rect.width * b.rect.height;
        if (bArea !== aArea) {
          return bArea - aArea;
        }
        return b.rect.left - a.rect.left;
      });

    const socialSlot = (rightHalf[0] || ranked
      .sort((a, b) => {
        const aArea = a.rect.width * a.rect.height;
        const bArea = b.rect.width * b.rect.height;
        if (bArea !== aArea) {
          return bArea - aArea;
        }
        return b.rect.left - a.rect.left;
      })[0])?.anchor;

    if (socialSlot) {
      patchWhatsAppLink(socialSlot);
    }
  }

  function patchSocialLinks() {
    const menu = findBottomMenuContainer();
    const menuRect = menu instanceof HTMLElement ? menu.getBoundingClientRect() : null;
    document.querySelectorAll("a").forEach((node) => {
      const href = (node.getAttribute("href") || "").toLowerCase();
      if (isInstagramLink(node) || href.includes("wa.me/17867786843") || isLikelyBottomMenuSocialAnchor(node, menuRect)) {
        patchWhatsAppLink(node);
      }
    });
    patchFallbackBottomMenuSocial();
  }

  function runPatchOnce() {
    document.querySelectorAll(`${INTRO_ROOT_SELECTOR} a, ${INTRO_ROOT_SELECTOR} button, ${INTRO_ROOT_SELECTOR} [role='button']`).forEach((node) => {
      replaceLabelOnce(node);
    });
    document.querySelectorAll(
      `${INTRO_ROOT_SELECTOR} a[data-highlight="true"], ${INTRO_ROOT_SELECTOR} button[data-highlight="true"], ${INTRO_ROOT_SELECTOR} [role='button'][data-highlight='true']`
    ).forEach((node) => {
      patchCtaActionElement(node);
    });

    patchVoteLabelsEverywhere();
    patchSubjectsLabelEverywhere();
    patchColorTitleLabelsEverywhere();
    ensureRealtimeCountdownTicker();
    ensureMobileTopBar();
    nudgeMobileStoriesLineBelowTopBar();
    applyStickyMobileBottomMenu();

    // Ensure legacy highlighted pickcolor anchors always navigate to /confirm.
    document.querySelectorAll(
      "a[data-highlight='true'][href*='#pickcolor'], a[data-highlight='true'][href*='pickcolor-container']"
    ).forEach((node) => {
      forceConfirmHref(node);
    });

    patchBrandLogos();
    patchSocialLinks();
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
      SETTINGS.acceptedLabels = Array.from(new Set([...SETTINGS.acceptedLabels, ...nextAccepted]));
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
    window.setTimeout(applyAll, 500);
    window.setTimeout(applyAll, 1500);
    window.setTimeout(runPatchOnce, 2200);
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

  function isFormCtaElement(element) {
    return isPrimaryConfirmCtaElement(element);
  }

  document.addEventListener(
    "click",
    (event) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      // Framer swaps nav variants on tap; force an immediate re-patch burst.
      window.setTimeout(runPatchOnce, 0);
      window.setTimeout(runPatchOnce, 120);
      window.setTimeout(runPatchOnce, 360);

      const actionElement = target.closest("a,button,[role='button']");
      if (!actionElement) {
        return;
      }
      if (!isFormCtaElement(actionElement)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();
      forceConfirmHref(actionElement);
      redirectTop();
    },
    true
  );

  let patchScheduled = false;
  function schedulePatch() {
    if (patchScheduled) {
      return;
    }
    patchScheduled = true;
    window.requestAnimationFrame(() => {
      patchScheduled = false;
      runPatchOnce();
    });
  }

  const mutationObserver = new MutationObserver(() => {
    schedulePatch();
  });

  function startMutationObserver() {
    if (!(document.body instanceof HTMLElement)) {
      return;
    }
    mutationObserver.observe(document.body, {
      subtree: true,
      childList: true,
      characterData: true
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      runPatchOnce();
      applyLegacyCopyAdapter();
      startMutationObserver();
    }, { once: true });
  } else {
    runPatchOnce();
    applyLegacyCopyAdapter();
    startMutationObserver();
  }

  window.setTimeout(runPatchOnce, 500);
  window.setTimeout(runPatchOnce, 1500);
  window.setTimeout(runPatchOnce, 3000);
  window.setTimeout(runPatchOnce, 4500);
  window.setInterval(runPatchOnce, 1500);
  window.addEventListener("hashchange", runPatchOnce, { passive: true });
  window.addEventListener("popstate", runPatchOnce, { passive: true });
  window.addEventListener("pageshow", runPatchOnce, { passive: true });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      runPatchOnce();
    }
  });
  window.addEventListener("resize", runPatchOnce, { passive: true });
  window.addEventListener("orientationchange", runPatchOnce, { passive: true });
})();
