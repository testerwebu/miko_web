const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const motionModuleUrl = "https://cdn.jsdelivr.net/npm/motion@12/+esm";

const easeOut = [0.16, 1, 0.3, 1];

const revealTargets = [
  ".problems .section-head",
  ".problem-list p",
  ".services .section-head",
  ".service-card",
  ".about > *",
  ".team > img",
  ".trusted > *",
  ".portfolio .section-head",
  ".project-card",
  ".process .section-head",
  ".process-cards article",
  ".reviews-head > *",
  ".review-card",
  ".faq > *",
  ".booking .section-head",
  ".booking img",
  ".footer-inner > *"
].join(",");

function setInitialRevealStyles(elements) {
  elements.forEach((element) => {
    element.style.opacity = "0";
    element.style.transform = "translateY(28px)";
    element.style.willChange = "opacity, transform";
  });
}

function clearMotionStyles(element) {
  element.style.willChange = "";
}

function afterAnimation(animation, callback, fallbackDelay = 800) {
  if (animation && animation.finished && typeof animation.finished.then === "function") {
    animation.finished.then(callback);
    return;
  }

  window.setTimeout(callback, fallbackDelay);
}

function animateTicker(animate) {
  const ticker = document.querySelector(".ticker");

  if (!ticker) {
    return;
  }

  animate(
    ticker,
    { backgroundColor: ["#c0d8d7", "#d4e7e5", "#c0d8d7"] },
    { duration: 5.5, repeat: Infinity, easing: "ease-in-out" }
  );
}

function animateLoopingStrip(animate, selector, duration) {
  const strip = document.querySelector(selector);

  if (!strip) {
    return;
  }

  animate(
    strip,
    { x: ["0%", "-50%"] },
    { duration, repeat: Infinity, easing: "linear" }
  );
}

function animateMarquee(animate) {
  const marquee = document.querySelector(".big-marquee");

  if (!marquee) {
    return;
  }

  animate(
    marquee,
    { x: ["0%", "-18%"] },
    { duration: 18, repeat: Infinity, easing: "linear" }
  );
}

function animateStatCounter(animate, inView) {
  const counter = document.querySelector("[data-count-to]");

  if (!counter) {
    return;
  }

  const target = Number(counter.dataset.countTo);

  if (!Number.isFinite(target)) {
    return;
  }

  counter.textContent = "0";

  inView(
    counter,
    () => {
      animate(0, target, {
        duration: 2.1,
        easing: [0.22, 1, 0.36, 1],
        onUpdate: (latest) => {
          counter.textContent = Math.round(latest).toString();
        }
      });
    },
    { amount: 0.8 }
  );
}

function bindInteractiveMotion(animate, hover, press) {
  document.querySelectorAll(".pill, .service-card a, .footer-main > a:last-child").forEach((element) => {
    hover(element, () => {
      animate(element, { y: -2, scale: 1.025 }, { duration: 0.28, easing: easeOut });

      return () => animate(element, { y: 0, scale: 1 }, { duration: 0.24, easing: easeOut });
    });

    press(element, () => {
      animate(element, { scale: 0.97 }, { duration: 0.12 });

      return () => animate(element, { scale: 1 }, { duration: 0.18, easing: easeOut });
    });
  });

  document.querySelectorAll(".service-card, .process-cards article, .review-card, .project-card").forEach((element) => {
    hover(element, () => {
      animate(element, { y: -8 }, { duration: 0.32, easing: easeOut });

      return () => animate(element, { y: 0 }, { duration: 0.28, easing: easeOut });
    });
  });

  document.querySelectorAll(".arrows button, .socials span").forEach((element) => {
    hover(element, () => {
      animate(element, { scale: 1.08, rotate: 2 }, { duration: 0.22, easing: easeOut });

      return () => animate(element, { scale: 1, rotate: 0 }, { duration: 0.2, easing: easeOut });
    });
  });
}

async function initMotion() {
  if (prefersReducedMotion) {
    return;
  }

  const { animate, inView, hover, press, stagger } = await import(motionModuleUrl);

  const revealElements = Array.from(document.querySelectorAll(revealTargets));
  setInitialRevealStyles(revealElements);

  animate(
    ".site-header",
    { opacity: [0, 1], y: [-18, 0] },
    { duration: 0.65, easing: easeOut }
  );

  const heroSequence = [
    document.querySelector(".hero-copy h1"),
    document.querySelector(".hero-copy p"),
    document.querySelector(".hero-actions"),
    document.querySelector(".hero-image")
  ].filter(Boolean);

  animate(
    heroSequence,
    { opacity: [0, 1], y: [34, 0], filter: ["blur(8px)", "blur(0px)"] },
    { delay: stagger(0.1, { start: 0.16 }), duration: 0.8, easing: easeOut }
  );

  inView(
    revealTargets,
    (element) => {
      const animation = animate(
        element,
        { opacity: 1, y: 0 },
        { duration: 0.72, easing: easeOut }
      );

      afterAnimation(animation, () => clearMotionStyles(element));
    },
    { amount: 0.2, margin: "0px 0px -80px 0px" }
  );

  animateTicker(animate);
  animateLoopingStrip(animate, ".ticker-strip", 24);
  animateLoopingStrip(animate, ".logos-strip", 30);
  animateMarquee(animate);
  animateStatCounter(animate, inView);
  bindInteractiveMotion(animate, hover, press);
}

initMotion().catch(() => {
  document.querySelectorAll(revealTargets).forEach((element) => {
    element.style.opacity = "";
    element.style.transform = "";
    element.style.willChange = "";
  });
});
