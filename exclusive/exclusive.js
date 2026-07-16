/* ==========================================
   ELEMENTS
========================================== */

const exclusiveList =
    document.getElementById("exclusive-list");


/* ==========================================
   LOAD
========================================== */

async function loadExclusive() {

    try {

        const response =
            await fetch("../data/exclusive.json");

        const albums =
            await response.json();

        renderAlbums(albums);

    }

    catch (error) {

        console.error(error);

        exclusiveList.innerHTML = `

            <div class="exclusive-empty">

                <h2>
                    Unable to load collection.
                </h2>

                <p>
                    Please try again later.
                </p>

            </div>

        `;
    }

}

loadExclusive();


/* ==========================================
   RENDER
========================================== */

function renderAlbums(albums) {

    if (!albums.length) {

        exclusiveList.innerHTML = `

            <div class="exclusive-empty">

                <h2>

                    Exclusive Collection

                </h2>

                <p>

                    Coming soon...

                </p>

            </div>

        `;

        return;

    }


    exclusiveList.innerHTML = albums.map(album => `

        <article class="exclusive-card">

            <div class="exclusive-cover">

                <img
                    src="../assets/exclusive/${album.folder}/${album.cover}.${album.format}"
                    alt="${album.title}"
                    loading="lazy">

            </div>


            <div class="exclusive-content">

                <h2 class="exclusive-title">

                    ${album.title}

                </h2>


                <p class="exclusive-subtitle">

                    ${album.subtitle}

                </p>


                <div class="exclusive-meta">

                    <p>

                        <span>📅</span>

                        ${album.date}

                    </p>


                    <p>

                        <span>📍</span>

                        ${album.location}

                    </p>


                    <p>

                        <span>📷</span>

                        ${album.photos}
                        Original Photos

                    </p>

                </div>


                <div class="exclusive-action">

                    <a
                        href="detail.html?id=${album.id}"
                        class="exclusive-btn">

                        View Gallery →

                    </a>

                </div>

            </div>

        </article>

    `).join("");

}
