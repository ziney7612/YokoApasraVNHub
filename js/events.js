/* ======================================================
   ELEMENTS
====================================================== */

const eventsList = document.getElementById("events-list");
const latestCard = document.getElementById("latest-event-card");
const monthFilter = document.getElementById("month-filter");
const totalEvents = document.getElementById("total-events");
const totalPhotos = document.getElementById("total-photos");
const sortSelect = document.getElementById("sort-select");
const gridBtn = document.getElementById("grid-view");
const listBtn = document.getElementById("list-view");

/* ======================================================
   STATE
====================================================== */

let events = [];
let currentMonth = "all";

/* ======================================================
   LOAD
====================================================== */

async function loadEvents() {
    try {
        const response = await fetch("../data/gallery.json");

        if (!response.ok) {
            throw new Error("Cannot load gallery.json");
        }

        events = await response.json();

        events.sort(
            (a, b) => parseDate(b.date) - parseDate(a.date)
        );

        updateStats();
        renderLatest();
        createFilters();
        renderEvents();
        setupToggleView(); 
    } catch (error) {
        console.error(error);
        if (eventsList) {
            eventsList.innerHTML = `
                <div class="empty">
                    Failed to load events.
                </div>
            `;
        }
    }
}

loadEvents();

/* ======================================================
   DATE PARSER
====================================================== */

function parseDate(dateString) {
    return new Date(
        dateString.replace(
            /(\d+) (\w+) (\d+)/,
            "$2 $1, $3"
        )
    );
}

/* ======================================================
   COUNTER ANIMATION
====================================================== */

function animateNumber(element, target) {
    if (!element) return;
    let current = 0;
    const step = Math.ceil(target / 40) || 1;
    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = current.toLocaleString();
    }, 20);
}

/* ======================================================
   STATS UPDATE (Đếm tổng số sự kiện và ảnh)
====================================================== */

function updateStats() {
    const photos = events.reduce((sum, item) => sum + item.photos, 0);
    animateNumber(totalEvents, events.length);
    animateNumber(totalPhotos, photos);
}

/* ======================================================
   LATEST EVENT CARD (Lấy chuẩn sự kiện mới nhất phần tử)
====================================================== */

/* ======================================================
   LATEST EVENT CARD (Đã loại bỏ thẻ article trùng lặp)
====================================================== */

function renderLatest() {
    if (!latestCard || !events.length) return;

    // Lấy chuẩn phần tử đầu tiên trong mảng dữ liệu
    const item = events[0]; 

    // ĐÃ LOẠI BỎ THẺ <article> BÊN TRONG:
    // Bản thân thẻ div#latest-event-card ở file index.html đã mang sẵn class này rồi.
    latestCard.innerHTML = `
        <div class="latest-image">
            <img
                src="../assets/events/${item.folder}/${item.cover}.${item.format}"
                alt="${item.title}">
        </div>

        <div class="latest-content">
            <span class="badge">
                ✦ LATEST EVENT
            </span>

            <h2>
                ${item.title}
            </h2>

            <p class="latest-meta">
                📅 ${item.date}
            </p>

            <p class="latest-meta">
                📷 ${item.photos} photos archived
            </p>

            <a href="detail.html?id=${item.id}" class="btn-secondary latest-btn">
                <span>View Gallery &nbsp; →</span>
                <div class="icon-circle">
                    ☾
                </div>
            </a>
        </div>
    `;
}

/* ======================================================
   MONTH FILTER CAPTURE
====================================================== */

function createFilters() {
    if (!monthFilter) return;

    const months = [
        "all",
        ...new Set(
            events.map(item =>
                parseDate(item.date).toLocaleString("en-US", { month: "long" })
            )
        )
    ];

    monthFilter.innerHTML = months.map(month => `
        <button
            data-month="${month}"
            class="${month === "all" ? "active" : ""}">
            ${month === "all" ? "All" : month}
        </button>
    `).join("");

    monthFilter.querySelectorAll("button").forEach(button => {
        button.onclick = () => {
            monthFilter.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
            button.classList.add("active");
            currentMonth = button.dataset.month;
            renderEvents();
        };
    });
}

/* ======================================================
   EVENTS RENDER GRID (Render danh sách thẻ card sự kiện)
====================================================== */

function renderEvents() {
    if (!eventsList) return;

    let filtered = [...events];

    if (currentMonth !== "all") {
        filtered = filtered.filter(item => {
            const month = parseDate(item.date).toLocaleString("en-US", { month: "long" });
            return month === currentMonth;
        });
    }

    if (sortSelect && sortSelect.value === "oldest") {
        filtered.sort((a, b) => parseDate(a.date) - parseDate(b.date));
    } else {
        filtered.sort((a, b) => parseDate(b.date) - parseDate(a.date));
    }

    if (filtered.length === 0) {
        eventsList.innerHTML = `<div class="empty">No events found in this month.</div>`;
        return;
    }

    eventsList.innerHTML = filtered.map(item => {
        const date = parseDate(item.date);
        const day = date.getDate();
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();

        return `
            <a href="detail.html?id=${item.id}" class="event-card">
                <div class="event-thumb">
                    <img 
                        src="../assets/events/${item.folder}/${item.cover}.${item.format}" 
                        alt="${item.title}"
                        loading="lazy"
                    >
                    
                    <div class="bubble b1"></div>
                    <div class="bubble b2"></div>
                    <div class="bubble b3"></div>

                    <div class="event-date-badge">
                        <strong>${day}</strong>
                        <span>${month.toUpperCase()}</span>
                        <small>${year}</small>
                    </div>
                </div>

                <div class="event-info">
                    <h2>${item.title}</h2>
                    <div class="event-meta">
                        <p class="event-date">
                            📅 ${item.date}
                        </p>
                        <span class="event-photos">
                            📷 ${item.photos} photos &nbsp; →
                        </span>
                    </div>
                </div>
            </a>
        `;
    }).join("");
}

/* ======================================================
   SORT SELECT WATCHER
====================================================== */
if (sortSelect) {
    sortSelect.onchange = () => {
        renderEvents();
    };
}

/* ======================================================
   VIEW TOGGLE
====================================================== */
function setupToggleView() {
    if (!gridBtn || !listBtn) return;

    gridBtn.onclick = () => {
        gridBtn.classList.add("active");
        listBtn.classList.remove("active");
        eventsList.classList.remove("events-list-view");
        eventsList.classList.add("events-grid");
    };

    listBtn.onclick = () => {
        listBtn.classList.add("active");
        gridBtn.classList.remove("active");
        eventsList.classList.remove("events-grid");
        eventsList.classList.add("events-list-view");
    };
}
