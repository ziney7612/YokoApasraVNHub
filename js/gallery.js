document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.getElementById("gallery");

    if (!gallery) return;

    const folder = gallery.dataset.folder;
    const total = Number(gallery.dataset.total);

    for (let i = 1; i <= total; i++) {

        const img = document.createElement("img");

        img.className = "gallery-img";

        img.loading = "lazy";

        img.src =
            `../assets/events/${folder}/${String(i).padStart(3, "0")}.jpg`;

        img.alt = `${folder} ${i}`;

        img.addEventListener("load",()=>{

    img.classList.add("loaded");

});

gallery.appendChild(img);

    }

});
