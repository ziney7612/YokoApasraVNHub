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
   LOAD DATA
========================================== */

async function loadEvents() {

    try {

        const response =
            await fetch("../data/gallery.json");

        events =
            await response.json();


        events.sort((a, b) => {

            return (
                new Date(b.date) -
                new Date(a.date)
            );

        });

        updateStats();

        renderLatest();

        createMonthFilters();

        renderEvents();

    }

    catch (error) {

        console.error(
            "Cannot load gallery.json",
            error
        );

    }
}

loadEvents();


/* ==========================================
   STATS
========================================== */

function updateStats() {

    totalEvents.textContent =
        events.length;

    const total =
        events.reduce(
            (sum, item) =>
                sum + item.photos,
            0
        );

    totalPhotos.textContent =
        total.toLocaleString() + "+";
}


/* ==========================================
   LATEST EVENT
========================================== */

function renderLatest() {

    if (!events.length) return;

    const latest = events[0];

    latestContainer.innerHTML = `

        <div class="latest-card">

            <div class="latest-image">

                <img
                    src="../assets/events/${latest.folder}/${latest.cover}.${latest.format}"
                    alt="${latest.title}"

                    onerror="
                    this.src='../assets/images/events.png'
                    ">

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

                    ${latest.photos}
                    photos archived.

                </p>

                <a
                    href="./detail.html?id=${latest.id}"
                    class="latest-btn">

                    View Gallery →

                </a>

            </div>

        </div>

    `;
}


/* ==========================================
   MONTH FILTER
========================================== */

function createMonthFilters() {

    const order = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];

    const months = [
        ...new Set(
            events.map(event => {

                return new Date(
                    event.date
                ).toLocaleString(
                    "en-US",
                    {
                        month: "long"
                    }
                );

            })
        )
    ];

    months.sort(
        (a, b) =>
            order.indexOf(a) -
            order.indexOf(b)
    );

    monthFilter.innerHTML = `

        <button
            class="active"
            data-month="all">

            All

        </button>

        ${months.map(month => `

            <button
                data-month="${month}">

                ${month}

            </button>

        `).join("")}

    `;

    monthFilter
        .querySelectorAll("button")
        .forEach(button => {

            button.onclick = () => {

                monthFilter
                    .querySelectorAll("button")
                    .forEach(btn => {

                        btn.classList.remove(
                            "active"
                        );

                    });

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
   RENDER
========================================== */

function renderEvents() {

    let filtered =
        [...events];

    if (
        currentMonth !== "all"
    ) {

        filtered =
            filtered.filter(event => {

                const month =
                    new Date(
                        event.date
                    ).toLocaleString(
                        "en-US",
                        {
                            month: "long"
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
                        month: "short"
                    }
                );

            const year =
                date.getFullYear();

            return `

            <a
                href="./detail.html?id=${event.id}"
                class="event-card">

                <div class="event-thumb">

                    <img
                        src="../assets/events/${event.folder}/${event.cover}.${event.format}"

                        alt="${event.title}"

                        onerror="
                        this.src='../assets/images/events.png'
                        ">

                    <div
                        class="event-date-badge">

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

                </div>

                <div
                    class="event-info">

                    <h2>

                        ${event.title}

                    </h2>

                    <p
                        class="event-date">

                        ${event.date}

                    </p>

                    <p
                        class="event-photos">

                        📷
                        ${event.photos}
                        Photos

                    </p>

                </div>

            </a>

            `;

        }).join("");

    fadeCards();
}


/* ==========================================
   ANIMATION
========================================== */

function fadeCards() {

    const cards =
        document.querySelectorAll(
            ".event-card"
        );

    cards.forEach(
        (card, index) => {

            card.style.opacity = "0";
            card.style.transform =
                "translateY(20px)";

            setTimeout(() => {

                card.style.transition =
                    ".45s ease";

                card.style.opacity = "1";

                card.style.transform =
                    "translateY(0px)";

            }, index * 60);

        }
    );
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
