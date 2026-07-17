document.addEventListener(
    "DOMContentLoaded",
    async () => {

        /*==================================
        =            Elements             =
        ==================================*/

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
                "Missing HTML elements."
            );

            return;

        }

        /*==================================
        =          Get Event ID           =
        ==================================*/

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

        /*==================================
        =      Load Gallery + Download    =
        ==================================*/

        let events = [];
        let downloads = {};

        try {

            const [
                galleryResponse,
                downloadResponse
            ] = await Promise.all([

                fetch("../data/gallery.json"),

                fetch("../data/download.json")

            ]);

            if (
                !galleryResponse.ok
            ) {

                throw new Error(
                    "Unable to load gallery.json"
                );

            }

            if (
                !downloadResponse.ok
            ) {

                throw new Error(
                    "Unable to load download.json"
                );

            }

            events =
                await galleryResponse.json();

            downloads =
                await downloadResponse.json();

        }

        catch (error) {

            console.error(error);

            titleElement.textContent =
                "Loading failed";

            metaElement.innerHTML =
                "<span>Unable to load data.</span>";

            return;

        }

        /*==================================
        =        Find Event Data          =
        ==================================*/

        const currentEvent =
            events.find(
                event =>
                    event.id === eventId
            );

        if (!currentEvent) {

            titleElement.textContent =
                "Event not found";

            metaElement.innerHTML =
                "<span>This event does not exist.</span>";

            return;

        }

        /*==================================
        =          Destructure            =
        ==================================*/

        const {

            title,
            date,
            folder,
            photos,
            format,
            cover

        } = currentEvent;

        const extension =
            format || "jpg";

        const downloadLink =
            downloads.events?.[
                eventId
            ] || "";

        document.title =
            `${title} | Yoko Apasra VNHub`;

        /*==================================
        =          Render Info            =
        ==================================*/

        titleElement.textContent =
            title;

        metaElement.innerHTML = `

            <span>📅 ${date}</span>

            <span>📷 ${photos} Photos</span>

            ${downloadLink ? `

                <a
                    href="${downloadLink}"
                    class="download-album"
                    target="_blank"
                    rel="noopener">

                    ⬇ Download Full Album

                </a>

            ` : ""}

        `;

        /*==================================
        =          Render Gallery         =
        ==================================*/

        galleryElement.innerHTML =
            "";

        for (
            let i = 1;
            i <= photos;
            i++
        ) {

            const number =
                String(i).padStart(
                    3,
                    "0"
                );

            const imagePath =
                `../assets/events/${folder}/${number}.${extension}`;

            const link =
                document.createElement(
                    "a"
                );

            link.href =
                imagePath;

            link.className =
                "lightbox-trigger";

            link.dataset.filename =
                `yoko-${folder}-${number}.${extension}`;

            const image =
                document.createElement(
                    "img"
                );

            image.src =
                imagePath;

            image.alt =
                `${title} - Photo ${number}`;

            image.loading =
                "lazy";

            image.decoding =
                "async";

            image.draggable =
                false;

            image.onerror =
                () => {

                    console.warn(
                        "Missing:",
                        imagePath
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

        /*==================================
        =          Cover Image            =
        ==================================*/

        if (cover) {

            const firstImage =
                galleryElement.querySelector(
                    "img"
                );

            const coverPath =
                `../assets/events/${folder}/${String(
                    cover
                ).padStart(
                    3,
                    "0"
                )}.${extension}`;

            if (
                firstImage
            ) {

                firstImage.src =
                    coverPath;

            }

        }

        /*==================================
        =        Refresh Lightbox         =
        ==================================*/

        if (
            window.refreshLightbox
        ) {

            window.refreshLightbox();

        }

        console.log(
            `Loaded "${title}" (${photos} photos)`
        );

    }
);
