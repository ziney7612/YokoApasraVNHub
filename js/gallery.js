/* ==========================================================
   VNHub Gallery Engine v2
   Author: ChatGPT
   ========================================================== */

class Gallery {

    constructor() {

        this.gallery = document.querySelector("#gallery");

        if (!this.gallery) return;

        this.folder = this.gallery.dataset.folder || "";

        this.total = Number(this.gallery.dataset.total || 0);

        this.extension = this.gallery.dataset.extension || "jpg";

        this.basePath = "../assets/events";

        this.padding = 3;

        this.preloadCount = 3;

        this.images = [];

    }

    init() {

        if (!this.gallery) return;

        this.createGallery();

        this.observeImages();

        this.bindEvents();

    }

    buildImagePath(index) {

        return `${this.basePath}/${this.folder}/${String(index).padStart(this.padding, "0")}.${this.extension}`;

    }

    createImage(index) {

        const img = document.createElement("img");

        img.className = "gallery-img";

        img.loading = "lazy";

        img.decoding = "async";

        img.draggable = false;

        img.alt = `${this.folder} ${index}`;

        img.dataset.index = index;

        img.dataset.folder = this.folder;

        img.dataset.full = this.buildImagePath(index);

        img.src = this.buildImagePath(index);

        img.addEventListener("load", () => {

            img.classList.add("loaded");

        });

        img.addEventListener("error", () => {

            img.classList.add("error");

            img.src =
                "data:image/svg+xml;charset=UTF-8," +
                encodeURIComponent(`
                    <svg xmlns="http://www.w3.org/2000/svg"
                    width="600"
                    height="600">

                    <rect width="100%" height="100%" fill="#202020"/>

                    <text
                    x="50%"
                    y="50%"
                    text-anchor="middle"
                    fill="#888"
                    font-size="28"
                    dy=".3em">

                    Image Missing

                    </text>

                    </svg>
                `);

        });

        this.images.push(img);

        return img;

    }

    createGallery() {

        const fragment = document.createDocumentFragment();

        for (let i = 1; i <= this.total; i++) {

            fragment.appendChild(

                this.createImage(i)

            );

        }

        this.gallery.appendChild(fragment);

    }

    observeImages() {

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) return;

                const img = entry.target;

                img.classList.add("visible");

                observer.unobserve(img);

            });

        }, {

            rootMargin: "300px"

        });

        this.images.forEach(img => observer.observe(img));

    }

    preload(index) {

        for (let i = 1; i <= this.preloadCount; i++) {

            const preload = new Image();

            preload.src = this.buildImagePath(index + i);

        }

    }

    bindEvents() {

        this.gallery.addEventListener("click", e => {

            const img = e.target.closest(".gallery-img");

            if (!img) return;

            const index = Number(img.dataset.index);

            this.preload(index);

            document.dispatchEvent(new CustomEvent("gallery:open", {

                detail: {

                    index,

                    folder: this.folder,

                    total: this.total,

                    extension: this.extension

                }

            }));

        });

    }

}

document.addEventListener("DOMContentLoaded", () => {

    const gallery = new Gallery();

    gallery.init();

});
