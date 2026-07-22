document.addEventListener("DOMContentLoaded", () => {
    const lightbox = document.getElementById("lightbox");
    const image = document.getElementById("lightbox-image");
    if (!lightbox || !image) return;

    const closeBtn = document.querySelector(".lightbox-close");
    const prevBtn = document.querySelector(".lightbox-prev");
    const nextBtn = document.querySelector(".lightbox-next");
    const counter = document.getElementById("lightbox-counter");
    const caption = document.getElementById("lightbox-caption");
    const download = document.getElementById("lightbox-download");
    const thumbsList = document.getElementById("lightbox-thumbs-list");
    const thumbPrev = document.querySelector(".thumb-nav.thumb-prev");
    const thumbNext = document.querySelector(".thumb-nav.thumb-next");

    let gallery = [];
    let current = 0;
    let touchStart = 0;

    function collect() {
        gallery = [...document.querySelectorAll(".lightbox-trigger")];
    }

    async function downloadFileBlob(url, customName) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error("Network error");
            const blob = await response.blob();
            const blobUrl = URL.createObjectURL(blob);
            const extension = url.substring(url.lastIndexOf('.')) || '.jpg';
            
            const tempLink = document.createElement("a");
            tempLink.href = blobUrl;
            tempLink.download = `${customName}${extension}`;
            document.body.appendChild(tempLink);
            tempLink.click();
            document.body.removeChild(tempLink);
            URL.revokeObjectURL(blobUrl);
        } catch (error) {
            window.open(url, "_blank");
        }
    }

    // KHỞI TẠO BONG BÓNG GỐC CHO NÚT DOWNLOAD
    function initDownloadBubbles() {
        if (!download) return;
        // Giữ cấu trúc chữ và icon mặt trăng gốc
        download.innerHTML = `<span>Download Original</span><div class="icon-circle">🌙</div>`;
        
        // Tạo 6 thẻ bong bóng dập dềnh
        for (let i = 0; i < 6; i++) {
            const bubble = document.createElement("span");
            bubble.className = "bubble";
            download.appendChild(bubble);
        }
    }

    function buildThumbnails() {
        if (!thumbsList) return;
        thumbsList.innerHTML = gallery.map((item, index) => {
            const thumbImg = item.querySelector("img");
            return `<img src="${thumbImg ? thumbImg.src : ''}" data-index="${index}" alt="thumb">`;
        }).join("");

        thumbsList.querySelectorAll("img").forEach(thumb => {
            thumb.onclick = (e) => show(parseInt(e.target.dataset.index));
        });
    }

    function updateUI() {
        if (!gallery[current]) return;
        const item = gallery[current];
        const img = item.querySelector("img");
        const src = item.getAttribute("href") || item.dataset.src || "";

        if (counter) counter.textContent = `${current + 1} / ${gallery.length}`;
        
        if (caption) {
            let photoNumber = String(current + 1).padStart(3, '0');
            const fileBaseName = src.substring(src.lastIndexOf('/') + 1);
            const matchNumber = fileBaseName.match(/\d+/);
            if (matchNumber) photoNumber = String(matchNumber).padStart(3, '0');
            caption.textContent = `Yoko @ Special Day 2026 - Photo ${photoNumber}`;
        }

        if (download) download.href = src;

        if (thumbsList) {
            const thumbs = thumbsList.querySelectorAll("img");
            thumbs.forEach(t => t.classList.remove("active"));
            if (thumbs[current]) {
                thumbs[current].classList.add("active");
                thumbs[current].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
            }
        }
    }

    function show(index) {
        if (index < 0 || index >= gallery.length) return;
        const src = gallery[index].getAttribute("href") || gallery[index].dataset.src || "";
        const img = gallery[index].querySelector("img");

        image.classList.add("loading");
        const loader = new Image();
        loader.onload = () => {
            image.src = src;
            image.alt = img?.alt || "";
            current = index;
            updateUI();
            requestAnimationFrame(() => image.classList.remove("loading"));
        };
        loader.src = src;
    }

    function open(index) {
        collect();
        if (!gallery.length) return;
        buildThumbnails();
        lightbox.classList.add("show");
        document.body.classList.add("lightbox-open");
        show(index);
    }

    function close() {
        lightbox.classList.remove("show");
        document.body.classList.remove("lightbox-open");
    }

    // XỬ LÝ SỰ KIỆN CLICK NÚT DOWNLOAD ĐỔI TÊN CHUẨN
    if (download) {
        initDownloadBubbles(); // Sinh bong bóng ngay khi tải trang
        
        download.addEventListener("click", async (e) => {
            e.preventDefault();
            const src = image.src;
            if (!src) return;

            const textSpan = download.querySelector("span");
            if (textSpan) textSpan.textContent = "Downloading...";
            download.style.pointerEvents = "none";

            try {
                let photoNumber = String(current + 1).padStart(3, '0');
                const fileBaseName = src.substring(src.lastIndexOf('/') + 1);
                const matchNumber = fileBaseName.match(/\d+/);
                if (matchNumber) photoNumber = String(matchNumber).padStart(3, '0');

                await downloadFileBlob(src, `Special Day 2026 - ${photoNumber}`);
            } catch (error) {
                window.open(src, "_blank");
            } finally {
                if (textSpan) textSpan.textContent = "Download Original";
                download.style.pointerEvents = "auto";
            }
        });
    }

    thumbPrev?.addEventListener("click", () => { if (thumbsList) thumbsList.scrollLeft -= 150; });
    thumbNext?.addEventListener("click", () => { if (thumbsList) thumbsList.scrollLeft += 150; });

    document.addEventListener("click", e => {
        const trigger = e.target.closest(".lightbox-trigger");
        if (trigger) { e.preventDefault(); collect(); open(gallery.indexOf(trigger)); }
    });

    closeBtn?.addEventListener("click", close);
    nextBtn?.addEventListener("click", () => { current = (current + 1) % gallery.length; show(current); });
    prevBtn?.addEventListener("click", () => { current = (current - 1 + gallery.length) % gallery.length; show(current); });

    lightbox.addEventListener("click", e => {
        if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) close();
    });

    document.addEventListener("keydown", e => {
        if (!lightbox.classList.contains("show")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowRight") { current = (current + 1) % gallery.length; show(current); }
        if (e.key === "ArrowLeft") { current = (current - 1 + gallery.length) % gallery.length; show(current); }
    });

    lightbox.addEventListener("touchstart", e => { touchStart = e.changedTouches.screenX; });
    lightbox.addEventListener("touchend", e => {
        const distance = e.changedTouches.screenX - touchStart;
        if (distance > 50) { current = (current - 1 + gallery.length) % gallery.length; show(current); }
        else if (distance < -50) { current = (current + 1) % gallery.length; show(current); }
    });
});
