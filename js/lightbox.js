/* ==========================================================
   LIGHTBOX.JS
   Yoko Apasra VNHub
   Luna Edition V5
   Part 1 / 4
========================================================== */

(() => {

"use strict";

/*==========================================================
    STATE
==========================================================*/

const state = {

    gallery: [],

    currentIndex: 0,

    isOpen: false,

    initialized: false,

    touchStartX: 0,

    touchEndX: 0,

    preloadCache: new Set()

};


/*==========================================================
    DOM
==========================================================*/

const dom = {

    lightbox: null,

    image: null,

    caption: null,

    counter: null,

    download: null,

    prev: null,

    next: null,

    close: null

};


/*==========================================================
    DOM CACHE
==========================================================*/

function cacheDOM(){

    dom.lightbox =
        document.getElementById("lightbox");

    dom.image =
        document.getElementById("lightbox-image");

    dom.caption =
        document.getElementById("lightbox-caption");

    dom.counter =
        document.getElementById("lightbox-counter");

    dom.download =
        document.getElementById("lightbox-download");

    dom.prev =
        document.querySelector(".lightbox-prev");

    dom.next =
        document.querySelector(".lightbox-next");

    dom.close =
        document.querySelector(".lightbox-close");

}


/*==========================================================
    VALIDATION
==========================================================*/

function validateDOM(){

    return (

        dom.lightbox &&

        dom.image &&

        dom.caption &&

        dom.counter &&

        dom.download &&

        dom.prev &&

        dom.next &&

        dom.close

    );

}


/*==========================================================
    REFRESH GALLERY
==========================================================*/

function refreshGallery(){

    state.gallery = [

        ...document.querySelectorAll(

            ".lightbox-trigger"

        )

    ];

    state.gallery.forEach(

        (item,index)=>{

            item.dataset.index=index;

            item.removeEventListener(

                "click",

                handleThumbnailClick

            );

            item.addEventListener(

                "click",

                handleThumbnailClick

            );

        }

    );

}


/*==========================================================
    INITIALIZE
==========================================================*/

function initializeLightbox(){

    if(state.initialized){

        refreshGallery();

        return;

    }

    cacheDOM();

    if(!validateDOM()){

        console.error(

            "[Lightbox] Missing HTML elements."

        );

        return;

    }

    refreshGallery();

    bindEvents();

    state.initialized=true;

}


/*==========================================================
    THUMBNAIL CLICK
==========================================================*/

function handleThumbnailClick(event){

    event.preventDefault();

    const index = Number(

        event.currentTarget.dataset.index

    );

    open(index);

}


/*==========================================================
    OPEN
==========================================================*/

function open(index=0){

    if(!state.gallery.length){

        return;

    }

    state.currentIndex=index;

    state.isOpen=true;

    document.body.classList.add(

        "lightbox-open"

    );

    dom.lightbox.classList.add(

        "show"

    );

    show(index);

}


/*==========================================================
    CLOSE
==========================================================*/

function close(){

    if(!state.isOpen){

        return;

    }

    state.isOpen=false;

    dom.lightbox.classList.remove(

        "show"

    );

    document.body.classList.remove(

        "lightbox-open"

    );

}


/*==========================================================
    PREVIOUS
==========================================================*/

function previous(){

    if(!state.gallery.length){

        return;

    }

    state.currentIndex--;

    if(state.currentIndex<0){

        state.currentIndex=

            state.gallery.length-1;

    }

    show(state.currentIndex);

}


/*==========================================================
    NEXT
==========================================================*/

function next(){

    if(!state.gallery.length){

        return;

    }

    state.currentIndex++;

    if(

        state.currentIndex>=

        state.gallery.length

    ){

        state.currentIndex=0;

    }

    show(state.currentIndex);

}

 /*==========================================================
    SHOW IMAGE
==========================================================*/

function show(index){

    const item = state.gallery[index];

    if(!item){

        return;

    }

    const source =

        item.dataset.full ||

        item.dataset.src ||

        item.dataset.image ||

        item.getAttribute("href") ||

        item.src;

    const caption =

        item.dataset.caption ||

        item.getAttribute("alt") ||

        item.getAttribute("title") ||

        "";

    updateCounter();

    updateCaption(caption);

    updateDownload(source);

    loadImage(source);

    preloadAround(index);

}


/*==========================================================
    LOAD IMAGE
==========================================================*/

function loadImage(source){

    if(!source){

        return;

    }

    dom.image.classList.add(

        "loading"

    );

    dom.image.classList.remove(

        "loaded"

    );

    dom.image.classList.add(

        "fade-out"

    );

    const img = new Image();

    img.onload = ()=>{

        requestAnimationFrame(()=>{

            dom.image.src = source;

            dom.image.classList.remove(

                "fade-out"

            );

            dom.image.classList.add(

                "fade-in"

            );

            dom.image.classList.remove(

                "loading"

            );

            dom.image.classList.add(

                "loaded"

            );

        });

    };

    img.onerror = ()=>{

        dom.image.classList.remove(

            "loading"

        );

        dom.image.classList.remove(

            "fade-out"

        );

        console.error(

            "[Lightbox] Image failed:",

            source

        );

    };

    img.src = source;

}


/*==========================================================
    CAPTION
==========================================================*/

function updateCaption(text){

    dom.caption.textContent =

        text || "";

}


/*==========================================================
    COUNTER
==========================================================*/

function updateCounter(){

    dom.counter.textContent =

        `${state.currentIndex + 1} / ${state.gallery.length}`;

}


/*==========================================================
    DOWNLOAD
==========================================================*/

function updateDownload(url){

    dom.download.href = url;

}


/*==========================================================
    PRELOAD
==========================================================*/

function preload(source){

    if(

        !source ||

        state.preloadCache.has(source)

    ){

        return;

    }

    const img = new Image();

    img.src = source;

    state.preloadCache.add(source);

}


/*==========================================================
    PRELOAD NEIGHBOR IMAGES
==========================================================*/

function preloadAround(index){

    if(state.gallery.length < 2){

        return;

    }

    const previousIndex =

        (index - 1 + state.gallery.length)

        % state.gallery.length;

    const nextIndex =

        (index + 1)

        % state.gallery.length;

    [

        previousIndex,

        nextIndex

    ].forEach(i=>{

        const item = state.gallery[i];

        if(!item){

            return;

        }

        const src =

            item.dataset.full ||

            item.dataset.src ||

            item.dataset.image ||

            item.getAttribute("href") ||

            item.src;

        preload(src);

    });

}


/*==========================================================
    IMAGE CLICK
==========================================================*/

function handleImageClick(){

    next();

}


/*==========================================================
    BACKDROP CLICK
==========================================================*/

function handleBackdropClick(event){

    if(

        event.target === dom.lightbox

    ){

        close();

    }

}


/*==========================================================
    DOWNLOAD CLICK
==========================================================*/

function handleDownload(){

    if(!dom.download.href){

        return;

    }

    dom.download.setAttribute(

        "download",

        ""

    );

}


/*==========================================================
    IMAGE DRAG
==========================================================*/

dom.image?.addEventListener(

    "dragstart",

    event=>event.preventDefault()

);

 /*==========================================================
    KEYBOARD
==========================================================*/

function handleKeyDown(event){

    if(!state.isOpen){

        return;

    }

    switch(event.key){

        case "Escape":

            close();

            break;

        case "ArrowLeft":

            previous();

            break;

        case "ArrowRight":

            next();

            break;

    }

}


/*==========================================================
    TOUCH
==========================================================*/

function touchStart(event){

    state.touchStartX =

        event.touches[0].clientX;

}


function touchMove(event){

    state.touchEndX =

        event.touches[0].clientX;

}


function touchEnd(){

    const distance =

        state.touchStartX -

        state.touchEndX;

    if(Math.abs(distance) < 50){

        return;

    }

    if(distance > 0){

        next();

    }

    else{

        previous();

    }

}


/*==========================================================
    MOUSE WHEEL
==========================================================*/

function handleWheel(event){

    if(!state.isOpen){

        return;

    }

    event.preventDefault();

    if(event.deltaY > 0){

        next();

    }

    else{

        previous();

    }

}


/*==========================================================
    RESIZE
==========================================================*/

function handleResize(){

    if(!state.isOpen){

        return;

    }

    dom.image.classList.remove(

        "fade-in"

    );

}


/*==========================================================
    BIND EVENTS
==========================================================*/

function bindEvents(){

    dom.close.addEventListener(

        "click",

        close

    );

    dom.prev.addEventListener(

        "click",

        previous

    );

    dom.next.addEventListener(

        "click",

        next

    );

    dom.image.addEventListener(

        "click",

        handleImageClick

    );

    dom.download.addEventListener(

        "click",

        handleDownload

    );

    dom.lightbox.addEventListener(

        "click",

        handleBackdropClick

    );

    document.addEventListener(

        "keydown",

        handleKeyDown

    );

    window.addEventListener(

        "resize",

        handleResize

    );

    dom.lightbox.addEventListener(

        "touchstart",

        touchStart,

        {

            passive:true

        }

    );

    dom.lightbox.addEventListener(

        "touchmove",

        touchMove,

        {

            passive:true

        }

    );

    dom.lightbox.addEventListener(

        "touchend",

        touchEnd

    );

    dom.lightbox.addEventListener(

        "wheel",

        handleWheel,

        {

            passive:false

        }

    );

}


/*==========================================================
    PUBLIC API
==========================================================*/

window.initializeLightbox =

    initializeLightbox;

window.refreshLightbox =

    refreshGallery;

window.openLightbox =

    open;

window.closeLightbox =

    close;

window.nextLightbox =

    next;

window.previousLightbox =

    previous;


/*==========================================================
    AUTO INIT
==========================================================*/

document.addEventListener(

    "DOMContentLoaded",

    initializeLightbox

);

 /* ==========================================================
    MOON CURSOR
========================================================== */

const cursor = document.createElement("div");

cursor.className = "lb-moon";

document.body.appendChild(cursor);

let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

let cursorX = mouseX;
let cursorY = mouseY;

document.addEventListener("mousemove", (event) => {

    mouseX = event.clientX;
    mouseY = event.clientY;

});


function animateCursor(){

    cursorX += (mouseX - cursorX) * 0.18;
    cursorY += (mouseY - cursorY) * 0.18;

    cursor.style.transform =
        `translate(${cursorX}px, ${cursorY}px) translate(-50%, -50%)`;

    requestAnimationFrame(animateCursor);

}

animateCursor();


/* ==========================================================
    BUBBLE TRAIL
========================================================== */

function createBubble(x, y){

    const bubble = document.createElement("span");

    bubble.className = "lb-bubble";

    const size = 6 + Math.random() * 10;

    bubble.style.width = size + "px";
    bubble.style.height = size + "px";

    bubble.style.left = x + "px";
    bubble.style.top = y + "px";

    const drift = (Math.random() - 0.5) * 30;

    bubble.animate(

        [

            {

                transform: "translate(-50%,-50%) scale(.4)",

                opacity: .7

            },

            {

                transform: `translate(${drift}px,-45px) scale(1.5)`,

                opacity: 0

            }

        ],

        {

            duration: 900,

            easing: "ease-out"

        }

    );

    document.body.appendChild(bubble);

    setTimeout(() => {

        bubble.remove();

    }, 900);

}


let bubbleTimer = 0;

document.addEventListener("mousemove", (event) => {

    const now = performance.now();

    if(now - bubbleTimer < 35){

        return;

    }

    bubbleTimer = now;

    createBubble(event.clientX, event.clientY);

});


/* ==========================================================
    RIPPLE
========================================================== */

function ripple(event){

    const target = event.currentTarget;

    const rect = target.getBoundingClientRect();

    const ripple = document.createElement("span");

    ripple.className = "lb-ripple";

    ripple.style.left =
        (event.clientX - rect.left) + "px";

    ripple.style.top =
        (event.clientY - rect.top) + "px";

    target.appendChild(ripple);

    ripple.animate(

        [

            {

                transform:
                    "translate(-50%,-50%) scale(.2)",

                opacity:.45

            },

            {

                transform:
                    "translate(-50%,-50%) scale(4)",

                opacity:0

            }

        ],

        {

            duration:550,

            easing:"ease-out"

        }

    );

    setTimeout(() => {

        ripple.remove();

    }, 550);

}


[
    dom.prev,
    dom.next,
    dom.close,
    dom.download
].forEach(button => {

    button.addEventListener(

        "click",

        ripple

    );

});


/* ==========================================================
    MAGNETIC HOVER
========================================================== */

function magnetic(button){

    button.addEventListener("mousemove",(event)=>{

        const rect = button.getBoundingClientRect();

        const x =
            event.clientX - rect.left - rect.width / 2;

        const y =
            event.clientY - rect.top - rect.height / 2;

        button.style.transform =
            `translate(${x * .15}px, ${y * .15}px)`;

    });

    button.addEventListener("mouseleave",()=>{

        button.style.transform = "";

    });

}


[
    dom.prev,
    dom.next,
    dom.close,
    dom.download
].forEach(magnetic);


/* ==========================================================
    DESTROY
========================================================== */

function destroyLightbox(){

    cursor.remove();

    document.removeEventListener(

        "keydown",

        handleKeyDown

    );

}


/* ==========================================================
    EXPORT
========================================================== */

window.destroyLightbox =
    destroyLightbox;

})();
