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
