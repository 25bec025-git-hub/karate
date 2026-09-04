"use strict";

/* =========================================================
   HEADER — Navigation & Scroll Behavior
   NIT Hamirpur Karate Academy
========================================================= */

const menuToggle = document.querySelector("#menu-toggle");
const navWrapper = document.querySelector("#navigation");
const navLinks   = document.querySelectorAll(".nav-link");
const siteHeader = document.querySelector("#site-header");


/* =========================================================
   MOBILE MENU OPEN
========================================================= */

function openMenu() {
    navWrapper.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation menu");
    document.body.classList.add("menu-open");
}


/* =========================================================
   MOBILE MENU CLOSE
========================================================= */

function closeMenu() {
    navWrapper.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation menu");
    document.body.classList.remove("menu-open");
}


/* =========================================================
   TOGGLE
========================================================= */

function toggleMenu() {
    if (navWrapper.classList.contains("open")) {
        closeMenu();
    } else {
        openMenu();
    }
}


/* =========================================================
   EVENT LISTENERS
========================================================= */

menuToggle.addEventListener("click", toggleMenu);

navLinks.forEach(link => link.addEventListener("click", closeMenu));

// Escape key closes menu
document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeMenu();
});

// Click outside closes menu
document.addEventListener("click", e => {
    if (!navWrapper.classList.contains("open")) return;
    if (!navWrapper.contains(e.target) && !menuToggle.contains(e.target)) {
        closeMenu();
    }
});


/* =========================================================
   SCROLL — Header "scrolled" class & active nav link
========================================================= */

function onScroll() {
    // Add/remove "scrolled" class on header
    if (window.scrollY > 30) {
        siteHeader.classList.add("scrolled");
    } else {
        siteHeader.classList.remove("scrolled");
    }

    // Highlight the active nav link based on scroll position
    const sections = document.querySelectorAll("section[id]");
    let currentSection = "";

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            currentSection = section.id;
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        if (link.dataset.section === currentSection) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", onScroll, { passive: true });
onScroll(); // Run once on load