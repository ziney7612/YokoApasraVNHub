/* ======================================================
   LIGHTBOX V6
   Yoko Apasra VNHub
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        /* ======================================================
           ELEMENTS
        ====================================================== */

        const lightbox =
            document.getElementById(
                "lightbox"
            );

        const lightboxImage =
            document.getElementById(
                "lightbox-image"
            );

        const closeButton =
            document.querySelector(
                ".lightbox-close"
            );

        const prevButton =
            document.querySelector(
                ".lightbox-prev"
            );

        const nextButton =
            document.querySelector(
                ".lightbox-next"
            );

        const counter =
            document.getElementById(
                "lightbox-counter"
            );

        const caption =
            document.getElementById(
                "lightbox-caption"
            );

        const downloadButton =
            document.getElementById(
                "lightbox-download"
            );

        if (

            !lightbox ||

            !lightboxImage

        ) {

            console.warn(
                "Lightbox not found."
            );

            return;

        }


        /* ======================================================
           STATE
        ====================================================== */

        let gallery = [];

        let currentIndex = 0;

        let zoom = 1;

        let isLoading = false;

        let touchStartX = 0;


        /* ======================================================
           COLLECT IMAGES
        ====================================================== */

        function collectGallery() {

            gallery = [

                ...document.querySelectorAll(
                    ".lightbox-trigger"
                )

            ];

        }


        window.refreshLightbox =
            collectGallery;


        /* ======================================================
           GET SOURCE
        ====================================================== */

        function getSource(item) {

            if (!item)
                return "";

            return (

                item.getAttribute(
                    "href"
                ) ||

                item.dataset.src ||

                ""

            );

        }


        /* ======================================================
           GET IMAGE
        ====================================================== */

        function getImage(item) {

            return (

                item.querySelector(
                    "img"
                ) ||

                item

            );

        }


        /* ======================================================
           RESET ZOOM
        ====================================================== */

        function resetZoom() {

            zoom = 1;

            lightboxImage.style.transform =
                "scale(1)";

        }


        /* ======================================================
           PRELOAD
        ====================================================== */

        function preload(index) {

            if (

                index < 0 ||

                index >= gallery.length

            ) {

                return;

            }

            const preloadImage =
                new Image();

            preloadImage.src =
                getSource(
                    gallery[index]
                );

        }


        function preloadNearby() {

            preload(
                currentIndex - 1
            );

            preload(
                currentIndex + 1
            );

                    /* ======================================================
           UPDATE UI
        ====================================================== */

        function updateUI() {

            const item =
                gallery[currentIndex];

            if (!item)
                return;

            const img =
                getImage(item);

            const src =
                getSource(item);

            if (counter) {

                counter.textContent =
                    `${currentIndex + 1} / ${gallery.length}`;

            }

            if (caption) {

                caption.textContent =
                    img.alt || "";

            }

            if (downloadButton) {

                downloadButton.href =
                    src;

                downloadButton.target =
                    "_blank";

                downloadButton.rel =
                    "noopener noreferrer";

                downloadButton.removeAttribute(
                    "download"
                );

            }

        }


        /* ======================================================
           SHOW IMAGE
        ====================================================== */

        function showImage(index) {

            if (

                isLoading ||

                !gallery.length

            ) {

                return;

            }

            isLoading = true;

            const item =
                gallery[index];

            if (!item) {

                isLoading = false;

                return;

            }

            const src =
                getSource(item);

            const img =
                getImage(item);

            lightboxImage.classList.add(
                "loading"
            );

            const loader =
                new Image();

            loader.onload =
                () => {

                    lightboxImage.src =
                        loader.src;

                    lightboxImage.alt =

                        img.alt ||

                        `Photo ${index + 1}`;

                    currentIndex =
                        index;

                    updateUI();

                    preloadNearby();

                    resetZoom();

                    requestAnimationFrame(
                        () => {

                            lightboxImage.classList.remove(
                                "loading"
                            );

                        }
                    );

                    isLoading = false;

                };

            loader.onerror =
                () => {

                    console.warn(
                        "Unable to load:",
                        src
                    );

                    isLoading = false;

                };

            loader.src =
                src;

        }


        /* ======================================================
           OPEN
        ====================================================== */

        function openLightbox(index) {

            collectGallery();

            if (!gallery.length)
                return;

            lightbox.classList.add(
                "show"
            );

            document.body.classList.add(
                "lightbox-open"
            );

            showImage(index);

        }


        /* ======================================================
           CLOSE
        ====================================================== */

        function closeLightbox() {

            lightbox.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "lightbox-open"
            );

            resetZoom();

        }


        /* ======================================================
           NEXT
        ====================================================== */

        function nextImage() {

            currentIndex++;

            if (

                currentIndex >=

                gallery.length

            ) {

                currentIndex = 0;

            }

            showImage(
                currentIndex
            );

        }


        /* ======================================================
           PREVIOUS
        ====================================================== */

        function previousImage() {

            currentIndex--;

            if (

                currentIndex < 0

            ) {

                currentIndex =
                    gallery.length - 1;

            }

            showImage(
                currentIndex
            );

        }

                    /* ======================================================
           CLICK TO OPEN
        ====================================================== */

        document.addEventListener(
            "click",
            (event) => {

                const target =
                    event.target.closest(
                        ".lightbox-trigger"
                    );

                if (!target)
                    return;

                event.preventDefault();

                collectGallery();

                const index =
                    gallery.indexOf(
                        target
                    );

                if (
                    index >= 0
                ) {

                    openLightbox(
                        index
                    );

                }

            }
        );


        /* ======================================================
           BUTTON EVENTS
        ====================================================== */

        closeButton?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                closeLightbox();

            }
        );


        nextButton?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                nextImage();

            }
        );


        prevButton?.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                previousImage();

            }
        );


        /* ======================================================
           CLICK OUTSIDE
        ====================================================== */

        lightbox.addEventListener(
            "click",
            (event) => {

                if (

                    event.target ===
                    lightbox

                ) {

                    closeLightbox();

                }

            }
        );


        /* ======================================================
           KEYBOARD
        ====================================================== */

        document.addEventListener(
            "keydown",
            (event) => {

                if (

                    !lightbox.classList.contains(
                        "show"
                    )

                ) {

                    return;

                }

                switch (event.key) {

                    case "Escape":

                        closeLightbox();

                        break;

                    case "ArrowRight":

                        nextImage();

                        break;

                    case "ArrowLeft":

                        previousImage();

                        break;

                }

            }
        );


        /* ======================================================
           SWIPE
        ====================================================== */

        lightbox.addEventListener(
            "touchstart",
            (event) => {

                touchStartX =

                    event.changedTouches[0]
                        .screenX;

            },

            {
                passive: true
            }

        );


        lightbox.addEventListener(
            "touchend",
            (event) => {

                const touchEndX =

                    event.changedTouches[0]
                        .screenX;

                const distance =

                    touchEndX -
                    touchStartX;

                if (

                    Math.abs(distance) < 60

                ) {

                    return;

                }

                if (

                    distance > 0

                ) {

                    previousImage();

                }

                else {

                    nextImage();

                }

            },

            {
                passive: true
            }

        );


        /* ======================================================
           CLICK TO ZOOM
        ====================================================== */

        lightboxImage.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                zoom =

                    zoom === 1
                        ? 2
                        : 1;

                lightboxImage.style.transform =

                    `scale(${zoom})`;

            }
        );


        /* ======================================================
           MOUSE WHEEL ZOOM
        ====================================================== */

        lightbox.addEventListener(
            "wheel",
            (event) => {

                if (

                    !lightbox.classList.contains(
                        "show"
                    )

                ) {

                    return;

                }

                event.preventDefault();

                zoom +=

                    event.deltaY > 0

                        ? -0.15

                        : 0.15;

                zoom =

                    Math.max(
                        1,
                        Math.min(
                            zoom,
                            4
                        )
                    );

                lightboxImage.style.transform =

                    `scale(${zoom})`;

            },

            {
                passive: false
            }

        );


        /* ======================================================
           INITIALIZE
        ====================================================== */

        collectGallery();

        console.log(

            `Lightbox ready (${gallery.length} images).`

        );

    }

);
        }
