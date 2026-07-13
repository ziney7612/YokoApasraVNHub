document.addEventListener("DOMContentLoaded", async () => {

    const eventsContainer =
        document.getElementById("events-list");

    const latestContainer =
        document.getElementById("latest-event-card");

    const totalEventsEl =
        document.getElementById("total-events");

    const totalPhotosEl =
        document.getElementById("total-photos");

    if (!eventsContainer) return;

    try {

        const response =
            await fetch("../data/gallery.json");

        if (!response.ok) {

            throw new Error(
                "Cannot load gallery.json"
            );

        }

        const events =
            await response.json();

        /* ==========================================
           SORT EVENTS (Newest → Oldest)
        ========================================== */

        events.sort((a, b) => {

            return (
                new Date(b.date) -
                new Date(a.date)
            );

        });

        /* ==========================================
           HERO STATS
        ========================================== */

        const totalPhotos =
            events.reduce(

                (sum, event) => {

                    return (
                        sum +
                        (event.photos || 0)
                    );

                },

                0

            );

        if (totalEventsEl) {

            totalEventsEl.textContent =
                events.length.toLocaleString();

        }

        if (totalPhotosEl) {

            totalPhotosEl.textContent =
                `${totalPhotos.toLocaleString()}+`;

        }

        /* ==========================================
           LATEST EVENT
        ========================================== */

        if (
            latestContainer &&
            events.length > 0
        ) {

            const latest =
                events[0];

            const cover =
                String(
                    latest.cover || "001"
                ).padStart(3, "0");

            const ext =
                latest.format || "jpg";

            latestContainer.innerHTML = `

                <a
                    class="event-card latest-card"
                    href="detail.html?id=${encodeURIComponent(latest.id)}">

                    <div class="event-thumb">

                        <img
                            src="../assets/events/${latest.folder}/${cover}.${ext}"
                            alt="${latest.title}">

                    </div>

                    <div class="event-info">

                        <span class="latest-badge">

                            ✨ Latest Event

                        </span>

                        <h2>

                            ${latest.title}

                        </h2>

                        <p class="event-date">

                            📅 ${latest.date}

                        </p>

                        <span class="event-photos">

                            📷 ${latest.photos}
                            Photos

                        </span>

                    </div>

                </a>

            `;

        }

        /* ==========================================
           EVENT GRID
        ========================================== */

        eventsContainer.innerHTML = "";

        events.forEach(event => {

            const cover =
                String(
                    event.cover || "001"
                ).padStart(3, "0");

            const ext =
                event.format || "jpg";

            const card =
                document.createElement("a");

            card.className =
                "event-card";

            card.href =
                `detail.html?id=${encodeURIComponent(event.id)}`;

            const date =
                new Date(event.date);

            const day =
                String(
                    date.getDate()
                ).padStart(2, "0");

            const month =
                date.toLocaleString(
                    "en-US",
                    {
                        month: "short"
                    }
                );

            const year =
                date.getFullYear();

            card.innerHTML = `

                <div class="event-thumb">

                    <div class="event-date-badge">

                        <strong>

                            ${day}

                        </strong>

                        <span>

                            ${month}

                        </span>

                        <small>

                            ${year}

                        </small>

                    </div>

                    <img
                        src="../assets/events/${event.folder}/${cover}.${ext}"
                        alt="${event.title}"
                        loading="lazy"
                        decoding="async">

                </div>

                <div class="event-info">

                    <h2>

                        ${event.title}

                    </h2>

                    <span class="event-photos">

                        📷
                        ${event.photos}
                        Photos

                    </span>

                </div>

            `;

            eventsContainer.appendChild(
                card
            );

        });

    }

    catch (error) {

        console.error(error);

        eventsContainer.innerHTML = `

            <div class="empty-state">

                <h2>

                    Unable to load events

                </h2>

                <p>

                    Please check
                    gallery.json

                </p>

            </div>

        `;

    }

});
