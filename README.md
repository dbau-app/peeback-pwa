# Peeback — App Shell (biến web app thành icon riêng ngoài màn hình)

Đây là **6 file nhỏ** giúp app Peeback (đang chạy trên Google Apps Script) có
thể "Thêm vào Màn hình chính" trên điện thoại như 1 app thật — có icon riêng,
mở toàn màn hình (không thấy thanh địa chỉ trình duyệt), tải nhanh hơn.

- `index.html` — trang vỏ (chỉ chứa 1 khung `<iframe>` nhúng thẳng app thật
  của bạn từ Apps Script, kèm màn hình chờ (splash) có logo trong lúc tải).
- `manifest.json` — khai báo tên app, icon, màu sắc để trình duyệt/điện thoại
  hiểu đây là 1 "app" có thể cài đặt.
- `service-worker.js` — cache vỏ app (index.html, icon...) để mở lần sau
  nhanh gần như tức thì; **không** cache dữ liệu thật bên trong app (link,
  ví, đơn hàng luôn tải mới, không lo dữ liệu cũ).
- `icon-192.png`, `icon-512.png`, `icon-512-maskable.png`, `icon-180.png`,
  `favicon.png` — icon app các kích thước khác nhau, cắt từ logo bạn gửi.

Đây là repo GitHub **hoàn toàn tách biệt** với app thật (app thật vẫn chạy
trên Apps Script, quản lý ở project trong Google Sheet như cũ) — repo này chỉ
đóng vai trò "lớp vỏ" giúp có icon ngoài màn hình, không chứa logic hay dữ
liệu gì.

## Cài đặt

1. Trong Apps Script (project Peeback), vào **Deploy → Manage deployments**,
   copy đúng **Web app URL** (dạng `https://script.google.com/macros/s/XXXX/exec`).
2. Mở file `index.html` trong bộ này, tìm dòng:
   ```html
   src="https://script.google.com/macros/s/DÁN_DEPLOYMENT_ID_CỦA_BẠN_VÀO_ĐÂY/exec"
   ```
   thay bằng đúng URL vừa copy.
3. Tạo 1 repository mới trên GitHub (VD: `peeback-app`) → **Add file → Upload
   files** → kéo thả cả 6 file (`index.html`, `manifest.json`,
   `service-worker.js`, và 4 file icon `.png`) → **Commit changes**.
4. Vào **Settings → Pages** của repo → Source: **Deploy from a branch** →
   Branch `main` / `(root)` → Save. Đợi 1-2 phút, GitHub cho ra 1 link dạng
   `https://<username>.github.io/peeback-app/`.
5. (Tuỳ chọn) Gắn tên miền riêng: tạo file `CNAME` chứa domain, trỏ DNS domain
   đó về GitHub Pages — xem hướng dẫn chi tiết Google "GitHub Pages custom domain",
   hoặc nhắn mình nếu muốn mình viết chi tiết phần này.

## Cài app vào điện thoại

- **Android (Chrome):** mở link ở bước 4 → menu 3 chấm góc trên → **"Thêm vào
  Màn hình chính"** / **"Cài đặt ứng dụng"**.
- **iPhone (Safari):** mở link → bấm nút Chia sẻ (hình vuông mũi tên lên) →
  **"Thêm vào Màn hình chính"**.

Sau đó biểu tượng Peeback sẽ nằm ngoài màn hình chính như 1 app thật, mở lên
là vào thẳng app, không còn thanh địa chỉ trình duyệt.

## Lưu ý

- Vì app thật vẫn nằm trên `script.google.com` (nhúng qua iframe), lớp vỏ
  này không cần bạn bảo trì gì thêm — sửa tính năng thì vẫn sửa trong Apps
  Script như bình thường, vỏ app tự động phản ánh đúng nội dung mới nhất.
- Nếu sau này đổi sang deployment Apps Script khác (deployment ID mới), nhớ
  cập nhật lại đúng URL trong `index.html` (bước 2) rồi upload lại file này.
