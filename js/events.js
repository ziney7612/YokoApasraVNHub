const eventsContainer =
    document.getElementById("events-list");

const latestContainer =
    document.getElementById("latest-event-card");

const monthFilter =
    document.getElementById("month-filter");

const totalEvents =
    document.getElementById("total-events");

const totalPhotos =
    document.getElementById("total-photos");

const sortSelect =
    document.getElementById("sort-select");

const gridBtn =
    document.getElementById("grid-view");

const listBtn =
    document.getElementById("list-view");

let events = [];
let currentMonth = "all";

/* ==========================================
   LOAD
========================================== */

async function loadEvents() {

    const response =
        await fetch("../data/events.json");

    events = await response.json();

    updateStats();

    renderLatest();

    createMonthFilters();

    renderEvents();
}

loadEvents();

/* ==========================================
   STATS
========================================== */

function updateStats() {

    totalEvents.textContent =
        events.length;

    const photos =
        events.reduce(
            (sum, item) =>
                sum + item.photos,
            0
        );

    totalPhotos.textContent =
        photos.toLocaleString() + "+";
}

/* ==========================================
   LATEST
========================================== */

function renderLatest() {

    if (!events.length) return;

    const latest = events[0];

    latestContainer.innerHTML = `

        <div class="latest-card">

            <div class="latest-image">

                <img
                    src="../assets/events/${latest.folder}/${latest.cover}.${latest.format}"
                    alt="${latest.title}">

            </div>

            <div class="latest-content">

                <span class="latest-tag">
                    ⭐ LATEST EVENT
                </span>

                <h2>
                    ${latest.title}
                </h2>

                <p>
                    🗓 ${latest.date}
                </p>

                <p>
                    ${latest.photos} photos archived.
                </p>

                <a
                    href="../events/detail.html?id=${latest.id}"
                    class="latest-btn">

                    View Gallery →

                </a>

            </div>

        </div>

    `;
}

/* ==========================================
   FILTER BUTTONS
========================================== */

function createMonthFilters() {

    const months = [
        "all",
        ...new Set(
            events.map(event => {

                return new Date(
                    event.date
                ).toLocaleString(
                    "en-US",
                    {
                        month:"long"
                    }
                );

            })
        )
    ];

    monthFilter.innerHTML =
        months.map(month => `

            <button
                class="${
                    month === "all"
                    ? "active"
                    : ""
                }"
                data-month="${month}">

                ${
                    month === "all"
                    ? "All"
                    : month
                }

            </button>

        `).join("");

    monthFilter
        .querySelectorAll("button")
        .forEach(button => {

            button.onclick = () => {

                monthFilter
                    .querySelectorAll("button")
                    .forEach(
                        b =>
                        b.classList.remove(
                            "active"
                        )
                    );

                button.classList.add(
                    "active"
                );

                currentMonth =
                    button.dataset.month;

                renderEvents();
            };
        });
}

/* ==========================================
   RENDER EVENTS
========================================== */

function renderEvents() {

    let filtered = [...events];

    if (currentMonth !== "all") {

        filtered =
            filtered.filter(event => {

                const month =
                    new Date(
                        event.date
                    ).toLocaleString(
                        "en-US",
                        {
                            month:"long"
                        }
                    );

                return (
                    month === currentMonth
                );
            });
    }

    if (
        sortSelect.value ===
        "oldest"
    ) {

        filtered.reverse();
    }

    eventsContainer.innerHTML =
        filtered.map(event => {

            const date =
                new Date(event.date);

            const day =
                date.getDate();

            const month =
                date.toLocaleString(
                    "en-US",
                    {
                        month:"short"
                    }
                );

            return `

            <a
                href="../events/detail.html?id=${event.id}"
                class="event-card">

                <div class="event-thumb">

                    <img
                        src="../assets/events/${event.folder}/${event.cover}.${event.format}"
                        alt="${event.title}">

                    <div class="event-date-badge">

                        <strong>
                            ${day}
                        </strong>

                        <span>
                            ${month}
                        </span>

                    </div>

                </div>

                <div class="event-info">

                    <h2>
                        ${event.title}
                    </h2>

                    <p class="event-date">
                        ${event.date}
                    </p>

                    <p class="event-photos">
                        📷 ${event.photos}
                        Photos
                    </p>

                </div>

            </a>

            `;

        }).join("");
}

/* ==========================================
   SORT
========================================== */

sortSelect.addEventListener(
    "change",
    renderEvents
);

/* ==========================================
   VIEW
========================================== */

gridBtn.onclick = () => {

    eventsContainer.classList.remove(
        "list-view"
    );

    gridBtn.classList.add(
        "active"
    );

    listBtn.classList.remove(
        "active"
    );
};

listBtn.onclick = () => {

    eventsContainer.classList.add(
        "list-view"
    );

    listBtn.classList.add(
        "active"
    );

    gridBtn.classList.remove(
        "active"
    );
};
