/* ======================================================
   EVENT DETAIL
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

        const metaElement =
            document.getElementById(
                "event-meta"
            );

        const galleryElement =
            document.getElementById(
                "gallery"
            );

        if (
            !titleElement ||
            !metaElement ||
            !galleryElement
        ) {

            console.error(
                "Gallery elements not found."
            );

            return;

        }


        /* ======================================================
           GET EVENT ID
        ====================================================== */

        const params =
            new URLSearchParams(
                window.location.search
            );

        const eventId =
            params.get("id");

        if (!eventId) {

            titleElement.textContent =
                "Event not found";

            metaElement.innerHTML =
                "<span>Missing event ID.</span>";

            return;

        }


        /* ======================================================
           LOAD JSON
        ====================================================== */

        let galleryData = [];
        let downloadData = {};

        try {

            const [
                galleryResponse,
                downloadResponse

            ] = await Promise.all([

                fetch(
                    "../data/gallery.json"
                ),

                fetch(
                    "../data/download.json"
                )

            ]);

            if (!galleryResponse.ok) {

                throw new Error(
                    "gallery.json not found."
                );

            }

            galleryData =
                await galleryResponse.json();


            if (
                downloadResponse.ok
            ) {

                downloadData =
                    await downloadResponse.json();

            }

        }

        catch (error) {

            console.error(error);

            titleElement.textContent =
                "Loading failed";

            metaElement.innerHTML =
                "<span>Unable to load gallery.</span>";

            return;

        }


        /* ======================================================
           FIND EVENT
        ====================================================== */

        const eventData =
            galleryData.find(

                item =>

                    item.id === eventId

            );

        if (!eventData) {

            titleElement.textContent =
                "Event not found";

            metaElement.innerHTML =
                "<span>This event does not exist.</span>";

            return;

        }


        /* ======================================================
           EVENT DATA
        ====================================================== */

        const {

            title,

            date,

            folder,

            photos,

            format = "jpg"

        } = eventData;


        const downloadLink =

            downloadData.events?.[
                eventId
            ] || "";


        document.title =

            `${title} | Yoko Apasra VNHub`;

            /* ======================================================
           RENDER HEADER
        ====================================================== */

        titleElement.textContent =
            title;

        metaElement.innerHTML =

`
<div class="event-meta-info">

    <span>
        📅 ${date}
    </span>

    <span>
        📷 ${photos.toLocaleString()} Photos
    </span>

</div>

${
    downloadLink

        ?

        `
        <a
            href="${downloadLink}"
            class="download-album btn-download"
            target="_blank"
            rel="noopener noreferrer">

            <span class="moon">

                ☾

            </span>

            <span>

                Download Full Album

            </span>

        </a>
        `

        :

        ""
}
`;


        /* ======================================================
           CLEAR GALLERY
        ====================================================== */

        galleryElement.innerHTML = "";


        /* ======================================================
           RENDER GALLERY
        ====================================================== */

        for (

            let i = 1;

            i <= photos;

            i++

        ) {

            const fileNumber =

                String(i).padStart(
                    3,
                    "0"
                );

            const imagePath =

                `../assets/events/${folder}/${fileNumber}.${format}`;


            const link =

                document.createElement("a");

            link.href = imagePath;

            link.className =
                "lightbox-trigger";

            link.dataset.filename =

                `yoko-${folder}-${fileNumber}.${format}`;


            const image =

                document.createElement("img");

            image.src =
                imagePath;

            image.alt =

                `${title} ${fileNumber}`;

            image.loading =
                "lazy";

            image.decoding =
                "async";

            image.draggable =
                false;

            image.onerror = () => {

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
           UPDATE PHOTO COUNT
        ====================================================== */

        const loadedPhotos =

            galleryElement.querySelectorAll(
                ".lightbox-trigger"
            ).length;

        const info =

            metaElement.querySelector(
                ".event-meta-info"
            );

        if (info) {

            info.innerHTML =

                `
                <span>
                    📅 ${date}
                </span>

                <span>
                    📷 ${loadedPhotos.toLocaleString()} Photos
                </span>
                `;

        }


        /* ======================================================
           FINISH
        ====================================================== */

        console.groupCollapsed(

            "Event Detail"

        );

        console.log(

            "Title:",
            title

        );

        console.log(

            "Folder:",
            folder

        );

        console.log(

            "Photos:",
            loadedPhotos

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
