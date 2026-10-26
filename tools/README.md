# Sinh trang tĩnh SEO `/xay-nha/…`

Trang tĩnh được tạo từ **chính logic tính của app** (nhà mẫu, đơn giá, mặt bằng), nên con số khớp với app.
Chạy lại mỗi khi đổi nhà mẫu, đơn giá (`FINISH_LEVELS`) hoặc danh sách lô (`LOT_PRESETS`).

1. Tạo thư mục tạm (ngoài dự án), chép `du-toan-xay-nha.html` vào đó thành `app.html`, rồi chèn ngay trước
   đoạn `if(document.readyState === 'loading'){` ở cuối file:
   ```js
   window.__X = {HOUSE_TEMPLATES:HOUSE_TEMPLATES, LOT_PRESETS:LOT_PRESETS, FINISH_LEVELS:FINISH_LEVELS, buildPlanFromTemplate:buildPlanFromTemplate, scoreTemplate:scoreTemplate,
     computePlanStats:computePlanStats, planGeometry:planGeometry, houseElevationSvg:houseElevationSvg, renderVizSvg:renderVizSvg, CATEGORIES:CATEGORIES, categoryShort:categoryShort, geoRoomType:geoRoomType, maxDensity:maxDensity};
   ```
2. Trong thư mục tạm, chạy một server tĩnh nhận POST ghi file ở cổng 8766 (VD server.py đơn giản dựa trên `http.server`).
3. Mở `http://127.0.0.1:8766/app.html`, dán `tools/seo_export.js` vào DevTools → được `seo-data.json`, `seo-css.css`.
4. Sinh trang + `sitemap.xml`:
   ```bash
   python3 -I tools/build_seo_pages.py /đường/dẫn/seo-data.json /đường/dẫn/seo-css.css
   ```
5. Deploy: `firebase deploy --only hosting` (thư mục `tools/` không được đưa lên Hosting).

Mỗi lô: 12 mẫu điểm cao nhất + mọi mẫu "2 tầng 1 tum" có trang riêng; mẫu còn lại vẫn hiện ở trang lô và mở thẳng app.
