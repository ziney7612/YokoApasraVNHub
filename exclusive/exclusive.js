/* ======================================================
   EXCLUSIVE
   Yoko Apasra VNHub
====================================================== */

/* ======================================================
   ELEMENTS
====================================================== */

const exclusiveList =
    document.getElementById(
        "exclusive-list"
    );


/* ======================================================
   LOAD
====================================================== */

async function loadExclusive() {

    try {

        const response =
            await fetch(
                "../data/exclusive.json"
            );

        if (!response.ok) {

            throw new Error(
                "Unable to load exclusive.json"
            );

        }

        const albums =
            await response.json();

        renderAlbums(albums);

    }

    catch (error) {

        console.error(error);

        exclusiveList.innerHTML =

            `
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


/* ======================================================
   RENDER
====================================================== */

function renderAlbums(albums) {

    if (

        !albums ||

        !albums.length

    ) {

        exclusiveList.innerHTML =

            `
            <div class="exclusive-empty">

                <h2>

                    Exclusive Collection

                </h2>

                <p>

                    Coming Soon...

                </p>

            </div>
            `;

        return;

    }

    exclusiveList.innerHTML =

        albums.map(album => {

            const extension =

                album.format || "jpg";

            const poster =

                `../assets/exclusive/${album.folder}/poster.${extension}`;

return `

<article class="exclusive-card glass-card">

    <div class="exclusive-cover">

        <img
            src="${poster}"
            alt="${album.title}"
            loading="lazy"
            decoding="async"
            draggable="false"
            onerror="this.src='../assets/logo/logo.png'">

    </div>


    <div class="exclusive-content">

        <span class="badge">

            ✦ Exclusive Collection

        </span>

        <h2 class="exclusive-title">

            ${album.title}

        </h2>


        <p class="exclusive-subtitle">

            ${album.subtitle || ""}

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
                Photo${album.photos > 1 ? "s" : ""}

            </p>

        </div>


        <div class="exclusive-action">

            <a
                href="detail.html?id=${album.id}"
                class="btn-primary">

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

</article>

`;

        }).join("");

}
