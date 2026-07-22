document.addEventListener(
    "DOMContentLoaded",
    () => {

        const lightbox =
            document.getElementById(
                "lightbox"
            );

        const image =
            document.getElementById(
                "lightbox-image"
            );

        if (!lightbox || !image)
            return;

        const closeBtn =
            document.querySelector(
                ".lightbox-close"
            );

        const prevBtn =
            document.querySelector(
                ".lightbox-prev"
            );

        const nextBtn =
            document.querySelector(
                ".lightbox-next"
            );

        const counter =
            document.getElementById(
                "lightbox-counter"
            );

        const caption =
            document.getElementById(
                "lightbox-caption"
            );

        const download =
            document.getElementById(
                "lightbox-download"
            );

        /* ======================================================
           1. HÀM TẢI FILE NHỊ PHÂN (BLOB) - VƯỢT LỖI CORS & ĐỔI TÊN FILE
        ====================================================== */
        async function downloadFileBlob(url, customName) {
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error("Network error");
                
                const blob = await response.blob();
                const blobUrl = URL.createObjectURL(blob);
                
                // Tự động lấy đuôi định dạng ảnh gốc (.jpg, .png...) từ link nguồn
                const extension = url.substring(url.lastIndexOf('.')) || '.jpg';
                
                const tempLink = document.createElement("a");
                tempLink.href = blobUrl;
                
                // Đổi tên file tải về chính xác dạng: "Special Day 2026 - 003.jpg"
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
           2. KHỞI TẠO NÚT BẤM DOWNLOAD CÓ ICON MẶT TRĂNG VÀ BONG BÓNG
        ====================================================== */
        if (download) {

            // Gán cấu trúc chữ và vòng tròn chứa mặt trăng đúng chuẩn giao diện mới
            download.innerHTML =
                `
                <span>Download Original</span>
                <div class="icon-circle">🌙</div>
                `;

            // Vòng lặp tự động tạo ra 6 hạt bong bóng kính 3D dập dềnh
            for (
                let i = 0;
                i < 6;
                i++
            ) {
                const bubble =
                    document.createElement(
                        "span"
                    );
                bubble.className =
                    "bubble";
                download.appendChild(
                    bubble
                );
            }

            // Gán sự kiện click tải ảnh nhị phân nâng cao
            download.addEventListener("click", async (e) => {
                e.preventDefault();
                
                const src = image.src;
                if (!src) return;

                // Thay đổi trạng thái chữ tạm thời khi đang tải
                const textSpan = download.querySelector("span:not(.icon-circle)");
                const originalText = textSpan ? textSpan.textContent : "Download Original";
                if (textSpan) textSpan.textContent = "Downloading...";
                download.style.pointerEvents = "none";

                try {
                    // Trích xuất con số thứ tự từ thuộc tính alt của ảnh hiện tại
                    let photoNumber = String(current + 1).padStart(3, '0');
                    if (image.alt) {
                        const matchNumber = image.alt.match(/\d+/);
                        if (matchNumber) photoNumber = String(matchNumber).padStart(3, '0');
                    }

                    // Gọi hàm ép tải xuống máy kèm đổi tên file mong muốn
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

        /* ======================================================
           3. ĐỊNH NGHĨA BIẾN TRẠNG THÁI VÀ BỘ KHUNG GỌI DỮ LIỆU LIGHTBOX
        ====================================================== */
        let gallery = [];
        let current = 0;
        let zoom = 1;
        let touchStart = 0;

        function collect() {
            gallery = [
                ...document.querySelectorAll(
                    ".lightbox-trigger"
                )
            ];
        }

        window.refreshLightbox = collect;

        function getSrc(item) {
            return (
                item.getAttribute(
                    "href"
                ) ||
                item.dataset.src ||
                ""
            );
        }

        function getImg(item) {
            return (
                item.querySelector(
                    "img"
                )
            );
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
           4. ĐỒNG BỘ GIAO DIỆN TEXT: TIÊU ĐỀ HÌNH ẢNH DẠNG CHUẨN MỚI
        ====================================================== */
        function updateUI() {
            const item = gallery[current];
            if (!item) return;

            const img = getImg(item);
            const src = getSrc(item);

            if (counter) {
                counter.textContent = `${current + 1} / ${gallery.length}`;
            }

            // Tự động gán dòng tiêu đề chuẩn: Yoko @ Special Day 2026 - Photo 003
            if (caption) {
                let photoNumber = String(current + 1).padStart(3, '0');
                const altText = img?.alt || "";
                const matchNumber = altText.match(/\d+/);
                
                if (matchNumber) {
                    photoNumber = String(matchNumber).padStart(3, '0');
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
            if (current >= gallery.length) {
                current = 0;
            }
            show(current);
        }

        function prev() {
            current--;
            if (current < 0) {
                current = gallery.length - 1;
            }
            show(current);
        }

        /* ======================================================
           5. LẮNG NGHE CÁC SỰ KIỆN ĐIỀU KHIỂN & SỰ KIỆN VUỐT CHUYỂN ẢNH
        ====================================================== */

        // Nhấn chuột vào các hình ảnh thu nhỏ (.lightbox-trigger) để kích hoạt mở Lightbox
        document.addEventListener("click", e => {
            const trigger = e.target.closest(".lightbox-trigger");
            if (!trigger) return;

            e.preventDefault();
            collect();

            const index = gallery.indexOf(trigger);
            if (index >= 0) {
                open(index);
            }
        });

        closeBtn?.addEventListener("click", close);
        nextBtn?.addEventListener("click", next);
        prevBtn?.addEventListener("click", prev);

        // Click chuột ra ngoài khu vực ảnh (Click vào vùng nền tối hoặc stage trống) để tắt Lightbox
        lightbox.addEventListener("click", e => {
            if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) {
                close();
            }
        });

        // Sử dụng phím điều hướng mũi tên và nút Esc trên bàn phím máy tính
document.addEventListener("keydown", e => {
if (!lightbox.classList.contains("show")) return;
switch (e.key) {
case "Escape":
close();
break;
case "ArrowRight":
next();
break;
case "ArrowLeft":
prev();
break;
}
});
// Cử chỉ vuốt màn hình (Touch Swipe) mượt mà trên Điện thoại/Máy tính bảng
lightbox.addEventListener("touchstart", e => {
touchStart = e.changedTouches[0].screenX;
});
lightbox.addEventListener("touchend", e => {
const touchEnd = e.changedTouches[0].screenX;
const distance = touchEnd - touchStart;
// Kiểm tra biên độ biên dịch vuốt ngang màn hình lớn hơn 50px
if (distance > 50) {
prev(); // Vuốt từ trái qua phải: Lùi về ảnh cũ
} else if (distance < -50) {
next(); // Vuốt từ phải qua trái: Tiến tới ảnh tiếp theo
}
});
}
);
