document.addEventListener("DOMContentLoaded", async () => {

    /* ==========================================
       ELEMENTS
    ========================================== */

    const titleElement = document.getElementById("event-title");

    const metaElement = document.getElementById("event-meta");

    const galleryElement = document.getElementById("gallery");

    if (!titleElement || !metaElement || !galleryElement) {

        console.error("Missing required HTML elements.");

        return;

    }

    /* ==========================================
       GET EVENT ID
    ========================================== */

    const params = new URLSearchParams(window.location.search);

    const eventId = params.get("id");

    if (!eventId) {

        titleElement.textContent = "Event not found";

        metaElement.innerHTML =
            "<span>Missing event ID.</span>";

        return;

    }

    /* ==========================================
       LOAD EVENTS.JSON
    ========================================== */

    let events = [];

    try {

        const response = await fetch("../data/gallery.json");

        if (!response.ok) {

            throw new Error("Unable to load events.json");

        }

        events = await response.json();

    }

    catch (error) {

        console.error(error);

        titleElement.textContent = "Loading failed";

        metaElement.innerHTML =
            "<span>Unable to load events.</span>";

        return;

    }

    /* ==========================================
       FIND CURRENT EVENT
    ========================================== */

    const currentEvent = events.find(event => event.id === eventId);

    if (!currentEvent) {

        titleElement.textContent = "Event not found";

        metaElement.innerHTML =
            "<span>This event does not exist.</span>";

        return;

    }

    /* ==========================================
       BASIC DATA
    ========================================== */

    const {

        title,

        date,

        folder,

        photos,

        format,

        cover

    } = currentEvent;

    const extension = format || "jpg";

    document.title =
        `${title} | Yoko Apasra VNHub`;
    /* ==========================================
       RENDER PAGE
    ========================================== */

    titleElement.textContent = title;

    metaElement.innerHTML = `
        <span>📅 ${date}</span>
        <span>📷 ${photos} Photos</span>
    `;

    /* ==========================================
       CREATE GALLERY
    ========================================== */

    galleryElement.innerHTML = "";

    for (let i = 1; i <= photos; i++) {

        const number = String(i).padStart(3, "0");

        const imagePath =
            `../assets/events/${folder}/${number}.${extension}`;

        const link = document.createElement("a");

        link.href = imagePath;

        link.className = "lightbox-trigger";

        link.setAttribute("data-download", "true");

        link.setAttribute(
            "data-filename",
            `yoko-${folder}-${number}.${extension}`
        );

        const image = document.createElement("img");

        image.src = imagePath;

        image.alt = `${title} - Photo ${number}`;

        image.loading = "lazy";

        image.decoding = "async";

        image.draggable = false;

        image.onerror = () => {

            console.warn(
                `Image not found: ${imagePath}`
            );

            link.remove();

        };

        link.appendChild(image);

        galleryElement.appendChild(link);

    }

    /* ==========================================
       UPDATE COVER IMAGE
    ========================================== */

    if (cover) {

        const coverPath =
            `../assets/events/${folder}/${String(cover).padStart(3, "0")}.${extension}`;

        const firstCard =
            galleryElement.querySelector("img");

        if (firstCard) {

            firstCard.src = coverPath;

        }

    }

    /* ==========================================
       READY
    ========================================== */

    console.log(
        `Loaded "${title}" (${photos} photos)`
    );
    /* ==========================================
       FINAL SETUP
    ========================================== */

    console.log(
        `Loaded "${title}" (${photos} photos)`
    );

    /* ==========================================
       REFRESH LIGHTBOX
    ========================================== */

    if (typeof initializeLightbox === "function") {

        initializeLightbox();

    }

});

/* ==========================================
   HELPER
========================================== */

function formatPhotoNumber(number) {

    return String(number).padStart(3, "0");

}
