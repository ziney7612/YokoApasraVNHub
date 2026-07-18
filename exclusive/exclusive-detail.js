/* ======================================================
   EXCLUSIVE DETAIL
   Yoko Apasra VNHub
====================================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /* ======================================================
           ELEMENTS
        ====================================================== */

        const titleElement =
            document.getElementById(
                "event-title"
            );

        const subtitleElement =
            document.getElementById(
                "event-subtitle"
            );

        const metaElement =
            document.getElementById(
                "event-meta"
            );

        const galleryElement =
            document.getElementById(
                "gallery"
            );

        const posterLink =
            document.getElementById(
                "poster-link"
            );

        const posterElement =
            document.getElementById(
                "poster-image"
            );

        const downloadButton =
            document.getElementById(
                "download-album"
            );

        if (

            !titleElement ||

            !subtitleElement ||

            !metaElement ||

            !galleryElement ||

            !posterLink ||

            !posterElement ||

            !downloadButton

        ) {

            console.error(
                "Exclusive Detail elements not found."
            );

            return;

        }


        /* ======================================================
           GET ALBUM ID
        ====================================================== */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const albumId =
            params.get("id");

        if (!albumId) {

            titleElement.textContent =
                "Album not found";

            return;

        }


        /* ======================================================
           LOAD JSON
        ====================================================== */

        let albums = [];

        let downloadData = {};

        try {

            const [

                albumResponse,

                downloadResponse

            ] = await Promise.all([

                fetch(
                    "../data/exclusive.json"
                ),

                fetch(
                    "../data/download.json"
                )

            ]);

            if (

                !albumResponse.ok

            ) {

                throw new Error(
                    "Unable to load exclusive.json"
                );

            }

            albums =
                await albumResponse.json();

            if (

                downloadResponse.ok

            ) {

                downloadData =
                    await downloadResponse.json();

            }

        }

        catch (error) {

            console.error(error);

            galleryElement.innerHTML =

                `
                <p class="empty">

                    Failed to load album.

                </p>
                `;

            return;

        }


        /* ======================================================
           FIND ALBUM
        ====================================================== */

        const album =

            albums.find(

                item =>

                    item.id === albumId

            );

        if (!album) {

            galleryElement.innerHTML =

                `
                <p class="empty">

                    Album not found.

                </p>
                `;

            return;

        }


        document.title =

            `${album.title} | Yoko Apasra VNHub`;


        /* ======================================================
           FILE PATH
        ====================================================== */

        const extension =

            album.format || "jpg";

        const posterPath =

            `../assets/exclusive/${album.folder}/poster.${extension}`;


        /* ======================================================
           POSTER
        ====================================================== */

        posterElement.src =
            posterPath;

        posterElement.alt =
            album.title;

        posterElement.onload =
            () => {

                posterElement.classList.add(
                    "loaded"
                );

            };

        posterLink.href =
            posterPath;

        posterLink.classList.add(
            "lightbox-trigger"
        );

        posterLink.dataset.filename =
            `${album.folder}-poster.${extension}`;


        /* ======================================================
           TITLE
        ====================================================== */

        titleElement.textContent =
            album.title;

        subtitleElement.textContent =
            album.subtitle || "";


        /* ======================================================
           META
        ====================================================== */

        metaElement.innerHTML =

            `
            <div class="meta-item">

                <span class="meta-icon">
                    📅
                </span>

                <div>

                    <strong>

                        Date

                    </strong>

                    <p>

                        ${album.date}

                    </p>

                </div>

            </div>


            <div class="meta-item">

                <span class="meta-icon">
                    📍
                </span>

                <div>

                    <strong>

                        Location

                    </strong>

                    <p>

                        ${album.location}

                    </p>

                </div>

            </div>


            <div class="meta-item">

                <span class="meta-icon">
                    📷
                </span>

                <div>

                    <strong>

                        Collection

                    </strong>

                    <p>

                        ${album.photos}
                        Photo${album.photos > 1 ? "s" : ""}

                    </p>

                </div>

            </div>

            `;


        /* ======================================================
           DOWNLOAD
        ====================================================== */

        const downloadLink =

            downloadData.exclusive?.[
                album.id
            ] || "";

        if (downloadLink) {

            downloadButton.href =
                downloadLink;

            downloadButton.target =
                "_blank";

            downloadButton.rel =
                "noopener noreferrer";

            downloadButton.style.display =
                "inline-flex";

        }

        else {

            downloadButton.style.display =
                "none";

        }


        /* ======================================================
           CLEAR GALLERY
        ====================================================== */

        galleryElement.innerHTML = "";

           /* ======================================================
           RENDER GALLERY
        ====================================================== */

        if (album.photos > 0) {

            for (

                let i = 1;

                i <= album.photos;

                i++

            ) {

                const fileNumber =

                    String(i).padStart(
                        3,
                        "0"
                    );

                const imagePath =

                    `../assets/exclusive/${album.folder}/${fileNumber}.${extension}`;

                const link =

                    document.createElement(
                        "a"
                    );

                link.href =
                    imagePath;

                link.className =
                    "lightbox-trigger";

                link.dataset.filename =

                    `${album.folder}-${fileNumber}.${extension}`;

                const image =

                    document.createElement(
                        "img"
                    );

                image.src =
                    imagePath;

                image.alt =

                    `${album.title} ${fileNumber}`;

                image.loading =
                    "lazy";

                image.decoding =
                    "async";

                image.draggable =
                    false;

                image.onload =
                    () => {

                        image.classList.add(
                            "loaded"
                        );

                    };

                image.onerror =
                    () => {

                        console.warn(
                            `Missing image: ${imagePath}`
                        );

                        link.remove();

                    };

                link.appendChild(
                    image
                );

                galleryElement.appendChild(
                    link
                );

            }

        }


        /* ======================================================
           REFRESH LIGHTBOX
        ====================================================== */

        if (

            typeof window.refreshLightbox ===
            "function"

        ) {

            window.refreshLightbox();

        }


        /* ======================================================
           DEBUG
        ====================================================== */

        console.groupCollapsed(
            "Exclusive Detail"
        );

        console.log(
            "Album:",
            album.title
        );

        console.log(
            "Folder:",
            album.folder
        );

        console.log(
            "Poster:",
            posterPath
        );

        console.log(
            "Gallery:",
            album.photos
        );

        console.log(
            "Download:",
            downloadLink
                ? "Available"
                : "Unavailable"
        );

        console.groupEnd();

    }

);
