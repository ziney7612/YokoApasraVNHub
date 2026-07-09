/*==================================================
    YokoApasraVNHub
    Lightbox V3
==================================================*/

document.addEventListener("DOMContentLoaded", () => {

    "use strict";

    /*==================================
    =            Elements             =
    ==================================*/

    const gallery = document.getElementById("gallery");
    const lightbox = document.getElementById("lightbox");

    if (!gallery || !lightbox) return;

    const stage = lightbox.querySelector(".lightbox-stage");

    const image = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");
    const counter = document.getElementById("lightbox-counter");

    const download = document.getElementById("lightbox-download");

    const prev = lightbox.querySelector(".lightbox-prev");
    const next = lightbox.querySelector(".lightbox-next");
    const close = lightbox.querySelector(".lightbox-close");



    /*==================================
    =          Gallery Info           =
    ==================================*/

    const folder = gallery.dataset.folder || "";
    const total = Number(gallery.dataset.total || 0);



    /*==================================
    =             State               =
    ==================================*/

    let currentIndex = 0;

    let isOpen = false;

    let isAnimating = false;

    let images = [];



    /*==================================
    =         Image Collection        =
    ==================================*/

    function collectImages() {

        images = [

            ...gallery.querySelectorAll(

                ".lightbox-trigger"

            )

        ];

    }

    collectImages();



    /*==================================
    =          Utilities              =
    ==================================*/

    function pad(number) {

        return String(number).padStart(3, "0");

    }



function getImagePath(index) {

    if (!images[index]) return "";

    return images[index].href;

}


    function lockScroll() {

        document.body.classList.add(

            "lightbox-open"

        );

    }



    function unlockScroll() {

        document.body.classList.remove(

            "lightbox-open"

        );

    }



    function preload(index) {

        if (

            index < 0 ||

            index >= total

        ) return;

        const img = new Image();

        img.src = getImagePath(index);

    }



    function preloadNearby() {

        preload(currentIndex - 1);

        preload(currentIndex + 1);

    }



    /*==================================
    =         UI Update               =
    ==================================*/

    function updateCounter() {

        counter.textContent =

            `${currentIndex + 1} / ${total}`;

    }



    function updateCaption() {

        const img = images[currentIndex];

        caption.textContent =

            img ? img.alt : "";

    }



    function updateDownload() {

        const src = getImagePath(currentIndex);

        download.href = src;

        download.download =

            src.split("/").pop();

    }

                              /*==================================
    =          Show Image             =
    ==================================*/

    function showImage(index) {

        if (isAnimating) return;

        const src = getImagePath(index);

        isAnimating = true;

        image.classList.remove(
            "loaded",
            "fade-in"
        );

        image.classList.add(
            "loading",
            "fade-out"
        );

        const loader = new Image();

        loader.src = src;

        loader.onload = () => {

            image.src = src;

            image.alt =

                images[index]?.alt ||

                `Photo ${index + 1}`;

            image.classList.remove(

                "loading",

                "fade-out"

            );

            image.classList.add(

                "loaded",

                "fade-in"

            );

            updateCounter();

            updateCaption();

            updateDownload();

            preloadNearby();

            isAnimating = false;

        };

        loader.onerror = () => {

            image.classList.remove(

                "loading",

                "fade-out"

            );

            caption.textContent =

                "Unable to load image.";

            isAnimating = false;

        };

    }



    /*==================================
    =        Open Lightbox            =
    ==================================*/

    function openLightbox(index) {

        if (isOpen) return;

        currentIndex = index;

        isOpen = true;

        lockScroll();

        lightbox.classList.add(

            "show"

        );

        showImage(currentIndex);

    }



    /*==================================
    =       Close Lightbox            =
    ==================================*/

    function closeLightbox() {

        if (!isOpen) return;

        isOpen = false;

        unlockScroll();

        lightbox.classList.remove(

            "show"

        );

        image.classList.remove(

            "loading",

            "fade-in",

            "fade-out"

        );

    }



    /*==================================
    =       Previous Image            =
    ==================================*/

    function previousImage() {

        if (

            isAnimating ||

            !isOpen

        ) return;

        currentIndex--;

        if (

            currentIndex < 0

        ) {

            currentIndex =

                total - 1;

        }

        showImage(

            currentIndex

        );

    }



    /*==================================
    =          Next Image             =
    ==================================*/
function nextImage() {

    console.log("Before:", {
        currentIndex,
        total,
        isAnimating,
        isOpen,
        images: images.length
    });

    if (
        isAnimating ||
        !isOpen
    ) return;

    currentIndex++;

    if (currentIndex >= total) {

        currentIndex = 0;

    }

    console.log("After:", currentIndex);

    showImage(currentIndex);

}

                              /*==================================
    =       Gallery Click Event       =
    ==================================*/

  gallery.addEventListener("click", (event) => {

    const target = event.target.closest(".lightbox-trigger");

    if (!target) return;

    event.preventDefault();

    collectImages();

    const index = images.indexOf(target);

    if (index === -1) return;

    openLightbox(index);

});
    /*==================================
    =       Previous Button           =
    ==================================*/

    prev.addEventListener("click", (event) => {

        event.stopPropagation();

        previousImage();

    });



    /*==================================
    =         Next Button             =
    ==================================*/

    next.addEventListener("click", (event) => {

        event.stopPropagation();

        nextImage();

    });



    /*==================================
    =        Close Button             =
    ==================================*/

    close.addEventListener("click", (event) => {

        event.stopPropagation();

        closeLightbox();

    });



    /*==================================
    =        Overlay Click            =
    ==================================*/

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            closeLightbox();

        }

    });



    /*==================================
    =       Keyboard Control          =
    ==================================*/

    document.addEventListener("keydown", (event) => {

        if (!isOpen) return;

        switch (event.key) {

            case "ArrowLeft":

                previousImage();

                break;

            case "ArrowRight":

                nextImage();

                break;

            case "Escape":

                closeLightbox();

                break;

        }

    });



    /*==================================
    =          Touch Swipe            =
    ==================================*/

    let touchStartX = 0;

    let touchEndX = 0;



    image.addEventListener(

        "touchstart",

        (event) => {

            touchStartX =

                event.changedTouches[0].clientX;

        },

        {

            passive: true

        }

    );



    image.addEventListener(

        "touchend",

        (event) => {

            touchEndX =

                event.changedTouches[0].clientX;

            const distance =

                touchEndX - touchStartX;

            if (Math.abs(distance) < 60) return;

            if (distance > 0) {

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



    /*==================================
    =       Prevent Drag Image        =
    ==================================*/

    image.addEventListener(

        "dragstart",

        (event) => {

            event.preventDefault();

        }

    );



    /*==================================
    =       Disable Context Menu      =
    ==================================*/

    image.addEventListener(

        "contextmenu",

        (event) => {

            event.preventDefault();

        }

    );

                              /*==================================
    =       Fried Egg Cursor 🍳       =
    ==================================*/

    if (window.matchMedia("(hover: hover)").matches) {

        const egg = document.createElement("div");

        egg.className = "lb-egg";

        document.body.appendChild(egg);

        let mouseX = window.innerWidth / 2;
        let mouseY = window.innerHeight / 2;

        let eggX = mouseX;
        let eggY = mouseY;

        document.addEventListener("mousemove", (event) => {

            mouseX = event.clientX;
            mouseY = event.clientY;

        });

        function animateEgg() {

            eggX += (mouseX - eggX) * 0.18;
            eggY += (mouseY - eggY) * 0.18;

            egg.style.left = eggX + "px";
            egg.style.top = eggY + "px";

            requestAnimationFrame(animateEgg);

        }

        animateEgg();



        /*==================================
        =          Hover State           =
        ==================================*/

        function bindHover(element, className) {

            if (!element) return;

            element.addEventListener("mouseenter", () => {

                egg.classList.add(className);

            });

            element.addEventListener("mouseleave", () => {

                egg.classList.remove(className);

            });

        }

        bindHover(prev, "prev-hover");
        bindHover(next, "next-hover");
        bindHover(close, "close-hover");
        bindHover(download, "download-hover");



        /*==================================
        =          Bubble Trail          =
        ==================================*/

        let bubbleTimer = null;

        function createBubble() {

            const bubble = document.createElement("div");

            bubble.className = "lb-bubble";

            bubble.style.left = eggX + "px";
            bubble.style.top = eggY + "px";

            const size = 6 + Math.random() * 8;

            bubble.style.width = size + "px";
            bubble.style.height = size + "px";

            document.body.appendChild(bubble);

            const angle = Math.random() * Math.PI * 2;
            const distance = 15 + Math.random() * 30;

            const dx = Math.cos(angle) * distance;
            const dy = Math.sin(angle) * distance;

            bubble.animate(

                [

                    {

                        transform:
                            "translate(0,0) scale(.5)",

                        opacity: .9

                    },

                    {

                        transform:
                            `translate(${dx}px,${dy}px) scale(1.4)`,

                        opacity: 0

                    }

                ],

                {

                    duration: 700,

                    easing: "ease-out"

                }

            );

            setTimeout(() => {

                bubble.remove();

            }, 700);

        }



        download.addEventListener("mouseenter", () => {

            bubbleTimer = setInterval(

                createBubble,

                90

            );

        });



        download.addEventListener("mouseleave", () => {

            clearInterval(bubbleTimer);

        });

    }



    /*==================================
    =          Initialize             =
    ==================================*/

    collectImages();

});
