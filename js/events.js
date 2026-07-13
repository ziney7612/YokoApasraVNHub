document.addEventListener("DOMContentLoaded", async () => {

    const eventsList = document.getElementById("events-list");
    const latestContainer =
        document.getElementById("latest-event-card");

    const totalEvents =
        document.getElementById("total-events");

    const totalPhotos =
        document.getElementById("total-photos");

    const monthFilter =
        document.getElementById("month-filter");

    const sortSelect =
        document.getElementById("sort-select");

    try {

        const response =
            await fetch("../data/gallery.json");

        const events =
            await response.json();

        let currentEvents =
            [...events];

        /* ==========================
           TOTALS
        ========================== */

        totalEvents.textContent =
            events.length;

        const photos =
            events.reduce(
                (sum, e) =>
                    sum + (e.photos || 0),
                0
            );

        totalPhotos.textContent =
            photos.toLocaleString() + "+";

        /* ==========================
           MONTH FILTER
        ========================== */

        const months = [
            ...new Set(
                events.map(e => {

                    const parts =
                        e.date.split(" ");

                    return parts[1];

                })
            )
        ];

        monthFilter.innerHTML = `

            <button
                class="active"
                data-month="all">

                All

            </button>

        `;

        months.forEach(month => {

            monthFilter.innerHTML += `

                <button
                    data-month="${month}">

                    ${month}

                </button>

            `;

        });

        /* ==========================
           LATEST EVENT
        ========================== */

        renderLatest(events[0]);

        /* ==========================
           INITIAL RENDER
        ========================== */

        renderEvents(events);

        /* ==========================
           FILTER CLICK
        ========================== */

        monthFilter.addEventListener(
            "click",
            e => {

                const btn =
                    e.target.closest("button");

                if (!btn) return;

                document
                    .querySelectorAll(
                        "#month-filter button"
                    )
                    .forEach(b =>
                        b.classList.remove(
                            "active"
                        )
                    );

                btn.classList.add(
                    "active"
                );

                const month =
                    btn.dataset.month;

                currentEvents =
                    month === "all"
                        ? [...events]
                        : events.filter(
                              ev =>
                                  ev.date.includes(
                                      month
                                  )
                          );

                applySort();

            }
        );

        /* ==========================
           SORT
        ========================== */

        sortSelect?.addEventListener(
            "change",
            applySort
        );

        function applySort() {

            const mode =
                sortSelect.value;

            const sorted =
                [...currentEvents];

            sorted.sort((a, b) => {

                const da =
                    new Date(a.date);

                const db =
                    new Date(b.date);

                return mode ===
                    "oldest"
                    ? da - db
                    : db - da;

            });

            renderEvents(sorted);

        }

        /* ==========================
           GRID / LIST
        ========================== */

        const gridBtn =
            document.getElementById(
                "grid-view"
            );

        const listBtn =
            document.getElementById(
                "list-view"
            );

        gridBtn?.addEventListener(
            "click",
            () => {

                eventsList.classList.remove(
                    "list-view"
                );

                gridBtn.classList.add(
                    "active"
                );

                listBtn.classList.remove(
                    "active"
                );

            }
        );

        listBtn?.addEventListener(
            "click",
            () => {

                eventsList.classList.add(
                    "list-view"
                );

                listBtn.classList.add(
                    "active"
                );

                gridBtn.classList.remove(
                    "active"
                );

            }
        );

    }

    catch (err) {

        console.error(err);

    }

    /* ===================================
       RENDER EVENTS
    =================================== */

    function renderEvents(events) {

        eventsList.innerHTML = "";

        events.forEach(event => {

            const cover =
                String(
                    event.cover || "001"
                ).padStart(
                    3,
                    "0"
                );

            const ext =
                event.format || "jpg";

            const day =
                event.date.split(" ")[0];

            const month =
                event.date.split(" ")[1];

            const card =
                document.createElement(
                    "a"
                );

            card.className =
                "event-card";

            card.href =
                `detail.html?id=${event.id}`;

            card.innerHTML = `

                <div class="event-thumb">

                    <div
                        class="event-date-badge">

                        <strong>
                            ${day}
                        </strong>

                        <span>
                            ${month}
                        </span>

                    </div>

                    <img
                        src="../assets/events/${event.folder}/${cover}.${ext}"
                        alt="${event.title}"
                        loading="lazy">

                </div>

                <div class="event-info">

                    <h2>
                        ${event.title}
                    </h2>

                    <p
                        class="event-date">

                        📅 ${event.date}

                    </p>

                    <span
                        class="event-photos">

                        📷
                        ${event.photos}
                        Photos

                    </span>

                </div>

            `;

            eventsList.appendChild(
                card
            );

        });

    }

    /* ===================================
       LATEST EVENT
    =================================== */

    function renderLatest(event) {

        if (!latestContainer)
            return;

        const cover =
            String(
                event.cover
            ).padStart(
                3,
                "0"
            );

        latestContainer.innerHTML = `

            <a
                href="detail.html?id=${event.id}"
                class="latest-card">

                <div
                    class="latest-image">

                    <img
                        src="../assets/events/${event.folder}/${cover}.${event.format}">

                </div>

                <div
                    class="latest-content">

                    <span
                        class="latest-tag">

                        ⭐ LATEST EVENT

                    </span>

                    <h2>

                        ${event.title}

                    </h2>

                    <p>

                        📅
                        ${event.date}

                    </p>

                    <p>

                        ${event.photos}
                        photos archived.

                    </p>

                    <span
                        class="latest-btn">

                        View Gallery →

                    </span>

                </div>

            </a>

        `;

    }

});
