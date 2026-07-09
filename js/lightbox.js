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

        if (
            !lightbox ||
            !image
        ) return;

        let images = [];

        let currentIndex = 0;

        function collectImages() {

            images = [

                ...document.querySelectorAll(
                    "#gallery .lightbox-trigger"
                )

            ];

            console.log(
                "Images:",
                images.length
            );

        }

        function showImage(index) {

            const item =
                images[index];

            if (!item)
                return;

            image.src =
                item.href;

            image.alt =
                item.querySelector("img")
                ?.alt || "";

            currentIndex =
                index;
        }

        function openLightbox(index) {

            collectImages();

            if (
                !images.length
            ) return;

            showImage(index);

            lightbox.classList.add(
                "show"
            );

            document.body.classList.add(
                "lightbox-open"
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

        closeButton?.addEventListener(
            "click",
            closeLightbox
        );

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

        document.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key ===
                    "Escape"
                ) {

                    closeLightbox();

                }

            }
        );

    }
);
