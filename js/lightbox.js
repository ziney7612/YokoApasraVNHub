/* ==========================================================
   VNHub Lightbox v2
   Part 1.1
========================================================== */

class Lightbox {

    constructor(options = {}) {

        this.options = {

            gallerySelector: ".gallery",

            imageSelector: ".gallery-img",

            maxScale: 5,

            minScale: 1,

            zoomStep: 0.25,

            preload: true,

            history: true,

            keyboard: true,

            swipe: true,

            ...options

        };

        this.images = [];

        this.current = 0;

        this.isOpen = false;

        this.isAnimating = false;

        this.scale = 1;

        this.translate = {

            x: 0,

            y: 0

        };

        this.drag = {

            active: false,

            startX: 0,

            startY: 0,

            originX: 0,

            originY: 0

        };

        this.touch = {

            startX: 0,

            startY: 0,

            lastTap: 0,

            pinch: false,

            distance: 0,

            startScale: 1

        };

        this.dom = {};

    }

    /* ==========================================
       INIT
    ========================================== */

    init() {

        this.collectImages();

        this.createUI();

        this.cacheDOM();

        this.bindEvents();

        this.openFromHash();

    }

    /* ==========================================
       COLLECT
    ========================================== */

    collectImages() {

        this.images = [

            ...document.querySelectorAll(

                this.options.imageSelector

            )

        ];

    }

    /* ==========================================
       CREATE UI
    ========================================== */

    createUI() {

        if (

            document.getElementById(

                "lightbox"

            )

        ) return;

        document.body.insertAdjacentHTML(

            "beforeend",

`

<div id="lightbox" class="lightbox">

    <button
        class="lightbox-close"
        aria-label="Close">
    </button>

    <button
        class="lightbox-prev"
        aria-label="Previous">
    </button>

    <div class="lightbox-stage">

        <img
            id="lightbox-image"
            draggable="false"
            alt="">

        <div
            class="lightbox-loading">

        </div>

    </div>

    <button
        class="lightbox-next"
        aria-label="Next">
    </button>

    <div class="lightbox-top">

        <div
            id="lightbox-counter"
            class="lightbox-counter">

        </div>

        <div
            class="lightbox-toolbar">

            <a
                id="lightbox-download"
                class="lightbox-download"
                download>

                Download

            </a>

        </div>

    </div>

    <div
        class="lightbox-bottom">

        <div
            id="lightbox-caption"
            class="lightbox-caption">

        </div>

    </div>

</div>

`

        );

    }

    /* ==========================================
       CACHE DOM
    ========================================== */

    cacheDOM() {

        this.dom.lightbox =

            document.getElementById(

                "lightbox"

            );

        this.dom.stage =

            this.dom.lightbox.querySelector(

                ".lightbox-stage"

            );

        this.dom.image =

            document.getElementById(

                "lightbox-image"

            );

        this.dom.loading =

            this.dom.lightbox.querySelector(

                ".lightbox-loading"

            );

        this.dom.counter =

            document.getElementById(

                "lightbox-counter"

            );

        this.dom.caption =

            document.getElementById(

                "lightbox-caption"

            );

        this.dom.download =

            document.getElementById(

                "lightbox-download"

            );

        this.dom.close =

            this.dom.lightbox.querySelector(

                ".lightbox-close"

            );

        this.dom.prev =

            this.dom.lightbox.querySelector(

                ".lightbox-prev"

            );

        this.dom.next =

            this.dom.lightbox.querySelector(

                ".lightbox-next"

            );

    }

    /* ==========================================
       OPEN
    ========================================== */

    open(index = 0) {

        if (!this.images.length) return;

        this.current = index;

        this.isOpen = true;

        this.show(index);

        this.dom.lightbox.classList.add(

            "show"

        );

        document.body.style.overflow =

            "hidden";

    }

    /* ==========================================
       CLOSE
    ========================================== */

    close() {

        this.isOpen = false;

        this.resetView();

        this.dom.lightbox.classList.remove(

            "show"

        );

        document.body.style.overflow = "";

        if (

            this.options.history

        ) {

            history.replaceState(

                null,

                "",

                location.pathname

            );

        }

    }

    /* ==========================================
       SHOW
    ========================================== */

    show(index) {

        const image =

            this.images[index];

        if (!image) return;

        this.current = index;

        this.dom.loading.classList.add(

            "show"

        );

        const src =

            image.dataset.full ||

            image.src;

        this.dom.image.onload = () => {

            this.dom.loading.classList.remove(

                "show"

            );

            this.updateInfo();

        };

        this.dom.image.src = src;

        this.dom.image.alt = image.alt;

        if (

            this.options.preload

        ) {

            this.preload();

        }

    }

    /* ==========================================
       UPDATE INFO
    ========================================== */

    updateInfo() {

        const image = this.images[this.current];

        if (!image) return;

        this.dom.counter.textContent =

            `${this.current + 1} / ${this.images.length}`;

        this.dom.caption.textContent =

            image.alt || "";

        const src =

            image.dataset.full ||

            image.src;

        this.dom.download.href = src;

        const parts = src.split("/");

        const folder = parts[parts.length - 2];

        const file = parts[parts.length - 1];

        this.dom.download.download =

            `yoko-${folder}-${file}`;

        if (this.options.history) {

            history.replaceState(

                null,

                "",

                `${location.pathname}#photo=${this.current + 1}`

            );

        }

    }

    /* ==========================================
       PRELOAD
    ========================================== */

    preload() {

        [

            this.current - 1,

            this.current + 1,

            this.current + 2

        ].forEach(index => {

            if (

                index < 0 ||

                index >= this.images.length

            ) return;

            const preload = new Image();

            preload.src =

                this.images[index].dataset.full ||

                this.images[index].src;

        });

    }

    /* ==========================================
       PREVIOUS
    ========================================== */

    previous() {

        let index = this.current - 1;

        if (index < 0) {

            index = this.images.length - 1;

        }

        this.show(index);

    }

    /* ==========================================
       NEXT
    ========================================== */

    next() {

        let index = this.current + 1;

        if (index >= this.images.length) {

            index = 0;

        }

        this.show(index);

    }

    /* ==========================================
       RESET VIEW
    ========================================== */

    resetView() {

        this.scale = 1;

        this.translate.x = 0;

        this.translate.y = 0;

        this.applyTransform();

    }

    /* ==========================================
       APPLY TRANSFORM
    ========================================== */

    applyTransform() {

        this.dom.image.style.transform =

            `translate3d(${this.translate.x}px, ${this.translate.y}px,0)
             scale(${this.scale})`;

    }

    /* ==========================================
       OPEN FROM HASH
    ========================================== */

    openFromHash() {

        if (!location.hash) return;

        const match =

            location.hash.match(/photo=(\d+)/);

        if (!match) return;

        const index =

            Number(match[1]) - 1;

        if (

            index < 0 ||

            index >= this.images.length

        ) return;

        this.open(index);

    }

    /* ==========================================
       GALLERY CLICK
    ========================================== */

    onGalleryClick(event) {

        const image =

            event.target.closest(

                this.options.imageSelector

            );

        if (!image) return;

        event.preventDefault();

        this.collectImages();

        this.open(

            this.images.indexOf(image)

        );

    }

    /* ==========================================
       BACKGROUND CLICK
    ========================================== */

    onBackdropClick(event) {

        if (

            event.target === this.dom.lightbox

        ) {

            this.close();

        }

    }

    /* ==========================================
       BUTTON EVENTS
    ========================================== */

    bindButtons() {

        this.dom.close.addEventListener(

            "click",

            () => this.close()

        );

        this.dom.prev.addEventListener(

            "click",

            () => this.previous()

        );

        this.dom.next.addEventListener(

            "click",

            () => this.next()

        );

    }

    /* ==========================================
       KEYBOARD
    ========================================== */

    onKeyDown(event) {

        if (!this.isOpen) return;

        switch (event.key) {

            case "Escape":

                this.close();

                break;

            case "ArrowLeft":

                this.previous();

                break;

            case "ArrowRight":

                this.next();

                break;

        }

    }

    /* ==========================================
       TOUCH START
    ========================================== */

    onTouchStart(event) {

        if (!this.options.swipe) return;

        if (event.touches.length !== 1) return;

        this.touch.startX =

            event.touches[0].clientX;

        this.touch.startY =

            event.touches[0].clientY;

    }

    /* ==========================================
       TOUCH END
    ========================================== */

    onTouchEnd(event) {

        if (!this.options.swipe) return;

        if (!this.isOpen) return;

        if (this.scale > 1) return;

        const endX =

            event.changedTouches[0].clientX;

        const endY =

            event.changedTouches[0].clientY;

        const diffX =

            endX - this.touch.startX;

        const diffY =

            endY - this.touch.startY;

        if (

            Math.abs(diffX) < 60 ||

            Math.abs(diffX) < Math.abs(diffY)

        ) {

            return;

        }

        if (diffX > 0) {

            this.previous();

        }

        else {

            this.next();

        }

    }

    /* ==========================================
       CUSTOM EVENT
    ========================================== */

    bindCustomEvents() {

        document.addEventListener(

            "gallery:open",

            (event) => {

                if (

                    typeof event.detail.index ===

                    "number"

                ) {

                    this.collectImages();

                    this.open(

                        event.detail.index

                    );

                }

            }

        );

    }

    /* ==========================================
       BIND EVENTS
    ========================================== */

    bindEvents() {

        this.bindButtons();

        document.addEventListener(

            "click",

            this.onGalleryClick.bind(this)

        );

        document.addEventListener(

            "keydown",

            this.onKeyDown.bind(this)

        );

        this.dom.lightbox.addEventListener(

            "click",

            this.onBackdropClick.bind(this)

        );

        this.dom.lightbox.addEventListener(

            "touchstart",

            this.onTouchStart.bind(this),

            {

                passive: true

            }

        );

        this.dom.lightbox.addEventListener(

            "touchend",

            this.onTouchEnd.bind(this),

            {

                passive: true

            }

        );

        this.bindCustomEvents();

    }

}

/* ==========================================
   INIT
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        const lightbox =

            new Lightbox();

        lightbox.init();

    }

);

    /* ==========================================
       ZOOM ENGINE
    ========================================== */

    initZoom() {

        this.scale = 1;

        this.translate.x = 0;

        this.translate.y = 0;

        this.zooming = false;

        this.drag.active = false;

        this.applyTransform();

    }

    /* ==========================================
       SET SCALE
    ========================================== */

    setScale(scale) {

        this.scale = Math.max(

            this.options.minScale,

            Math.min(

                this.options.maxScale,

                scale

            )

        );

    }

    /* ==========================================
       ZOOM TO POINT
    ========================================== */

    zoomTo(clientX, clientY, delta) {

        const rect =

            this.dom.image.getBoundingClientRect();

        const oldScale = this.scale;

        let newScale =

            oldScale +

            delta * this.options.zoomStep;

        this.setScale(newScale);

        newScale = this.scale;

        if (oldScale === newScale) return;

        const offsetX =

            clientX - rect.left;

        const offsetY =

            clientY - rect.top;

        const ratio =

            newScale / oldScale;

        this.translate.x -=

            (offsetX - rect.width / 2) *

            (ratio - 1);

        this.translate.y -=

            (offsetY - rect.height / 2) *

            (ratio - 1);

        this.limitTranslate();

        this.applyTransform();

        this.updateZoomLabel();

    }

    /* ==========================================
       WHEEL
    ========================================== */

    onWheel(event) {

        if (!this.isOpen) return;

        event.preventDefault();

        this.zoomTo(

            event.clientX,

            event.clientY,

            event.deltaY < 0 ? 1 : -1

        );

    }

    /* ==========================================
       DOUBLE CLICK
    ========================================== */

    onDoubleClick(event) {

        if (!this.isOpen) return;

        if (this.scale === 1) {

            this.setScale(2.5);

        }

        else {

            this.setScale(1);

            this.translate.x = 0;

            this.translate.y = 0;

        }

        this.applyTransform();

        this.updateZoomLabel();

    }

    /* ==========================================
       DRAG START
    ========================================== */

    onPointerDown(event) {

        if (!this.isOpen) return;

        if (this.scale <= 1) return;

        event.preventDefault();

        this.drag.active = true;

        this.drag.startX = event.clientX;

        this.drag.startY = event.clientY;

        this.drag.originX = this.translate.x;

        this.drag.originY = this.translate.y;

        this.dom.image.style.cursor =

            "grabbing";

    }

    /* ==========================================
       DRAG MOVE
    ========================================== */

    onPointerMove(event) {

        if (!this.drag.active) return;

        const dx =

            event.clientX -

            this.drag.startX;

        const dy =

            event.clientY -

            this.drag.startY;

        this.translate.x =

            this.drag.originX + dx;

        this.translate.y =

            this.drag.originY + dy;

        this.limitTranslate();

        this.applyTransform();

    }

    /* ==========================================
       DRAG END
    ========================================== */

    onPointerUp() {

        this.drag.active = false;

        if (this.scale > 1) {

            this.dom.image.style.cursor =

                "grab";

        }

    }

    /* ==========================================
       LIMIT TRANSLATE
    ========================================== */

    limitTranslate() {

        if (this.scale <= 1) {

            this.translate.x = 0;

            this.translate.y = 0;

            return;

        }

        const rect =

            this.dom.image.getBoundingClientRect();

        const overflowX =

            Math.max(

                0,

                (rect.width * this.scale - rect.width) / 2

            );

        const overflowY =

            Math.max(

                0,

                (rect.height * this.scale - rect.height) / 2

            );

        this.translate.x = Math.min(

            overflowX,

            Math.max(

                -overflowX,

                this.translate.x

            )

        );

        this.translate.y = Math.min(

            overflowY,

            Math.max(

                -overflowY,

                this.translate.y

            )

        );

    }

    /* ==========================================
       UPDATE CURSOR
    ========================================== */

    updateCursor() {

        if (this.scale <= 1) {

            this.dom.image.style.cursor = "";

            return;

        }

        this.dom.image.style.cursor =

            this.drag.active

                ? "grabbing"

                : "grab";

    }

    /* ==========================================
       UPDATE ZOOM LABEL
    ========================================== */

    updateZoomLabel() {

        if (!this.dom.zoomLabel) return;

        this.dom.zoomLabel.textContent =

            `${Math.round(this.scale * 100)}%`;

    }

    /* ==========================================
       APPLY TRANSFORM
    ========================================== */

    applyTransform() {

        this.limitTranslate();

        this.dom.image.style.transform =

`translate3d(${this.translate.x}px,${this.translate.y}px,0)
 scale(${this.scale})`;

        this.updateCursor();

        this.updateZoomLabel();

    }

    /* ==========================================
       CREATE ZOOM LABEL
    ========================================== */

    createZoomLabel() {

        if (this.dom.zoomLabel) return;

        this.dom.zoomLabel =

            document.createElement("div");

        this.dom.zoomLabel.className =

            "lightbox-zoom";

        this.dom.zoomLabel.textContent =

            "100%";

        this.dom.lightbox.appendChild(

            this.dom.zoomLabel

        );

    }

    /* ==========================================
       RESET ZOOM
    ========================================== */

    resetZoom() {

        this.scale = 1;

        this.translate.x = 0;

        this.translate.y = 0;

        this.applyTransform();

    }

    /* ==========================================
       ENABLE ZOOM
    ========================================== */

    bindZoom() {

        this.createZoomLabel();

        this.initZoom();

        this.dom.image.addEventListener(

            "wheel",

            this.onWheel.bind(this),

            {

                passive: false

            }

        );

        this.dom.image.addEventListener(

            "dblclick",

            this.onDoubleClick.bind(this)

        );

        this.dom.image.addEventListener(

            "pointerdown",

            this.onPointerDown.bind(this)

        );

        window.addEventListener(

            "pointermove",

            this.onPointerMove.bind(this)

        );

        window.addEventListener(

            "pointerup",

            this.onPointerUp.bind(this)

        );

    }

    /* ==========================================
       DOUBLE TAP
    ========================================== */

    onDoubleTap(event) {

        if (!this.isOpen) return;

        const now = Date.now();

        const delay =

            now - this.touch.lastTap;

        this.touch.lastTap = now;

        if (

            delay < 300 &&

            delay > 0

        ) {

            event.preventDefault();

            if (this.scale === 1) {

                this.setScale(2.5);

            }

            else {

                this.resetZoom();

                return;

            }

            this.applyTransform();

        }

    }

    /* ==========================================
       PINCH START
    ========================================== */

    onPinchStart(event) {

        if (

            event.touches.length !== 2

        ) return;

        event.preventDefault();

        this.touch.pinch = true;

        const dx =

            event.touches[0].clientX -

            event.touches[1].clientX;

        const dy =

            event.touches[0].clientY -

            event.touches[1].clientY;

        this.touch.distance =

            Math.hypot(dx, dy);

        this.touch.startScale =

            this.scale;

    }

    /* ==========================================
       PINCH MOVE
    ========================================== */

    onPinchMove(event) {

        if (!this.touch.pinch) return;

        if (

            event.touches.length !== 2

        ) return;

        event.preventDefault();

        const dx =

            event.touches[0].clientX -

            event.touches[1].clientX;

        const dy =

            event.touches[0].clientY -

            event.touches[1].clientY;

        const distance =

            Math.hypot(dx, dy);

        const ratio =

            distance /

            this.touch.distance;

        this.setScale(

            this.touch.startScale *

            ratio

        );

        this.applyTransform();

    }

    /* ==========================================
       PINCH END
    ========================================== */

    onPinchEnd(event) {

        if (

            event.touches.length > 1

        ) return;

        this.touch.pinch = false;

        if (

            this.scale <= 1

        ) {

            this.resetZoom();

        }

    }

    /* ==========================================
       TOUCH ROUTER
    ========================================== */

    onImageTouchStart(event) {

        if (

            event.touches.length === 2

        ) {

            this.onPinchStart(event);

            return;

        }

        this.onDoubleTap(event);

    }

    onImageTouchMove(event) {

        if (

            this.touch.pinch

        ) {

            this.onPinchMove(event);

        }

    }

    onImageTouchEnd(event) {

        if (

            this.touch.pinch

        ) {

            this.onPinchEnd(event);

        }

    }

    /* ==========================================
       EXTEND ZOOM
    ========================================== */

    bindZoom() {

        this.createZoomLabel();

        this.initZoom();

        this.dom.image.addEventListener(

            "wheel",

            this.onWheel.bind(this),

            {

                passive:false

            }

        );

        this.dom.image.addEventListener(

            "dblclick",

            this.onDoubleClick.bind(this)

        );

        this.dom.image.addEventListener(

            "pointerdown",

            this.onPointerDown.bind(this)

        );

        window.addEventListener(

            "pointermove",

            this.onPointerMove.bind(this)

        );

        window.addEventListener(

            "pointerup",

            this.onPointerUp.bind(this)

        );

        this.dom.image.addEventListener(

            "touchstart",

            this.onImageTouchStart.bind(this),

            {

                passive:false

            }

        );

        this.dom.image.addEventListener(

            "touchmove",

            this.onImageTouchMove.bind(this),

            {

                passive:false

            }

        );

        this.dom.image.addEventListener(

            "touchend",

            this.onImageTouchEnd.bind(this),

            {

                passive:false

            }

        );

    }

    /* ==========================================
       CREATE TOOLBAR
    ========================================== */

    createToolbar() {

        if (this.dom.toolbarReady) return;

        this.dom.toolbarReady = true;

        const toolbar =

            this.dom.lightbox.querySelector(

                ".lightbox-toolbar"

            );

        toolbar.insertAdjacentHTML(

            "beforeend",

`

<button
    class="lightbox-share"
    title="Share">

    Share

</button>

<button
    class="lightbox-fullscreen"
    title="Fullscreen">

    Fullscreen

</button>

<div
    class="lightbox-info">

    <span
        class="lightbox-resolution">

        --

    </span>

    <span
        class="lightbox-filesize">

        --

    </span>

</div>

`

        );

        this.dom.share =

            toolbar.querySelector(

                ".lightbox-share"

            );

        this.dom.fullscreen =

            toolbar.querySelector(

                ".lightbox-fullscreen"

            );

        this.dom.resolution =

            toolbar.querySelector(

                ".lightbox-resolution"

            );

        this.dom.filesize =

            toolbar.querySelector(

                ".lightbox-filesize"

            );

    }

    /* ==========================================
       IMAGE INFO
    ========================================== */

    async updateImageInfo() {

        const img = this.dom.image;

        this.dom.resolution.textContent =

            `${img.naturalWidth} × ${img.naturalHeight}`;

        try {

            const response = await fetch(

                img.src,

                {

                    method:"HEAD"

                }

            );

            const length =

                response.headers.get(

                    "content-length"

                );

            if (!length) {

                this.dom.filesize.textContent =

                    "--";

                return;

            }

            const size =

                Number(length);

            const units =

                [

                    "B",

                    "KB",

                    "MB",

                    "GB"

                ];

            let index = 0;

            let value = size;

            while (

                value >= 1024 &&

                index < units.length - 1

            ) {

                value /= 1024;

                index++;

            }

            this.dom.filesize.textContent =

                `${value.toFixed(1)} ${units[index]}`;

        }

        catch {

            this.dom.filesize.textContent =

                "--";

        }

    }

    /* ==========================================
       SHARE
    ========================================== */

    async shareImage() {

        if (

            !navigator.share

        ) {

            alert(

                "Share is not supported."

            );

            return;

        }

        try {

            await navigator.share({

                title:

                    document.title,

                text:

                    this.dom.caption.textContent,

                url:

                    this.dom.image.src

            });

        }

        catch {}

    }

    /* ==========================================
       FULLSCREEN
    ========================================== */

    toggleFullscreen() {

        if (

            !document.fullscreenElement

        ) {

            this.dom.lightbox.requestFullscreen?.();

        }

        else {

            document.exitFullscreen?.();

        }

    }

    /* ==========================================
       TOOLBAR EVENTS
    ========================================== */

    bindToolbar() {

        this.createToolbar();

        this.dom.share.addEventListener(

            "click",

            () =>

                this.shareImage()

        );

        this.dom.fullscreen.addEventListener(

            "click",

            () =>

                this.toggleFullscreen()

        );

    }

    /* ==========================================
       UPDATE INFO EXTEND
    ========================================== */

    updateInfo() {

        const image =

            this.images[this.current];

        if (!image) return;

        this.dom.counter.textContent =

            `${this.current + 1} / ${this.images.length}`;

        this.dom.caption.textContent =

            image.alt || "";

        const src =

            image.dataset.full ||

            image.src;

        this.dom.download.href = src;

        const parts =

            src.split("/");

        this.dom.download.download =

            `yoko-${parts.at(-2)}-${parts.at(-1)}`;

        this.updateImageInfo();

    }

    /* ==========================================
       IMAGE CACHE
    ========================================== */

    initCache() {

        this.cache = new Map();

        this.maxCache = 20;

    }

    cacheImage(src) {

        if (this.cache.has(src)) return;

        const img = new Image();

        img.decoding = "async";

        img.loading = "eager";

        img.src = src;

        this.cache.set(src, img);

        if (this.cache.size > this.maxCache) {

            const firstKey =

                this.cache.keys().next().value;

            this.cache.delete(firstKey);

        }

    }

    /* ==========================================
       SMART PRELOAD
    ========================================== */

    smartPreload() {

        if (!this.options.preload) return;

        [

            this.current - 2,

            this.current - 1,

            this.current + 1,

            this.current + 2,

            this.current + 3

        ].forEach(index => {

            if (

                index < 0 ||

                index >= this.images.length

            ) return;

            const src =

                this.images[index].dataset.full ||

                this.images[index].src;

            this.cacheImage(src);

        });

    }

    /* ==========================================
       FADE IMAGE
    ========================================== */

    fadeImage(callback) {

        this.dom.image.classList.add(

            "lightbox-fade"

        );

        requestAnimationFrame(() => {

            requestAnimationFrame(() => {

                callback();

            });

        });

    }

    /* ==========================================
       LOADED
    ========================================== */

    onImageLoaded() {

        this.dom.loading.classList.remove(

            "show"

        );

        this.dom.image.classList.remove(

            "lightbox-fade"

        );

        this.updateInfo();

        this.smartPreload();

        this.resetZoom();

    }

    /* ==========================================
       SHOW (OPTIMIZED)
    ========================================== */

    show(index) {

        const image =

            this.images[index];

        if (!image) return;

        this.current = index;

        this.dom.loading.classList.add(

            "show"

        );

        const src =

            image.dataset.full ||

            image.src;

        this.fadeImage(() => {

            if (

                this.cache.has(src)

            ) {

                this.dom.image.src = src;

            }

            else {

                this.dom.image.src = src;

            }

        });

        this.dom.image.alt =

            image.alt || "";

        this.dom.image.onload =

            () => this.onImageLoaded();

    }

    /* ==========================================
       LOADING SPINNER
    ========================================== */

    createSpinner() {

        if (

            this.dom.spinner

        ) return;

        this.dom.spinner =

            document.createElement(

                "div"

            );

        this.dom.spinner.className =

            "lightbox-spinner";

        this.dom.loading.appendChild(

            this.dom.spinner

        );

    }

    /* ==========================================
       PREFETCH NEXT
    ========================================== */

    prefetchNext() {

        const next =

            this.current + 1;

        if (

            next >=

            this.images.length

        ) return;

        const src =

            this.images[next].dataset.full ||

            this.images[next].src;

        const link =

            document.createElement(

                "link"

            );

        link.rel =

            "prefetch";

        link.as =

            "image";

        link.href =

            src;

        document.head.appendChild(

            link

        );

    }

    /* ==========================================
       PERFORMANCE
    ========================================== */

    optimizeImage() {

        this.dom.image.decoding =

            "async";

        this.dom.image.fetchPriority =

            "high";

        this.dom.image.loading =

            "eager";

    }

    /* ==========================================
       INIT PERFORMANCE
    ========================================== */

    initPerformance() {

        this.initCache();

        this.createSpinner();

        this.optimizeImage();

    }

    /* ==========================================
       HISTORY API
    ========================================== */

    updateHistory() {

        if (!this.options.history) return;

        const url = new URL(location.href);

        url.hash = `photo=${this.current + 1}`;

        history.replaceState(

            {

                photo: this.current

            },

            "",

            url

        );

    }

    restoreHistory() {

        if (!location.hash) return;

        const match =

            location.hash.match(

                /photo=(\d+)/

            );

        if (!match) return;

        const index =

            Number(match[1]) - 1;

        if (

            index < 0 ||

            index >= this.images.length

        ) return;

        this.open(index);

    }

    /* ==========================================
       POPSTATE
    ========================================== */

    onPopState() {

        if (!location.hash) {

            if (this.isOpen) {

                this.close();

            }

            return;

        }

        this.restoreHistory();

    }

    /* ==========================================
       PUBLIC API
    ========================================== */

    go(index) {

        if (

            index < 0 ||

            index >= this.images.length

        ) return;

        this.show(index);

    }

    first() {

        this.go(0);

    }

    last() {

        this.go(

            this.images.length - 1

        );

    }

    currentImage() {

        return

            this.images[

                this.current

            ];

    }

    /* ==========================================
       DESTROY
    ========================================== */

    destroy() {

        this.close();

        this.cache.clear();

        this.images = [];

        this.dom.lightbox.remove();

    }

    /* ==========================================
       READY
    ========================================== */

    ready() {

        this.initPerformance();

        this.bindToolbar();

        this.bindZoom();

        this.restoreHistory();

        window.addEventListener(

            "popstate",

            this.onPopState.bind(this)

        );

    }

}

/* ==========================================
   BOOT
========================================== */

document.addEventListener(

    "DOMContentLoaded",

    () => {

        window.VNHubLightbox =

            new Lightbox({

                preload: true,

                history: true,

                swipe: true,

                keyboard: true,

                maxScale: 5,

                minScale: 1,

                zoomStep: 0.25

            });

        VNHubLightbox.init();

        VNHubLightbox.ready();

    }

);
