"use strict";

document.documentElement.classList.add("js-enabled");

/* =========================================================
   MARTIAL ARTS KARATE ACADEMY — NIT HAMIRPUR
   MAIN FRONTEND JAVASCRIPT

   01. DOMContentLoaded init
   02. Scroll reveal animations (staggered)
   03. Achievement counters
   04. Image loading
   05. Gallery lightbox
   06. Contact form
   07. Back-to-top button
   08. Smooth anchor scrolling
   09. Marquee duplication (infinite scroll)
   10. Utility helpers
========================================================= */


/* =========================================================
   01. DOM READY
========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    initRevealAnimations();
    initCounters();
    initImageLoading();
    initGallery();
    initContactForm();
    initBackToTop();
    initSmoothAnchors();
    initMarquees();
    initParallax();
});


/* =========================================================
   02. REVEAL ANIMATIONS
   Elements with class "reveal" fade+slide in on viewport entry.
   Supports data-delay="100|200|300..." for stagger.
========================================================= */

function initRevealAnimations() {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    const revealEls = document.querySelectorAll(".reveal");

    if (!revealEls.length) return;

    if (prefersReducedMotion) {
        revealEls.forEach(el => el.classList.add("revealed"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;

                const el    = entry.target;
                const delay = parseInt(el.dataset.delay || "0", 10);

                setTimeout(() => el.classList.add("revealed"), delay);

                observer.unobserve(el);
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    revealEls.forEach(el => observer.observe(el));
}


/* =========================================================
   03. ACHIEVEMENT COUNTERS
   Uses IntersectionObserver to trigger animated count-up
   when .achievement-stats enters the viewport.
========================================================= */

function initCounters() {
    const counters = document.querySelectorAll("[data-counter]");
    if (!counters.length) return;

    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
        counters.forEach(c => showFinalValue(c));
        return;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (!entry.isIntersecting) return;
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            });
        },
        { threshold: 0.4 }
    );

    counters.forEach(c => observer.observe(c));
}

function animateCounter(el) {
    const target   = Number(el.dataset.counter);
    const duration = Number(el.dataset.duration) || 2000;
    const startTime = performance.now();

    if (!Number.isFinite(target)) return;

    function tick(now) {
        const elapsed  = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased    = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        const current  = Math.floor(target * eased);

        renderCounterValue(el, current);

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            renderCounterValue(el, target);
        }
    }

    requestAnimationFrame(tick);
}

function showFinalValue(el) {
    renderCounterValue(el, Number(el.dataset.counter));
}

function renderCounterValue(el, value) {
    const suffix = el.dataset.suffix || "";
    const prefix = el.dataset.prefix || "";
    el.textContent = `${prefix}${Number.isFinite(value) ? value.toLocaleString("en-IN") : value}${suffix}`;
}


/* =========================================================
   04. IMAGE LOADING
   Adds .loaded / .load-error classes for CSS transitions.
========================================================= */

function initImageLoading() {
    document.querySelectorAll("img").forEach(img => {
        if (img.complete && img.naturalWidth > 0) {
            img.classList.add("loaded");
            return;
        }
        img.addEventListener("load", () => img.classList.add("loaded"), { once: true });
        img.addEventListener("error", () => img.classList.add("load-error"), { once: true });
    });
}


/* =========================================================
   05. GALLERY LIGHTBOX
   Click any .gallery-item img to open a fullscreen viewer.
   Close with ×, Escape key, or clicking the backdrop.
========================================================= */

function initGallery() {
    const galleryImgs = document.querySelectorAll(".gallery-item img");
    if (!galleryImgs.length) return;

    // Build lightbox
    const lightbox = createLightbox();

    galleryImgs.forEach(img => {
        img.setAttribute("tabindex", "0");
        img.setAttribute("role", "button");
        img.setAttribute("aria-label", `View ${img.alt || "image"} in fullscreen`);

        img.addEventListener("click", () => openLightbox(lightbox, img));
        img.addEventListener("keydown", e => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openLightbox(lightbox, img);
            }
        });
    });
}

function createLightbox() {
    const lb = document.createElement("div");
    lb.id        = "gallery-viewer";
    lb.className = "gallery-viewer";
    lb.setAttribute("role", "dialog");
    lb.setAttribute("aria-modal", "true");
    lb.setAttribute("aria-label", "Image viewer");

    lb.innerHTML = `
        <button
            type="button"
            class="gallery-viewer-close"
            aria-label="Close image viewer"
        >×</button>
        <div class="gallery-viewer-content">
            <img
                src=""
                alt=""
                class="gallery-viewer-image"
            >
        </div>
    `;

    document.body.appendChild(lb);

    // Close via button
    lb.querySelector(".gallery-viewer-close").addEventListener("click", () => closeLightbox(lb));

    // Close via backdrop click
    lb.addEventListener("click", e => {
        if (e.target === lb) closeLightbox(lb);
    });

    // Close via Escape
    document.addEventListener("keydown", e => {
        if (e.key === "Escape" && lb.classList.contains("open")) closeLightbox(lb);
    });

    return lb;
}

function openLightbox(lb, img) {
    const viewerImg = lb.querySelector(".gallery-viewer-image");
    viewerImg.src   = img.currentSrc || img.src;
    viewerImg.alt   = img.alt || "";
    lb.classList.add("open");
    document.body.classList.add("gallery-open");

    // Focus the close button for keyboard accessibility
    setTimeout(() => lb.querySelector(".gallery-viewer-close").focus(), 50);
}

function closeLightbox(lb) {
    lb.classList.remove("open");
    document.body.classList.remove("gallery-open");
}


/* =========================================================
   06. CONTACT FORM
   Posts to /api/contact (JSON).
   Shows success / error status message.
========================================================= */

function initContactForm() {
    const form   = document.getElementById("contact-form");
    const status = document.getElementById("form-status");
    const submit = document.getElementById("contact-submit");

    if (!form) return;

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        // Simple validation
        const data = {
            name:    form.name?.value.trim(),
            email:   form.email?.value.trim(),
            subject: form.subject?.value.trim(),
            message: form.message?.value.trim(),
        };

        if (!data.name || !data.email || !data.message) {
            showStatus(status, "error", "Please fill in all required fields.");
            return;
        }

        if (!isValidEmail(data.email)) {
            showStatus(status, "error", "Please enter a valid email address.");
            return;
        }

        setSubmitting(submit, true);
        clearStatus(status);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                showStatus(status, "success", "✓ Your message has been sent! We'll get back to you soon.");
                form.reset();
            } else {
                const body = await res.json().catch(() => ({}));
                showStatus(status, "error", body.message || "Something went wrong. Please try again.");
            }
        } catch {
            showStatus(status, "error", "Network error — please check your connection and try again.");
        } finally {
            setSubmitting(submit, false);
        }
    });
}

function setSubmitting(btn, loading) {
    if (!btn) return;
    btn.disabled     = loading;
    btn.textContent  = loading ? "Sending…" : "Send Message";
}

function showStatus(el, type, msg) {
    if (!el) return;
    el.className    = `form-status ${type}`;
    el.textContent  = msg;
    el.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function clearStatus(el) {
    if (!el) return;
    el.className   = "form-status";
    el.textContent = "";
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


/* =========================================================
   07. BACK-TO-TOP BUTTON
   Shows after scrolling 400px, smooth-scrolls to top.
========================================================= */

function initBackToTop() {
    const btn = document.getElementById("back-to-top");
    if (!btn) return;

    const toggleVisibility = () => {
        if (window.scrollY > 400) {
            btn.classList.add("visible");
        } else {
            btn.classList.remove("visible");
        }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });

    btn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });

    toggleVisibility(); // Initial check
}


/* =========================================================
   08. SMOOTH ANCHOR SCROLLING
   Offsets scroll by header height so sections aren't hidden.
========================================================= */

function initSmoothAnchors() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener("click", (e) => {
            const id = anchor.getAttribute("href");
            if (id === "#" || !id) return;

            const target = document.querySelector(id);
            if (!target) return;

            e.preventDefault();

            const headerH = parseInt(
                getComputedStyle(document.documentElement).getPropertyValue("--header-height") || "76",
                10
            );

            const top = target.getBoundingClientRect().top + window.scrollY - headerH;
            window.scrollTo({ top, behavior: "smooth" });

            // Close mobile nav if open
            const nav    = document.getElementById("navigation");
            const toggle = document.getElementById("menu-toggle");
            if (nav && nav.classList.contains("open")) {
                nav.classList.remove("open");
                toggle?.setAttribute("aria-expanded", "false");
                document.body.classList.remove("menu-open");
            }
        });
    });
}


/* =========================================================
   09. MARQUEE DUPLICATION
   Doubles each marquee track's content so the animation
   loops seamlessly even with few cards.
========================================================= */

function initMarquees() {
    document.querySelectorAll(".cadet-marquee-track").forEach(track => {
        /*
          Clone exactly once so the track has 2 identical sets.
          The CSS animation translates from 0 to -50% and loops —
          this creates a seamless infinite scroll with no visible
          repeating of the same person.
        */
        const children = Array.from(track.children);
        children.forEach(child => {
            track.appendChild(child.cloneNode(true));
        });
    });
}


/* =========================================================
   10. SUBTLE PARALLAX ON HERO IMAGE
   Moves the hero image slightly as user scrolls.
   Disabled for reduced-motion users.
========================================================= */

function initParallax() {
    const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) return;

    const heroImg = document.querySelector(".hero-image");
    if (!heroImg) return;

    let ticking = false;

    window.addEventListener("scroll", () => {
        if (ticking) return;
        ticking = true;

        requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            const max     = document.querySelector(".hero-section")?.offsetHeight || 600;

            if (scrollY <= max) {
                const offset = scrollY * 0.12;
                heroImg.style.transform = `scale(1) translateY(${offset}px)`;
            }

            ticking = false;
        });
    }, { passive: true });
}