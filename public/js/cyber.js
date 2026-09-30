const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const hasFinePointer = window.matchMedia("(pointer: fine)").matches;

// Navbar scroll effect
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

const fadeElements = document.querySelectorAll(".fade-in");
if (!prefersReducedMotion) {
  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("visible");
      });
    },
    { threshold: 0.2 }
  );
  fadeElements.forEach((element) => fadeObserver.observe(element));
} else {
  fadeElements.forEach((element) => element.classList.add("visible"));
}

const navLinks = Array.from(document.querySelectorAll(".navbar-nav .nav-link"));
const sections = navLinks
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

const setActiveLink = (id) => {
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === id);
  });
};

const updateActiveLink = () => {
  const offset = window.innerHeight * 0.28;
  const scrollPos = window.scrollY + offset;
  let currentId = sections[0] ? `#${sections[0].id}` : "";

  sections.forEach((section) => {
    if (scrollPos >= section.offsetTop) {
      currentId = `#${section.id}`;
    }
  });

  setActiveLink(currentId);
};

window.addEventListener("scroll", updateActiveLink);
window.addEventListener("load", updateActiveLink);
window.addEventListener("resize", updateActiveLink);

navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    setActiveLink(link.getAttribute("href"));
    
    // Close mobile menu if open
    const navbarCollapse = document.querySelector('.navbar-collapse');
    if (navbarCollapse.classList.contains('show')) {
      const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
      if (bsCollapse) {
        bsCollapse.hide();
      } else {
        // Fallback for older bootstrap versions or if instance is not found
        navbarCollapse.classList.remove('show');
      }
    }
  });
});

// Progress bars
const progressBars = document.querySelectorAll(".progress-bar");
if (progressBars.length) {
  if (prefersReducedMotion) {
    progressBars.forEach((bar) => {
      const target = bar.dataset.progress || 0;
      bar.style.width = `${target}%`;
    });
  } else {
    const progressObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const bar = entry.target;
            const target = bar.dataset.progress || 0;
            bar.style.width = `${target}%`;
            bar.classList.add("filled");
            observer.unobserve(bar);
          }
        });
      },
      { threshold: 0.4 }
    );
    progressBars.forEach((bar) => progressObserver.observe(bar));
  }
}

// Custom animations
const animatedElements = document.querySelectorAll("[data-animate]");
if (animatedElements.length) {
  if (prefersReducedMotion) {
    animatedElements.forEach((el) => el.classList.add("animated"));
  } else {
    const animateObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animated");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2, rootMargin: "0px 0px -40px 0px" }
    );
    animatedElements.forEach((el) => animateObserver.observe(el));
  }
}

// Parallax photo
const parallaxTargets = document.querySelectorAll("[data-parallax]");
if (!prefersReducedMotion && hasFinePointer && parallaxTargets.length) {
  window.addEventListener("mousemove", (event) => {
    const x = event.clientX / window.innerWidth - 0.5;
    const y = event.clientY / window.innerHeight - 0.5;
    parallaxTargets.forEach((target) => {
      const intensity = parseFloat(target.dataset.parallax) || 18;
      const translateX = -(x * intensity);
      const translateY = -(y * intensity);
      target.style.transform = `translate3d(${translateX}px, ${translateY}px, 0)`;
    });
  });
}

// Certifications carousel: infinite marquee (rightward loop) + prev/next + pause
const certCarousel = document.getElementById("certCarousel");
const certPrev = document.getElementById("certPrev");
const certNext = document.getElementById("certNext");
const certPlayPause = document.getElementById("certPlayPause");

if (certCarousel && certPrev && certNext && certPlayPause) {
  const playIcon = "fas fa-play";
  const pauseIcon = "fas fa-pause";
  const icon = certPlayPause.querySelector("i");
  const SPEED_PX_S = 45;
  let playing = !prefersReducedMotion;
  let hovering = false;
  let programmatic = false;

  // Duplicate cards once for a seamless infinite loop
  Array.from(certCarousel.children).forEach((card) => {
    const clone = card.cloneNode(true);
    clone.setAttribute("aria-hidden", "true");
    clone.removeAttribute("data-animate");
    certCarousel.appendChild(clone);
  });

  const halfWidth = () => certCarousel.scrollWidth / 2;
  const norm = (value) => {
    const width = halfWidth();
    if (!width) return 0;
    return ((value % width) + width) % width;
  };
  let pos = 0;
  certCarousel.scrollLeft = 0;

  const cardStep = () => {
    const card = certCarousel.querySelector(".cert-card");
    return card ? card.getBoundingClientRect().width + 24 : 380;
  };

  const goNext = () => {
    pos = norm(pos + cardStep());
    programmatic = true;
    certCarousel.scrollLeft = pos;
  };

  const goPrev = () => {
    pos = norm(pos - cardStep());
    programmatic = true;
    certCarousel.scrollLeft = pos;
  };

  const setPlaying = (value) => {
    playing = value;
    if (icon) icon.className = playing ? pauseIcon : playIcon;
    certPlayPause.setAttribute("aria-label", playing ? "Pausar carrusel de certificaciones" : "Reanudar carrusel de certificaciones");
  };

  // Adopt manual drags so the loop resumes from where the user left it
  certCarousel.addEventListener("scroll", () => {
    if (programmatic) {
      programmatic = false;
      return;
    }
    pos = norm(certCarousel.scrollLeft);
  });

  certNext.addEventListener("click", goNext);
  certPrev.addEventListener("click", goPrev);
  certPlayPause.addEventListener("click", () => setPlaying(!playing));

  certCarousel.addEventListener("pointerenter", () => { hovering = true; });
  certCarousel.addEventListener("pointerleave", () => { hovering = false; });
  certCarousel.addEventListener("focusin", () => { hovering = true; });
  certCarousel.addEventListener("focusout", () => { hovering = false; });

  setPlaying(playing);

  // Continuous motion: cards travel left -> right, wrapping seamlessly
  let lastTime = performance.now();
  const tick = (now) => {
    const delta = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    if (playing && !hovering && !document.hidden && halfWidth() > 0) {
      pos = norm(pos - SPEED_PX_S * delta);
      programmatic = true;
      certCarousel.scrollLeft = pos;
    }
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// Tilt effect for cards
const tiltCards = document.querySelectorAll("[data-tilt]");
if (!prefersReducedMotion && hasFinePointer && tiltCards.length) {
  tiltCards.forEach((card) => {
    const maxTilt = parseFloat(card.dataset.tilt) || 6;
    card.addEventListener("mousemove", (event) => {
      const bounds = card.getBoundingClientRect();
      const relativeX = (event.clientX - bounds.left) / bounds.width - 0.5;
      const relativeY = (event.clientY - bounds.top) / bounds.height - 0.5;
      const rotateY = relativeX * maxTilt;
      const rotateX = -relativeY * maxTilt;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "";
    });
  });
}
