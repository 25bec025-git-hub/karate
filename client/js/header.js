"use strict";


const menuToggle =
    document.querySelector("#menu-toggle");

const navWrapper =
    document.querySelector("#navigation");

const navLinks =
    document.querySelectorAll(".nav-link");


/* =========================================================
   OPEN
========================================================= */

function openMenu() {

    navWrapper.classList.add("open");

    menuToggle.classList.add("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "true"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Close navigation menu"
    );

    document.body.classList.add(
        "menu-open"
    );
}


/* =========================================================
   CLOSE
========================================================= */

function closeMenu() {

    navWrapper.classList.remove("open");

    menuToggle.classList.remove("open");

    menuToggle.setAttribute(
        "aria-expanded",
        "false"
    );

    menuToggle.setAttribute(
        "aria-label",
        "Open navigation menu"
    );

    document.body.classList.remove(
        "menu-open"
    );
}


/* =========================================================
   TOGGLE
========================================================= */

function toggleMenu() {

    if (
        navWrapper.classList.contains(
            "open"
        )
    ) {

        closeMenu();

    } else {

        openMenu();

    }

}


/* =========================================================
   TOGGLE BUTTON
========================================================= */

menuToggle.addEventListener(
    "click",
    toggleMenu
);


/* =========================================================
   CLOSE AFTER NAV LINK
========================================================= */

navLinks.forEach(
    link => {

        link.addEventListener(
            "click",
            closeMenu
        );

    }
);


/* =========================================================
   ESCAPE
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key === "Escape"
        ) {

            closeMenu();

        }

    }
);


/* =========================================================
   CLICK OUTSIDE
========================================================= */

document.addEventListener(
    "click",
    event => {

        if (
            !navWrapper.classList.contains(
                "open"
            )
        ) {

            return;

        }


        const insideMenu =
            navWrapper.contains(
                event.target
            );

        const insideButton =
            menuToggle.contains(
                event.target
            );


        if (
            !insideMenu &&
            !insideButton
        ) {

            closeMenu();

        }

    }
);