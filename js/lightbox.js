document.addEventListener(
    "DOMContentLoaded",
    () => {

        /*==============================
        =           Elements          =
        ==============================*/

        const lightbox =
            document.getElementById(
                "lightbox"
            );

        const image =
            document.getElementById(
                "lightbox-image"
            );

        const counter =
            document.getElementById(
                "lightbox-counter"
            );

        const caption =
            document.getElementById(
                "lightbox-caption"
            );

        const download =
            document.getElementById(
                "lightbox-download"
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

        if (
            !lightbox ||
            !image
        ) return;

        /*==============================
        =             State           =
        ==============================*/

        let images = [];

        let currentIndex = 0;

        let isAnimating = false;

        /*==============================
        =        Collect Images       =
        ==============================*/

        function collectImages() {

            images = [

                ...document.querySelectorAll(
                    "#gallery .lightbox-trigger"
                )

            ];

        }

        window.refreshLightbox =
            collectImages;

        /*==============================
        =          Update UI          =
        ==============================*/

        function updateUI() {

            const item =
                images[currentIndex];

            if (!item)
                return;

            const img =
                item.querySelector(
                    "img"
                );

            if (counter) {

                counter.textContent =
                    `${currentIndex + 1} / ${images.length}`;

            }

            if (caption) {

                caption.textContent =
                    img?.alt || "";

            }

            if (download) {

                download.href =
                    item.href;

                download.download =
                    item.dataset
                        .filename ||

                    item.href
                        .split("/")
                        .pop();

            }

        }

        /*==============================
        =           Preload          =
        ==============================*/

        function preload(index) {

            if (
                index < 0 ||
                index >= images.length
            ) return;

            const img =
                new Image();

            img.src =
                images[index].href;

        }

        function preloadNearby() {

            preload(
                currentIndex - 1
            );

            preload(
                currentIndex + 1
            );

        }

        /*==============================
        =         Show Image         =
        ==============================*/

        function showImage(index) {

            if (
                isAnimating
            ) return;

            const item =
                images[index];

            if (!item)
                return;

            isAnimating =
                true;

            image.classList.remove(
                "loaded"
            );

            image.classList.add(
                "loading"
            );

            const loader =
                new Image();

            loader.onload =
                () => {

                    image.src =
                        loader.src;

                    image.alt =
                        item
                        .querySelector(
                            "img"
                        )
                        ?.alt ||

                        "";

                    currentIndex =
                        index;

                    updateUI();

                    preloadNearby();

                    requestAnimationFrame(
                        () => {

                            image.classList.remove(
                                "loading"
                            );

                            image.classList.add(
                                "loaded"
                            );

                            isAnimating =
                                false;

                        }
                    );

                };

            loader.onerror =
                () => {

                    isAnimating =
                        false;

                };

            loader.src =
                item.href;

        }

        /*==============================
        =       Open / Close         =
        ==============================*/

        function openLightbox(
            index
        ) {

            collectImages();

            if (
                !images.length
            ) return;

            lightbox.classList.add(
                "show"
            );

            document.body.classList.add(
                "lightbox-open"
            );

            showImage(
                index
            );

        }

        function closeLightbox() {

            lightbox.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "lightbox-open"
            );

        }

        /*==============================
        =        Navigation          =
        ==============================*/

        function prevImage() {

            if (
                !images.length
            ) return;

            currentIndex--;

            if (
                currentIndex < 0
            ) {

                currentIndex =
                    images.length - 1;

            }

            showImage(
                currentIndex
            );

        }

        function nextImage() {

            if (
                !images.length
            ) return;

            currentIndex++;

            if (
                currentIndex >=
                images.length
            ) {

                currentIndex = 0;

            }

            showImage(
                currentIndex
            );

        }

        /*==============================
        =          Click Open        =
        ==============================*/

        document.addEventListener(
            "click",
            event => {

                const target =
                    event.target.closest(
                        ".lightbox-trigger"
                    );

                if (
                    !target
                ) return;

                event.preventDefault();

                collectImages();

                const index =
                    images.indexOf(
                        target
                    );

                if (
                    index === -1
                ) return;

                openLightbox(
                    index
                );

            }
        );

        /*==============================
        =            Events          =
        ==============================*/

        closeButton
            ?.addEventListener(
                "click",
                closeLightbox
            );

        prevButton
            ?.addEventListener(
                "click",
                prevImage
            );

        nextButton
            ?.addEventListener(
                "click",
                nextImage
            );

        lightbox.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    lightbox
                ) {

                    closeLightbox();

                }

            }
        );

        document.addEventListener(
            "keydown",
            event => {

                if (
                    !lightbox.classList.contains(
                        "show"
                    )
                ) return;

                switch (
                    event.key
                ) {

                    case "Escape":

                        closeLightbox();

                        break;

                    case "ArrowLeft":

                        prevImage();

                        break;

                    case "ArrowRight":

                        nextImage();

                        break;

                }

            }
        );

    }
);
