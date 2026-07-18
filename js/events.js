/* ==========================================
   ELEMENTS
========================================== */

const eventsList = document.getElementById("events-list");
const latestCard = document.getElementById("latest-event-card");

const monthFilter = document.getElementById("month-filter");

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


/* ==========================================
   STATE
========================================== */

let events = [];
let currentMonth = "all";


/* ==========================================
   LOAD
========================================== */

async function loadEvents() {

    try {

        const response =
            await fetch("../data/gallery.json");

        events =
            await response.json();

        events.sort(
            (a, b) =>
                parseDate(b.date) -
                parseDate(a.date)
        );

        updateStats();
        renderLatest();
        createFilters();
        renderEvents();
    }

    catch (error) {

        console.error(error);

        eventsList.innerHTML =
            `
            <p class="empty">
                Failed to load events.
            </p>
            `;
    }
}

loadEvents();


/* ==========================================
   DATE
========================================== */

function parseDate(dateString) {

    return new Date(
        dateString.replace(
            /(\d+) (\w+) (\d+)/,
            "$2 $1, $3"
        )
    );
}


/* ==========================================
   COUNTER
========================================== */

function animateNumber(
    element,
    target
) {

    let current = 0;

    const step =
        Math.ceil(target / 40);

    const timer =
        setInterval(() => {

            current += step;

            if (current >= target) {

                current = target;
                clearInterval(timer);
            }

            element.textContent =
                current.toLocaleString();

        }, 20);
}


/* ==========================================
   STATS
========================================== */

function updateStats() {

    const photoCount =
        events.reduce(
            (sum, item) =>
                sum + item.photos,
            0
        );

    animateNumber(
        totalEvents,
        events.length
    );

    animateNumber(
        totalPhotos,
        photoCount
    );
}


/* ==========================================
   LATEST EVENT
========================================== */

function renderLatest() {

    if (!events.length) return;

    const item = events[0];

    latestCard.innerHTML = `
        <div class="latest-card">

            <div class="latest-image">
                <img
                    src="../assets/events/${item.folder}/${item.cover}.${item.format}"
                    alt="${item.title}">
            </div>

            <div class="latest-content">

                <span class="latest-tag">
                    ✦ LATEST EVENT
                </span>

                <h2>
                    ${item.title}
                </h2>

                <p>
                    📅 ${item.date}
                </p>

                <p>
                    📷 ${item.photos}
                    photos archived
                </p>

                <a
                    href="detail.html?id=${item.id}"
                    class="latest-btn">

                    <span>
                        View Gallery
                    </span>

                    <span class="arrow">
                        →
                    </span>

                    <span class="moon">
                        ☾
                    </span>

                </a>

            </div>

        </div>
    `;
}
/* ==========================================
   FILTER
========================================== */

function createFilters() {

    const months = [

        "all",

        ...new Set(

            events.map(item =>

                parseDate(item.date)
                    .toLocaleString(
                        "en-US",
                        {
                            month: "long"
                        }
                    )
            )
        )
    ];

    monthFilter.innerHTML =

        months.map(month =>

            `
            <button
                data-month="${month}"
                class="${
                    month === "all"
                        ? "active"
                        : ""
                }">

                ${
                    month === "all"
                        ? "All"
                        : month
                }

            </button>
            `
        ).join("");

    monthFilter
        .querySelectorAll("button")
        .forEach(button => {

            button.onclick = () => {

                monthFilter
                    .querySelectorAll("button")
                    .forEach(btn =>
                        btn.classList.remove(
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

    let filtered =
        [...events];

    if (
        currentMonth !== "all"
    ) {

        filtered =
            filtered.filter(item => {

                const month =
                    parseDate(item.date)
                        .toLocaleString(
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

        filtered.sort(
            (a, b) =>
                parseDate(a.date) -
                parseDate(b.date)
        );
    }

    eventsList.innerHTML =

        filtered.map(item => {

            const date =
                parseDate(item.date);

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
    href="detail.html?id=${item.id}"
    class="event-card">

    <div class="event-thumb">

    <span class="bubble b1"></span>
    <span class="bubble b2"></span>

    <img
        src="../assets/events/${item.folder}/${item.cover}.${item.format}"
        alt="${item.title}">
        
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
        
    </div>

   <div class="event-info">

    <h2>
        ${item.title}
    </h2>

    <p class="event-date">
        📅 ${item.date}
    </p>

    <p class="event-photos">
        ${item.photos} photos →
    </p>

</div>

</a>

`;

        }).join("");
}


/* ==========================================
   SORT
========================================== */

if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        renderEvents
    );
}


/* ==========================================
   VIEW MODE
========================================== */

if (gridBtn && listBtn) {

    gridBtn.onclick = () => {

        eventsList.classList.remove(
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

        eventsList.classList.add(
            "list-view"
        );

        listBtn.classList.add(
            "active"
        );

        gridBtn.classList.remove(
            "active"
        );
    };
}
