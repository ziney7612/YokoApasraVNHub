/* ==========================================
   ELEMENTS
========================================== */

const titleElement =
    document.getElementById("event-title");

const subtitleElement =
    document.getElementById("event-subtitle");

const metaElement =
    document.getElementById("event-meta");

const gallery =
    document.getElementById("gallery");

const poster =
    document.getElementById("poster-image");

const downloadButton =
    document.getElementById("download-album");


/* ==========================================
   GET ID
========================================== */

const params =
    new URLSearchParams(
        window.location.search
    );

const albumId =
    params.get("id");


/* ==========================================
   LOAD
========================================== */

async function loadAlbum() {

    try {

        const response =
            await fetch("../data/exclusive.json");

        const albums =
            await response.json();

        const album =
            albums.find(item =>
                item.id === albumId
            );

        if (!album) {

            gallery.innerHTML =

                `
                <p class="empty">

                    Album not found.

                </p>
                `;

            return;

        }

        renderAlbum(album);

    }

    catch (error) {

        console.error(error);

        gallery.innerHTML =

            `
            <p class="empty">

                Failed to load album.

            </p>
            `;

    }

}

loadAlbum();


/* ==========================================
   RENDER
========================================== */

function renderAlbum(album) {

    document.title =
        `${album.title} • Yoko Apasra VNHub`;



    /* ---------- Poster ---------- */

    const posterImage =

        `../assets/exclusive/${album.folder}/poster.${album.format}`;

    poster.src =
        posterImage;

    poster.alt =
        album.title;



    /* ---------- Title ---------- */

    titleElement.textContent =
        album.title;

    subtitleElement.textContent =
        album.subtitle;



    /* ---------- Meta ---------- */

    metaElement.innerHTML =

        `
        <p>

            📅
            ${album.date}

        </p>

        <p>

            📍
            ${album.location}

        </p>

        <p>

            📷
            ${album.photos} Photos

        </p>
        `;



    /* ---------- Download ---------- */

    downloadButton.href =
        album.zip;



    /* ---------- Gallery ---------- */

    gallery.innerHTML =

        `
        <img

            src="${posterImage}"

            alt="${album.title}"

            class="gallery-img"

            loading="lazy"

            data-full="${posterImage}"

            data-caption="${album.title}"

        >
        `;

}
