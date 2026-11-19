document.addEventListener("DOMContentLoaded", () => {
  /* =====================================================
     CONFIGURABLE HOLD DURATION (Modify freely)
     ===================================================== */
  const HOLD_DURATION_MS = 250;

  const loaderScreen = document.getElementById("loader-screen");
  const breezeContainer = document.getElementById("paper-breeze-container");
  const appViewport = document.getElementById("app-viewport");
  const scaleWrapper = document.getElementById("scale-wrapper");
  const bookStack = document.getElementById("book-stack");
  const pages = Array.from(document.querySelectorAll(".page"));

  const holdIndicator = document.getElementById("hold-indicator");
  const brushStroke = document.querySelector(".brush-ring__stroke");
  const BRUSH_CIRCUMFERENCE = 2 * Math.PI * 27; // 169.65

  const downloadPdfBtn = document.getElementById("download-pdf-btn");
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const fsIconExpand = document.getElementById("fs-icon-expand");
  const fsIconCompress = document.getElementById("fs-icon-compress");
  const fsLabel = document.getElementById("fs-label");

  const BASE_PAGE_WIDTH = 794;
  const BASE_PAGE_HEIGHT = 1080;

  let currentPageIndex = 0;
  let isHolding = false;
  let isAnimating = false;
  let holdStartTime = 0;
  let rafId = null;

  /* =====================================================
     1. RESPONSIVE VIEWPORT FIT (NO SCROLL)
     ===================================================== */
  function fitResumeToWindow() {
    const paddingX = 32;
    const paddingY = 104; // Clearance for top controls & bottom-right credits

    const availWidth = window.innerWidth - paddingX;
    const availHeight = window.innerHeight - paddingY;

    const scaleX = availWidth / BASE_PAGE_WIDTH;
    const scaleY = availHeight / BASE_PAGE_HEIGHT;
    const scale = Math.min(scaleX, scaleY, 1.05);

    scaleWrapper.style.transform = `scale(${scale})`;
  }

  window.addEventListener("resize", fitResumeToWindow);
  fitResumeToWindow();

  /* =====================================================
     2. CONTINUOUS RANDOM PAPER BREEZE (2 SECONDS)
     ===================================================== */
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  function initFullWindowPaperBreeze() {
    const paperCount = 34;

    for (let i = 0; i < paperCount; i++) {
      const sheet = document.createElement("div");
      sheet.className = "flying-paper";

      const startY = randomBetween(-12, 96);
      const endY = startY + randomBetween(-22, 22);

      const scale = randomBetween(0.75, 1.35);
      const startZ = randomBetween(-180, 140);
      const endZ = randomBetween(-140, 200);

      const rotXStart = randomBetween(-25, 25);
      const rotXEnd = rotXStart + randomBetween(-120, 120);
      const rotYStart = randomBetween(-30, 30);
      const rotYEnd = rotYStart + randomBetween(90, 220);
      const rotZStart = randomBetween(-28, 28);
      const rotZEnd = rotZStart + randomBetween(-45, 75);

      const duration = randomBetween(1.15, 1.65);
      const delay = randomBetween(0, 0.75);

      sheet.style.width = `${220 * scale}px`;
      sheet.style.height = `${300 * scale}px`;
      sheet.style.zIndex = Math.floor(randomBetween(1, 30));

      sheet.style.setProperty("--start-y", `${startY}vh`);
      sheet.style.setProperty("--end-y", `${endY}vh`);
      sheet.style.setProperty("--start-z", `${startZ}px`);
      sheet.style.setProperty("--end-z", `${endZ}px`);
      sheet.style.setProperty("--rot-x-start", `${rotXStart}deg`);
      sheet.style.setProperty("--rot-x-end", `${rotXEnd}deg`);
      sheet.style.setProperty("--rot-y-start", `${rotYStart}deg`);
      sheet.style.setProperty("--rot-y-end", `${rotYEnd}deg`);
      sheet.style.setProperty("--rot-z-start", `${rotZStart}deg`);
      sheet.style.setProperty("--rot-z-end", `${rotZEnd}deg`);
      sheet.style.setProperty("--duration", `${duration}s`);
      sheet.style.setProperty("--delay", `${delay}s`);

      sheet.style.transform = `translate3d(-380px, ${startY}vh, ${startZ}px)`;

      breezeContainer.appendChild(sheet);
    }

    setTimeout(() => {
      loaderScreen.classList.add("fade-out");
      appViewport.classList.remove("hidden");
      fitResumeToWindow();
      updatePageStackClasses();
    }, 2000);
  }

  /* =====================================================
     3. PAGE STACK & TACTILE LIFT-AND-TUCK FLIP
     ===================================================== */
  function updatePageStackClasses() {
    pages.forEach((page, index) => {
      page.classList.remove("active", "next-up", "queued", "flipped", "flipping-out", "returning");
      page.style.removeProperty("--fan-x");
      page.style.removeProperty("--fan-y");
      page.style.removeProperty("--fan-rot");
      page.style.removeProperty("--rest-x");
      page.style.removeProperty("--rest-y");
      page.style.removeProperty("--rest-scale");

      if (index < currentPageIndex) {
        page.classList.add("flipped");
      } else if (index === currentPageIndex) {
        page.classList.add("active");
      } else if (index === currentPageIndex + 1) {
        page.classList.add("next-up");
      } else {
        page.classList.add("queued");
      }
    });
  }

  function advancePage() {
    if (isAnimating) return;
    isAnimating = true;

    const currentPage = pages[currentPageIndex];
    const nextIndex = (currentPageIndex + 1) % pages.length;
    const isLastPage = currentPageIndex === pages.length - 1;

    // Pre-stage the incoming sheet right underneath so it's visible as the top page lifts away
    if (isLastPage) {
      pages[0].classList.remove("flipped");
      pages[0].classList.add("next-up");
    }

    currentPage.classList.add("flipping-out");

    setTimeout(() => {
      if (!isLastPage) {
        currentPageIndex = nextIndex;
        updatePageStackClasses();
        isAnimating = false;
      } else {
        resetPagesInOrder();
      }
    }, 900); // Matches clearAndTuck duration
  }

  function resetPagesInOrder() {
    currentPageIndex = 0;

    // Fan all sheets out slightly to the right and square them back cleanly onto the desk
    pages.forEach((page, idx) => {
      page.classList.remove("flipped", "flipping-out", "queued", "next-up", "active");
      page.style.zIndex = pages.length - idx;

      const spread = (idx + 1) * 26;
      page.style.setProperty("--fan-x", `${spread}px`);
      page.style.setProperty("--fan-y", `${-idx * 6}px`);
      page.style.setProperty("--fan-rot", `${(idx + 1) * 2.2}deg`);
      page.style.setProperty("--rest-x", `${-idx * 3}px`);
      page.style.setProperty("--rest-y", `${idx * 3}px`);
      page.style.setProperty("--rest-scale", `${1 - idx * 0.009}`);

      // Trigger reflow so the fan animation plays cleanly
      void page.offsetWidth;
      page.classList.add("returning");
    });

    setTimeout(() => {
      pages.forEach((p) => {
        p.style.zIndex = "";
      });
      updatePageStackClasses();
      isAnimating = false;
    }, 750);
  }

  /* =====================================================
     4. CLICK-AND-HOLD & GREEN PAINT-BRUSH PROGRESS
     ===================================================== */
  function positionIndicator(x, y) {
    holdIndicator.style.left = `${x}px`;
    holdIndicator.style.top = `${y}px`;
  }

  function startHold(e) {
    if (e.button !== undefined && e.button !== 0) return;
    if (isAnimating) return;

    isHolding = true;
    holdStartTime = performance.now();

    positionIndicator(e.clientX, e.clientY);
    holdIndicator.classList.add("visible");

    function updateProgress(now) {
      if (!isHolding) return;

      const elapsed = now - holdStartTime;
      const progress = Math.min(elapsed / HOLD_DURATION_MS, 1);
      const offset = BRUSH_CIRCUMFERENCE * (1 - progress);

      brushStroke.style.strokeDashoffset = offset;

      if (progress >= 1) {
        cancelHold();
        advancePage();
      } else {
        rafId = requestAnimationFrame(updateProgress);
      }
    }

    rafId = requestAnimationFrame(updateProgress);
  }

  function moveHold(e) {
    if (!isHolding) return;
    positionIndicator(e.clientX, e.clientY);
  }

  function cancelHold() {
    isHolding = false;
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    holdIndicator.classList.remove("visible");
    brushStroke.style.strokeDashoffset = BRUSH_CIRCUMFERENCE;
  }

  bookStack.addEventListener("pointerdown", startHold);
  window.addEventListener("pointermove", moveHold);
  window.addEventListener("pointerup", cancelHold);
  window.addEventListener("pointercancel", cancelHold);

  /* =====================================================
     5. DOWNLOAD PDF & FULLSCREEN CONTROLS
     ===================================================== */
  downloadPdfBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    window.print();
  });

  function updateFullscreenUI() {
    const isFullscreen = Boolean(document.fullscreenElement);
    fsIconExpand.classList.toggle("hidden-icon", isFullscreen);
    fsIconCompress.classList.toggle("hidden-icon", !isFullscreen);
    fsLabel.textContent = isFullscreen ? "Exit Fullscreen" : "Fullscreen";
    setTimeout(fitResumeToWindow, 50);
  }

  fullscreenBtn.addEventListener("click", async (e) => {
    e.stopPropagation();
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (err) {
      console.warn("Fullscreen request denied or unsupported:", err);
    }
  });

  document.addEventListener("fullscreenchange", updateFullscreenUI);

  initFullWindowPaperBreeze();
});