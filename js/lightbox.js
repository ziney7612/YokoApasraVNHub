document.addEventListener(
    "DOMContentLoaded",
    () => {

        const lightbox = document.getElementById("lightbox");
        const image = document.getElementById("lightbox-image");

        if (!lightbox || !image) return;

        const closeBtn = document.querySelector(".lightbox-close");
        const prevBtn = document.querySelector(".lightbox-prev");
        const nextBtn = document.querySelector(".lightbox-next");
        const counter = document.getElementById("lightbox-counter");
        const caption = document.getElementById("lightbox-caption");
        const download = document.getElementById("lightbox-download");

        /* ======================================================
           1. HÀM TẢI FILE NHỊ PHÂN (BLOB) & ĐỔI TÊN THEO SỐ ẢNH MƯỢT MÀ
        ====================================================== */
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
                console.error("Download failed, opening origin link instead:", error);
                window.open(url, "_blank");
            }
        }

        /* ======================================================
           2. SỰ KIỆN KHỞI TẠO NÚT BẤM DOWNLOAD CỐ ĐỊNH FORM HTML
        ====================================================== */
        if (download) {
            // Chỉ sinh 6 hạt bong bóng, KHÔNG viết đè innerHTML để giữ cấu trúc thẻ div mặt trăng của file HTML
            for (let i = 0; i < 6; i++) {
                const bubble = document.createElement("span");
                bubble.className = "bubble";
                download.appendChild(bubble);
            }

            download.addEventListener("click", async (e) => {
                e.preventDefault();
                const src = image.src;
                if (!src) return;

                const textSpan = download.querySelector("span");
                const originalText = textSpan ? textSpan.textContent : "Download Original";
                if (textSpan) textSpan.textContent = "Downloading...";
                download.style.pointerEvents = "none";

                try {
                    // ĐÃ SỬA: Lấy con số thứ tự ảnh chuẩn dựa trên tên file nguồn (Ví dụ: 001.jpg, 002.jpg)
                    let photoNumber = String(current + 1).padStart(3, '0');
                    const fileBaseName = src.substring(src.lastIndexOf('/') + 1);
                    const matchNumber = fileBaseName.match(/\d+/);
                    if (matchNumber) photoNumber = String(matchNumber[0]).padStart(3, '0');

                    await downloadFileBlob(src, `Special Day 2026 - ${photoNumber}`);
                } catch (error) {
                    console.error("Process download error:", error);
                    window.open(src, "_blank");
                } finally {
                    if (textSpan) textSpan.textContent = originalText;
                    download.style.pointerEvents = "auto";
                }
            });
        }

        let gallery = [];
        let current = 0;
        let zoom = 1;
        let touchStart = 0;

        function collect() {
            gallery = [...document.querySelectorAll(".lightbox-trigger")];
        }

        window.refreshLightbox = collect;

        function getSrc(item) {
            return item.getAttribute("href") || item.dataset.src || "";
        }

        function getImg(item) {
            return item.querySelector("img");
        }

        function resetZoom() {
            zoom = 1;
            image.style.transform = "scale(1)";
        }

        function preload(index) {
            if (index < 0 || index >= gallery.length) return;
            const img = new Image();
            img.src = getSrc(gallery[index]);
        }

        function preloadNearby() {
            preload(current - 1);
            preload(current + 1);
        }

        /* ======================================================
           3. ĐỒNG BỘ TIÊU ĐỀ CHỮ: SỬA LỖI NHẢY SỐ NĂM 2026
        ====================================================== */
        function updateUI() {
            const item = gallery[current];
            if (!item) return;

            const src = getSrc(item);

            if (counter) {
                counter.textContent = `${current + 1} / ${gallery.length}`;
            }

            if (caption) {
                // ĐÃ SỬA TRIỆT ĐỂ: Cắt bỏ tên mục để dò số từ đuôi file ảnh (ví dụ: 002.jpg -> 002), tránh bắt nhầm năm 2026
                let photoNumber = String(current + 1).padStart(3, '0');
                const fileBaseName = src.substring(src.lastIndexOf('/') + 1);
                const matchNumber = fileBaseName.match(/\d+/);
                
                if (matchNumber) {
                    photoNumber = String(matchNumber[0]).padStart(3, '0');
                }
                
                caption.textContent = `Yoko @ Special Day 2026 - Photo ${photoNumber}`;
            }

            if (download) {
                download.href = src;
            }
        }

        function show(index) {
            const item = gallery[index];
            if (!item) return;

            const src = getSrc(item);
            const img = getImg(item);

            image.classList.add("loading");

            const loader = new Image();
            loader.onload = () => {
                image.src = src;
                image.alt = img?.alt || "";
                current = index;

                updateUI();
                preloadNearby();
                resetZoom();

                requestAnimationFrame(() => {
                    image.classList.remove("loading");
                });
            };
            loader.src = src;
        }

        function open(index) {
            collect();
            if (!gallery.length) return;

            lightbox.classList.add("show");
            document.body.classList.add("lightbox-open");
            show(index);
        }

        function close() {
            lightbox.classList.remove("show");
            document.body.classList.remove("lightbox-open");
            resetZoom();
        }

        function next() {
            current++;
            if (current >= gallery.length) current = 0;
            show(current);
        }

        function prev() {
            current--;
            if (current < 0) current = gallery.length - 1;
            show(current);
        }

        /* ======================================================
           4. SỰ KIỆN CLICK ĐÓNG MỞ & VUỐT DI ĐỘNG
        ====================================================== */
        document.addEventListener("click", e => {
            const trigger = e.target.closest(".lightbox-trigger");
            if (!trigger) return;

            e.preventDefault();
            collect();

            const index = gallery.indexOf(trigger);
            if (index >= 0) open(index);
        });

        closeBtn?.addEventListener("click", close);
        nextBtn?.addEventListener("click", next);
        prevBtn?.addEventListener("click", prev);

        lightbox.addEventListener("click", e => {
            if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) {
                close();
            }
        });

        document.addEventListener("keydown", e => {
            if (!lightbox.classList.contains("show")) return;
            switch (e.key) {
                case "Escape": close(); break;
                case "ArrowRight": next(); break;
                case "ArrowLeft": prev(); break;
            }
        });

        lightbox.addEventListener("touchstart", e => {
            touchStart = e.changedTouches[0].screenX;
        });

        lightbox.addEventListener("touchend", e => {
            const touchEnd = e.changedTouches[0].screenX;
            const distance = touchEnd - touchStart;
            if (distance > 50) prev();
            else if (distance < -50) next();
        });
    }
);
