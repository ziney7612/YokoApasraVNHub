document.addEventListener("DOMContentLoaded", async () => {

    const container = document.getElementById("events-list");

    if (!container) return;

    try {

        const response = await fetch("../data/gallery.json");

        if (!response.ok) {

            throw new Error("Cannot load events.json");

        }

        const events = await response.json();
        
        console.log(events);

        container.innerHTML = "";

        events.forEach(event => {

            console.log(event);

            const cover = String(event.cover || "001").padStart(3, "0");

            const ext = event.format || "jpg";

            const card = document.createElement("a");

            card.className = "event-card";

            card.href = `detail.html?id=${encodeURIComponent(event.id)}`;

            card.innerHTML = `

                <div class="event-thumb">

                    <img
                        src="../assets/events/${event.folder}/${cover}.${ext}"
                        alt="${event.title}"
                        loading="lazy"
                        decoding="async">

                </div>

                <div class="event-info">

                    <h2>${event.title}</h2>

                    <p class="event-date">

                        📅 ${event.date}

                    </p>

                    <span class="event-photos">

                        📷 ${event.photos} Photos

                    </span>

                </div>

            `;

            container.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="empty-state">

                <h2>Unable to load events.</h2>

                <p>Please check events.json</p>

            </div>

        `;

    }

});
