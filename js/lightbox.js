document.addEventListener(
    "DOMContentLoaded",
    () => {

        const lightbox =
            document.getElementById(
                "lightbox"
            );

        const image =
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

        const download =
            document.getElementById(
                "lightbox-download"
            );

        if (
            !lightbox ||
            !image
        ) return;

        let images = [];

        let currentIndex = 0;

        let isAnimating = false;

        /*========================*/

        function collectImages() {

            images = [

                ...document.querySelectorAll(
                    "#gallery .lightbox-trigger"
                )

            ];

        }

        window.refreshLightbox =
            collectImages;

        /*========================*/

        function updateUI() {

            const item =
                images[currentIndex];

            if (!item)
                return;

            const img =
                item.querySelector(
                    "img"
                );

            counter &&
                (counter.textContent =
                    `${currentIndex + 1} / ${images.length}`);

            caption &&
                (caption.textContent =
                    img?.alt || "");

            if (download) {

                download.href =
                    item.href;

                download.download =
                    item.dataset.filename ||

                    item.href
                        .split("/")
                        .pop();

            }

        }

        /*========================*/

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

        /*========================*/

        function showImage(index) {

            if (
                isAnimating
            ) return;

            const item =
                images[index];

            if (!item)
                return;

            isAnimating = true;

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

                        `Photo ${index + 1}`;

                    currentIndex =
                        index;

                    updateUI();

                    preloadNearby();

                    requestAnimationFrame(
                        () => {

                            image.classList.remove(
                                "loading"
                            );

                        }
                    );

                    isAnimating =
                        false;

                };

            loader.onerror =
                () => {

                    image.classList.remove(
                        "loading"
                    );

                    isAnimating =
                        false;

                };

            loader.src =
                item.href;

        }

        /*========================*/

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

        /*========================*/

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

        /*========================*/
        /* OPEN IMAGE */
        /*========================*/

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

        /*========================*/

        closeButton?.addEventListener(
            "click",
            closeLightbox
        );

        nextButton?.addEventListener(
            "click",
            nextImage
        );

        prevButton?.addEventListener(
            "click",
            prevImage
        );

        /*========================*/

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

        /*========================*/
        /* KEYBOARD */
        /*========================*/

        document.addEventListener(
            "keydown",
            (event) => {

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

                    case "ArrowRight":

                        nextImage();
                        break;

                    case "ArrowLeft":

                        prevImage();
                        break;

                }

            }
        );

        /*========================*/
        /* TOUCH SWIPE */
        /*========================*/

        let touchStartX = 0;

        let touchEndX = 0;

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

                touchEndX =
                    event.changedTouches[0]
                        .screenX;

                const distance =
                    touchEndX -
                    touchStartX;

                if (
                    Math.abs(
                        distance
                    ) < 60
                ) return;

                if (
                    distance > 0
                ) {

                    prevImage();

                }

                else {

                    nextImage();

                }

            },
            {
                passive: true
            }
        );

        /*========================*/

        collectImages();

    }
);
