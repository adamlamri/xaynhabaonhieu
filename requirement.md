# Requirement: Xây Nhà Bao Nhiêu — công cụ dự tính chi phí xây nhà (HTML)

## 1. Mục tiêu

Xây dựng một file HTML độc lập (single-file, chạy offline trên trình duyệt, không cần server/build tool) giúp người dùng lập và quản lý nhiều phương án dự toán chi phí xây nhà. Toàn bộ thông số về ngôi nhà, vật liệu, sản phẩm đều có thể tùy chỉnh (giá, hãng, kích thước, số lượng...) và cho phép để trống (null) khi chưa có thông tin.

Ngôn ngữ giao diện: **Tiếng Việt**.

## 2. Cấu trúc trang (site map)

Dạng: 1 trang tổng quan + các trang chi tiết theo hạng mục (điều hướng bằng menu/tab, tất cả nằm trong 1 file HTML, chuyển trang bằng JS không load lại trang).

1. **Trang Danh sách Plan** — trang vào đầu tiên
   - Danh sách các phương án dự toán (plan) đã tạo: tên plan, ngày tạo/sửa, tổng chi phí hiện tại
   - Chức năng: Tạo plan mới, Nhân bản plan, Đổi tên, Xóa, Mở plan để làm việc
2. **Trang Thông tin chung ngôi nhà** (thuộc từng plan)
   - Diện tích đất, số tầng, loại nhà... — dùng làm dữ liệu nền cho các công thức tính theo diện tích/định mức %
   - **Danh sách tầng**: khai báo từng tầng (VD: Trệt, Lầu 1, Lầu 2, Sân thượng), mỗi tầng có diện tích xây dựng riêng. Mỗi tầng cũng có ô **"Kích thước"** dạng text theo Dài×Rộng (VD: `7x19`, `5.5x8`) — Diện tích xây dựng sẽ tự động tính = Dài × Rộng, giống cách làm ở phòng/khu vực; vẫn có thể tự nhập tay ô Diện tích nếu tầng không phải hình chữ nhật
   - **Danh sách phòng/khu vực**: khai báo từng phòng/khu vực, gồm tên, diện tích, thuộc tầng nào. Có sẵn mẫu gợi ý (vẫn thêm/sửa/xóa tự do):
     - Phòng ngủ (ba mẹ, con trai, con gái, phòng khách...)
     - Phòng chức năng (bếp, WC, phòng thờ, phòng làm việc)
     - Khu vực chung trong nhà (hành lang, cầu thang, ban công)
     - Khu vực ngoài trời (sân, cổng, sân thượng, gara)
   - **Hiển thị nhóm theo tầng**: phòng/khu vực được hiển thị thành từng nhóm theo tầng (VD: nhóm "Trệt", nhóm "Lầu 1"...) và 1 nhóm riêng "Chưa gán tầng / Toàn nhà" cho các phòng/khu vực không thuộc tầng cụ thể — giúp dễ nhìn hơn so với danh sách phẳng
   - **Sắp xếp thứ tự hiển thị**: dùng nút ▲▼ để đổi thứ tự các tầng, và đổi thứ tự các phòng/khu vực trong từng nhóm (tầng hoặc "Chưa gán tầng / Toàn nhà")
   - **Kích thước tự tính diện tích**: mỗi phòng/khu vực có thêm ô "Kích thước" dạng text, nhập theo Dài×Rộng (VD: `5x5`, `5.5x2`, hỗ trợ cả dấu chấm và dấu phẩy thập phân) — Diện tích sẽ tự động tính = Dài × Rộng (VD: `5.5x2` → 11 m²). Nếu định dạng không hợp lệ, hoặc phòng không phải hình chữ nhật, vẫn có thể tự nhập tay ô Diện tích như bình thường
   - **Xem + sửa vật liệu/thiết bị đã gán + tổng chi phí theo phòng/tầng/khu vực**: mỗi dòng tầng và mỗi dòng phòng/khu vực hiển thị "Tổng chi phí" (tổng tầng gồm cả các phòng bên trong). Nút "▼ Chi tiết" mở ra dropdown liệt kê từng vật liệu/thiết bị đã gán vào đó — bấm lại để ẩn. Nút "▼ Mở tất cả / ▲ Đóng tất cả" ở đầu mục cho phép mở/đóng toàn bộ dropdown cùng lúc
     - Trong dropdown này có thể **sửa trực tiếp** (rút gọn chỉ còn: Hạng mục, Tên, Cách tính, Đơn giá, SL/Diện tích/%, Thành tiền — hiển thị đầy đủ các trường còn lại vẫn ở trang hạng mục tương ứng), **xóa dòng**, và **thêm dòng mới** qua các nút "+ <Hạng mục>" (chọn sẵn hạng mục và tự gán đúng tầng/phòng đang xem)
   - Toàn bộ trường có thể để trống

## 5.1. Sửa Hạng mục sau khi tạo

Cột/ô "Hạng mục" trên mỗi dòng vật liệu (cả ở trang hạng mục lẫn trong dropdown chi tiết phòng/tầng) là 1 dropdown **luôn có thể đổi được**, không bị khóa cố định theo nơi tạo ra dòng đó. Khi đổi hạng mục, dòng vật liệu sẽ tự động chuyển sang hiển thị ở trang hạng mục mới — hữu ích khi bấm nhầm hạng mục lúc thêm mới, không cần xóa và tạo lại.

## 5.2. Kích thước hiển thị & màu sắc

- Bảng/nút trong dropdown chi tiết phòng/tầng dùng **cùng kích thước** (cỡ chữ, khoảng đệm) với bảng ở trang hạng mục — không thu nhỏ lại, đảm bảo dễ đọc/dễ bấm như phần còn lại của công cụ.
- Có hệ thống màu nhận diện nhất quán, dùng làm điểm nhấn (viền, dấu chấm tròn, thanh biểu đồ) — không tô nền cả khối để tránh rối mắt:
  - **Hạng mục**: mỗi hạng mục (Kết cấu & xây thô, Hoàn thiện & nội thất, MEP, Ngoại thất & khác) có 1 màu cố định, thể hiện qua viền trái ô "Hạng mục", màu tab khi đang mở trang đó, viền trái tiêu đề trang, và màu thanh biểu đồ ở Tổng quan (khi xem theo hạng mục)
  - **Tầng**: mỗi tầng có 1 màu riêng (tự chọn theo mã tầng, giữ nguyên dù đổi thứ tự), thể hiện qua dấu chấm tròn trước tên tầng, viền trái + nền nhạt của khối "Phòng/khu vực theo tầng", và màu thanh biểu đồ ở Tổng quan (khi xem theo phòng/khu vực, mục "Toàn tầng")
  - **Phòng/khu vực**: mỗi phòng có 1 màu riêng, thể hiện qua dấu chấm tròn trước tên phòng và màu thanh biểu đồ tương ứng ở Tổng quan
3. **Trang Tổng quan chi phí** (thuộc từng plan)
   - Tổng chi phí toàn bộ + biểu đồ/breakdown theo từng nhóm hạng mục
4. **Các trang chi tiết theo nhóm hạng mục** (thuộc từng plan), mỗi trang là 1 bảng nhập vật liệu/sản phẩm:
   - Kết cấu & xây thô (móng, khung, cột, dầm, tường, mái, cầu thang...)
   - Hoàn thiện & nội thất (sơn, trần, sàn, cửa, bếp, thiết bị vệ sinh, đèn, đồ gỗ...)
   - Hệ thống MEP – Điện, Nước, Điều hòa (dây điện, ổ cắm, tủ điện, ống nước, điều hòa, PCCC, chống sét...)
   - Ngoại thất & chi phí khác (sân vườn, hàng rào, thiết kế, giấy phép, nhân công, dự phòng phát sinh...)

## 3. Quản lý Plan (phương án dự toán)

- Người dùng có thể tạo **nhiều plan** độc lập (ví dụ: "Phương án tiết kiệm", "Phương án cao cấp"...)
- Mỗi plan lưu riêng: thông tin chung ngôi nhà + toàn bộ dữ liệu vật liệu của tất cả hạng mục
- Thao tác trên trang danh sách plan: Tạo mới, Nhân bản, Đổi tên, Xóa, Mở

## 4. Phòng/Khu vực & cấp áp dụng chi phí

"Phòng/Khu vực" và "Hạng mục" là hai chiều khác nhau, không ép vào 1 cây phân cấp duy nhất mà **gắn thẻ (tag) vào từng dòng vật liệu**:

- Mỗi dòng vật liệu có 1 trường **"Cấp áp dụng"**, chọn 1 trong 3 mức:
  1. **Toàn nhà** — áp dụng chung cho cả căn nhà (VD: móng, hệ thống nước chính)
  2. **Theo tầng** — chọn 1 tầng cụ thể trong Danh sách tầng (VD: khung/tường/mái tầng Trệt, tầng Lầu 1...)
  3. **Theo phòng** — chọn 1 phòng cụ thể trong Danh sách phòng (VD: sơn phòng ngủ ba mẹ, gạch lát bếp, giường phòng con gái...)
- Mặc định gợi ý theo hạng mục (người dùng vẫn đổi được tự do cho từng dòng):
  - Kết cấu & xây thô (móng, khung, mái...) → mặc định "Toàn nhà" hoặc "Theo tầng"
  - Hoàn thiện & nội thất (sơn, sàn, cửa, đồ nội thất...) → mặc định "Theo phòng"
  - Hệ thống MEP → mặc định "Toàn nhà" hoặc "Theo tầng" (đường ống/dây chính), nhưng từng thiết bị lẻ (ổ cắm, đèn) có thể chọn "Theo phòng"
  - Ngoại thất & chi phí khác → mặc định "Theo phòng" (dùng các khu vực ngoài trời như sân, cổng) hoặc "Toàn nhà" (thiết kế, giấy phép, dự phòng)
- Trang Tổng quan chi phí hỗ trợ xem/nhóm tổng chi phí theo **2 trục độc lập**: theo Hạng mục, hoặc theo Phòng/Khu vực.

## 5. Cấu trúc dữ liệu một dòng vật liệu/sản phẩm

Mỗi dòng trong bảng hạng mục gồm các trường sau (tất cả đều **cho phép để trống/null**, có thể chỉnh sửa tự do):

| Trường | Mô tả |
|---|---|
| Tên vật liệu/sản phẩm | Tên gọi |
| Hãng/Thương hiệu | Có thể null nếu chưa chọn |
| Quy cách/Kích thước | VD: 60x60cm, D20, 1m2/thùng... |
| Đơn giá | VNĐ, có thể null |
| Số lượng | Nhập tay hoặc tự tính (xem mục 6) |
| Cấp áp dụng | Toàn nhà / Theo tầng / Theo phòng (xem mục 4) |
| Tầng/Phòng cụ thể | Chọn từ Danh sách tầng hoặc Danh sách phòng, tùy Cấp áp dụng; để trống nếu Cấp áp dụng = Toàn nhà |
| Nhà cung cấp | Tên cửa hàng/nhà cung cấp, có thể null |
| Link tham khảo | URL sản phẩm, có thể null |
| Ghi chú | Text tự do |
| Trạng thái | Đã chốt / Đang cân nhắc / (để trống) — ảnh hưởng trực tiếp tới Tổng chi phí, xem ghi chú bên dưới |
| Thành tiền | Tự động = Đơn giá × Số lượng (0 hoặc bỏ trống nếu thiếu dữ liệu) |

Người dùng có thể thêm/xóa dòng tùy ý trong mỗi bảng hạng mục.

**Trạng thái quyết định có tính vào Tổng chi phí hay không**: dòng nào đang chọn "Đang cân nhắc" sẽ KHÔNG được cộng vào Tổng chi phí (ở trang hạng mục, Tổng quan, và tổng theo tầng/phòng) — vẫn hiển thị đầy đủ trong bảng kèm ghi chú "(không tính)" ở cột Thành tiền, để dễ so sánh phương án trước khi chốt mua. Dòng "Đã chốt" hoặc để trống đều được tính bình thường như nhau. Khi thêm dòng mới (bằng bất kỳ cách nào: "+ Thêm dòng", "+ Từ thư viện", hay các nút thêm nhanh trong "▼ Chi tiết"), Trạng thái mặc định là "Đã chốt" — chỉ khi người dùng tự tay đổi sang "Đang cân nhắc" thì dòng đó mới bị loại khỏi tổng.

## 6. Công thức tính chi phí

Cho phép **chọn linh hoạt theo từng dòng**, hỗ trợ các cách tính sau:

1. **Đơn giá × Số lượng (nhập tay)** — mặc định, đơn giản nhất
2. **Đơn giá × Diện tích/Kích thước** — tự động lấy số liệu từ diện tích tầng/phòng đã khai báo ở trang Thông tin chung ngôi nhà (VD: m² phòng ngủ × đơn giá gạch)
3. **Định mức theo % / m² xây dựng** — ước tính nhanh dựa trên đơn giá xây dựng trọn gói theo m² và tỷ lệ % phân bổ cho từng hạng mục

Mỗi dòng có thể chọn 1 trong 3 cách tính trên; nếu thiếu dữ liệu đầu vào (đơn giá hoặc số lượng), thành tiền coi như chưa xác định (không tính vào tổng hoặc hiển thị 0/--).

## 6.1. Phương pháp tính chi phí (Trọn gói nhà thầu / Tự dự tính)

Ở trang Thông tin chung ngôi nhà, mỗi plan chọn 1 trong **3 phương pháp tính tổng chi phí**:

1. **Tự dự tính chi phí** (mặc định) — tính chi tiết từng dòng vật liệu ở cả 4 nhóm hạng mục, như mục 5/6 ở trên.
2. **Trọn gói phần thô** — dùng khi thuê nhà thầu làm trọn gói riêng nhóm **Kết cấu & xây thô** theo 1 đơn giá/m² do nhà thầu báo. Người dùng tự nhập **Diện tích tính phí trọn gói (m²)** và **Đơn giá trọn gói (đ/m²)**; công cụ tự tính "Chi phí trọn gói" = Diện tích × Đơn giá và cộng vào Tổng chi phí thay cho tổng các dòng vật liệu trong nhóm Kết cấu & xây thô. 3 nhóm còn lại (Hoàn thiện & nội thất, MEP, Ngoại thất & chi phí khác) vẫn tính chi tiết theo từng dòng như bình thường.
3. **Trọn gói thô + hoàn thiện** — tương tự phương pháp 2, nhưng gói trọn gói của nhà thầu gồm cả 2 nhóm **Kết cấu & xây thô** và **Hoàn thiện & nội thất**. Chỉ còn nhóm MEP và Ngoại thất & chi phí khác tính chi tiết riêng (vì thường điều hòa, thiết bị điện máy, nội thất rời, sân vườn... không nằm trong gói xây dựng trọn gói của nhà thầu).

Ghi chú thiết kế:
- Diện tích và đơn giá trọn gói do người dùng tự nhập theo báo giá thực tế đã thống nhất với nhà thầu; công cụ chỉ hiển thị **giá tham khảo thị trường 2026** để đối chiếu (phần thô: ~3.200.000–4.300.000 đ/m²; trọn gói thô + hoàn thiện: ~4.400.000–6.500.000 đ/m² tùy cấp độ vật tư hoàn thiện).
- Khi 1 nhóm hạng mục đang được tính theo gói trọn gói, trang chi tiết của nhóm đó vẫn hiển thị đầy đủ các dòng vật liệu đã nhập (không xóa dữ liệu) nhưng có **banner cảnh báo** và ghi rõ "(không cộng vào tổng)" ở dòng Tổng cộng — các dòng này chỉ mang tính tham khảo/so sánh với đơn giá nhà thầu.
- Trang Tổng quan chi phí hiển thị thêm 1 dòng riêng cho "Chi phí trọn gói..." trong breakdown theo hạng mục; các nhóm đã gộp vào gói hiển thị 0đ kèm chú thích "(đã gồm trong gói trọn gói)".
- Đổi qua đổi lại giữa 3 phương pháp **không làm mất dữ liệu** — số liệu diện tích/đơn giá của từng phương pháp gói được lưu riêng, vẫn còn nguyên khi chọn lại phương pháp đó sau này.
- Vì mỗi **plan** có 1 phương pháp riêng, người dùng có thể tạo nhiều plan (VD: "Tự làm", "Thuê trọn gói") để so sánh tổng chi phí giữa các phương án.

### 6.1.2. Diện tích tính phí trọn gói — tự động hoàn toàn, không nhập tay

**"Diện tích tính phí trọn gói (m²)" LUÔN được tự động tính** = tổng của 4 thành phần dưới đây, không có ô nhập tay và không có nút "Áp dụng" — nghĩa là chỉ cần đổi diện tích tầng/phòng hoặc đổi lựa chọn hệ số, số liệu và Tổng chi phí sẽ tự cập nhật ngay, không thể bị lệch do quên bấm cập nhật:

- **Diện tích sàn các tầng**: tự cộng 100% diện tích tất cả các tầng trong Danh sách tầng.
- **Diện tích móng**: chọn "Loại móng" (Móng đơn 30% / Móng cọc 45% / Móng băng 50% / Móng bè 90%) — hệ số nhân lên diện tích tầng đầu tiên theo thứ tự hiển thị (coi là tầng trệt).
- **Diện tích sân**: tự lấy diện tích phòng tên chính xác **"Sân"** (nếu có khai báo), nhân hệ số theo "Loại sân" (Có mái che 100% / Không mái che có lát gạch+đổ móng 50% / Không tính 0%).
- **Diện tích sân thượng**: tự lấy diện tích phòng tên chính xác **"Sân thượng"** (nếu có khai báo), nhân hệ số theo "Loại sân thượng" (Có mái che 100% / Không mái che 60% / Không tính 0%).

Cả 4 phần trên hiển thị thành **bảng chi tiết riêng từng dòng** (Diện tích sàn các tầng / Móng / Sân / Sân thượng), mỗi dòng gồm cả **diện tích quy đổi** và **chi phí** (= diện tích × Đơn giá trọn gói đã nhập) — rồi mới đến dòng **Tổng** (= đúng bằng Diện tích/Chi phí trọn gói hiển thị ở trên) ở cuối bảng, thay vì chỉ hiện 1 con số gộp.

Ghi chú:
- Loại móng/sân/sân thượng là thuộc tính của **plan** (không đổi theo phương pháp tính chi phí đang chọn) — đổi qua lại giữa 3 phương pháp vẫn giữ nguyên lựa chọn này.
- Nếu chưa đặt tên phòng đúng "Sân" hoặc "Sân thượng", hoặc phòng đó chưa có diện tích, hoặc chưa chọn loại móng, dòng tương ứng vẫn hiển thị nhưng ghi chú rõ lý do và tính = 0m² thay vì báo lỗi. Nếu chưa nhập "Đơn giá trọn gói", cột Chi phí hiển thị "—" kèm nhắc nhở.
- Hệ số dùng trong bộ tính lấy từ mục 11.4 (Phụ lục) bên dưới.

### 6.1.1. Cờ "Tính riêng" (nội thất rời / thiết bị rời)

Theo thực tế thị trường xây dựng: gói "phần thô" chỉ gồm móng, khung, tường, mái, cầu thang (kết cấu) và hệ thống điện nước âm tường (ống chờ); gói "trọn gói thô + hoàn thiện" thêm phần ốp lát, sơn, cửa, trần — nhưng **cả 2 loại gói đều KHÔNG bao gồm nội thất rời và thiết bị rời** (tủ bếp, tủ quần áo, bàn thờ, bàn ghế, giàn phơi đồ, điều hòa, bình nóng lạnh...). Chủ nhà luôn phải tự mua/tính riêng các hạng mục này dù đã thuê trọn gói.

Vì vậy, mỗi dòng vật liệu ở nhóm **Kết cấu & xây thô** và **Hoàn thiện & nội thất** có thêm ô tick **"Tính riêng"**:
- Dòng nào tick "Tính riêng" sẽ **luôn được cộng vào Tổng chi phí**, kể cả khi hạng mục đó đang bị gộp vào gói trọn gói (dùng cho nội thất rời/thiết bị rời).
- Dòng nào KHÔNG tick sẽ bị loại khỏi tổng khi hạng mục đó đang dùng phương pháp trọn gói (vì coi như đã nằm trong đơn giá/m² nhà thầu báo).
- Nhóm MEP và Ngoại thất & chi phí khác không cần cờ này vì 2 nhóm đó luôn được tính riêng ở cả 3 phương pháp.
- Trang hạng mục hiển thị dòng "Tổng cộng (đã trừ phần trong gói)" và thêm 1 dòng tham khảo "Tổng nếu tính đủ cả phần đã gồm trong gói" để dễ đối chiếu.
- Trong dữ liệu mẫu, các hạng mục đã đánh dấu "Tính riêng" gồm: Tủ bếp trên dưới, Tủ quần áo (từng phòng ngủ), Bàn thờ, Bàn làm việc + tủ tích hợp, Giàn phơi đồ.

## 7. Định dạng hiển thị tiền tệ

- Đơn vị: VNĐ
- Phân cách hàng nghìn bằng dấu chấm: `1.000.000 đ`

## 8. Lưu trữ dữ liệu — tự động lưu vào file JSON trên máy

- Người dùng **kết nối 1 lần mỗi phiên làm việc** với 1 file JSON trên máy, bằng 1 trong 2 cách:
  - **"🆕 Tạo file mới"**: chọn nơi lưu, tạo 1 file JSON mới (trống hoặc theo dữ liệu hiện có)
  - **"📂 Mở file đã lưu"**: chọn file JSON đã lưu từ lần làm việc trước để khôi phục toàn bộ dữ liệu (mọi plan, thông tin nhà, tầng, phòng, vật liệu) và tiếp tục làm việc
- Sau khi kết nối, **mọi thay đổi** (sửa ô, thêm/xóa dòng, thêm/xóa tầng/phòng, tạo/xóa plan...) sẽ **tự động ghi vào file JSON đó** (có độ trễ ngắn ~0.5s sau thay đổi cuối), không cần thao tác lưu thủ công, không có nút "Xuất/Nhập"
- Thanh trạng thái ở đầu trang hiển thị: tên file đang kết nối + thời điểm lưu gần nhất, hoặc cảnh báo nếu chưa kết nối / lưu lỗi
- **Ghi nhớ file đã kết nối**: công cụ ghi nhớ file đã chọn (qua IndexedDB của trình duyệt). Lần mở lại sau, công cụ tự động thử kết nối lại file đó — nếu trình duyệt còn nhớ quyền truy cập thì kết nối lại hoàn toàn tự động (0 thao tác). Nếu trình duyệt cần xác nhận lại quyền (thường sau khi khởi động lại trình duyệt), công cụ **không bắt người dùng phải tìm và bấm riêng 1 nút xác nhận** — chỉ cần thao tác/bấm bất kỳ đâu trong công cụ như bình thường (VD: mở phương án, đổi tab...), thao tác đó sẽ tự kích hoạt xin lại quyền và kết nối lại file trong nền. Nút "▶ Tiếp tục" vẫn hiển thị như 1 lựa chọn tường minh nếu muốn bấm ngay, nhưng không bắt buộc.
- **Giới hạn kỹ thuật của trình duyệt**: do quy định bảo mật, trình duyệt không cho phép trang web tự ý ghi vào file trên máy mà không có xác nhận của người dùng ít nhất 1 lần — đây là giới hạn chung của mọi trình duyệt, không thể "hardcode" đường dẫn để bỏ qua hoàn toàn bước xác nhận này, cũng không thể tự động mở hộp thoại chọn file khi vừa mở trang (bắt buộc phải có 1 cú bấm của người dùng)
- **Lưới an toàn chống mất dữ liệu khi CHƯA kết nối file**: để không bao giờ mất dữ liệu chỉ vì chưa/quên bấm "Tạo file mới"/"Mở file đã lưu", công cụ **luôn tự động lưu tạm vào bộ nhớ trình duyệt (localStorage)** mỗi khi có thay đổi — kể cả trên trình duyệt có hỗ trợ File System Access API nhưng người dùng chưa kết nối file thật. Khi mở lại trang mà chưa có file nào được kết nối/khôi phục, công cụ tự nạp lại bản lưu tạm này thay vì mất trắng. Thanh trạng thái khi chưa kết nối file sẽ hiển thị rõ đang lưu tạm + thời điểm lưu gần nhất, thay vì cảnh báo mất dữ liệu.
- Tính năng lưu trực tiếp ra file yêu cầu trình duyệt hỗ trợ **File System Access API** (Chrome, Edge, Opera bản mới). Với trình duyệt không hỗ trợ hoặc chặn API này (Brave chặn theo mặc định dù dùng lõi Chromium; Firefox, Safari không hỗ trợ), công cụ luôn dùng lưới an toàn localStorage nói trên làm nơi lưu chính (vẫn tự động lưu mỗi thay đổi, mở lại cùng trình duyệt/máy vẫn còn dữ liệu)
- Với các trình duyệt này, thanh trạng thái hiện thêm 2 nút dự phòng: **"⬇ Xuất JSON"** (tải dữ liệu hiện tại ra 1 file JSON để backup/chia sẻ) và **"📂 Nhập JSON"** (chọn 1 file JSON để nạp vào, thay thế toàn bộ dữ liệu hiện tại) — dùng cách xuất/nhập file thủ công thay cho việc tự động ghi trực tiếp vào file

### 8.1. Dữ liệu mặc định (nhúng sẵn trong file HTML)

- File HTML có sẵn 1 bộ dữ liệu mẫu (plan "7x23 2 tầng 1 tum") nhúng trực tiếp trong mã nguồn, để mỗi lần mở trang lên **không cần phải Nhập JSON thủ công** như trước.
- Thứ tự ưu tiên nạp dữ liệu khi mở trang: (1) file đã kết nối trước đó qua File System Access API (nếu quyền còn hợp lệ) → (2) dữ liệu đã lưu trong bộ nhớ trình duyệt (localStorage — áp dụng cho MỌI trình duyệt, không chỉ trình duyệt không hỗ trợ File System Access API, vì đây cũng là lưới an toàn khi chưa kịp kết nối file) → (3) nếu cả 2 nguồn trên đều không có, mới nạp bộ dữ liệu mặc định nhúng sẵn.
- Dữ liệu mặc định **không bao giờ ghi đè** lên dữ liệu người dùng đang có — chỉ được dùng làm dữ liệu khởi đầu khi thực sự chưa có gì.
- Các nút **"📂 Mở file đã lưu"** (trình duyệt hỗ trợ File System Access API) và **"📂 Nhập JSON"** (trình duyệt không hỗ trợ) vẫn giữ nguyên, cho phép nạp 1 file JSON khác bất cứ lúc nào để thay thế dữ liệu mặc định hoặc dữ liệu hiện tại.

## 9. Yêu cầu kỹ thuật

- Toàn bộ HTML/CSS/JS gói trong **1 file .html duy nhất**, không cần cài đặt, không cần internet để chạy (trừ chức năng xuất/nhập JSON dùng API trình duyệt)
- Giao diện responsive: dễ dùng trên desktop; trên điện thoại (≤ 760px) thanh đầu trang gọn 1 hàng và bảng vật liệu (chế độ Cơ bản) chuyển thành dạng thẻ, không phải kéo ngang
- Không dùng localStorage bắt buộc (dữ liệu chính lưu qua file JSON theo yêu cầu người dùng); localStorage chỉ là lưới an toàn (mục 8), nơi lưu tùy chọn giao diện và các bản sao lưu tự động (mục 13.6)

## 10. Ngoài phạm vi (chưa yêu cầu ở phiên bản này)

- Đăng nhập/nhiều người dùng
- (Đã làm ở bản 2026-10-24, xem mục 13: in/xuất PDF báo cáo, so sánh nhiều plan song song)

## 11. Phụ lục: Ghi chú thị trường xây dựng nhà phố Việt Nam (tham khảo, cập nhật 2026)

Phần này tổng hợp lại kết quả tra cứu thực tế dùng làm căn cứ cho mục 6.1 (Phương pháp tính chi phí) và mục 6.1.1 (cờ "Tính riêng"), để tham khảo lại khi cần mà không phải tra cứu lại từ đầu. Số liệu chỉ mang tính tham khảo, giá thực tế phụ thuộc nhà thầu, khu vực, thời điểm thi công.

### 11.1. Gói "Trọn gói phần thô" — gồm những gì

- **Kết cấu chịu lực**: móng (và bể ngầm nếu có), cột, dầm, sàn bê tông cốt thép
- **Hình khối công trình**: xây tường (gạch tuynel/gạch block) + trát vữa xi măng làm phẳng bề mặt tường, cầu thang (phần bê tông kết nối các tầng), mái bê tông (hoặc phần khung mái ngói)
- **Hệ thống kỹ thuật ở dạng thô**: điện nước đi **âm tường** — lắp ống nước, dây điện ẩn trong tường/sàn, để sẵn đầu chờ cho giai đoạn hoàn thiện sau này (KHÔNG gồm thiết bị đầu cuối như bóng đèn, công tắc, thiết bị vệ sinh)
- **Chống thấm** ở mức cơ bản

Gói phần thô **KHÔNG gồm**: sơn, ốp lát, trần, cửa, thiết bị điện/nước, nội thất — toàn bộ phần hoàn thiện được tính ở giai đoạn riêng, đơn giá khác.

Đơn giá tham khảo 2026: dao động **~3.200.000 – 4.300.000 đ/m²** xây dựng tùy khu vực (TP.HCM/Hà Nội) và độ phức tạp thiết kế.

### 11.2. Gói "Trọn gói thô + hoàn thiện" — gồm thêm những gì

Gồm toàn bộ phần thô ở mục 11.1, cộng thêm phần hoàn thiện mức tiêu chuẩn:
- Lát gạch nền, ốp tường, sơn bả toàn bộ nhà
- Chống thấm các khu vực trọng điểm: toilet, sàn mái, ban công
- Cửa ngoại thất + nội thất mức tiêu chuẩn
- Thiết bị điện và vệ sinh **mức tiêu chuẩn/phổ thông** (công tắc, ổ cắm, đèn cơ bản, thiết bị vệ sinh cơ bản)
- Hoàn thiện cầu thang (lan can, mặt bậc), trần thạch cao và các chi tiết nhỏ khác

Đơn giá tham khảo 2026 theo cấp độ vật tư hoàn thiện:

| Cấp độ vật tư hoàn thiện | Đơn giá tham khảo (đ/m²) |
|---|---|
| Phổ thông nhất | ~4.400.000 |
| Thông dụng | ~4.800.000 |
| Khá | ~5.200.000 |
| Tốt | ~5.600.000 |
| Cao cấp | ~6.500.000 |

(Một số nhà thầu báo trọn gói cao hơn, ~6.200.000 – 6.900.000 đ/m², tùy cam kết "giá minh bạch không phát sinh".)

### 11.3. KHÔNG bao gồm trong bất kỳ gói trọn gói nào (chủ nhà luôn tự lo/tự mua riêng)

Đây là phần quan trọng nhất khi dùng công cụ: dù chọn "Trọn gói phần thô" hay "Trọn gói thô + hoàn thiện", các hạng mục sau **KHÔNG nằm trong đơn giá/m² nhà thầu báo** — vẫn phải tính riêng, không xóa khỏi dự toán:

- Điều hòa (máy lạnh)
- Bình nước nóng, bồn tắm
- Tủ bếp / tủ treo tường bếp
- Nội thất rời: giường, tủ quần áo, bàn ghế, sofa, kệ tivi, bàn thờ, bàn làm việc, giàn phơi đồ...
- Đồ trang trí, đèn trang trí cao cấp, thiết bị điện tử
- Sân vườn, cổng, hàng rào, ngoại thất rời
- Chi phí thiết kế, xin phép xây dựng, nhân công dự phòng phát sinh (thuộc nhóm Ngoại thất & chi phí khác)

→ Đây là lý do công cụ có cờ **"Tính riêng"** (mục 6.1.1): những dòng thuộc danh sách trên nên được tick "Tính riêng" để không bị loại khỏi tổng khi chọn phương pháp trọn gói.

### 11.4. Hệ số quy đổi diện tích xây dựng (dùng khi tự ước tính "Diện tích tính phí trọn gói")

Diện tích xây dựng = Tổng diện tích sàn sử dụng các tầng (hệ số 100%) + các phần diện tích khác nhân hệ số quy đổi:

| Hạng mục | Hệ số |
|---|---|
| Mái bê tông | 50% |
| Mái ngói | 70% |
| Mái tôn | 15–30% |
| Mái sân thượng (không có kết cấu phía trên) | 30% |
| Sân thượng < 15m² | 100% |
| Sân thượng 15–30m², có xây tường rào/đổ cột/sê nô trang trí | 70% |
| Sân thượng không trang trí | 50% |
| Móng đơn (móng độc lập) | 20–35% diện tích tầng trệt |
| Móng băng 1 phương | 40–50% diện tích tầng trệt |
| Móng băng 2 phương | 50–75% diện tích tầng trệt |
| Móng cọc (đài móng trên cọc khoan nhồi) | 40–50% diện tích tầng trệt (chưa gồm chi phí ép/khoan cọc) |
| Móng bè | 100% diện tích tầng trệt |
| Tầng hầm sâu ≤ 1.3m | 150% diện tích tầng trệt |
| Tầng hầm sâu ≤ 1.7m | 170% diện tích tầng trệt |
| Tầng hầm sâu ≤ 2m | 200% diện tích tầng trệt |
| Tầng hầm sâu > 2m | 250% diện tích tầng trệt |

Lưu ý: mỗi nhà thầu có thể áp hệ số khác nhau — nên đối chiếu lại với báo giá thực tế trước khi chốt số liệu vào công cụ.

### 11.5. Nguồn tham khảo

- [Đơn giá xây dựng nhà phố phần thô và trọn gói năm 2026](https://xaynhasaigon.vn/du-an-hoan-thanh/don-gia-xay-dung-nha-tho-va-tron-goi/)
- [Giá xây dựng phần thô năm 2026 — Kiến trúc Mai Việt](https://maiviet.vn/dich-vu/gia-xay-dung-phan-tho.html)
- [Xây nhà phần thô là gì? Bao gồm những gì](https://xaydungsuachuanhaviet.vn/xay-nha-phan-tho.html)
- [Xây nhà trọn gói bao gồm những gì — SBSHouse](https://sbshouse.vn/xay-nha-tron-goi-bao-gom-nhung-gi/)
- [Gói xây nhà trọn gói gồm những hạng mục gì — Vietcons Education](https://vietcons.edu.vn/goi-xay-nha-tron-goi-gom-nhung-hang-muc-gi)
- [Hệ số xây dựng: Bảng hệ số chuẩn & cách tính 2026](https://xaydungminhduy.com/he-so-xay-dung.html)
- [So sánh móng đơn/băng/bè/cọc và chi phí xây dựng — Vietcons Education](https://vietcons.edu.vn/so-sanh-mong-don-bang-be-coc-va-chi-phi-xay-dung)
- [TCVN 13967:2024 — Nhà ở riêng lẻ, yêu cầu chung về thiết kế (PDF)](https://firesmart.vn/wp-content/uploads/2024/06/TCVN-13967-2024-tieu-chuan-thiet-ke-nha-o-rieng-le.pdf)
- [Diện tích sử dụng tối thiểu các phòng nhà ở riêng lẻ theo TCVN 13967:2024 — Thư viện Pháp luật](https://thuvienphapluat.vn/phap-luat-doanh-nghiep/bai-viet/dien-tich-su-dung-toi-thieu-cac-phong-nha-o-rieng-le-theo-tcvn-13967-2024-9864.html)
- [TCVN 13967:2024 — Vietcons Education](https://vietcons.edu.vn/tcvn-13967-2024-nha-o-rieng-le-yeu-cau-chung-ve-thiet-ke)
- [Các thông số cầu thang nhà ở — VnExpress](https://vnexpress.net/cac-thong-so-cau-thang-nha-o-2935712.html)
- [Tiêu chuẩn gara ô tô trong nhà — Báo Hà Tĩnh](https://baohatinh.vn/tieu-chuan-gara-o-to-trong-nha-phu-hop-cho-cac-loai-xe-hien-nay-post300133.html)
- [Đề xuất diện tích phòng trọ ≥ 10 m² — LSVN](https://lsvn.vn/de-xuat-tieu-chuan-dien-tich-phong-tro-phai-tren-10m21657529716-a121067.html)

- [Luật Xây dựng 2025: trường hợp miễn giấy phép xây dựng — LuatVietnam](https://luatvietnam.vn/tin-van-ban-moi/tu-01-7-2026-nha-o-rieng-le-duoi-7-tang-duoc-mien-giay-phep-xay-dung-186-106122-article.html)
- [Nghị định 217/2026 về cấp giấy phép xây dựng — Báo Chính phủ](https://baochinhphu.vn/quy-dinh-moi-ve-cap-giay-phep-xay-dung-102260619232158492.htm)
- [Thủ tục cấp phép xây dựng nhà ở riêng lẻ — Sở Xây dựng Đồng Nai](https://sxd.dongnai.gov.vn/vi/news/Tuyen-truyen/quy-dinh-ve-moi-ve-ho-so-cap-giay-phep-xay-dung-theo-nghi-dinh-so-217-2026-nd-cp-cua-chinh-phu-13490.html)
- [Quy định độ vươn ban công theo lộ giới — HoaTieu](https://hoatieu.vn/phap-luat/ban-cong-duoc-phep-xay-dung-tho-ra-ngoai-bao-nhieu-6496)
- [Lệ phí cấp giấy phép xây dựng 2026 — Thư viện Pháp luật](https://thuvienphapluat.vn/hoi-dap-phap-luat/le-phi-cap-giay-phep-xay-dung-tai-tphcm-nam-2026-bao-nhieu-138095770.html)
- [Mức phạt khởi công không có giấy phép 2026 — Thư viện Pháp luật](https://thuvienphapluat.vn/phap-luat-nha-dat/nam-2026-muc-phat-khi-khoi-cong-xay-dung-khong-co-giay-phep-xay-dung-la-bao-nhieu-15731.html)
- [Nhà ở riêng lẻ được bảo hành tối thiểu bao lâu — Thư viện Pháp luật](https://thuvienphapluat.vn/hoi-dap-phap-luat/tu-01012025-nha-o-rieng-le-duoc-bao-hanh-toi-thieu-trong-bao-lau-138024736.html)
- [Đăng ký bổ sung nhà ở vào sổ đỏ — LuatVietnam](https://luatvietnam.vn/dat-dai-nha-o/dang-ky-bo-sung-nha-o-vao-so-do-567-26117-article.html)
- [Mẫu hợp đồng thi công xây nhà trọn gói — LuatVietnam](https://luatvietnam.vn/bieu-mau/hop-dong-thi-cong-xay-nha-tron-goi-571-92542-article.html)
- [TCVN 4453: thời gian tháo cốp pha, bảo dưỡng bê tông — QLDA GXD](https://qlda.gxd.vn/van-ban/chat-luong/tcvn-4453-1995.html)
- [Thể tích bể tự hoại theo Bảng K-2 — Minh Tùng Composite](https://minhtungcomposite.vn/cach-tinh-be-tu-hoai/)
- [Cách tính công suất máy lạnh BTU theo diện tích — Meta.vn](https://meta.vn/hotro/btu-la-gi-cach-tinh-btu-dieu-hoa-cho-phong-5380)
- [Độ rọi theo TCVN 7114 — Rạng Đông](https://rangdong.com.vn/)
- [Kim Lâu là gì — Wiki Batdongsan](https://wiki.batdongsan.com.vn/wiki/kim-lau-la-gi-evr-795277)
- [Hoang Ốc là gì — Wiki Batdongsan](https://wiki.batdongsan.com.vn/wiki/hoang-oc-la-gi-110059)
- [Tam Tai là gì — Wiki Batdongsan](https://wiki.batdongsan.com.vn/wiki/tam-tai-la-gi-767904)
- [Cung phi là gì — Wiki Batdongsan](https://wiki.batdongsan.com.vn/wiki/cung-phi-la-gi-768289)
- [Thời gian xây nhà các giai đoạn — VTC News](https://vtcnews.vn/xay-nha-5-tang-mat-bao-lau-ar959657.html)
- [Trình tự xây dựng nhà ở — VnExpress](https://vnexpress.net/trinh-tu-xay-dung-nha-o-2828335.html)
- [Cách chống thấm sàn nhà vệ sinh — VnExpress](https://vnexpress.net/cach-chong-tham-san-nha-ve-sinh-4473109.html)
- [Bi hài xem tuổi làm nhà — VnExpress](https://vnexpress.net/bi-hai-xem-tuoi-lam-nha-4557459.html)
- [Giá thiết kế nhà ở 2026 — Kiến An Vinh](https://kienanvinh.com/bang-gia/don-gia-thiet-ke-nha-pho-kien-an-vinh)
- [Nghị định 207/2026: giữ lại bảo hành — Báo Xây dựng](https://baoxaydung.vn/muc-bao-hanh-toi-thieu-doi-voi-cong-trinh-xay-dung-la-bao-nhieu-192260709165154209.htm)
- [Nghị định 207/2026 về quản lý chất lượng và bảo trì công trình — LuatVietnam](https://luatvietnam.vn/xay-dung/nghi-dinh-207-2026-nd-cp-quy-dinh-chi-tiet-luat-xay-dung-ve-quan-ly-chat-luong-va-bao-tri-cong-trinh-437635-d1.html)

## 12. Thư viện vật liệu/thiết bị (chọn nhanh khi nhập liệu)

Mục tiêu: giảm việc gõ tay lặp lại tên/quy cách/đơn vị/cách tính/đơn giá cho các vật liệu, thiết bị hay dùng lại giữa nhiều dòng hoặc nhiều plan (gạch, đá ốp lát, quạt trần, điều hòa, máy giặt, tivi, tủ lạnh, đèn spotlight...).

- **Tab riêng "📚 Thư viện vật liệu"**: dùng chung cho mọi plan (không thuộc plan nào), thêm/sửa/xóa tự do. Mỗi dòng gồm: Hạng mục (dùng chung 4 nhóm ở mục 2), Tên, Quy cách/Thông số, Đơn vị tính, Cách tính tiền (Đơn giá×SL hoặc Đơn giá×Diện tích), Đơn giá tham khảo, Tính riêng (mặc định gợi ý theo mục 11.3), Ghi chú.
- **Chọn nhanh ở từng trang hạng mục**: mỗi trang Kết cấu/Hoàn thiện/MEP/Ngoại thất có thêm ô "📚 Chọn từ thư viện…" (chỉ liệt kê các mục cùng hạng mục) + nút "+ Từ thư viện" — bấm sẽ tạo 1 dòng vật liệu mới trong plan đang mở, điền sẵn toàn bộ các trường từ mục thư viện đã chọn; người dùng chỉ cần chỉnh Số lượng/Tầng/Phòng nếu cần.
- **Dữ liệu mẫu có sẵn**: gạch men 30x60, gạch granite 60x60, đá 80x80, đá 60x120, gạch lót toilet chống trơn, gạch lót sân ngoài trời, quạt trần, quạt trần đèn, máy giặt, tivi, tủ lạnh, đèn spotlight (góc chiếu 15°/24°/36°/60°), đèn thả, đèn ốp trần, đèn downlight, điều hòa Daikin 1 ngựa — đơn giá là giá tham khảo thị trường 2026, cần đối chiếu báo giá thực tế trước khi chốt.
- **Lưu trữ**: thư viện được lưu chung trong cùng file JSON của công cụ (khóa `library` ở cấp cao nhất, song song với `plans`), tự động lưu/nạp giống các dữ liệu khác ở mục 8. File cũ (chưa có khóa `library`) khi mở lên sẽ tự nạp bộ thư viện mặc định.

## 13. Trải nghiệm người dùng & tính năng thông minh (bản 2026-10-24)

Mục tiêu: ai cũng dùng được — người mới chỉ cần trả lời vài câu là có dự toán; người dùng thạo có đủ công cụ nâng cao (lọc, thao tác hàng loạt, phím tắt, tài chính).

### 13.1. Bắt đầu nhanh cho người mới
- **Màn hình chào** ở lần mở đầu tiên: chọn "Ước tính nhanh nhà mới", "Xem phương án mẫu" hoặc "Mở file đã lưu".
- **✨ Ước tính nhanh (wizard)**: nhập kích thước đất (VD `5x20`), số tầng, có tum/sân thượng, loại móng, số phòng ngủ/WC, mức hoàn thiện (Phổ thông → Cao cấp), phương pháp tính và ngân sách. Bên phải hiển thị **xem trước tức thì** đúng con số của phương án sẽ tạo (tổng, đ/m², số phòng, số dòng) và so với ngân sách. Bấm tạo sẽ sinh đủ tầng, phòng, vật liệu mẫu theo phòng.
- **Hướng dẫn tích hợp** (nút ❓ hoặc phím `?`): Bắt đầu · Nhập nhanh · Phím tắt · Hỏi đáp · Hiển thị (đổi sáng/tối, Cơ bản/Nâng cao, cỡ chữ lớn).
- **Mẹo theo ngữ cảnh** (hộp 💡) có thể tắt từng cái; trạng thái đã tắt được ghi nhớ.

### 13.2. Nhập liệu thông minh
- Ô tiền hiểu cách gõ tự nhiên: `1tr5` = 1.500.000, `500k`, `2 tỷ 3`, `1.200.000`, và phép tính `250k*12`, `1tr+300k`. Khi gõ hiện ngay dòng xem trước "= 1.500.000 đ".
- Ô số lượng/diện tích tính được biểu thức: `4x2,5`, `12+8`. Ô kích thước tầng/phòng hỗ trợ hình ghép `5x15+2x3` và các dấu `x`, `*`, `×`.
- **Enter** xác nhận ô và nhảy xuống cùng cột ở dòng kế tiếp (như bảng tính); **Esc** trả ô về giá trị cũ; Esc trong ô tìm kiếm là xóa từ khóa.
- **Tự điền từ thư viện**: gõ tên trùng một mục thư viện → tự điền đơn giá/đơn vị/cách tính còn trống; nếu vật liệu là đồ rời mà phương án đang tính trọn gói thì tự tick "Tính riêng" (có thông báo + Hoàn tác).
- Dòng mới thêm được tự focus vào ô tên và nháy sáng để dễ thấy.

### 13.3. An toàn & hoàn tác
- **Hoàn tác / Làm lại** mọi thao tác dữ liệu (`Ctrl/⌘+Z`, `Ctrl/⌘+Shift+Z`, `Ctrl+Y`), nút ↶ ↷ trên đầu trang. Xóa dòng/tầng/phòng/phương án đều có thông báo kèm nút "Hoàn tác".
- Hộp thoại xác nhận, nhập tên, thông báo dùng giao diện riêng của công cụ (không dùng `alert/confirm/prompt` của trình duyệt).

### 13.4. Điều hướng & tìm kiếm
- Thanh tab cố định: Thông tin nhà · Tổng quan · 5 hạng mục (kèm số dòng) · Kiểm tra (kèm số cảnh báo) · Tài chính · Thư viện. Chuyển nhanh bằng `Alt/⌥ + 1…9`.
- **Tìm nhanh mọi thứ** (`Ctrl/⌘+K`): trang, lệnh (thêm dòng, xuất Excel, so sánh, sao lưu, đổi giao diện…), phương án, vật liệu, tầng/phòng, thêm từ thư viện. Tìm không cần gõ dấu.
- Trên trang hạng mục: ô tìm (phím `/`), lọc theo trạng thái (Đã chốt / Đang cân nhắc / Thiếu dữ liệu / Tính riêng / Chưa trả đủ), theo vị trí (tầng, phòng), sắp xếp theo thành tiền/tên/vị trí. Phím `N` thêm dòng.
- Chế độ hiển thị **Cơ bản** (ít cột, dễ nhìn) / **Nâng cao** (đủ hãng, quy cách, cách tính, đơn vị, nhà cung cấp, link, ghi chú, đã chi). Giao diện **sáng/tối**, **cỡ chữ lớn**.

### 13.5. Phân tích & quyết định
- **Tổng quan**: tổng chi phí, đ/m² và mức tương đương, biểu đồ tròn cơ cấu chi phí, chi phí theo tầng/phòng, top dòng tốn kém, theo dõi ngân sách (thanh tiến độ, cảnh báo vượt).
- **Ngân sách & dự phòng**: `house.budget` (VNĐ) và `house.contingencyPercent` (%) — tiền dự phòng được **cộng vào tổng** và hiển thị riêng.
- **Trạng thái dòng**: "✓ Đã chốt" (tính vào tổng) / "🤔 Đang cân nhắc" (không tính, hiện riêng để thấy "nếu chốt hết thì bao nhiêu").
- **🩺 Kiểm tra dự toán**: chấm điểm 0–100 và liệt kê lỗi/thiếu sót (dòng thiếu giá/số lượng, phòng chưa có vật liệu, tầng thiếu diện tích, phòng vượt diện tích tầng, chưa có dự phòng, đ/m² bất thường, đồ rời chưa tick "Tính riêng" khi tính trọn gói, đơn giá lệch nhiều so với thư viện, dòng có thể bị trùng, vượt/sắp chạm ngân sách…), mỗi mục có nút sửa nhanh hoặc nhảy tới đúng dòng.
- **⚖️ So sánh** 2+ phương án song song: tổng, chênh lệch, đ/m², chi phí từng hạng mục, gói trọn gói, dự phòng (xanh = thấp nhất, đỏ = cao nhất).
- **Thao tác hàng loạt**: tick nhiều dòng → đổi trạng thái, chuyển hạng mục, gán vị trí, tick "Tính riêng", nhân bản, lưu vào thư viện, xóa.

### 13.6. Tài chính, báo cáo, sao lưu
- **💰 Tài chính** (lưu trong `plan.finance`, tùy chọn): tiền tự có, khoản vay (lãi suất, thời hạn, trả đều hoặc gốc đều lãi giảm dần), thu nhập hằng tháng → trả tháng đầu, tổng lãi, tỷ lệ trả nợ/thu nhập có cảnh báo; nút "Vay đúng phần còn thiếu". **Tiến độ thanh toán theo đợt** (6 đợt mẫu: tạm ứng, móng, khung, xây tô, hoàn thiện, bàn giao) với % / số tiền / ngày dự kiến / đã trả.
- **Đã chi** (`item.paid`, chế độ Nâng cao) để theo dõi tiền đã trả từng dòng.
- **🖨 Báo cáo / In PDF**: trang báo cáo gọn để in hoặc "Lưu dưới dạng PDF" gửi người thân/nhà thầu.
- **⬇ Xuất Excel (CSV)** UTF-8 có BOM (mở đúng tiếng Việt trong Excel).
- **Bản sao lưu tự động trong trình duyệt** (localStorage `duToanXayNhaSnapshots`, giữ 15 bản): tự chụp mỗi 10 phút khi có thay đổi và trước mỗi lần mở file/tạo file/nhập/khôi phục; xem, khôi phục (vẫn hoàn tác được), tải về từng bản trong hộp thoại "💾 Lưu trữ & sao lưu".
- **Nhập JSON** cho phép chọn **Gộp** (thêm phương án/thư viện mới vào dữ liệu hiện tại) hoặc **Thay thế**; luôn sao lưu trước khi nhập.

### 13.7. Tương thích dữ liệu
- Mọi trường mới đều **tùy chọn**: `house.budget`, `house.contingencyPercent`, `item.paid`, `plan.finance = {savings, loanAmount, loanRate, loanYears, loanType: 'annuity'|'declining', monthlyIncome, stages:[{id, name, percent, paid, dueDate}]}`. File JSON cũ mở bình thường; file mới vẫn đọc được các trường cũ.
- Tùy chọn giao diện lưu riêng ở localStorage `duToanXayNhaUI` (theme, mode, font, mẹo đã tắt), không lẫn vào file dữ liệu.
- Giữ nguyên toàn bộ cơ chế lưu ở mục 8 (File System Access API, tự kết nối lại, lưới an toàn localStorage `duToanXayNhaData`, dữ liệu mặc định không ghi đè dữ liệu người dùng).

### 13.8. Nhà mẫu theo lô đất (trang `templates`)
- Người dùng chọn kích thước lô (nút −/+ hoặc chip lô thường gặp 3,5×12 … 5×20, 5×22, 5×23, 6×15 … 7×23, 7×25, 8×25, 9×25 … 20×30), **kiểu dáng** (Tất cả · 2 tầng 1 tum · Chữ L / U · Thông thoáng · Nhà phố · 1 tầng / cấp 4 · Biệt thự & vườn · Kinh doanh / cho thuê — mỗi chip hiện "số mẫu hợp lô / tổng"), nhu cầu (ô tô, kinh doanh, người già, cho thuê, **thông thoáng**), số phòng ngủ, ngân sách, mức hoàn thiện.
- **35 mẫu** tự co giãn theo lô. 12 mẫu gốc: nhà phố 3 tầng + tum, nhà phố 2 tầng tiết kiệm, nhà phố kinh doanh 5 tầng, nhà siêu mỏng, nhà cấp 4, cấp 4 gác lửng, nhà 3 thế hệ có thang máy, nhà phố có gara, nhà trọ cho thuê, biệt thự 2 tầng, biệt thự 3 tầng hồ bơi, nhà vườn.
- 15 mẫu cho **lô ngang rộng (6–10 m, VD 7×23), nhà chữ L / chữ U và nhà thông thoáng**: nhà phố lô rộng 2 giếng trời, nhà 2 tầng lệch hông thoáng, nhà phố 3 tầng khe thoáng hông, nhà cấp 4 chữ L mái Thái, nhà chữ L 2 tầng sân vườn trước, nhà chữ L có sân đậu ô tô, nhà phố chữ L sân vườn sau, nhà chữ U sân trong giữa, nhà cấp 4 sân trong mái dốc, biệt thự chữ L (lô ≥ 350 m² có hồ bơi), dãy trọ chữ L sân chung, nhà phố văn phòng + ở, nhà sân vườn + quán cà phê, nhà 2 thế hệ 2 bếp, nhà nhiệt đới xanh.
- 8 mẫu **"2 tầng 1 tum"** (1 trệt 1 lầu + tum thờ, sân thượng; tag `tum`, nhắm lô 5×20, 5×22, 5×23, 6×15, 7×20, 7×23): nhà phố 2 tầng 1 tum (cơ bản), có gara ô tô, có phòng ông bà tầng trệt, lô dài 2 giếng trời, lô 7 m sân đậu ô tô (4 phòng ngủ), lô ngắn (6×15), mặt tiền kinh doanh, sân vườn trước. Mẫu "Nhà chữ L có sân đậu ô tô" (cũng 1 trệt 1 lầu + tum) cũng mang tag `tum`.
  - Mẫu tự bỏ bớt khi lô không đủ chỗ: lô ngang < 6 m có gara thì lầu 1 làm *phòng sinh hoạt chung* giữa nhà thay phòng ngủ 3 (phòng ngủ phía sau ≥ 2,6 m ngang); chỉ thêm gara / phòng ông bà khi nhà đủ dài.
- Mỗi mẫu có `tags` (L, airy, town, low, villa, biz) để lọc và `feat.airy` (0–3) để chấm điểm nhu cầu thông thoáng; điểm có thêm phần cộng nhỏ theo độ gần tâm khoảng lý tưởng (ngang, diện tích) để phân hạng các mẫu cùng hợp. Thẻ mẫu có **sơ đồ nhìn từ trên** (lô, khối nhà, sân trong) và nhãn "⌐ Chữ L / ⊐ Chữ U · sân … m²".
- Mỗi mẫu tự tính khoảng lùi trước/sau, giới hạn **mật độ xây dựng theo QCVN 01:2021** (≤90 m² đất: 100%, 100: 90%, 200: 70%, 300: 60%, 500: 50%, ≥1000: 40%, nội suy tuyến tính), chia diện tích phòng theo trọng số; chấm điểm phù hợp (kích thước, nhu cầu, số phòng ngủ, ngân sách) và xếp hạng; mẫu không vừa lô được gom riêng kèm lý do.
- Xem chi tiết: mặt đứng, mặt bằng từng tầng, chi phí theo hạng mục, thời gian thi công ước tính, dòng tiền cho thuê (mẫu nhà trọ). "Tạo phương án từ mẫu này" sinh đủ tầng, phòng, gói vật liệu mẫu, khoản chung và kích thước lô.
- Gói vật liệu mẫu mới: thang máy, giếng trời, mặt bằng kinh doanh, phòng cho thuê, hồ bơi.
- **Chuẩn kích thước & công năng khi thiết kế mẫu** (rà soát kiểu kiến trúc sư, bản 4):
  - Phòng ngủ ≥ 9 m², cạnh ≥ 2,6 m và **có cửa sổ** (chạm tường ngoài, giếng trời hoặc ban công); phòng khách ≥ 12 m², cạnh ≥ 3 m; bếp ≥ 7 m²; WC ≥ 2,5 m² (`wcA`: 3,6 / 4,2 m², nhà ≥ 6,5 m ngang 4,2 / 5 m²).
  - Gara ô tô (`garA`): nhà < 8,5 m ngang chiếm trọn bề ngang, sâu 5,4 m (ô tô + xe máy); nhà rộng hơn gara 2 xe ≈ 34 m². Để xe máy (`mbA`) ≈ 2,6 m × ngang nhà (8–20 m²). Giếng trời (`lwA`) hết bề ngang, sâu ~1,5 m (4–9 m²).
  - Cầu thang là 1 lõi thẳng đứng chung mọi tầng; giếng trời đặt ngay sau cầu thang ở mọi tầng để thẳng hàng; phòng ngủ ưu tiên đầu nhà (ban công) và cuối nhà (sân sau / giếng trời).
  - Tum: phòng thờ phía trước cầu thang, khu giặt phơi phía sau; không để dải trống thừa.
- **Bộ chia phòng tự động** (mặt bằng 2D/3D): loại phòng suy ra từ **tên phòng** (`ROOM_TYPE_PATTERNS`: "Pantry" = bếp, "Văn phòng / phòng họp / thư viện" = làm việc, "Hiên" = ban công, "Sinh hoạt" = phòng khách, "Sân / vườn" = sân). Chia theo dải (band) có tính chi phí hình dạng, tính **cửa sổ** (phòng ngủ / cho thuê / làm việc bị phạt nếu không chạm tường ngoài hay giếng trời / ban công), thử cả 2 hướng chia khi khối gần vuông; WC / giặt đứng 1 mình có "Hành lang" đi kèm thay vì bị kéo dài; vị trí cầu thang chừa đủ sâu cho gara + phòng khách phía trước.

### 13.9. Mặt bằng 2D & phối cảnh 3D (trang `visual` — "Mặt bằng & 3D")
- Hình vẽ **tự sinh từ dữ liệu** (tầng, phòng, diện tích, `house.lotWidth/lotLength/setbackFront/sideSetback/roofType/facing`); thiếu kích thước lô thì tự đoán từ diện tích và gắn nhãn "ước đoán".
- **2D (SVG)**: tổng mặt bằng lô (đường/hẻm, sân trước/sau, cổng, la bàn hướng nhà, kích thước) và mặt bằng từng tầng (bố trí phòng dạng treemap có thứ tự, cầu thang, kích thước); tô màu theo loại phòng hoặc theo chi phí. Chạm vào phòng → bảng chi tiết phòng.
- **3D (Three.js r160, tải từ CDN khi cần)**: lô đất, đường, hàng rào, cây, tường, cửa kính, sàn từng phòng, cầu thang, mái (bằng / Thái / dốc 2 mái), bể nước; xoay/thu phóng/kéo bằng chuột hoặc chạm; chọn tầng để "bóc" các tầng phía trên; thanh trượt **tách tầng**; bật/tắt nhãn; bấm phòng trong 3D để mở chi tiết. Mất mạng lần đầu → thông báo và nút xem 2D.
- Bảng **Lô đất & quy chuẩn**: chỉnh ngang/dài lô, sân trước bằng nút −/+, hiện diện tích đất, diện tích xây dựng, mật độ so với mức tối đa, tổng sàn, chiều cao ước tính; chọn kiểu mái và hướng nhà (kèm gợi ý theo hướng).
- **Bảng phòng** (skill `mat-bang-2d`): chạm phòng trên bản vẽ / thẻ phòng / 3D → phòng được chọn ngay trên bản vẽ và bảng phòng mở **không che bản vẽ**: máy tính ở cột phải (dính khi cuộn), điện thoại là bảng dưới 2 nấc (thấp ~40% màn hình, chạm lần 2 hoặc "▴ Mở rộng" để mở cao), đầu trang cuộn đi để bản vẽ + bảng chiếm trọn màn hình. Gồm: ▲ Lên trước / ▼ Ra sau (thử chèn vào thứ tự tầng, chọn vị trí gần nhất làm phòng thật sự dịch về phía đó), ⇄ Xoay, ↶ Hoàn tác; ngang × dài −/+ (nhấn giữ để lặp, ô gõ số) kèm **khoảng đặt được** thử trước bằng bộ xếp ("đặt được 3–5 m", "cố định 3,9 m · bề ngang giữ theo cột cạnh hành lang"), nút mờ ở đầu khoảng kèm lý do; dòng chuẩn TCVN; **phòng khác đổi theo** ("Bếp 7 × 3,2 → 7 × 2,7 m" + nút "Giữ … như cũ") và lỗi "ở được" mới phát sinh; chỗ trên tầng; cỡ thường dùng (cỡ không vừa tầng thì mờ); khu trên tầng; chuyển tầng; chi phí lớn nhất; vật liệu, gói mẫu, đổi tên, bỏ kích thước, xóa. Cầu thang: ▲ ▼ dời lõi thang 0,5 m (chung mọi tầng), "✨ Tự đặt". Mở từ nút 📐 ở trang Thông tin nhà → chuyển sang trang Mặt bằng, có nút "← Thông tin nhà".
- **Thao tác trực tiếp trên bản vẽ 2D**: phòng đang chọn có 2 tay nắm **↔** (cạnh phải → ngang) và **↕** (cạnh sau → dài); kéo thì bản vẽ xếp lại theo từng khung hình và hiện số "↕ Dài 4,2 m" (dừng ở đầu khoảng đặt được, nói lý do), thả tay = 1 bước Hoàn tác. **Giữ 0,4 s rồi kéo** phòng: thả lên phòng khác cùng tầng = đổi chỗ, thả lên chip tầng = chuyển tầng. Phòng đổi chỗ có chuyển động ngắn; phòng bị ảnh hưởng nhấp nháy viền; phòng lệch kích thước viền cam nét đứt. "🔍 Phóng to" quanh phòng đang chọn. Máy tính: ←/→ ngang, ↑/↓ dài (Shift = 0,5 m), Esc bỏ chọn, Delete xóa. Chuỗi bấm −/+ liên tục gộp 1 bước Hoàn tác.
- **Ô bản vẽ tự thêm** (Còn trống, Không gian chung, Kho / tủ âm, Hành lang, Lối đi, cầu thang tự thêm): chạm vào → bảng nói vì sao có + việc làm được: "＋ Thêm phòng vào đây" (kích thước = ô, thứ tự chọn để phòng mới nằm gần ô nhất; báo thật nếu bộ xếp đặt chỗ khác), "⤢ Nới <phòng bên cạnh> → …" (chỉ khi cạnh chung phủ gần hết cạnh phòng và không làm phòng dài ngoằng), "＋ Biến thành phòng Kho" (chỉ khi thử trước thấy phòng vào đúng ô — ô kho trong lõi kỹ thuật dùng phòng "Kho" người dùng thêm), "＋ Thêm cầu thang để chỉnh kích thước". Ô nhỏ hiện tên viết tắt (PN2, HL, Kho) thay vì chỉ biểu tượng.
- **Thêm phòng bằng chạm** (nút "+ Phòng" / nút nổi ＋): chọn tầng (chip) và loại phòng trong lưới (Phòng ngủ, WC, Phòng khách, Bếp, Phòng thờ, Giặt phơi, Kho, Phòng làm việc, Sinh hoạt chung, Ban công, Giếng trời, Gara, Phòng cho thuê, Sân thượng, "Tên khác…"); tên tự đánh số (VD đã có "Phòng ngủ 2, 3" → "Phòng ngủ 4"), kích thước gợi ý sẵn, rồi chọn luôn phòng mới trên bản vẽ (có tay nắm, bảng phòng nấc thấp).

#### 13.9.1. Kích thước phòng ngang × dài
- Mỗi phòng chọn được **kích thước ngang × dài** (ngang = theo mặt tiền, dài = theo chiều sâu nhà) thay vì chỉ diện tích. Lưu trong trường có sẵn `room.dimension` dạng `"3,5x4"`; `room.area` tự tính = ngang × dài. Dữ liệu cũ (không có kích thước, hoặc dạng tổng `"3x4+1x2"`) vẫn chạy như trước.
- Trong bảng chi tiết phòng: 2 ô **↔ Ngang / ↕ Dài** có nút −/+ (bước 0,1 m) và gõ được; **⇄ Xoay** (đổi ngang/dài); **✕ Bỏ kích thước** (về chế độ tự chia theo diện tích); chip **kích thước chuẩn theo loại phòng** (VD phòng ngủ 3×3,3 … 4×5, WC 1,5×2 … 2,2×2,5 (≥ 3 m²), bếp 3×4 … 5×5, gara 3×5,5 … 6×5,6) và chip **"↔ Hết ngang x m"** (ngang = bề ngang nhà, giữ diện tích). Đổi diện tích khi đã có kích thước → giữ ngang, tự tính dài.
- **Góp ý công năng**: cạnh ngắn nhỏ hơn mức tối thiểu của loại phòng (phòng ngủ 2,7 m, khách 3 m, bếp 2,4 m, WC 1,2 m…) hoặc phòng dài quá mức (tỉ lệ dài/rộng) → hiện 💡 gợi ý.
- **Chỗ trên tầng**: dòng "Tầng: các phòng x / y m² · còn trống z m² / vượt z m² / vừa khít" (y = diện tích dùng được, đã trừ cầu thang và lối đi tự sinh; bỏ qua chênh lệch ≤ 3% do làm tròn) + nút 1 chạm **"⤢ Nới phòng này lấp chỗ trống"** / **"⤡ Thu phòng này cho vừa"**. Danh sách tầng và đầu danh sách phòng của tầng cũng hiện "còn trống / ⚠ vượt".
- **Vị trí trên tầng** (tầng có lõi cầu thang): chip *✨ Tự xếp* / *🪜 Cạnh cầu thang* / *🏠 Khu chính* — trường tùy chọn `room.slot` (`'stair'`|`'main'`; trống = tự xếp). Khi 1 phòng đã ghim, phòng không ghim trên tầng đó ở khu chính; chọn "Tự xếp" bỏ ghim cả tầng; chuyển tầng thì bỏ ghim phòng đó.
- **Bản vẽ 2D/3D dùng kích thước đã chọn**: bộ chia phòng coi phòng có kích thước là cố định (cho phép xoay), phạt độ lệch so với ngang × dài mong muốn; cầu thang có kích thước thì lõi thang theo đúng kích thước. Nếu mọi phòng trong khối đã chốt kích thước mà còn thừa chỗ (> 6%) → vẽ ô **"Còn trống"** (1 mảnh cạnh phòng lớn nhất cho đúng ngang × dài + phần còn lại) thay vì kéo giãn phòng; nếu có hành lang tự sinh thì hành lang nhận phần dư. Sân thượng luôn nhận phần dư của khu ngoài trời.
- Nhãn trên bản vẽ / thẻ phòng / bảng phòng dùng chung 1 hàm (`roomSizeInfo`): **📐 ngang × dài · diện tích** = đặt đúng kích thước đã chọn (mỗi cạnh lệch ≤ 0,3 m do làm tròn); **⚠ muốn a × b · vẽ c × d** = tầng không đủ chỗ (viền cam trên bản vẽ; bảng phòng nói cạnh nào thiếu, vì sao, và đưa lựa chọn sửa 1 chạm **đã thử trước**: "↔ Ngang 4,6 m, giữ dài 3,4 m", "📐 Lấy đúng như bản vẽ", "⇅ Chuyển sang Lầu 1 (trống 18 m²)"); **≈ a × b** = chưa chốt, bản vẽ tự chia (diện tích hiện theo bản vẽ). Diện tích chỉ là ô nhập khi phòng chưa có kích thước.
- **Tự ghi kích thước**: tạo phương án từ nhà mẫu → các phòng được ghi sẵn ngang × dài đúng như bản vẽ (không nắn, **không tự ghim khu** — ghim khu tắt lõi kỹ thuật WC + giếng trời) và chốt vị trí cầu thang (`house.stairAt`); ghi xong kiểm lại, phòng nào bị dời > 0,3 m thì để tự chia, kém "ở được" hơn thì bỏ ghi hết → bản vẽ phương án giống hệt bản xem trước nhà mẫu (251/251 mẫu ở được giữ ở được). Phương án cũ: nút **"📐 Ghi kích thước (n)"**; tầng có phòng lệch kích thước có hộp "⚠ n phòng đang vẽ khác kích thước đã chọn" + **"📐 Lấy đúng như bản vẽ"** / **"✨ Tự xếp lại tầng"**. Tầng mà mọi phòng đều bị ghim khu (do bản cũ tự ghim) được coi như chưa ghim.
- **Vị trí cầu thang** chốt ở `house.stairAt` (m từ mép trước nhà, 4 số lẻ) khi tạo từ nhà mẫu hoặc khi bắt đầu chỉnh phòng trên 2D → đổi kích thước 1 phòng không làm cầu thang trượt kéo cả nhà xếp lại. Bộ xếp: đoạn trước / dải cạnh hành lang / đoạn sau mà mọi phòng đã có kích thước thì giữ đúng chiều sâu đó, đoạn còn lại nhận phần dư.
- **Phòng ngủ vuông vắn, không dài / hẹp** (giới hạn cứng `ROOM_SHAPE_LIMIT`): phòng ngủ dài ≤ 1,8 lần ngang và cạnh ngắn ≥ 2,5 m; phòng làm việc ≤ 2 lần, ≥ 2,2 m; phòng cho thuê ≤ 2,3 lần, ≥ 2,5 m (phòng trọ có WC + bếp bên trong nên được dài hơn).
  - Bảng chi tiết phòng: bấm −/+ hay gõ vượt giới hạn → giữ cạnh kia, chặn cạnh đang sửa ở mức tối đa/tối thiểu và báo toast (VD ngang 4,1 thì dài tối đa 7,3 m). "↔ Hết ngang" với phòng ngủ tự tăng chiều dài cho khỏi thành dải hẹp. Đổi diện tích / "Nới phòng lấp chỗ trống" cũng theo giới hạn này.
  - Phòng đang dài / hẹp quá (theo kích thước đã chọn, hoặc theo bản vẽ nếu chưa chọn) → hộp cảnh báo ở đầu danh sách phòng của tầng + mục cảnh báo trong Kiểm tra dự toán, nút **🔧 Nắn vuông vắn** (có Hoàn tác): giữ diện tích, nắn về dài ≈ 1,3 × ngang, ngang không quá bề ngang nhà (VD 2,6 × 8,5 → 4,1 × 5,4).
  - "📐 Ghi kích thước" gặp phòng ngủ đang vẽ méo thì ghi kích thước đã nắn vuông.
  - **Bộ chia phòng**: phạt gấp 3 khi phòng ngủ / làm việc vượt tỉ lệ; phòng ngủ sau ban công (hoặc cạnh giếng trời) tính là có cửa sổ; ban công được chạy hết mặt tiền. Sau khi xếp, nếu còn phòng ngủ méo / hẹp / bị kéo giãn quá 2 lần diện tích, hoặc phòng có kích thước chọn bị vẽ lệch: thử (a) giữ đúng diện tích phòng ngủ, dồn phần dư cho phòng chung (khách, bếp…), (b) chèn 1 ô "Không gian chung" / "Hành lang" (ô hẹp < 1,6 m) cạnh phòng đó — chọn phương án ít méo nhất. Lõi cầu thang lùi / tiến để phòng ngủ trước / sau thang đủ sâu (≥ 3 m).
  - Gợi ý nhà mẫu: mẫu có phòng ngủ cạnh ngắn < 2,3 m trên lô đang chọn bị loại ("Phòng ngủ quá hẹp trên lô này"); phòng ngủ dài > 1,9 lần bị trừ điểm.
- Trang Thông tin nhà: cột "Kích thước (ngang × dài)" là nút 📐 mở bảng chọn kích thước bằng chạm; chế độ Nâng cao vẫn có ô gõ nhanh `3,5x4`.
- Kiểm tra dự toán có thêm cảnh báo **mật độ xây dựng vượt quy chuẩn** (dẫn tới trang Mặt bằng).
- Trường mới (tùy chọn) trong `house`: `lotWidth`, `lotLength`, `setbackFront`, `sideSetback`, `roofType` (`flat`|`thai`|`gable`), `facing` (8 hướng). Nhập ngang/dài lô tự cập nhật `landArea`.
- **Hình khối nhà chữ L / chữ U** (chip "Hình khối nhà"): khối nhà = hình chữ nhật `ngang nhà × dài nhà` trừ 1 khoảng sân sát hông — *sân trước* hoặc *sân sau* (chữ L) hay *sân giữa* (chữ U); chọn sân bên trái/phải, chỉnh sân rộng/sâu bằng −/+. Trường tùy chọn: `house.shape` (`'L'` hoặc trống = chữ nhật), `courtPos` (`front`|`back`|`middle`), `courtSide` (`left`|`right`), `courtWidth`, `courtLength` (m). Nhà phải ngang ≥ 5 m, dài ≥ 8 m; sân bị giới hạn để còn ≥ 3 m bề ngang và ≥ 5 m chiều dài nhà.
  - Phòng mỗi tầng được chia vào các khối theo thứ tự trước → sau và tỉ lệ diện tích; tầng trệt vẽ sân trong (khu sân có tên chứa "sân trong / sân hông / sân giữa / vườn hông / vườn trong" được đặt vào đó), tầng trên vẽ "Khoảng thông thoáng". Đường bao 2D, tường, cửa kính hướng ra sân, mái (mỗi khối 1 mái; mái bằng có tường chắn mái chạy theo đường bao) trong 3D đều theo hình chữ L/U. Diện tích xây dựng & mật độ trừ phần sân.
  - Nếu diện tích sàn đã nhập lệch > 3% so với hình khối → gợi ý "Cập nhật" 1 chạm (đặt lại diện tích các tầng đầy đủ và diện tích khu sân trong).
- **Vị trí nhà trên lô** (khi nhà hẹp hơn lô > 0,3 m): sát trái / giữa / sát phải — `house.sideAlign` (`left`|`center`|`right`; trống = tự động: chừa > 1,5 m thì đặt giữa, ngược lại sát trái). Khe hông được vẽ 2D/3D (có cây, cửa sổ hông).

#### 13.9.2. Chuẩn diện tích & kích thước phòng theo công năng
Bảng `ROOM_STD` (+ `roomStd(type, name)`) theo **TCVN 13967:2024 — Nhà ở riêng lẻ** (Bảng 3 diện tích sử dụng tối thiểu) và thực tế thiết kế nhà phố VN:

| Loại phòng | Tối thiểu | Thường dùng / tối đa hợp lý | Nguồn |
|---|---|---|---|
| Phòng ngủ | giường đơn ≥ 9 m², giường đôi (master, ông bà, bố/ba/cha mẹ, vợ chồng) ≥ 12 m² | 12–20 m², ≤ 30 m² | TCVN |
| Sinh hoạt chung / tiếp khách | ≥ 13 m² (SHC phụ trên lầu ≥ 9 m²) | 18–35 m², ≤ 70 m² | TCVN |
| Bếp + ăn | ≥ 12 m² (bếp phụ / pantry không tính) | 12–25 m², ≤ 40 m² | TCVN |
| WC | ≥ 3 m², ngang ≥ 1,2 m | 3–5 m², ≤ 10 m² | TCVN |
| Làm việc | ≥ 7 m² | 8–15 m², ≤ 20 m² | thực tế |
| Phòng thờ | ≥ 4 m² (tủ thờ ~1,6 × 0,7 m + chỗ lễ) | 6–15 m², ≤ 20 m² | thực tế |
| Giặt phơi | ≥ 2,5 m² | 3–6 m², ≤ 12 m² | thực tế |
| Phòng cho thuê | ≥ 10 m² (đề xuất HN / TP.HCM) | 15–25 m² có WC riêng, ≤ 30 m² | đề xuất địa phương |
| Gara ô tô | ≥ 15 m² (≥ 3 × 5–5,5 m) | xe máy ~2 m²/xe | thực tế |
| Cầu thang | vế ≥ 0,7 m (nên 0,9–1,2 m), bậc cao ≤ 19 cm, rộng ≥ 25 cm | | TCVN 5.11 |
| Lối đi thoát nạn | ≥ 1,0 m | | TCVN 9.3 |
| Tum | ≤ 30% diện tích sàn mái, vượt thì tính là 1 tầng | | TCVN 3.24 |

- **Bảng chi tiết phòng**: dòng "📐 Chuẩn TCVN 13967:2024: …" theo loại phòng; phòng nhỏ hơn mức tối thiểu → chữ đỏ "phòng này x m² nhỏ hơn mức tối thiểu y m²", rộng quá mức thường dùng → chữ cam.
- **Kiểm tra dự toán**: cảnh báo "n phòng nhỏ hơn diện tích tối thiểu" (kèm trích Bảng 3), gợi ý "n phòng rộng hơn mức thường dùng", cảnh báo "Tum x m² = y% sàn mái → bị tính là 1 tầng".
- **Nhà mẫu**: mẫu có phòng TCVN thiếu > 20% mức tối thiểu trên lô đang chọn bị loại ("Lô quá nhỏ cho mẫu này"); thiếu ít → trừ điểm và hiện "✗ Nhỏ hơn chuẩn: … (TCVN 13967)".
  - Phòng chia theo tỉ lệ (`TF`) có trần diện tích (phòng ngủ 18 m², master 24, ông bà 20, bếp 30, khách 45, thờ 16, giặt 8–12, thuê 25 m²…); phần dư trên lô lớn thành phòng đi kèm hợp công năng (phòng thay đồ / phòng tủ đồ / phòng đa năng / sảnh + hành lang) đặt ngay cạnh phòng đó, thay vì phòng ngủ 40–50 m².
  - Tum mặc định = 30% sàn mái; nếu không đủ chỗ thì bỏ khu giặt khỏi tum. Ban công sâu ~1,2 m chạy hết mặt tiền (diện tích = ngang nhà × 1,2, 3,6–6 m²). Nhà cho thuê lô 1 dãy sâu ≥ 15 m chia 3 phòng/tầng (~20 m², phòng nào cũng có cửa sổ).
- **Bộ chia phòng**: WC / giặt không thành ống dài hẹp (ngang ≥ 1,2 m, tỉ lệ ≤ 2,6); WC trong ô cạnh cầu thang rộng thì là hộp ~1,6 × 2,4 m + sảnh; thang máy là hộp ~1,7 × 1,8 m + sảnh chờ; WC, giặt, kho, thờ được chuyển qua phía trước / sau cầu thang bên còn rộng khi một bên quá chật (phòng cần cửa sổ chỉ chuyển nếu nằm cạnh giếng trời); ban công mặt tiền / mặt sau là dải hết bề ngang (so 2 cách xếp, giữ cách ít méo hơn); hành lang tự thêm cạnh WC chỉ lấy phần chỗ thừa.
- Đo bằng bộ kiểm tra tự động trên 30 lô × 7 bộ nhu cầu × 35 mẫu (~2.770 phương án): lỗi kích thước / diện tích giảm từ 10.580 xuống ~2.100; phòng ngủ méo 130 → 117, phòng ngủ dài > 2 lần ngang 3 → 0, cạnh < 2,5 m 19 → 3. Còn lại chủ yếu: WC ~1,0 m ngang trên lô hẹp / tầng chật, tum lô ≤ 5 m vượt 30% (riêng khối cầu thang đã ~27%) — app cảnh báo thay vì ép bản vẽ.

### 13.10. Đồng bộ đám mây (Firebase)
- Tùy chọn, **local-first**: localStorage và file JSON vẫn là nơi lưu chính; Firebase là lớp đồng bộ thêm. Không cấu hình thì app chạy như cũ, hoàn toàn offline.
- Cấu hình: dán `firebaseConfig` (chấp nhận cả đoạn JS copy từ Firebase Console) trong hộp thoại "☁️ Đồng bộ đám mây"; lưu ở localStorage `duToanFirebaseConfig` (hoặc gắn cứng vào hằng `FIREBASE_CONFIG` trong file HTML).
- Đăng nhập: **Google** (popup, tự chuyển sang redirect nếu bị chặn) hoặc **ẩn danh**. Phải chạy qua `http://localhost` hoặc Firebase Hosting (không chạy trên `file://`); domain phải có trong *Authorized domains*.
- Dữ liệu Firestore: `users/{uid}/plans/{planId}` = `{json, name, updatedAt, deleted, device, savedAt}` (xóa = tombstone `deleted:true`), `users/{uid}/meta/library` = `{json}`. Quy tắc bảo mật trong `firestore.rules` (chỉ chủ tài khoản đọc/ghi).
- Lần đầu đăng nhập: gộp dữ liệu máy và đám mây theo `updatedAt` (bản mới hơn thắng), không mất phương án ở bên nào. Sau đó: tự đẩy thay đổi sau ~1,2 giây, nhận thay đổi từ máy khác theo thời gian thực, bộ nhớ đệm offline của Firestore, tự gửi lại khi có mạng.
- Chỉ báo trạng thái trên thanh đầu trang (Đăng nhập / Đang đồng bộ / Đã đồng bộ hh:mm / Ngoại tuyến / Lỗi).
- `firebase.json` kèm sẵn: Hosting (phục vụ thư mục, mọi đường dẫn về `du-toan-xay-nha.html`), rules, emulator Auth `9199` / Firestore `8180` (nút "🧪 Dùng Emulator" chỉ hiện khi chạy ở localhost).
- **Dự án thật:** Firebase `xaynhabaonhieu` (tài khoản chủ: hungthanhnguyen28@gmail.com), Hosting `https://xaynhabaonhieu.web.app`, Firestore `(default)` ở `asia-southeast1`, đăng nhập Google + ẩn danh bật qua mục `auth.providers` trong `firebase.json`. Cấu hình web app gắn sẵn trong hằng `FIREBASE_CONFIG`; cấu hình dán trong hộp thoại (localStorage) được ưu tiên hơn (VD Emulator).
- Không tải Firebase SDK lúc mở trang, trừ khi máy đã từng đăng nhập (localStorage `duToanCloudUsed = '1'`, xóa khi đăng xuất) hoặc có cấu hình riêng; người dùng mới chỉ tải SDK khi bấm "☁️ Đồng bộ".
- Deploy: `firebase deploy --only hosting,auth,firestore:rules`. Không đưa lên Hosting: `du-toan-xay-nha-data*.json`, `backup/`, `*.md`, `firebase.json`, `firestore.rules`, file ẩn.

### 13.10b. Tên & SEO (bản 10)
- Tên app: **Xây Nhà Bao Nhiêu** (khớp kiểu tìm kiếm "xây nhà … hết bao nhiêu tiền"). Tiêu đề trang, thanh đầu, báo cáo in, hộp chào mừng dùng tên mới; tên file tải về giữ `du-toan-xay-nha-*.json` để tương thích.
- `<head>`: title, meta description/keywords, canonical, theme-color sáng/tối, Open Graph + Twitter card (`icons/og-image.png` 1200×630), JSON-LD `WebApplication`.
- `manifest.webmanifest` (cài lên màn hình chính), `icons/` (favicon.svg, 192, 512, maskable 512, apple-touch 180), `robots.txt`, `sitemap.xml`.
- `#app` chứa sẵn đoạn giới thiệu tĩnh (h1 + tính năng) để Google đọc được khi chưa chạy JS; JS vẽ app sẽ thay thế đoạn này.
- **Trang tĩnh SEO `/xay-nha/`** (bản 11): mục lục lô đất, 23 trang lô (`/xay-nha/5x20` — "Xây nhà 5x20 hết bao nhiêu tiền?", các mẫu vừa lô + bảng so sánh) và 259 trang mẫu (`/xay-nha/5x20-nha-pho-2-tang-1-tum`): chi phí trọn gói (mức thông dụng) + khoảng theo 5 mức hoàn thiện, phương án tự mua vật tư hoàn thiện, cơ cấu chi phí, thông số (kích thước nhà, tầng — tum không tính là tầng, phòng, m² sàn, mật độ, thời gian thi công), mặt đứng + mặt bằng SVG từng tầng kèm danh sách phòng, lý do hợp lô, FAQ (JSON-LD FAQPage), BreadcrumbList, liên kết mẫu khác cùng lô / cùng mẫu lô khác. Mỗi lô làm trang cho 12 mẫu điểm cao nhất + mọi mẫu "2 tầng 1 tum".
- Số liệu xuất bằng chính hàm của app (`buildPlanFromTemplate`, `computePlanStats`, `renderVizSvg`…) qua `tools/seo_export.js`, sinh trang bằng `tools/build_seo_pages.py` (cũng ghi `sitemap.xml`, 284 URL). Hướng dẫn chạy lại: `tools/README.md`.
- Nút "Mở mẫu này" trên trang tĩnh dẫn tới `/?lo=5x20&mau=tum2` → app mở trang Nhà mẫu đúng lô và chi tiết mẫu (`applyDeepLink`, không hiện hộp chào mừng, xóa tham số khỏi URL). Trang chủ có liên kết tới các lô phổ biến và `/xay-nha/`.

### 13.11. Dùng hoàn toàn bằng chạm / bấm
- Nút **−/+** cho mọi con số hay chỉnh (kích thước lô, số tầng, số phòng, diện tích phòng), **chip** cho lựa chọn (lô mẫu, nhu cầu, ngân sách, mức hoàn thiện, kiểu mái, hướng).
- Trên điện thoại (≤760px): **thanh điều hướng dưới** (Nhà · Tổng quan · Mặt bằng · Hạng mục · Thêm; ngoài phương án: Phương án · Nhà mẫu · Ước tính · Cẩm nang · Thêm — Đồng bộ chuyển vào ☰ Thêm), **nút nổi ＋** (thêm dòng / thêm phòng), hộp thoại dạng **bảng trượt từ dưới lên**.
- Màn hình cảm ứng: không tự bật bàn phím khi mở hộp thoại (trừ ô tìm nhanh/nhập tên), vùng chạm ≥ 40px, ẩn gợi ý phím tắt.
- Trình "Ước tính nhanh" chuyển sang nút −/+ và chip (lô mẫu, tiện ích, ngân sách); tạo xong mở thẳng trang Mặt bằng.

### 13.12. Quyết định kỹ thuật
- Giữ **JavaScript thuần trong 1 file HTML** (không chuyển React/Vue): app chạy offline từ 1 file, không cần build, dữ liệu/logic hiện có lớn; thư viện ngoài chỉ tải khi cần (Three.js khi mở 3D, Firebase SDK khi bật đồng bộ).

### 13.13. Cẩm nang xây nhà (cho người lần đầu làm nhà) — bản 8
Trang **🧭 Cẩm nang** mở từ: ô "Cẩm nang xây nhà" ở trang danh sách, thanh dưới (ngoài phương án), tab "Cẩm nang" trong phương án, menu ☰ Thêm, bảng Hạng mục ("khoản hay quên") và tìm nhanh `Ctrl/⌘+K` (nhóm "Cẩm nang": tab, câu hỏi, thuật ngữ). Mở trong một phương án thì tư vấn theo lô đất / số tầng / phòng / hướng / chi phí của phương án đó; việc đã đánh dấu, báo giá, nhật ký lưu **trong phương án** (`plan.guide = {done, diary, quotes}`, chỉ tạo khi có thao tác ghi). Ngoài phương án thì lưu ở localStorage riêng `duToanXayNhaGuide` (kèm tab đang xem, năm sinh, giới tính, số liệu đã nhập ở công cụ tính). Không đổi định dạng `duToanXayNhaData`.

Danh sách tính năng (12 tab):

**Bắt đầu**
1. Tư vấn riêng theo phương án (~20 quy tắc): lô nhỏ / hẹp / sâu cần giếng trời, mật độ xây dựng tối đa theo diện tích lô, số tầng, ≥ 500 m² sàn, giấy phép, người già ở tầng trên, hướng nhà, tuổi & cung mệnh, ngân sách, dự phòng thấp, đơn giá/m² so với mặt bằng, gara, phòng cho thuê, kinh doanh, tum, lỗi ở trang Kiểm tra.
2. Chọn "Bạn đang ở bước nào?" (6 giai đoạn) → gợi ý việc cần làm ngay.
3. Thanh tiến độ lộ trình (số việc đã tick / tổng).
4. 10 nguyên tắc vàng khi lần đầu làm nhà.
5. Lối tắt nhanh: Nhà mẫu theo lô, Ước tính nhanh.

**Lộ trình 12 bước**
6. 12 bước từ xác định nhu cầu → hoàn công: việc cần làm (tick được), giấy tờ, lỗi hay gặp, thời gian, chi phí cho từng bước.
7. Ước tính thời gian từng giai đoạn theo số tầng / loại móng, biểu đồ Gantt.
8. Chọn ngày bắt đầu → lịch theo ngày từng giai đoạn, cảnh báo trùng Tết (2026–2032).
9. Nút đi thẳng tới công cụ liên quan (VD bước 1 → Ước tính nhanh).

**Giấy phép & pháp lý**
10. Trắc nghiệm "Nhà tôi có phải xin phép không?" theo Luật Xây dựng 2025 (hiệu lực 01/7/2026).
11. Danh mục hồ sơ xin phép theo NĐ 217/2026 (nộp UBND xã/phường, ~7 ngày làm việc).
12. Lệ phí, mức phạt khi xây không phép (NĐ 16/2022).
13. Tính độ vươn ban công tối đa theo lộ giới (QCVN 01:2021).
14. Tính mật độ xây dựng tối đa theo diện tích lô (bảng 90…1000 m²), so với phương án.
15. Thủ tục hoàn công & cập nhật nhà vào sổ (Điều 148 Luật Đất đai 2024).

**Chi phí**
16. Cơ cấu chi phí nhà phố (móng, thô, hoàn thiện, MEP, nội thất, thiết kế, phép…).
17. Chọn rủi ro (nhà cũ, đất yếu, hẻm nhỏ, mùa mưa…) → mức dự phòng nên để, so với dự phòng hiện tại.
18. Tính diện tích quy đổi (móng, tầng, sân thượng, mái) × đơn giá → chi phí trọn gói.
19. Đơn giá tham khảo 2026 theo mức hoàn thiện.
20. Dò 18 khoản người mới hay quên (điện nước tạm, ép cọc thử, chống thấm, cổng, rèm, máy nước nóng, lễ, hoàn công…), báo khoản nào đã có trong dự toán.
21. Nút "＋ Thêm vào dự toán" cho từng khoản còn thiếu.

**Nhà thầu & hợp đồng**
22. Checklist chọn nhà thầu.
23. Câu hỏi nên hỏi nhà thầu.
24. Các điều khoản bắt buộc phải có trong hợp đồng.
25. Bảng so sánh báo giá nhiều nhà thầu (giá, số ngày, bảo hành, ghi chú), tô sáng giá thấp nhất.
26. Tiến độ thanh toán mẫu theo giai đoạn (15/20/10/…/5% giữ lại bảo hành) và nút áp dụng vào trang Tài chính.
27. Lưu ý giữ lại bảo hành ≥ 5% trong 12 tháng (NĐ 207/2026).

**Giám sát công trường**
28. 11 checklist nghiệm thu theo giai đoạn (định vị, móng, cốt thép, đổ bê tông, xây tường, điện nước âm, chống thấm, trát, ốp lát, sơn, điện nước hoàn thiện).
29. Bảng thời gian tháo cốp pha (TCVN 4453).
30. Thời gian bảo dưỡng bê tông, mùa mưa và mùa nên xây theo vùng Bắc / Trung / Nam.
31. Cách kiểm tra vật liệu nhận về (thép, xi măng, gạch, cát, đá, ống…).
32. Nhật ký công trình theo ngày (thêm / xóa).

**Công cụ tính**
33. Cầu thang: số bậc, chiều cao / mặt bậc theo 2h + b, độ dốc, kích thước ô thang, đếm bậc "Sinh".
34. Bồn nước theo số người.
35. Bể tự hoại theo số phòng ngủ (Bảng K-2).
36. Điện: tổng công suất, CB tổng, tiết diện dây.
37. Máy lạnh BTU cho từng phòng của phương án (+20% tầng mái, +10% hướng Tây).
38. Đèn: lux theo TCVN 7114 → lumen cần cho từng phòng.
39. Gạch ốp lát: số thùng theo khổ gạch, hao hụt.
40. Sơn: số lít / thùng theo diện tích tường, số lớp.
41. Vật liệu thô ước tính (xi măng, cát, đá, thép, gạch) theo m² sàn.

**Kích thước chuẩn**
42. 9 nhóm kích thước (cửa, cầu thang, bếp, WC, phòng ngủ, gara, ban công, trần, lối đi).
43. Bảng diện tích chuẩn theo TCVN 13967:2024, đối chiếu phòng của phương án.
44. Ưu / nhược 8 hướng nhà và gợi ý chống nắng, thông gió theo khí hậu.

**Tuổi & phong thủy**
45. Nhập năm sinh → can chi, mệnh nạp âm, màu hợp / kỵ.
46. Cung phi (kua) theo giới tính; 4 hướng tốt / 4 hướng xấu, tô hướng của phương án.
47. Kiểm tra Kim Lâu, Hoang Ốc, Tam Tai cho năm định xây (tùy chọn sinh trước Tết).
48. Bảng 6 năm tới tốt / xấu, gợi ý tuổi mượn đứng ra động thổ.
49. Mẹo bố trí bếp, bàn thờ, cầu thang, WC, phòng ngủ, cửa chính.

**Lễ & mùa xây**
50. Lễ động thổ, đổ mái (cất nóc), nhập trạch: chuẩn bị gì, các bước.
51. Mùa xây tốt / nên tránh theo vùng.

**Bàn giao & sau khi ở**
52. Checklist nghiệm thu bàn giao (11 mục).
53. Hồ sơ pháp lý cần nhận khi bàn giao.
54. Bảo hành ≥ 24 tháng (Luật Nhà ở 2023), lịch bảo trì định kỳ.

**Học nhanh**
55. Ô tìm kiếm chung cho câu hỏi, thuật ngữ, lỗi hay gặp.
56. ~16 câu hỏi thường gặp (FAQ).
57. ~57 thuật ngữ xây dựng giải thích dễ hiểu.
58. 20 sai lầm phổ biến khi xây nhà lần đầu.

Mọi số liệu là **tham khảo** (ghi rõ ở cuối trang); quy định có thể khác theo địa phương — kiểm tra với UBND xã/phường và kỹ sư.

### 13.14. Cẩm nang phần 2 — 20 tính năng mới + cải thiện tính năng cũ (bản 9)

Thêm 2 tab (**🤔 Nên chọn gì?**, **📒 Sổ công trình**), tổng 14 tab. Dữ liệu mới nằm trong `plan.guide` (tùy chọn, tương thích ngược): `changes[]`, `snags[]`, `contacts[]`; nhật ký thêm `w` (thời tiết), `n` (số thợ), `m` (tiền chi). Kế hoạch tài chính thêm `finance.otherDebt`.

**20 tính năng mới**
1. **🗓 Việc cần làm tuần này** (đầu tab Bắt đầu + thẻ ở Tổng quan): giai đoạn hiện tại theo lịch, Tết sắp tới, đợt thanh toán quá hạn / sắp đến hạn, lỗi chưa sửa, phát sinh chờ duyệt, nhắc ghi nhật ký, việc tiếp theo của lộ trình.
2. **🎯 Có X tiền xây được nhà thế nào?** — trừ 15% dự phòng + chi phí khác, ra số m² sàn theo mức hoàn thiện; bảng 1–5 tầng trên lô (mật độ QCVN 01:2021); nút lọc nhà mẫu theo ngân sách.
3. **🎚 Chọn cấp vật tư hoàn thiện** — 8 hạng mục × 3 mức (phổ thông / khá / cao cấp), ví dụ cụ thể, đánh dấu "khó thay sau" để biết nên chi vào đâu.
4. **📈 Dòng tiền theo tháng** (trang Tài chính) — cột theo tháng, tháng cần nhiều tiền nhất, tháng tiền tự có dùng hết; nút tự điền ngày các đợt theo lịch thi công.
5. **🧮 Vay được tối đa bao nhiêu?** — 40% thu nhập trừ nợ khác, hạn mức vay theo lãi / thời hạn, thử lãi +3% khi hết ưu đãi (tham khảo lãi 8/2026).
6. **📒 Nhật ký công trình nâng cấp** — ngày, thời tiết, số thợ, tiền chi; thống kê ngày mưa, tổng công, tổng chi.
7. **➕ Sổ phát sinh** — nội dung, ± số tiền, nguyên nhân, trạng thái chờ duyệt / đã duyệt / từ chối; so với dự phòng; nút "Đưa vào dự toán".
8. **🛠 Danh sách lỗi cần sửa** — mức độ, vị trí (gợi ý tên phòng), trạng thái, ngày sửa xong; cảnh báo chưa trả đợt cuối khi còn lỗi.
9. **📇 Danh bạ công trình** — vai trò, số điện thoại, bấm gọi.
10. **📝 Mẫu văn bản tự điền** — biên bản hiện trạng nhà liền kề, thư thông báo hàng xóm, nghiệm thu giai đoạn, phụ lục phát sinh, bàn giao & giữ 5% bảo hành; sao chép / tải .txt / in.
11. **⬇ Xuất Sổ công trình ra Excel (CSV)**.
12. **🏅 Chấm điểm nhà thầu** — giá, bảo hành, tiến độ tự chấm; kinh nghiệm, độ rõ báo giá, uy tín tự chọn 1–5; chọn nhà thầu → dùng làm giá trị hợp đồng.
13. **🏗 Chọn loại móng** — số tầng, nền đất, sát nhà cũ, tầng hầm → gợi ý móng đơn / băng / cọc / bè kèm lý do, chi phí, cảnh báo; áp dụng vào phương án.
14. **🤝 Trọn gói hay tự quản?** — 4 câu hỏi → cách thuê thầu phù hợp, bảng so sánh, áp dụng cách tính chi phí.
15. **🏠 Chọn kiểu mái** — mái bằng, Thái, Nhật, kèo thép ngói, tôn: chi phí quy đổi, chống nóng, chống thấm, tuổi thọ.
16. **⚖️ So sánh vật liệu** — gạch xây, cửa, sàn, chống thấm, bồn nước, ống nước, sơn, chống nóng mái (giá, ưu, nhược, nên dùng cho).
17. **🪨 Tính bê tông** — sàn, dầm, cột, móng, bản thang; M200/250/300 → m³, xe bồn, xi măng, cát, đá, nước.
18. **🧱 Tính tường gạch** — gạch ống / thẻ / block / AAC, tường 10/20, trừ cửa → số viên, vữa, trát, xi măng, cát.
19. **🔩 Quy đổi thép** (kg/m = d²/162, cây 11,7 m) + **☀️ Điện mặt trời áp mái** (kWp, số tấm, diện tích mái, hoàn vốn, có/không pin).
20. **🪟 Cửa sổ đủ sáng cho từng phòng** (dò trên mặt bằng tự xếp: phòng kín, kính ≥ 1/8 sàn) + **✅ Checklist duyệt bản vẽ** (15 điểm) + **🦺 An toàn công trường** (8 điểm).

**Cải thiện tính năng cũ**
- Tìm kiếm ở tab Hỏi đáp tìm cả trong lộ trình, giám sát, kích thước chuẩn, vật liệu, điều khoản hợp đồng, bàn giao, khoản hay quên — có nút "Mở" tới đúng chỗ.
- Thanh công cụ: "⊞ Mở hết / ⊟ Thu gọn" mọi mục, "🖨 In"; huy hiệu trên tab (% lộ trình, số lỗi chưa sửa).
- Lịch Gantt có vạch "hôm nay" và đánh dấu giai đoạn đang làm.
- "Dùng lịch thanh toán cho Tài chính" tự điền luôn ngày dự kiến theo lịch thi công.
- Dự phòng: nút "Áp dụng X% vào phương án"; Khoản hay quên: nút "Thêm cả N khoản còn thiếu".
- So sánh báo giá hiện thêm đ/m² sàn; lịch thanh toán lấy giá nhà thầu đã chọn.
- Tuổi & hướng: bấm hướng để đặt hướng nhà của phương án.
- Ô số trong Cẩm nang hiểu cách gõ tiền "2 tỷ", "15tr"; ô số tiền hiển thị có dấu chấm ngăn cách; ô chữ không vẽ lại khi đang gõ (gõ Telex mượt).
- Trang Kiểm tra thêm cảnh báo: khoản hay quên, phát sinh vượt dự phòng, đợt thanh toán quá hạn, lỗi nặng chưa sửa (bấm "Đi tới" mở đúng mục Cẩm nang).
- Báo cáo in có phần "📒 Hồ sơ công trình": nhà thầu đã chọn, phát sinh đã duyệt, lỗi chưa sửa, nhật ký gần đây.
- Tìm nhanh `Ctrl/⌘+K` có thêm 12 công cụ và 5 mục Sổ công trình.

## 14. Lịch sử thay đổi

- **2026-10-24** — Thiết kế lại UX/UI toàn bộ: màn hình chào + wizard ước tính nhanh, nhập liệu thông minh, hoàn tác/làm lại, tìm nhanh `Ctrl/⌘+K`, lọc/sắp xếp/thao tác hàng loạt, chế độ Cơ bản/Nâng cao, giao diện sáng/tối, cỡ chữ lớn, trang Kiểm tra dự toán, Tài chính & tiến độ thanh toán, So sánh phương án, Báo cáo/In PDF, Xuất CSV, sao lưu tự động trong trình duyệt, ngân sách & dự phòng, bố cục dạng thẻ trên điện thoại. Bản gốc trước khi sửa được giữ trong thư mục `backup/`.
- **2026-10-24 (bản 2)** — Thêm 12 nhà mẫu theo lô đất, trang Mặt bằng 2D & phối cảnh 3D, đồng bộ Firebase (Google/ẩn danh, realtime, offline), thao tác hoàn toàn bằng chạm (nút −/+, chip, thanh điều hướng dưới, bảng trượt), ảnh mặt đứng trên thẻ phương án, cảnh báo mật độ xây dựng. Thêm `firebase.json`, `firestore.rules`. Bản trước khi sửa trong `backup/`.
- **2026-10-24 (bản 3)** — Thêm 15 nhà mẫu cho lô ngang rộng (7×23…), nhà chữ L / chữ U, nhà thông thoáng (tổng 27 mẫu); lọc theo kiểu dáng, nhu cầu "Thông thoáng"; hỗ trợ hình khối chữ L/U và vị trí nhà sát trái/giữa/phải trong 2D/3D; thêm chip lô 6×25, 7×23, 7×25, 8×25, 9×25, 10×30. Bản trước khi sửa: `backup/du-toan-xay-nha.before-Lshape-073550.html`.
- **2026-10-24 (bản 4)** — Rà soát toàn bộ nhà mẫu như kiến trúc sư: sửa nhận diện loại phòng theo tên, bộ chia phòng tính cửa sổ, gara sâu 5,4 m, giếng trời thẳng hàng sau cầu thang, tum không còn dải trống, sắp lại thứ tự phòng ở nhiều mẫu, thu hẹp khoảng lô hợp lệ (nhà có gara, nhà 2 thế hệ, nhà lệch hông) — số lỗi kích thước/công năng trên 6 lô thường gặp giảm từ 511 xuống ~30 (còn lại chủ yếu thiếu vài chục cm). Thêm 8 mẫu "2 tầng 1 tum" (tổng 35 mẫu), chip lọc "2 tầng 1 tum", chip lô 5×22, 5×23, 6×15. Bản trước khi sửa: `backup/du-toan-xay-nha.before-review-075301.html`.
- **2026-10-24 (bản 6)** — Sửa phòng ngủ dài / hẹp (VD 2,6 × 8,5 m): giới hạn cứng phòng ngủ dài ≤ 1,8 lần ngang, cạnh ≥ 2,5 m khi chọn kích thước; nút "🔧 Nắn vuông vắn" ở Mặt bằng + Kiểm tra; bộ chia phòng ưu tiên phòng ngủ vuông vắn (chèn hành lang / không gian chung cạnh phòng, phòng sau ban công có cửa sổ); loại / trừ điểm nhà mẫu có phòng ngủ méo. Trên các lô 4×15 … 7×23 không còn phòng ngủ nào dài quá 2 lần ngang (trước: 38 trường hợp), phòng ngủ méo / hẹp giảm từ 265 xuống 63. Bản trước khi sửa: `backup/du-toan-xay-nha.before-bedshape-122433.html`.
- **2026-10-24 (bản 5)** — Phòng chọn được **kích thước ngang × dài** bằng nút −/+ / kích thước chuẩn / xoay / hết ngang nhà (không chỉ diện tích); bản vẽ 2D/3D đặt đúng kích thước đã chọn, vẽ ô "Còn trống" khi thừa chỗ, cảnh báo ⚠ khi tầng không đủ chỗ; hiện chỗ còn trống/vượt của từng tầng kèm nút lấp/thu 1 chạm; góp ý cạnh phòng quá hẹp/quá dài; ghim vị trí phòng cạnh cầu thang / khu chính; tạo phương án từ nhà mẫu tự ghi sẵn kích thước; thêm phòng bằng lưới chạm (tự đánh số tên). Sửa ô diện tích bị co mất trên điện thoại, cột tên phòng bị cắt chữ. Bản trước khi sửa: `backup/du-toan-xay-nha.before-dims-083354.html`.
- **2026-10-24 (bản 7)** — Rà soát mọi kích thước / diện tích phòng theo công năng và **TCVN 13967:2024** (xem 13.9.2): bảng chuẩn `ROOM_STD`, dòng chuẩn trong bảng chi tiết phòng, cảnh báo phòng dưới chuẩn / quá rộng và tum > 30% sàn mái trong Kiểm tra dự toán, loại / trừ điểm nhà mẫu dưới chuẩn; trần diện tích cho phòng chia tỉ lệ + phòng đi kèm (thay đồ, tủ đồ, đa năng); tum = 30%; ban công theo bề ngang nhà; kích thước gợi ý WC ≥ 3 m², bếp ≥ 12 m², lối đi ≥ 1,0 m; bộ chia phòng sửa WC / giặt / thang máy hẹp dài, cân bằng trước / sau cầu thang, ban công hết mặt tiền. Bản trước khi sửa: `backup/du-toan-xay-nha.before-std-124708.html`.
- **2026-10-24 (bản 8)** — Thêm trang **🧭 Cẩm nang xây nhà** cho người lần đầu làm nhà (13.13): 12 tab, 58 tính năng — tư vấn riêng theo phương án, lộ trình 12 bước có checklist + Gantt + lịch theo ngày, trắc nghiệm giấy phép (Luật Xây dựng 2025, NĐ 217/2026), ban công / mật độ, chi phí & dự phòng & khoản hay quên (thêm thẳng vào dự toán), chọn nhà thầu + so sánh báo giá + tiến độ thanh toán áp vào Tài chính, checklist giám sát từng giai đoạn + nhật ký công trình, 9 công cụ tính (cầu thang, bồn nước, bể tự hoại, điện, máy lạnh, đèn, gạch, sơn, vật liệu thô), kích thước chuẩn, tuổi làm nhà (Kim Lâu / Hoang Ốc / Tam Tai, cung phi, hướng tốt), lễ động thổ / cất nóc / nhập trạch, bàn giao & bảo hành, FAQ + thuật ngữ + sai lầm phổ biến có tìm kiếm. Bản trước khi sửa: `backup/du-toan-xay-nha.before-guide-151630.html`.
- **2026-10-24 (bản 9)** — Cẩm nang phần 2 (13.14): thêm tab **Nên chọn gì?** (móng, cách thuê thầu, mái, vật liệu) và **Sổ công trình** (nhật ký, phát sinh, lỗi cần sửa, danh bạ, 5 mẫu văn bản, xuất CSV); việc cần làm tuần này, ngân sách → nhà vừa túi tiền, chọn cấp vật tư, dòng tiền theo tháng + hạn mức vay ở Tài chính, chấm điểm nhà thầu, 4 công cụ tính mới (bê tông, tường gạch, thép, điện mặt trời), kiểm tra cửa sổ từng phòng, checklist duyệt bản vẽ và an toàn; cải thiện tìm kiếm, Gantt, dự phòng, báo giá, Kiểm tra, Báo cáo, Tìm nhanh. Nguồn tham khảo thêm: lãi vay 8/2026 (nhadautu.vn, LuatVietnam), giá điện mặt trời & dự thảo hỗ trợ (Tạp chí Công Thương, Thesaigontimes), định mức xây gạch AE.64200, giá bê tông tươi (Sở Xây dựng Hà Nam). Bản trước khi sửa: `backup/du-toan-xay-nha.before-guide2-164404.html`.
- **2026-10-24 (bản 10)** — Đổi tên thành **Xây Nhà Bao Nhiêu**; thêm SEO (meta, Open Graph, JSON-LD, manifest, icon, robots, sitemap, đoạn giới thiệu tĩnh); tạo dự án Firebase `xaynhabaonhieu`, gắn cấu hình sẵn, bật đăng nhập Google/ẩn danh, Firestore ở Singapore, deploy lên https://xaynhabaonhieu.web.app. Firebase SDK chỉ tải khi cần. Bản trước khi sửa trong `backup/du-toan-xay-nha.before-rename-*.html`.
- **2026-10-25 (bản 11)** — Trang tĩnh SEO `/xay-nha/…`: 1 mục lục + 23 trang lô + 259 trang mẫu nhà (chi phí, mặt bằng, FAQ), sitemap 284 URL; liên kết sâu `?lo=&mau=` mở đúng mẫu trong app; công cụ sinh trang trong `tools/`. Bản trước khi sửa: `backup/du-toan-xay-nha.before-seo-pages-*.html`.
- **2026-10-27 (bản 12)** — Mặt bằng nhà mẫu ở được (skill `thiet-ke-nha`): lõi kỹ thuật giếng trời + trục WC chồng thẳng, "xương sống" hành lang để mọi phòng có lối vào, `planLivability` loại mẫu không ở được trên lô; công cụ chấm `tools/layout-audit.js`.
- **2026-10-27 (bản 13)** — Mặt bằng 2D dễ dùng (skill `mat-bang-2d`, 13.9): bảng phòng không che bản vẽ thay cho hộp thoại, tay nắm ↔ ↕ kéo trên bản vẽ, giữ-kéo đổi chỗ / chuyển tầng, ▲ ▼ trước / sau, khoảng đặt được thử trước, báo phòng khác đổi theo + lỗi ở được mới, cảnh báo lệch có lý do và cách sửa đã thử, ô tự vẽ giải thích được + thêm phòng vào ô trống, nhãn kích thước thống nhất, phím tắt, nhấn giữ −/+. Sửa lỗi phương án tạo từ nhà mẫu vẽ khác bản xem trước và hay mất "ở được" (212/251 mẫu): bỏ tự ghim khu + nắn khi ghi kích thước, ghi xong kiểm lại, chốt vị trí cầu thang, chia chiều sâu tôn trọng phòng đã chốt.
