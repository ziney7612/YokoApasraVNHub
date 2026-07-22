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
    const zoomBtn = document.querySelector(".lightbox-zoom-btn");

    let gallery = [];
    let current = 0;
    let touchStart = 0;

    // Biến lưu trữ tên sự kiện động hiện tại
    let currentEventTitle = "Yoko Apasra";

    /* ======================================================
       1. HÀM TỰ ĐỘNG TRÍCH XUẤT TÊN SỰ KIỆN - VÁ LỖI LẶP TỪ CHỮ YOKO @
    ====================================================== */
    function detectEventTitle(triggerElement) {
        // A. Nếu đang ở trang chi tiết hoặc exclusive, lấy thẳng từ tiêu đề h1 của trang
        const pageTitleEl = document.getElementById("event-title") || 
                            document.querySelector(".hero-title") || 
                            document.querySelector(".exclusive-title");
        
        if (pageTitleEl && pageTitleEl.textContent.trim() !== "") {
            let title = pageTitleEl.textContent.trim();
            // Lọc bỏ chữ "Archive" và cụm "Yoko @" dính kèm nếu có
            title = title.replace(/Archive/gi, "").trim();
            return title.replace(/Yoko\s*@\s*/gi, "").trim();
        }

        // B. Nếu đang ở trang danh sách hoặc trang chủ, dò ngược tìm thẻ card chứa ảnh
        const cardParent = triggerElement.closest(".event-card") || 
                           triggerElement.closest(".featured-card") || 
                           triggerElement.closest(".latest-card");
        
        if (cardParent) {
            const cardTitleEl = cardParent.querySelector("h2") || cardParent.querySelector("h3");
            if (cardTitleEl) {
                let title = cardTitleEl.textContent.trim();
                
                /* ĐÃ SỬA TRIỆT ĐỂ: Sử dụng cờ quét toàn cục /gi để xóa sạch bóng 
                   tất cả các chữ "Yoko @" dính trong thẻ h2, trả lại tên sự kiện sạch */
                return title.replace(/Yoko\s*@\s*/gi, "").trim();
            }
        }

        return "Yoko Apasra";
    }

    /* ======================================================
       2. HÀM TẢI FILE NHỊ PHÂN (BLOB) - VƯỢT LỖI CORS & ĐỔI TÊN ĐỘNG
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
            window.open(url, "_blank");
        }
    }

    /* ======================================================
       3. KHỞI TẠO BONG BÓNG KÍNH 3D CHO NÚT DOWNLOAD ORIGINAL
    ====================================================== */
    function initDownloadBubbles() {
        if (!download) return;
        download.innerHTML = `<span>Download Original</span><div class="moon">☾</div>`;
        for (let i = 0; i < 6; i++) {
            const bubble = document.createElement("span");
            bubble.className = "bubble";
            download.appendChild(bubble);
        }
    }

    /* ======================================================
       4. GENERATE DẢI THUMBNAIL STRIP DƯỚI ĐÁY MÀN HÌNH
    ====================================================== */
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

    /* ======================================================
       5. CƠ CHẾ BẬT/TẮT FULL SCREEN ĐIỆN ẢNH (ẢNH BỰ TRÀN VIỀN)
    ====================================================== */
    function toggleFullscreenMode() {
        if (lightbox.classList.contains("fullscreen-mode")) {
            lightbox.classList.remove("fullscreen-mode");
            if (zoomBtn) zoomBtn.innerHTML = "⛶"; 
        } else {
            lightbox.classList.add("fullscreen-mode");
            if (zoomBtn) zoomBtn.innerHTML = "⛵"; 
        }
    }

    if (zoomBtn) {
        zoomBtn.addEventListener("click", (e) => {
            e.stopPropagation(); 
            toggleFullscreenMode();
        });
    }

    image.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleFullscreenMode();
    });

    /* ======================================================
       6. ĐỒNG BỘ TEXT TIÊU ĐỀ CHUẨN XÁC, SẠCH LỖI LẶP TỪ
    ====================================================== */
    function updateUI() {
        if (!gallery[current]) return;
        const item = gallery[current];
        const src = item.getAttribute("href") || item.dataset.src || "";

        if (counter) counter.textContent = `${current + 1} / ${gallery.length}`;
        
        // Trích xuất số thứ tự ảnh chuẩn xác từ đuôi file
        let photoNumber = String(current + 1).padStart(3, '0');
        const fileBaseName = src.substring(src.lastIndexOf('/') + 1);
        const matchNumber = fileBaseName.match(/\d+/);
        if (matchNumber) photoNumber = String(matchNumber).padStart(3, '0');

        // Gán chuỗi tiêu đề động theo định dạng sạch không nhân đôi Yoko @
        if (caption) {
            caption.textContent = `Yoko @ ${currentEventTitle} - Photo ${photoNumber}`;
        }

        if (download) download.href = src;

        // Cập nhật viền sáng active cho ô ảnh thu nhỏ dưới đáy
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

        image.lightbox.classList.remove("fullscreen-mode"); // Trả lại thanh strip khi chuyển hình
        if (zoomBtn) zoomBtn.innerHTML = "⛶";
        
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

    function open(index, triggerElement) {
        collect();
        if (!gallery.length) return;
        
        // Bắt chính xác tên sự kiện động ngay khi click mở ảnh
        currentEventTitle = detectEventTitle(triggerElement);
        
        buildThumbnails();
        lightbox.classList.add("show");
        document.body.classList.add("lightbox-open");
        show(index);
    }

    function close() {
        lightbox.classList.remove("show");
        lightbox.classList.remove("fullscreen-mode"); 
        if (zoomBtn) zoomBtn.innerHTML = "⛶";
        document.body.classList.remove("lightbox-open");
    }

    /* ======================================================
       7. SỰ KIỆN CLICK NÚT DOWNLOAD: ĐỔI TÊN ĐỘNG THEO SỰ KIỆN SẠCH
    ====================================================== */
    if (download) {
        initDownloadBubbles(); 
        
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

                // Tên file tải về tự động khớp sạch sẽ theo tên sự kiện động
                await downloadFileBlob(src, `${currentEventTitle} - ${photoNumber}`);
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
if (trigger) {
e.preventDefault();
collect();
// Truyền thêm thẻ click trigger để bóc tách tiêu đề h2 động sạch
open(gallery.indexOf(trigger), trigger);
}
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
