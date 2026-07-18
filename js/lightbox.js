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

        if (!lightbox || !image)
            return;

        const closeBtn =
            document.querySelector(
                ".lightbox-close"
            );

        const prevBtn =
            document.querySelector(
                ".lightbox-prev"
            );

        const nextBtn =
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


/* ==================================
   ADD DOWNLOAD BUBBLES
================================== */

if (download) {

    download.insertAdjacentHTML(

        "afterbegin",

        `
        <span class="bubble"></span>
        <span class="bubble"></span>
        <span class="bubble"></span>
        `
    );

}

        let gallery = [];
        let current = 0;
        let zoom = 1;
        let touchStart = 0;

        function collect() {

            gallery = [
                ...document.querySelectorAll(
                    ".lightbox-trigger"
                )
            ];

        }

        window.refreshLightbox =
            collect;

        function getSrc(item) {

            return (
                item.getAttribute("href") ||
                item.dataset.src ||
                ""
            );

        }

        function getImg(item) {

            return (
                item.querySelector("img")
            );

        }

        function resetZoom() {

            zoom = 1;

            image.style.transform =
                "scale(1)";

        }

        function preload(index) {

            if (
                index < 0 ||
                index >= gallery.length
            ) return;

            const img =
                new Image();

            img.src =
                getSrc(
                    gallery[index]
                );

        }

        function preloadNearby() {

            preload(current - 1);
            preload(current + 1);

        }

        function updateUI() {

            const item =
                gallery[current];

            if (!item) return;

            const img =
                getImg(item);

            const src =
                getSrc(item);

            if (counter) {

                counter.textContent =
                    `${current + 1} / ${gallery.length}`;

            }

            if (caption) {

                caption.textContent =
                    img?.alt || "";

            }

            if (download) {

                download.href =
                    src;

            }

        }

        function show(index) {

            const item =
                gallery[index];

            if (!item)
                return;

            const src =
                getSrc(item);

            const img =
                getImg(item);

            image.classList.add(
                "loading"
            );

            const loader =
                new Image();

            loader.onload =
                () => {

                    image.src =
                        src;

                    image.alt =
                        img?.alt || "";

                    current =
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

                };

            loader.src =
                src;

        }

        function open(index) {

            collect();

            if (!gallery.length)
                return;

            lightbox.classList.add(
                "show"
            );

            document.body.classList.add(
                "lightbox-open"
            );

            show(index);

        }

        function close() {

            lightbox.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "lightbox-open"
            );

            resetZoom();

        }

        function next() {

            current++;

            if (
                current >=
                gallery.length
            ) {

                current = 0;

            }

            show(current);

        }

        function prev() {

            current--;

            if (
                current < 0
            ) {

                current =
                    gallery.length - 1;

            }

            show(current);

        }

        document.addEventListener(
            "click",
            (e) => {

                const trigger =
                    e.target.closest(
                        ".lightbox-trigger"
                    );

                if (!trigger)
                    return;

                e.preventDefault();

                collect();

                const index =
                    gallery.indexOf(
                        trigger
                    );

                if (
                    index >= 0
                ) {

                    open(index);

                }

            }
        );

        closeBtn?.addEventListener(
            "click",
            close
        );

        nextBtn?.addEventListener(
            "click",
            next
        );

        prevBtn?.addEventListener(
            "click",
            prev
        );

        lightbox.addEventListener(
            "click",
            (e) => {

                if (
                    e.target ===
                    lightbox
                ) {

                    close();

                }

            }
        );

        document.addEventListener(
            "keydown",
            (e) => {

                if (
                    !lightbox.classList.contains(
                        "show"
                    )
                ) return;

                if (
                    e.key ===
                    "Escape"
                ) {

                    close();

                }

                if (
                    e.key ===
                    "ArrowRight"
                ) {

                    next();

                }

                if (
                    e.key ===
                    "ArrowLeft"
                ) {

                    prev();

                }

            }
        );

        lightbox.addEventListener(
            "touchstart",
            (e) => {

                touchStart =
                    e.changedTouches[0]
                        .screenX;

            }
        );

        lightbox.addEventListener(
            "touchend",
            (e) => {

                const end =
                    e.changedTouches[0]
                        .screenX;

                const distance =
                    end -
                    touchStart;

                if (
                    Math.abs(
                        distance
                    ) < 60
                ) return;

                if (
                    distance > 0
                ) {

                    prev();

                }

                else {

                    next();

                }

            }
        );

        image.addEventListener(
            "click",
            (e) => {

                e.stopPropagation();

                zoom =
                    zoom === 1
                        ? 2
                        : 1;

                image.style.transform =
                    `scale(${zoom})`;

            }
        );

        lightbox.addEventListener(
            "wheel",
            (e) => {

                if (
                    !lightbox.classList.contains(
                        "show"
                    )
                ) return;

                e.preventDefault();

                zoom +=
                    e.deltaY > 0
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

        collect();

    }
);
