document.addEventListener("DOMContentLoaded", () => {

    /*==================================
    =            Elements             =
    ==================================*/

    const lightbox =
        document.getElementById("lightbox");

    const image =
        document.getElementById(
            "lightbox-image"
        );

    const closeButton =
        document.querySelector(
            ".lightbox-close"
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

    /*==================================
    =             State               =
    ==================================*/

    let images = [];

    let currentIndex = 0;

    let isOpen = false;

    /*==================================
    =        Collect Images           =
    ==================================*/

    function collectImages() {

        images = [

            ...document.querySelectorAll(
                ".lightbox-trigger"
            )

        ];

    }

    /*==================================
    =        Update Information       =
    ==================================*/

    function updateUI() {

        const item =
            images[currentIndex];

        if (!item) return;

        const img =
            item.querySelector("img");

        counter.textContent =
            `${currentIndex + 1} / ${images.length}`;

        caption.textContent =
            img?.alt || "";

        download.href =
            item.href;

        download.download =
            item.dataset.filename ||

            item.href.split("/")
                .pop();

    }

         /*==================================
    =          Show Image             =
    ==================================*/

    function showImage(index) {

        const item =
            images[index];

        if (!item) return;

        image.src =
            item.href;

        image.alt =
            item.querySelector("img")
            ?.alt || "";

        currentIndex = index;

        updateUI();

    }

    /*==================================
    =          Open Lightbox          =
    ==================================*/

    function openLightbox(index) {

        collectImages();

        if (!images.length)
            return;

        isOpen = true;

        lightbox.classList.add(
            "active"
        );

        document.body.classList.add(
            "lightbox-open"
        );

        showImage(index);

    }

        /*==================================
    =         Close Lightbox          =
    ==================================*/

    function closeLightbox() {

        isOpen = false;

        lightbox.classList.remove(
            "active"
        );

        document.body.classList.remove(
            "lightbox-open"
        );

    }

        /*==================================
    =          Click Image            =
    ==================================*/

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

            if (index === -1)
                return;

            openLightbox(index);

        }
    );

    closeButton?.addEventListener(
        "click",
        closeLightbox
    );

});
