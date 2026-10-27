# Công cụ phát triển (không đưa lên Hosting)

## Server chạy app có móc kiểm tra — `layout-audit-server.mjs`

```bash
node tools/layout-audit-server.mjs        # → http://127.0.0.1:8767/
```

Phục vụ đúng file `du-toan-xay-nha.html` của dự án (đọc lại mỗi lần tải trang), chèn thêm `window.__X` (các hàm
nội bộ: `HOUSE_TEMPLATES`, `buildPlanFromTemplate`, `planGeometry`, `scoreTemplate`, `planLivability`, …) và
`tools/layout-audit.js`. `POST /__out/<tên file>` ghi file vào `OUT_DIR` (mặc định `<tmp>/xaynhabaonhieu-seo`).

## Chấm mặt bằng nhà mẫu — `layout-audit.js`

Kiểm tra theo skill `thiet-ke-nha` (luật L1–L10: lối vào mọi phòng, phòng ngủ có cửa sổ, giếng trời thông,
WC không trên bếp, kích thước tối thiểu TCVN 13967…). Trong DevTools của trang ở cổng 8767:

```js
auditSummary(auditTemplates(__X))                                   // mọi mẫu × LOT_PRESETS, gom lỗi theo loại
auditTemplates(__X, {only:['tube3'], lots:[[5,20]], withWarn:true}) // chi tiết 1 mẫu
auditDump(__X, 'tube3', 5, 20)                                      // toạ độ từng phòng
```

Trên bản live: mở 1 nhà mẫu (hộp thoại "Mặt bằng sơ bộ từng tầng") rồi dán cả file `layout-audit.js` vào
DevTools — script đọc SVG trong hộp thoại và trả về `{fail, warn}`.

App cũng tự chấm: `planLivability(geo)` trong `du-toan-xay-nha.html`; `scoreTemplate` loại mẫu có lỗi cứng
trên lô đó ("Trên lô này chưa bố trí được nhà ở được: …").

## Sinh trang tĩnh SEO `/xay-nha/…`

Trang tĩnh được tạo từ **chính logic tính của app** (nhà mẫu, đơn giá, mặt bằng), nên con số khớp với app.
Chạy lại mỗi khi đổi nhà mẫu, engine xếp phòng, đơn giá (`FINISH_LEVELS`) hoặc danh sách lô (`LOT_PRESETS`).

1. `node tools/layout-audit-server.mjs`, mở `http://127.0.0.1:8767/`.
2. Trong DevTools: `window.__SEO_OUT = '/__out/'`, rồi dán `tools/seo_export.js` → server ghi
   `seo-data.json`, `seo-css.css` vào `OUT_DIR`.
3. Sinh trang + `sitemap.xml` (bản Node, không cần Python; `build_seo_pages.py` là bản cũ, cùng đầu ra):
   ```bash
   node tools/build_seo_pages.mjs "$TEMP/xaynhabaonhieu-seo/seo-data.json" "$TEMP/xaynhabaonhieu-seo/seo-css.css"
   ```
4. Deploy: `firebase deploy --only hosting` (thư mục `tools/` không được đưa lên Hosting).

Mỗi lô: 12 mẫu điểm cao nhất + mọi mẫu "2 tầng 1 tum" có trang riêng; mẫu còn lại vẫn hiện ở trang lô và mở thẳng app.
Chỉ mẫu "Phù hợp" (đã qua kiểm tra ở được) mới có mặt trên trang SEO.
