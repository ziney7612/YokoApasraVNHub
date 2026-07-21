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

        /* ============================
           DOWNLOAD BUBBLES
        ============================ */

        if (download) {

            download.innerHTML =
                `
                <span class="moon-icon">🌙</span>
                <span>Download Original</span>
                `;

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

            /* ======================================================
               NEW: ADVANCED BLOB DOWNLOAD (Sửa lỗi không tự động tải ảnh)
            ====================================================== */
            download.addEventListener("click", async (e) => {
                e.preventDefault(); // Ngăn trình duyệt mở liên kết sang tab mới
                
                const src = image.src;
                if (!src) return;

                // Thay đổi trạng thái nút tạm thời để người dùng biết hệ thống đang xử lý
                const originalText = download.querySelector("span:not(.moon-icon)").textContent;
                download.querySelector("span:not(.moon-icon)").textContent = "Downloading...";
                download.style.pointerEvents = "none";

                try {
                    const response = await fetch(src);
                    if (!response.ok) throw new Error("Network error");
                    
                    // Chuyển dữ liệu ảnh sang dạng mã nhị phân Blob an toàn
                    const blob = await response.blob();
                    const objectUrl = URL.createObjectURL(blob);
                    
                    // Trích xuất tên file ảnh (ví dụ: 001.jpg) từ đường dẫn nguồn
                    const fileName = src.substring(src.lastIndexOf('/') + 1) || "yoko-photo.jpg";
                    
                    // Tạo thẻ liên kết ảo để ép trình duyệt lưu tệp xuống thư mục máy
                    const tempLink = document.createElement("a");
                    tempLink.href = objectUrl;
                    tempLink.download = `Yoko_${fileName}`;
                    
                    document.body.appendChild(tempLink);
                    tempLink.click();
                    
                    // Giải phóng bộ nhớ
                    document.body.removeChild(tempLink);
                    URL.revokeObjectURL(objectUrl);
                } catch (error) {
                    console.error("Download failed, opening origin link instead:", error);
                    // Phương án dự phòng nếu dính lỗi bảo mật CORS: Mở ảnh trực tiếp ở tab mới
                    window.open(src, "_blank");
                } finally {
                    // Trả lại trạng thái chữ ban đầu cho nút bấm
                    download.querySelector("span:not(.moon-icon)").textContent = originalText;
                    download.style.pointerEvents = "auto";
                }
            });
        }

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

        window.refreshLightbox =
            collect;

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

            image.style.transform =
                "scale(1)";

        }

        function preload(index) {

            if (
                index < 0 ||
                index >=
                    gallery.length
            )
                return;

            const img =
                new Image();

            img.src =
                getSrc(
                    gallery[index]
                );

        }

        function preloadNearby() {

            preload(
                current - 1
            );

            preload(
                current + 1
            );

        }

        function updateUI() {

            const item =
                gallery[current];

            if (!item)
                return;

            const img =
                getImg(item);

            const src =
                getSrc(item);

            if (counter) {

                counter.textContent =
                    `${current + 1} / ${gallery.length}`;

            }

            if (caption) {

                caption.textContent =
                    img?.alt || "";

            }

            if (download) {
                // Giữ thuộc tính href mặc định làm phương án dự phòng
                download.href = src;
            }

        }

        function show(index) {

            const item =
                gallery[index];

            if (!item)
                return;

            const src =
                getSrc(item);

            const img =
                getImg(item);

            image.classList.add(
                "loading"
            );

            const loader =
                new Image();

            loader.onload =
                () => {

                    image.src =
                        src;

                    image.alt =
                        img?.alt ||
                        "";

                    current =
                        index;

                    updateUI();

                    preloadNearby();

                    resetZoom();

                    requestAnimationFrame(
                        () => {

                            image.classList.remove(
                                "loading"
                            );

                        }
                    );

                };

            loader.src = src;

        }

        function open(index) {

            collect();

            if (
                !gallery.length
            )
                return;

            lightbox.classList.add(
                "show"
            );

            document.body.classList.add(
                "lightbox-open"
            );

            show(index);

        }

        function close() {

            lightbox.classList.remove(
                "show"
            );

            document.body.classList.remove(
                "lightbox-open"
            );

            resetZoom();

        }

        function next() {

            current++;

            if (
                current >=
                gallery.length
            ) {

                current = 0;

            }

            show(current);

        }

        function prev() {

            current--;

            if (
                current < 0
            ) {

                current =
                    gallery.length -
                    1;

            }

            show(current);

        }

        /* ============================
           OPEN
        ============================ */

        document.addEventListener(
            "click",
            e => {

                const trigger =
                    e.target.closest(
                        ".lightbox-trigger"
                    );

                if (!trigger)
                    return;

                e.preventDefault();

                collect();

                const index =
                    gallery.indexOf(
                        trigger
                    );

                if (
                    index >= 0
                ) {

                    open(index);

                }

            }
        );

        closeBtn?.addEventListener(
            "click",
            close
        );

        nextBtn?.addEventListener(
            "click",
            next
        );

        prevBtn?.addEventListener(
            "click",
            prev
        );

        lightbox.addEventListener(
            "click",
            e => {
                // Sửa logic click vùng tối để tắt: Nếu click trúng vùng ngoài rìa hộp ảnh thì đóng lightbox
                if (e.target === lightbox || e.target.classList.contains("lightbox-stage")) {
                    close();
                }
            }
        );

        /* ============================
           KEYBOARD
        ============================ */

        document.addEventListener(
            "keydown",
            e => {

                if (
                    !lightbox.classList.contains(
                        "show"
)
)
return;
switch (
e.key
) {
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
}
);
/* ============================
TOUCH SWIPE (Bổ sung phần code khuyết hoàn chỉnh)
============================ */
lightbox.addEventListener(
"touchstart",
e => {
touchStart =
e.changedTouches[0]
.screenX;
}
);
lightbox.addEventListener(
"touchend",
e => {
const touchEnd =
e.changedTouches[0]
.screenX;
const distance = touchEnd - touchStart;
// Nếu vuốt ngang màn hình một khoảng lớn hơn 50px thì chuyển ảnh
if (distance > 50) {
prev(); // Vuốt từ trái sang phải: Quay lại ảnh cũ
} else if (distance < -50) {
next(); // Vuốt từ phải sang trái: Xem ảnh tiếp theo
}
}
);
}
);
