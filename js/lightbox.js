document.addEventListener("DOMContentLoaded", () => {

    const lightbox = document.getElementById("lightbox");

    if (!lightbox) return;

    const image = document.getElementById("lightbox-image");
    const caption = document.getElementById("lightbox-caption");
    const counter = document.getElementById("lightbox-counter");

    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");

    let images = [];
    let currentIndex = 0;
    let isAnimating = false;

    /* ===========================
       Counter
    =========================== */

    function updateCounter() {

        if (!counter) return;

        counter.textContent = `${currentIndex + 1} / ${images.length}`;

    }

    /* ===========================
       Caption
    =========================== */

    function updateCaption() {

        if (!caption) return;

        const text = images[currentIndex].alt.trim();

        caption.textContent =
            text !== ""
                ? text
                : `Photo ${currentIndex + 1}`;

    }

    /* ===========================
       Navigation
    =========================== */

    function updateNavigation() {

        if (images.length <= 1) {

            lightbox.classList.add("single");

            return;

        }

        lightbox.classList.remove("single");

    }

    /* ===========================
       Load Image
    =========================== */

    function loadImage(index) {

        if (isAnimating) return;

        isAnimating = true;

        image.classList.add("loading");

        image.style.opacity = "0";

        const newImage = new Image();

        newImage.src = images[index].src;

        newImage.onload = () => {

            currentIndex = index;

            image.src = newImage.src;

            image.alt = images[index].alt;

            updateCaption();

            updateCounter();

            updateNavigation();

            requestAnimationFrame(() => {

                image.classList.remove("loading");

                image.style.opacity = "1";

                isAnimating = false;

            });

        };

    }

    /* ===========================
       Open
    =========================== */

    function open(index) {

        loadImage(index);

        lightbox.classList.add("show");

        document.body.style.overflow = "hidden";

    }

    /* ===========================
       Close
    =========================== */

    function close() {

        lightbox.classList.remove("show");

        document.body.style.overflow = "";

    }

    /* ===========================
       Previous
    =========================== */

    function previous() {

        const index =
            (currentIndex - 1 + images.length) % images.length;

        loadImage(index);

    }

    /* ===========================
       Next
    =========================== */

    function next() {

        const index =
            (currentIndex + 1) % images.length;

        loadImage(index);

    }

    /* ===========================
       Click Image
    =========================== */

    document.addEventListener("click", (event) => {

        const target =
            event.target.closest(".lightbox-trigger");

        if (!target) return;

        event.preventDefault();

        images = Array.from(
            document.querySelectorAll(".lightbox-trigger")
        );

        open(images.indexOf(target));

    });

    /* ===========================
       Buttons
    =========================== */

    closeBtn?.addEventListener("click", close);

    prevBtn?.addEventListener("click", previous);

    nextBtn?.addEventListener("click", next);

    /* ===========================
       Click Background
    =========================== */

    lightbox.addEventListener("click", (event) => {

        if (event.target === lightbox) {

            close();

        }

    });

    /* ===========================
       Keyboard
    =========================== */

    document.addEventListener("keydown", (event) => {

        if (!lightbox.classList.contains("show")) return;

        switch (event.key) {

            case "Escape":

                close();

                break;

            case "ArrowLeft":

                if (images.length > 1) {

                    previous();

                }

                break;

            case "ArrowRight":

                if (images.length > 1) {

                    next();

                }

                break;

        }

    });

    /* ===========================
       Swipe (Mobile)
    =========================== */

    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener("touchstart", (event) => {

        touchStartX = event.changedTouches[0].screenX;

    });

    lightbox.addEventListener("touchend", (event) => {

        touchEndX = event.changedTouches[0].screenX;

        const distance = touchStartX - touchEndX;

        if (Math.abs(distance) < 50) return;

        if (distance > 0) {

            if (images.length > 1) next();

        } else {

            if (images.length > 1) previous();

        }

    });

});
