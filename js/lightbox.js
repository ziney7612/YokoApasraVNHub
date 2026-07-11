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

        let zoom = 1;

        /*=============================*/
        /* COLLECT */
        /*=============================*/

        function collectImages() {

            images = [

                ...document.querySelectorAll(
                    ".lightbox-trigger"
                )

            ];

        }

        window.refreshLightbox =
            collectImages;

        /*=============================*/

        function getImageSrc(item) {

            return (

                item.href ||

                item.dataset.src ||

                item.src ||

                ""

            );

        }

        /*=============================*/

        function resetZoom() {

            zoom = 1;

            image.style.transform =
                "scale(1)";

        }

        /*=============================*/

        function updateUI() {

            const item =
                images[currentIndex];

            if (!item)
                return;

            const img =
                item.querySelector(
                    "img"
                ) ||

                item;

            const src =
                getImageSrc(
                    item
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
                    src;

                download.download =

                    item.dataset.filename ||

                    src
                        .split("/")
                        .pop();

            }

        }

        /*=============================*/

        function preload(index) {

            if (
                index < 0 ||
                index >= images.length
            ) return;

            const item =
                images[index];

            const img =
                new Image();

            img.src =
                getImageSrc(
                    item
                );

        }

        function preloadNearby() {

            preload(
                currentIndex - 1
            );

            preload(
                currentIndex + 1
            );

        }

        /*=============================*/

        function showImage(index) {

            if (
                isAnimating
            ) return;

            const item =
                images[index];

            if (!item)
                return;

            const src =
                getImageSrc(
                    item
                );

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

                    const img =
                        item.querySelector(
                            "img"
                        ) ||

                        item;

                    image.alt =
                        img?.alt ||

                        `Photo ${index + 1}`;

                    currentIndex =
                        index;

                    updateUI();

                    preloadNearby();

                    resetZoom();

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

                    isAnimating =
                        false;

                };

            loader.src =
                src;

        }

        /*=============================*/

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

            resetZoom();

        }

        /*=============================*/

        function nextImage() {

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

        /*=============================*/
        /* OPEN */
        /*=============================*/

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

        /*=============================*/
        /* BUTTONS */
        /*=============================*/

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

                prevImage();

            }
        );

        /*=============================*/

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

        /*=============================*/
        /* KEYBOARD */
        /*=============================*/

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

        /*=============================*/
        /* SWIPE */
        /*=============================*/

        let touchStartX = 0;

        lightbox.addEventListener(
            "touchstart",
            (event) => {

                touchStartX =
                    event.changedTouches[0]
                        .screenX;

            },
            {
                passive:true
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
                passive:true
            }
        );

        /*=============================*/
        /* CLICK TO ZOOM */
        /*=============================*/

        image.addEventListener(
            "click",
            (event) => {

                event.stopPropagation();

                zoom =
                    zoom === 1
                    ? 2
                    : 1;

                image.style.transform =
                    `scale(${zoom})`;

            }
        );

        /*=============================*/
        /* MOUSE WHEEL */
        /*=============================*/

        lightbox.addEventListener(
            "wheel",
            (event) => {

                if (
                    !lightbox.classList.contains(
                        "show"
                    )
                ) return;

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

                image.style.transform =
                    `scale(${zoom})`;

            },
            {
                passive:false
            }
        );

        collectImages();

    }
);
