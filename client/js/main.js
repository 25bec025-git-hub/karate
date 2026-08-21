"use strict";

document.documentElement.classList.add(
    "js-enabled"
);


/* =========================================================
   MARTIAL ARTS KARATE ACADEMY
   NIT HAMIRPUR

   MAIN FRONTEND JAVASCRIPT

   Responsibilities:

   01. Page initialization
   02. Scroll reveal animations
   03. Achievement counters
   04. Image loading
   05. Gallery interaction
   06. Contact form handling
   07. API helper
   08. Utility functions
   09. Scroll-to-top behavior
   10. General UI helpers
========================================================= */


/* =========================================================
   01. DOM READY
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        initializeWebsite();

    }
);


/* =========================================================
   WEBSITE INITIALIZATION
========================================================= */

function initializeWebsite() {

    initializeRevealAnimations();

    initializeCounters();

    initializeImageLoading();

    initializeGallery();

    initializeContactForm();

    initializeScrollTop();

    initializeSmoothAnchors();

}


/* =========================================================
   02. REVEAL ANIMATIONS
========================================================= */

/*
    Elements with these classes will appear
    when they enter the viewport.

    Example:

    <article class="cadet-card reveal">
*/


function initializeRevealAnimations() {

    const revealElements =
        document.querySelectorAll(
            ".reveal"
        );


    if (!revealElements.length) {
        return;
    }


    /*
        Respect user's reduced-motion preference.
    */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    if (prefersReducedMotion) {

        revealElements.forEach(
            element => {

                element.classList.add(
                    "revealed"
                );

            }
        );

        return;
    }


    /*
        IntersectionObserver is more efficient
        than listening to scroll continuously.
    */

    const revealObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            entry.isIntersecting
                        ) {

                            entry.target.classList.add(
                                "revealed"
                            );


                            /*
                                Stop observing once the
                                animation has happened.
                            */

                            revealObserver.unobserve(
                                entry.target
                            );

                        }

                    }
                );

            },
            {
                threshold: 0.12,

                rootMargin:
                    "0px 0px -60px 0px"
            }
        );


    revealElements.forEach(
        element => {

            revealObserver.observe(
                element
            );

        }
    );

}


/* =========================================================
   03. ACHIEVEMENT COUNTERS
========================================================= */

/*
    Example HTML:

    <span
        class="stat-number"
        data-counter="25"
    >
    0
    </span>

*/


function initializeCounters() {

    const counters =
        document.querySelectorAll(
            "[data-counter]"
        );


    if (!counters.length) {
        return;
    }


    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /*
        If reduced motion is enabled,
        show final values immediately.
    */

    if (prefersReducedMotion) {

        counters.forEach(
            counter => {

                setCounterValue(
                    counter,
                    Number(
                        counter.dataset.counter
                    )
                );

            }
        );

        return;
    }


    const counterObserver =
        new IntersectionObserver(
            entries => {

                entries.forEach(
                    entry => {

                        if (
                            !entry.isIntersecting
                        ) {
                            return;
                        }


                        animateCounter(
                            entry.target
                        );


                        counterObserver.unobserve(
                            entry.target
                        );

                    }
                );

            },
            {
                threshold: 0.6
            }
        );


    counters.forEach(
        counter => {

            counterObserver.observe(
                counter
            );

        }
    );

}


/*
    Animate one counter.
*/

function animateCounter(
    counter
) {

    const target =
        Number(
            counter.dataset.counter
        );


    if (
        !Number.isFinite(target)
    ) {

        return;

    }


    const duration =
        Number(
            counter.dataset.duration
        ) || 1800;


    const startTime =
        performance.now();


    function updateCounter(
        currentTime
    ) {

        const elapsed =
            currentTime - startTime;


        const progress =
            Math.min(
                elapsed / duration,
                1
            );


        /*
            Ease-out effect.
        */

        const easedProgress =
            1 -
            Math.pow(
                1 - progress,
                3
            );


        const currentValue =
            Math.floor(
                target * easedProgress
            );


        setCounterValue(
            counter,
            currentValue
        );


        if (
            progress < 1
        ) {

            requestAnimationFrame(
                updateCounter
            );

        } else {

            setCounterValue(
                counter,
                target
            );

        }

    }


    requestAnimationFrame(
        updateCounter
    );

}


/*
    Update visible counter value.
*/

function setCounterValue(
    element,
    value
) {

    const suffix =
        element.dataset.suffix || "";


    const prefix =
        element.dataset.prefix || "";


    const formattedValue =
        Number.isFinite(value)
            ? value.toLocaleString("en-IN")
            : value;


    element.textContent =
        `${prefix}${formattedValue}${suffix}`;

}


/* =========================================================
   04. IMAGE LOADING
========================================================= */

/*
    Adds a "loaded" class when images finish loading.

    This lets us create smooth image appearance effects.
*/


function initializeImageLoading() {

    const images =
        document.querySelectorAll(
            "img"
        );


    if (!images.length) {
        return;
    }


    images.forEach(
        image => {

            /*
                Already loaded.
            */

            if (
                image.complete &&
                image.naturalWidth > 0
            ) {

                image.classList.add(
                    "loaded"
                );

                return;

            }


            image.addEventListener(
                "load",
                () => {

                    image.classList.add(
                        "loaded"
                    );

                },
                {
                    once: true
                }
            );


            image.addEventListener(
                "error",
                () => {

                    image.classList.add(
                        "load-error"
                    );

                },
                {
                    once: true
                }
            );

        }
    );

}


/* =========================================================
   05. GALLERY
========================================================= */


/*
    This creates a lightweight image preview.

    Clicking a gallery image opens
    a fullscreen viewer.

    No external library is required.
*/


function initializeGallery() {

    const galleryItems =
        document.querySelectorAll(
            ".gallery-item img"
        );


    if (!galleryItems.length) {
        return;
    }


    createGalleryViewer();


    galleryItems.forEach(
        image => {

            image.setAttribute(
                "tabindex",
                "0"
            );


            image.setAttribute(
                "role",
                "button"
            );


            image.addEventListener(
                "click",
                () => {

                    openGalleryViewer(
                        image
                    );

                }
            );


            image.addEventListener(
                "keydown",
                event => {

                    if (
                        event.key === "Enter" ||
                        event.key === " "
                    ) {

                        event.preventDefault();

                        openGalleryViewer(
                            image
                        );

                    }

                }
            );

        }
    );

}


/*
    Create viewer only once.
*/

function createGalleryViewer() {

    if (
        document.querySelector(
            "#gallery-viewer"
        )
    ) {

        return;

    }


    const viewer =
        document.createElement(
            "div"
        );


    viewer.id =
        "gallery-viewer";


    viewer.className =
        "gallery-viewer";


    viewer.innerHTML = `
        <button
            type="button"
            class="gallery-viewer-close"
            aria-label="Close image viewer"
        >
            ×
        </button>

        <div class="gallery-viewer-content">

            <img
                src=""
                alt=""
                class="gallery-viewer-image"
            >

        </div>
    `;


    document.body.appendChild(
        viewer
    );


    const closeButton =
        viewer.querySelector(
            ".gallery-viewer-close"
        );


    closeButton.addEventListener(
        "click",
        closeGalleryViewer
    );


    viewer.addEventListener(
        "click",
        event => {

            if (
                event.target === viewer
            ) {

                closeGalleryViewer();

            }

        }
    );


    document.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Escape"
            ) {

                closeGalleryViewer();

            }

        }
    );

}


/*
    Open image viewer.
*/

function openGalleryViewer(
    image
) {

    const viewer =
        document.querySelector(
            "#gallery-viewer"
        );


    if (!viewer) {
        return;
    }


    const viewerImage =
        viewer.querySelector(
            ".gallery-viewer-image"
        );


    viewerImage.src =
        image.currentSrc ||
        image.src;


    viewerImage.alt =
        image.alt || "";


    viewer.classList.add(
        "open"
    );


    document.body.classList.add(
        "gallery-open"
    );

}


/*
    Close image viewer.
*/

function closeGalleryViewer() {

    const viewer =
        document.querySelector(
            "#gallery-viewer"
        );


    if (!viewer) {
        return;
    }


    viewer.classList.remove(
        "open"
    );


    document.body.classList.remove(
        "gallery-open"
    );

}


/* =========================================================
   06. CONTACT FORM
========================================================= */


/*
    This frontend is prepared for:

        POST /api/contact

    The backend can later receive:

        name
        email
        subject
        message
*/


function initializeContactForm() {

    const form =
        document.querySelector(
            "#contact-form"
        );


    if (!form) {
        return;
    }


    const statusElement =
        document.querySelector(
            "#form-status"
        );


    form.addEventListener(
        "submit",
        async event => {

            event.preventDefault();


            /*
                Basic client-side validation.
            */

            if (
                !validateContactForm(
                    form
                )
            ) {

                setFormStatus(
                    statusElement,
                    "Please complete all required fields.",
                    "error"
                );

                return;

            }


            /*
                Disable submission
                while request is running.
            */

            const submitButton =
                form.querySelector(
                    'button[type="submit"]'
                );


            setButtonLoading(
                submitButton,
                true
            );


            setFormStatus(
                statusElement,
                "Sending message...",
                "loading"
            );


            const formData =
                new FormData(
                    form
                );


            const data =
                Object.fromEntries(
                    formData.entries()
                );


            try {

                /*
                    API call is ready for the
                    Node.js / Express backend.

                    Until backend exists,
                    this will fail gracefully.
                */

                const response =
                    await apiRequest(
                        "/api/contact",
                        {
                            method: "POST",

                            body: data
                        }
                    );


                if (
                    !response.success
                ) {

                    throw new Error(
                        response.message ||
                        "Unable to send message."
                    );

                }


                setFormStatus(
                    statusElement,
                    "Your message has been sent successfully.",
                    "success"
                );


                form.reset();


            } catch (error) {

                console.error(
                    "Contact form error:",
                    error
                );


                setFormStatus(
                    statusElement,
                    "Unable to send your message right now. Please try again later.",
                    "error"
                );


            } finally {

                setButtonLoading(
                    submitButton,
                    false
                );

            }

        }
    );

}


/*
    Validate contact form.
*/

function validateContactForm(
    form
) {

    const requiredFields =
        form.querySelectorAll(
            "[required]"
        );


    let valid = true;


    requiredFields.forEach(
        field => {

            const value =
                field.value.trim();


            if (!value) {

                field.classList.add(
                    "input-error"
                );

                valid = false;

            } else {

                field.classList.remove(
                    "input-error"
                );

            }

        }
    );


    /*
        Email validation.
    */

    const email =
        form.querySelector(
            "#email"
        );


    if (
        email &&
        email.value.trim()
    ) {

        const emailPattern =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


        if (
            !emailPattern.test(
                email.value.trim()
            )
        ) {

            email.classList.add(
                "input-error"
            );

            valid = false;

        }

    }


    return valid;

}


/*
    Form status helper.
*/

function setFormStatus(
    element,
    message,
    type
) {

    if (!element) {
        return;
    }


    element.textContent =
        message;


    element.dataset.status =
        type;

}


/*
    Button loading state.
*/

function setButtonLoading(
    button,
    isLoading
) {

    if (!button) {
        return;
    }


    if (isLoading) {

        if (
            !button.dataset.originalText
        ) {

            button.dataset.originalText =
                button.textContent;

        }


        button.disabled =
            true;


        button.textContent =
            "Sending...";


        button.classList.add(
            "loading"
        );

    } else {

        button.disabled =
            false;


        button.textContent =
            button.dataset.originalText ||
            button.textContent;


        button.classList.remove(
            "loading"
        );

    }

}


/* =========================================================
   07. API HELPER
========================================================= */


/*
    Central API helper.

    Instead of writing fetch()
    everywhere, we use one function.

    Example:

        apiRequest(
            "/api/cadets"
        );

    Later this can be expanded with:

        authentication
        tokens
        error handling
        refresh logic
*/


async function apiRequest(
    endpoint,
    options = {}
) {

    const {
        method = "GET",
        body = null,
        headers = {}
    } = options;


    const requestHeaders = {
        ...headers
    };


    /*
        JSON body.
    */

    let requestBody =
        undefined;


    if (
        body !== null
    ) {

        requestHeaders[
            "Content-Type"
        ] =
            "application/json";


        requestBody =
            JSON.stringify(
                body
            );

    }


    const response =
        await fetch(
            endpoint,
            {
                method,

                headers:
                    requestHeaders,

                body:
                    requestBody,

                credentials:
                    "include"
            }
        );


    /*
        Try to read JSON.
    */

    let responseData = {};


    try {

        responseData =
            await response.json();

    } catch {

        responseData = {};

    }


    if (
        !response.ok
    ) {

        throw new Error(
            responseData.message ||
            `Request failed with status ${response.status}`
        );

    }


    return responseData;

}


/* =========================================================
   08. SMOOTH ANCHOR NAVIGATION
========================================================= */

function initializeSmoothAnchors() {

    const anchors =
        document.querySelectorAll(
            'a[href^="#"]'
        );


    anchors.forEach(
        anchor => {

            anchor.addEventListener(
                "click",
                event => {

                    const targetId =
                        anchor.getAttribute(
                            "href"
                        );


                    /*
                        Ignore empty "#"
                    */

                    if (
                        !targetId ||
                        targetId === "#"
                    ) {

                        return;

                    }


                    const target =
                        document.querySelector(
                            targetId
                        );


                    if (!target) {
                        return;
                    }


                    event.preventDefault();


                    target.scrollIntoView(
                        {
                            behavior:
                                "smooth",

                            block:
                                "start"
                        }
                    );


                    /*
                        Update URL without
                        jumping the page.
                    */

                    history.pushState(
                        null,
                        "",
                        targetId
                    );

                }
            );

        }
    );

}


/* =========================================================
   09. SCROLL TO TOP
========================================================= */

/*
    We'll dynamically create a scroll-top button.

    It appears after scrolling down.
*/


function initializeScrollTop() {

    const button =
        createScrollTopButton();


    if (!button) {
        return;
    }


    window.addEventListener(
        "scroll",
        () => {

            if (
                window.scrollY > 600
            ) {

                button.classList.add(
                    "visible"
                );

            } else {

                button.classList.remove(
                    "visible"
                );

            }

        },
        {
            passive: true
        }
    );


    button.addEventListener(
        "click",
        () => {

            window.scrollTo(
                {
                    top: 0,

                    behavior:
                        "smooth"
                }
            );

        }
    );

}


/*
    Create button.
*/

function createScrollTopButton() {

    if (
        document.querySelector(
            "#scroll-top"
        )
    ) {

        return document.querySelector(
            "#scroll-top"
        );

    }


    const button =
        document.createElement(
            "button"
        );


    button.type =
        "button";


    button.id =
        "scroll-top";


    button.className =
        "scroll-top";


    button.setAttribute(
        "aria-label",
        "Scroll to top"
    );


    button.innerHTML =
        "↑";


    document.body.appendChild(
        button
    );


    return button;

}


/* =========================================================
   10. EXTERNAL LINK SECURITY
========================================================= */


/*
    Automatically ensure target="_blank"
    links have safe rel attributes.
*/


function initializeExternalLinks() {

    const links =
        document.querySelectorAll(
            'a[target="_blank"]'
        );


    links.forEach(
        link => {

            const existingRel =
                link.getAttribute(
                    "rel"
                ) || "";


            const relValues =
                new Set(
                    existingRel
                        .split(" ")
                        .filter(Boolean)
                );


            relValues.add(
                "noopener"
            );

            relValues.add(
                "noreferrer"
            );


            link.setAttribute(
                "rel",
                Array.from(
                    relValues
                ).join(" ")
            );

        }
    );

}


/* =========================================================
   11. ONLINE / OFFLINE STATE
========================================================= */


/*
    Useful for a future full-stack application.

    If network disappears, we can show
    a small notification.
*/


function initializeNetworkState() {

    window.addEventListener(
        "offline",
        () => {

            showNotification(
                "You are currently offline.",
                "warning"
            );

        }
    );


    window.addEventListener(
        "online",
        () => {

            showNotification(
                "Your internet connection has been restored.",
                "success"
            );

        }
    );

}


/* =========================================================
   12. NOTIFICATION SYSTEM
========================================================= */


/*
    Generic notification helper.

    It can later be reused for:

        login success
        logout
        form submission
        API errors
        admin actions
*/


function showNotification(
    message,
    type = "info"
) {

    let container =
        document.querySelector(
            "#notification-container"
        );


    if (!container) {

        container =
            document.createElement(
                "div"
            );

        container.id =
            "notification-container";

        container.className =
            "notification-container";

        document.body.appendChild(
            container
        );

    }


    const notification =
        document.createElement(
            "div"
        );


    notification.className =
        `notification notification-${type}`;


    notification.setAttribute(
        "role",
        "status"
    );


    notification.textContent =
        message;


    container.appendChild(
        notification
    );


    requestAnimationFrame(
        () => {

            notification.classList.add(
                "show"
            );

        }
    );


    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );


            setTimeout(
                () => {

                    notification.remove();

                },
                300
            );

        },
        4000
    );

}


/* =========================================================
   13. INITIALIZE ADDITIONAL SYSTEMS
========================================================= */

initializeExternalLinks();

initializeNetworkState();


/* =========================================================
   14. GLOBAL ERROR HANDLING
========================================================= */


/*
    This prevents a random JavaScript error
    from becoming completely invisible.

    In development it helps debugging.
*/


window.addEventListener(
    "error",
    event => {

        console.error(
            "Frontend error:",
            event.error || event.message
        );

    }
);


/* =========================================================
   15. UNHANDLED PROMISE ERRORS
========================================================= */

window.addEventListener(
    "unhandledrejection",
    event => {

        console.error(
            "Unhandled promise rejection:",
            event.reason
        );

    }
);

/* =========================================================
   GALLERY AUTO CAROUSEL + DOT NAVIGATION
========================================================= */

function initializeGalleryCarousel() {

    const gallery =
        document.querySelector(".gallery-grid");

    const dotsContainer =
        document.querySelector(".gallery-dots");


    if (!gallery || !dotsContainer) {
        return;
    }


    const slides =
        gallery.querySelectorAll(".gallery-item");


    if (slides.length <= 1) {
        return;
    }


    /* -----------------------------------------------------
       REDUCED MOTION
    ----------------------------------------------------- */

    const prefersReducedMotion =
        window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;


    /* -----------------------------------------------------
       STATE
    ----------------------------------------------------- */

    let currentIndex = 0;

    let intervalId = null;


    /* -----------------------------------------------------
       CREATE DOTS
    ----------------------------------------------------- */

    slides.forEach(
        (slide, index) => {

            const dot =
                document.createElement("button");


            dot.type =
                "button";


            dot.className =
                "gallery-dot";


            dot.setAttribute(
                "aria-label",
                `Go to gallery image ${index + 1}`
            );


            dot.setAttribute(
                "aria-current",
                index === 0
                    ? "true"
                    : "false"
            );


            if (index === 0) {

                dot.classList.add(
                    "active"
                );

            }


            dot.addEventListener(
                "click",
                () => {

                    goToSlide(index);

                    restartAutoSlide();

                }
            );


            dotsContainer.appendChild(
                dot
            );

        }
    );


    const dots =
        dotsContainer.querySelectorAll(
            ".gallery-dot"
        );


    /* -----------------------------------------------------
       UPDATE DOTS
    ----------------------------------------------------- */

    function updateDots() {

        dots.forEach(
            (dot, index) => {

                const isActive =
                    index === currentIndex;


                dot.classList.toggle(
                    "active",
                    isActive
                );


                dot.setAttribute(
                    "aria-current",
                    isActive
                        ? "true"
                        : "false"
                );

            }
        );

    }


    /* -----------------------------------------------------
       MOVE TO SLIDE
    ----------------------------------------------------- */

    function goToSlide(index) {

        currentIndex =
            (index + slides.length) %
            slides.length;


        gallery.scrollTo({

            left:
                gallery.clientWidth *
                currentIndex,

            behavior:
                prefersReducedMotion
                    ? "auto"
                    : "smooth"

        });


        updateDots();

    }


    /* -----------------------------------------------------
       DETECT MANUAL SCROLL
    ----------------------------------------------------- */

    let scrollTimeout = null;


    gallery.addEventListener(
        "scroll",
        () => {

            clearTimeout(
                scrollTimeout
            );


            scrollTimeout =
                setTimeout(
                    () => {

                        const slideWidth =
                            gallery.clientWidth;


                        if (
                            slideWidth <= 0
                        ) {
                            return;
                        }


                        const detectedIndex =
                            Math.round(
                                gallery.scrollLeft /
                                slideWidth
                            );


                        currentIndex =
                            Math.max(
                                0,
                                Math.min(
                                    detectedIndex,
                                    slides.length - 1
                                )
                            );


                        updateDots();

                    },
                    50
                );

        },
        {
            passive: true
        }
    );


    /* -----------------------------------------------------
       AUTO SLIDE
    ----------------------------------------------------- */

    function startAutoSlide() {

        if (
            prefersReducedMotion
        ) {

            return;

        }


        stopAutoSlide();


        intervalId =
            setInterval(
                () => {

                    goToSlide(
                        currentIndex + 1
                    );

                },
                2000
            );

    }


    /* -----------------------------------------------------
       STOP AUTO SLIDE
    ----------------------------------------------------- */

    function stopAutoSlide() {

        if (
            intervalId !== null
        ) {

            clearInterval(
                intervalId
            );

            intervalId =
                null;

        }

    }


    /* -----------------------------------------------------
       RESTART AUTO SLIDE
    ----------------------------------------------------- */

    function restartAutoSlide() {

        stopAutoSlide();

        startAutoSlide();

    }


    /* -----------------------------------------------------
       PAUSE ON HOVER
    ----------------------------------------------------- */

    gallery.addEventListener(
        "mouseenter",
        stopAutoSlide
    );


    gallery.addEventListener(
        "mouseleave",
        startAutoSlide
    );


    /* -----------------------------------------------------
       PAUSE ON TOUCH
    ----------------------------------------------------- */

    gallery.addEventListener(
        "touchstart",
        stopAutoSlide,
        {
            passive: true
        }
    );


    gallery.addEventListener(
        "touchend",
        startAutoSlide,
        {
            passive: true
        }
    );


    /* -----------------------------------------------------
       KEYBOARD SUPPORT
    ----------------------------------------------------- */

    gallery.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "ArrowRight"
            ) {

                goToSlide(
                    currentIndex + 1
                );

                restartAutoSlide();

            }


            if (
                event.key === "ArrowLeft"
            ) {

                goToSlide(
                    currentIndex - 1
                );

                restartAutoSlide();

            }

        }
    );


    /* -----------------------------------------------------
       START
    ----------------------------------------------------- */

    updateDots();

    startAutoSlide();

}
function initializeWebsite() {

    initializeRevealAnimations();

    initializeCounters();

    initializeImageLoading();

    initializeGallery();

    initializeGalleryCarousel();

    initializeContactForm();

    initializeScrollTop();

    initializeSmoothAnchors();

}