/* ==========================================
   LIGHTBOX V2
   Yoko Apasra VNHub
========================================== */

let lightbox = null;

let lightboxImage = null;

let lightboxCaption = null;

let lightboxCounter = null;

let lightboxDownload = null;

let closeButton = null;

let prevButton = null;

let nextButton = null;

let images = [];

let currentIndex = 0;

let startX = 0;

let initialized = false;

/* ==========================================
   INITIALIZE
========================================== */

function initializeLightbox() {

    if (initialized) {

        images = Array.from(
            document.querySelectorAll(".lightbox-trigger")
        );

        return;

    }

    lightbox = document.getElementById("lightbox");

    if (!lightbox) return;

    lightboxImage =
        document.getElementById("lightbox-image");

    lightboxCaption =
        document.getElementById("lightbox-caption");

    lightboxCounter =
        document.getElementById("lightbox-counter");

    lightboxDownload =
        document.getElementById("lightbox-download");

    closeButton =
        document.querySelector(".lightbox-close");

    prevButton =
        document.querySelector(".lightbox-prev");

    nextButton =
        document.querySelector(".lightbox-next");

    images = Array.from(
        document.querySelectorAll(".lightbox-trigger")
    );

    initialized = true;

    bindEvents();

}

/* ==========================================
   EVENTS
========================================== */

function bindEvents() {

    document.addEventListener("click", handleOpen);

    closeButton?.addEventListener(
        "click",
        closeLightbox
    );

    prevButton?.addEventListener(
        "click",
        previousImage
    );

    nextButton?.addEventListener(
        "click",
        nextImage
    );

    lightbox?.addEventListener(
        "click",
        handleBackgroundClick
    );

    document.addEventListener(
        "keydown",
        handleKeyboard
    );

    lightbox?.addEventListener(
        "touchstart",
        handleTouchStart,
        {
            passive: true
        }
    );

    lightbox?.addEventListener(
        "touchend",
        handleTouchEnd,
        {
            passive: true
        }
    );

}

/* ==========================================
   OPEN
========================================== */

function handleOpen(event) {

    const trigger =
        event.target.closest(".lightbox-trigger");

    if (!trigger) return;

    event.preventDefault();

    images = Array.from(
        document.querySelectorAll(".lightbox-trigger")
    );

    const index =
        images.indexOf(trigger);

    if (index < 0) return;

    openLightbox(index);

}

/* ==========================================
   OPEN LIGHTBOX
========================================== */

function openLightbox(index) {

    currentIndex = index;

    showImage(currentIndex);

    lightbox.classList.add("show");

    document.body.style.overflow = "hidden";

}

/* ==========================================
   SHOW IMAGE
========================================== */

function showImage(index) {

    if (!images.length) return;

    currentIndex = index;

    const current = images[currentIndex];

    const imageSrc = current.getAttribute("href");

    const imageAlt =
        current.querySelector("img")?.alt || "";

    lightboxImage.classList.remove("show");

    requestAnimationFrame(() => {

        lightboxImage.src = imageSrc;

        lightboxImage.alt = imageAlt;

    });

    lightboxImage.onload = () => {

        lightboxImage.classList.add("show");

        preloadImages();

    };

    /* ==========================
       CAPTION
    ========================== */

    if (lightboxCaption) {

        lightboxCaption.textContent = imageAlt;

    }

    /* ==========================
       COUNTER
    ========================== */

    if (lightboxCounter) {

        lightboxCounter.textContent =
            `${currentIndex + 1} / ${images.length}`;

    }

    /* ==========================
       DOWNLOAD
    ========================== */

    if (lightboxDownload) {

        lightboxDownload.href = imageSrc;

        const customFilename =
            current.dataset.filename;

        if (customFilename) {

            lightboxDownload.download =
                customFilename;

        }

        else {

            const filename =
                imageSrc.split("/").pop();

            lightboxDownload.download =
                filename;

        }

    }

    /* ==========================
       BUTTONS
    ========================== */

    if (images.length <= 1) {

        prevButton.style.display = "none";

        nextButton.style.display = "none";

    }

    else {

        prevButton.style.display = "flex";

        nextButton.style.display = "flex";

    }

}

/* ==========================================
   PRELOAD
========================================== */

function preloadImages() {

    if (!images.length) return;

    const next =
        (currentIndex + 1) % images.length;

    const prev =
        (currentIndex - 1 + images.length) %
        images.length;

    [

        images[next],

        images[prev]

    ].forEach(item => {

        const preload = new Image();

        preload.src =
            item.getAttribute("href");

    });

}

/* ==========================================
   PREVIOUS
========================================== */

function previousImage() {

    if (images.length <= 1) return;

    currentIndex =
        (currentIndex - 1 + images.length) %
        images.length;

    showImage(currentIndex);

}

/* ==========================================
   NEXT
========================================== */

function nextImage() {

    if (images.length <= 1) return;

    currentIndex =
        (currentIndex + 1) %
        images.length;

    showImage(currentIndex);

}

/* ==========================================
   CLOSE
========================================== */

function closeLightbox() {

    lightbox.classList.remove("show");

    document.body.style.overflow = "";

}

/* ==========================================
   BACKGROUND CLICK
========================================== */

function handleBackgroundClick(event) {

    if (event.target === lightbox) {

        closeLightbox();

    }

}

/* ==========================================
   KEYBOARD
========================================== */

function handleKeyboard(event) {

    if (!lightbox.classList.contains("show")) return;

    switch (event.key) {

        case "Escape":

            closeLightbox();

            break;

        case "ArrowLeft":

            previousImage();

            break;

        case "ArrowRight":

            nextImage();

            break;

    }

}

/* ==========================================
   TOUCH START
========================================== */

function handleTouchStart(event) {

    startX = event.touches[0].clientX;

}

/* ==========================================
   TOUCH END
========================================== */

function handleTouchEnd(event) {

    const endX = event.changedTouches[0].clientX;

    const distance = endX - startX;

    if (Math.abs(distance) < 50) return;

    if (distance > 0) {

        previousImage();

    }

    else {

        nextImage();

    }

}

/* ==========================================
   AUTO INITIALIZE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    initializeLightbox();

});

/* ==========================================
   WINDOW RESIZE
========================================== */

window.addEventListener("resize", () => {

    if (!lightbox) return;

    if (!lightbox.classList.contains("show")) return;

    lightboxImage.style.maxHeight =
        `${window.innerHeight - 120}px`;

});

/* ==========================================
   IMAGE DRAG
========================================== */

document.addEventListener("dragstart", (event) => {

    if (
        event.target &&
        event.target.id === "lightbox-image"
    ) {

        event.preventDefault();

    }

});

/* ==========================================
   PREVENT DOUBLE CLICK SELECT
========================================== */

document.addEventListener("selectstart", (event) => {

    if (
        lightbox &&
        lightbox.classList.contains("show")
    ) {

        event.preventDefault();

    }

});

/* ==========================================
   EXPORT
========================================== */

window.initializeLightbox = initializeLightbox;
