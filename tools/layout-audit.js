// Kiểm tra mặt bằng nhà mẫu theo skill thiet-ke-nha.
// Cách 1 (giao diện): mở xaynhabaonhieu (bản live hoặc local), mở chi tiết 1 nhà mẫu (hộp thoại
// "Mặt bằng sơ bộ từng tầng"), rồi chạy toàn bộ file này trong trang (javascript_tool).
// Cách 2 (hàng loạt): nạp file này vào trang rồi gọi window.auditFloors(floors) với
// floors = [{title, tum, rooms:[{name, type?, x, y, w, h}]}], y lớn = mặt tiền (xem tools/layout-audit.html).
// Kết quả: {house, floors, fail:[...], warn:[...], ok} — FAIL là nhà không ở được / sai quy chuẩn.
(function(){
  var E = 0.05;                 // sai số toạ độ (m)
  var DOOR = 0.7;               // cạnh chung tối thiểu để đặt được cửa (WC 0,7 m; phòng 0,8 m)

  // Phòng nhỏ chỉ vẽ biểu tượng (ROOM_TYPE_META.icon) thay cho tên
  var ICON = {'🛋️':'living', '🛋':'living', '🛏️':'bedroom', '🛏':'bedroom', '🍳':'kitchen', '🚿':'wc', '🕯️':'altar', '💻':'office', '🪜':'stairs', '🛗':'elevator', '🧺':'laundry', '🌤️':'balcony', '🌤':'lightwell', '☀️':'rooftop', '🚗':'garage', '🏪':'shop', '🔑':'rental', '↔️':'corridor', '↔':'corridor'};
  function typeOf(n){
    n = String(n || '').trim();
    if(ICON[n]) return ICON[n];
    n = n.toLowerCase();
    if(/cầu thang/.test(n)) return 'stairs';
    if(/thang máy/.test(n)) return 'elevator';
    if(/giếng trời|thông tầng/.test(n)) return 'lightwell';
    if(/^🚿|wc|vệ sinh|tắm/.test(n)) return 'wc';
    if(/giặt|phơi/.test(n)) return 'laundry';
    if(/phòng ngủ|ngủ /.test(n)) return 'bedroom';
    if(/bếp/.test(n)) return 'kitchen';
    if(/khách|sinh hoạt|giải trí/.test(n)) return 'living';
    if(/thờ/.test(n)) return 'altar';
    if(/ban công|lô gia|logia|hiên/.test(n)) return 'balcony';
    if(/sân thượng|mái/.test(n)) return 'rooftop';
    if(/gara|để xe|ô tô/.test(n)) return 'garage';
    if(/kinh doanh|cửa hàng|shop/.test(n)) return 'shop';
    if(/cho thuê|phòng trọ/.test(n)) return 'rental';
    if(/làm việc|học|văn phòng/.test(n)) return 'office';
    if(/^↔|hành lang|lối đi|sảnh|không gian chung/.test(n)) return 'corridor';
    if(/kho|tủ đồ|thay đồ/.test(n)) return 'storage';
    return 'other';
  }
  // Không gian đi xuyên qua được (giao thông + phòng chung). Phòng ngủ, WC, thờ, kho thì KHÔNG.
  var PASS = {stairs:1, corridor:1, living:1, kitchen:1, garage:1, shop:1, elevator:1};

  function floorTitle(svg){
    var el = svg;
    for(var k = 0; k < 6 && el; k++){
      el = el.parentElement;
      var t = el && el.innerText || '';
      if(/m²/.test(t) && t.length < 600) return t.split('\n')[0].trim();
    }
    return '?';
  }
  function readDom(){
  var root = document.querySelector('[role=dialog]') || document.body;
  var svgs = [].slice.call(root.querySelectorAll('svg')).filter(function(s){
    var txt = s.textContent || '';
    return /Mặt tiền/.test(txt) && !/ĐƯỜNG|HẺM/.test(txt);
  });
  return svgs.map(function(svg, i){
    var seen = {}, rooms = [];
    [].slice.call(svg.querySelectorAll('g')).forEach(function(g){
      var r = g.querySelector(':scope > rect') || g.querySelector('rect');
      var t = g.querySelector('text');
      if(!r || !t) return;
      var x = +r.getAttribute('x'), y = +r.getAttribute('y'), w = +r.getAttribute('width'), h = +r.getAttribute('height');
      if(!(w > 0 && h > 0)) return;
      var name = t.textContent.trim(), key = [x, y, w, h].map(function(v){ return v.toFixed(2); }).join(',');
      if(seen[key]) return;
      seen[key] = 1;
      rooms.push({name:name, type:typeOf(name), x:x, y:y, w:w, h:h, a:w * h});
    });
    var title = floorTitle(svg);
    return {idx:i, title:title, tum:/tum|mái/i.test(title), rooms:rooms};
  });
  }

  function auditFloors(floors){
  floors.forEach(function(f, i){
    f.idx = i;
    f.title = f.title || ('Tầng ' + (i + 1));
    f.rooms.forEach(function(r){ r.type = r.type || typeOf(r.name); r.a = r.w * r.h; });
  });
  var fail = [], warn = [];
  function F(f, msg){ fail.push((f ? f.title.split('·')[0].trim() + ': ' : '') + msg); }
  function W(f, msg){ warn.push((f ? f.title.split('·')[0].trim() + ': ' : '') + msg); }
  function ov(a, b){ return Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x)) * Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y)); }
  function edge(a, b){
    var s = 0;
    if(Math.abs(a.x + a.w - b.x) < E || Math.abs(b.x + b.w - a.x) < E) s = Math.max(s, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));
    if(Math.abs(a.y + a.h - b.y) < E || Math.abs(b.y + b.h - a.y) < E) s = Math.max(s, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
    return Math.max(0, s);
  }
  function short(r){ return Math.min(r.w, r.h); }
  function long(r){ return Math.max(r.w, r.h); }
  function f1(v){ return (Math.round(v * 10) / 10).toString().replace('.', ','); }

  if(!floors.length) return {error:'Không tìm thấy mặt bằng — hãy mở hộp thoại chi tiết 1 nhà mẫu trước.'};
  var all = floors.reduce(function(a, f){ return a.concat(f.rooms); }, []);
  var X0 = Math.min.apply(null, all.map(function(r){ return r.x; })), X1 = Math.max.apply(null, all.map(function(r){ return r.x + r.w; }));
  var Y0 = Math.min.apply(null, all.map(function(r){ return r.y; })), Y1 = Math.max.apply(null, all.map(function(r){ return r.y + r.h; }));
  var bw = X1 - X0, bl = Y1 - Y0;
  // Mặt tiền = y lớn nhất (▼ Mặt tiền vẽ ở dưới), mặt sau = y nhỏ nhất. Hai hông là tường giáp ranh: không mở cửa sổ (TCVN 9411 6.4.3.1).
  // Cạnh phòng là tường ngoài khi không phòng nào khác áp vào (đo phần hở ≥ 0,8 m). Cạnh ngang (mặt tiền,
  // mặt sau, nhìn ra sân trong) mở được; cạnh dọc chỉ mở được khi cách ranh đất ≥ 1 m (cần f.lotW).
  function ext(r, f){
    function freeLen(a0, a1, cover){
      var segs = cover.map(function(c){ return [Math.max(a0, c[0]), Math.min(a1, c[1])]; }).filter(function(c){ return c[1] > c[0] + 0.01; }).sort(function(p, q){ return p[0] - q[0]; });
      var best = 0, at = a0;
      segs.forEach(function(c){ best = Math.max(best, c[0] - at); at = Math.max(at, c[1]); });
      return Math.max(best, a1 - at);
    }
    var others = f.rooms.filter(function(q){ return q !== r; });
    var hz = [r.y, r.y + r.h].some(function(yy){
      return freeLen(r.x, r.x + r.w, others.filter(function(q){ return Math.abs(q.y - yy) < E || Math.abs(q.y + q.h - yy) < E; }).map(function(q){ return [q.x, q.x + q.w]; })) >= 0.8;
    });
    if(hz) return true;
    if(!f.lotW) return false;
    return [r.x, r.x + r.w].some(function(xx){
      if(Math.min(xx, f.lotW - xx) < 0.95) return false;
      return freeLen(r.y, r.y + r.h, others.filter(function(q){ return Math.abs(q.x - xx) < E || Math.abs(q.x + q.w - xx) < E; }).map(function(q){ return [q.y, q.y + q.h]; })) >= 0.8;
    });
  }
  function airy(r, f){
    return ext(r, f) || f.rooms.some(function(q){ return q !== r && (q.type === 'lightwell' || q.type === 'balcony' || q.type === 'rooftop') && edge(r, q) >= 0.8; });
  }

  floors.forEach(function(f){
    var R = f.rooms;
    // 1. Chồng lấn
    for(var i = 0; i < R.length; i++) for(var j = i + 1; j < R.length; j++){
      var o = ov(R[i], R[j]);
      if(o > 0.05) F(f, 'Chồng lấn: "' + R[i].name + '" đè "' + R[j].name + '" ' + f1(o) + ' m²');
    }
    // 2. Kích thước tối thiểu (TCVN 13967:2024 Bảng 1 + kích thước đồ đạc)
    R.forEach(function(r){
      var s = short(r), L = long(r), ratio = L / Math.max(s, 0.01), n = r.name;
      if(r.type === 'bedroom'){
        var dbl = /master|đôi|bố mẹ|ông bà|vợ chồng/i.test(n);
        if(r.a < (dbl ? 12 : 9) - 0.05) F(f, '"' + n + '" ' + f1(r.a) + ' m² < ' + (dbl ? 12 : 9) + ' m² (TCVN 13967 Bảng 1)');
        if(s < 2.4) F(f, '"' + n + '" cạnh ngắn ' + f1(s) + ' m — không kê nổi giường + lối đi (cần ≥ 2,7 m)');
        else if(s < 2.7) W(f, '"' + n + '" cạnh ngắn ' + f1(s) + ' m — nên ≥ 2,7 m (giường 1,6 m + lối 2 bên)');
        if(ratio > 1.8) W(f, '"' + n + '" dài hẹp ' + f1(L) + '×' + f1(s) + ' (tỉ lệ ' + f1(ratio) + ' > 1,8)');
      }
      if(r.type === 'living' && /khách/i.test(n) && (r.a < 13 - 0.05 || s < 3)) F(f, '"' + n + '" ' + f1(r.a) + ' m², cạnh ' + f1(s) + ' m — cần ≥ 13 m² và cạnh ≥ 3 m');
      if(r.type === 'kitchen' && /ăn/i.test(n) && r.a < 12 - 0.05) F(f, '"' + n + '" ' + f1(r.a) + ' m² < 12 m² (TCVN 13967 Bảng 1)');
      if(r.type === 'kitchen' && s < 2.1) F(f, '"' + n + '" rộng ' + f1(s) + ' m — bếp + lối đi cần ≥ 2,1 m');
      if(r.type === 'wc'){
        if(r.a < 3 - 0.05) F(f, '"' + n + '" ' + f1(r.a) + ' m² < 3 m² (TCVN 13967 Bảng 1)');
        if(s < 1.1) F(f, '"' + n + '" rộng ' + f1(s) + ' m — không đặt được bồn cầu + cửa (cần ≥ 1,2 m)');
        if(ratio > 2.4) W(f, '"' + n + '" thành ống dài ' + f1(L) + '×' + f1(s));
      }
      if(r.type === 'corridor' && s < 0.9 && L > 1.2) F(f, '"' + n + '" rộng ' + f1(s) + ' m < 0,9 m');
      if(r.type === 'lightwell' && s < 1.2) W(f, '"' + n + '" cạnh ngắn ' + f1(s) + ' m — giếng < 1,2 m gần như không xuống sáng');
      if(r.type === 'balcony' && s < 0.6) F(f, '"' + n + '" sâu ' + f1(s) + ' m < 0,6 m (TCVN 13967 Hình A.16)');
      if(r.type === 'garage' && /ô tô/i.test(n) && (s < 2.9 || L < 5.2)) F(f, '"' + n + '" ' + f1(r.w) + '×' + f1(r.h) + ' m — ô tô cần ≥ 2,9 × 5,2 m');
      if(r.type === 'stairs'){
        if(s < 0.9) F(f, 'Cầu thang rộng ' + f1(s) + ' m — vế thang thoát nạn ≥ 0,9 m (TCVN 9411 6.3.5.1)');
        else if(s < 1.9 && L < 4.5) F(f, 'Cầu thang ' + f1(r.w) + '×' + f1(r.h) + ' m: thang 1 vế cần dài ≥ 4,5 m (≈19 bậc × 0,25 m cho tầng 3,6 m), thang chữ U cần rộng ≥ 1,9 m');
      }
      if(NEEDS(r) && !airy(r, f)){
        var msg = '"' + n + '" không chạm mặt tiền / mặt sau / giếng trời / ban công → không có cửa sổ (hông nhà là tường giáp ranh)';
        // phòng ngủ / phòng thuê phải có cửa sổ; SHC, làm việc giữa nhà (lấy sáng qua cầu thang, giếng trời) chỉ cảnh báo
        if(r.type === 'living' || r.type === 'office') W(f, msg + ' — lấy sáng gián tiếp');
        else F(f, msg);
      }
    });
    if(R.some(function(r){ return r.type === 'kitchen'; })){
      var k = R.filter(function(r){ return r.type === 'kitchen'; })[0];
      if(!airy(k, f)) W(f, 'Bếp không chạm mặt sau / giếng trời — thiếu sáng, khó hút mùi');
    }
    // 3. Lối đi: phòng nào cũng phải tới được từ cầu thang (lầu) hoặc cửa chính (trệt) mà không xuyên qua phòng ngủ / WC / giếng trời
    // tầng trệt: hiên / sân trước là lối vào từ đường
    function thru(r){ return PASS[r.type] || (f.idx === 0 && r.type === 'balcony'); }
    var start = R.filter(function(r){ return thru(r) && (f.idx === 0 ? Math.abs(r.y + r.h - Math.max.apply(null, R.map(function(q){ return q.y + q.h; }))) < E || r.type === 'stairs' : r.type === 'stairs'); });
    var reach = start.slice(), q = start.slice();
    while(q.length){
      var cur = q.shift();
      R.forEach(function(r){ if(reach.indexOf(r) < 0 && thru(r) && edge(cur, r) >= 0.8){ reach.push(r); q.push(r); } });
    }
    R.forEach(function(r){
      if(reach.indexOf(r) >= 0 || r.type === 'lightwell' || r.type === 'rooftop') return;
      var via = R.filter(function(p){ return reach.indexOf(p) >= 0 && edge(p, r) >= DOOR; });
      if(via.length) return;
      // ngoại lệ hợp lệ: WC riêng / ban công / tủ đồ đi qua phòng ngủ của nó
      var host = R.filter(function(p){ return (p.type === 'bedroom' || p.type === 'living' || p.type === 'office' || p.type === 'altar' || (r.type === 'storage' && p.type === 'wc')) && edge(p, r) >= DOOR && R.some(function(z){ return reach.indexOf(z) >= 0 && edge(z, p) >= 0.8; }); })[0];
      if(host && (r.type === 'balcony' || r.type === 'storage' || r.type === 'laundry' || (r.type === 'wc' && /master|riêng|ông bà/i.test(r.name)))) return;
      var msg = '"' + r.name + '" không có lối vào — phải đi xuyên ' + (R.filter(function(p){ return edge(p, r) >= DOOR; }).map(function(p){ return '"' + p.name + '"'; }).join(', ') || 'tường');
      // khoảng trống / hành lang thừa không nối lối đi: phí chỗ chứ không làm nhà không ở được
      if(r.type === 'corridor') W(f, msg + ' (khoảng thừa)'); else F(f, msg);
    });
    // 4. WC master phải mở cửa từ phòng master
    R.filter(function(r){ return r.type === 'wc' && /master/i.test(r.name); }).forEach(function(wc){
      var m = R.filter(function(r){ return r.type === 'bedroom' && /master/i.test(r.name); })[0];
      if(m && edge(m, wc) < DOOR) F(f, '"' + wc.name + '" không liền "' + m.name + '" — phải ra ngoài hành lang mới vào được WC riêng');
    });
    // 5. Lấp đầy sàn
    var fx0 = Math.min.apply(null, R.map(function(r){ return r.x; })), fx1 = Math.max.apply(null, R.map(function(r){ return r.x + r.w; }));
    var fy0 = Math.min.apply(null, R.map(function(r){ return r.y; })), fy1 = Math.max.apply(null, R.map(function(r){ return r.y + r.h; }));
    var hole = (fx1 - fx0) * (fy1 - fy0) - R.reduce(function(s, r){ return s + r.a; }, 0);
    if(!f.tum && hole > 1) W(f, 'Còn ' + f1(hole) + ' m² sàn không thuộc phòng nào (lỗ trống / chưa gán)');
  });
  function NEEDS(r){ return r.type === 'bedroom' || r.type === 'living' || r.type === 'office' || r.type === 'rental'; }

  // 6. Theo phương đứng
  for(var i = 1; i < floors.length; i++){
    var lo = floors[i - 1], up = floors[i];
    var sl = lo.rooms.filter(function(r){ return r.type === 'stairs'; })[0], su = up.rooms.filter(function(r){ return r.type === 'stairs'; })[0];
    if(sl && su && ov(sl, su) < Math.min(sl.a, su.a) * 0.9) F(up, 'Cầu thang không chồng thẳng lên cầu thang tầng dưới');
    // giếng trời phải là 1 ống thẳng đứng: tầng trên phải để trống đúng chỗ đó (giếng / sân thượng / mái)
    lo.rooms.filter(function(r){ return r.type === 'lightwell'; }).forEach(function(lw){
      var open = up.rooms.filter(function(r){ return r.type === 'lightwell' || r.type === 'rooftop'; }).reduce(function(s, r){ return s + ov(lw, r); }, 0);
      var covered = up.rooms.filter(function(r){ return r.type !== 'lightwell' && r.type !== 'rooftop'; }).reduce(function(s, r){ return s + ov(lw, r); }, 0);
      if(covered > lw.a * 0.3) F(up, 'Giếng trời tầng dưới bị sàn "' + up.rooms.filter(function(r){ return r.type !== 'lightwell' && r.type !== 'rooftop' && ov(lw, r) > 0.1; }).map(function(r){ return r.name; }).join('", "') + '" bịt ' + Math.round(covered / lw.a * 100) + '% — giếng trời phải thẳng hàng mọi tầng');
      else if(open < lw.a * 0.7 && !up.tum) W(up, 'Giếng trời lệch so với tầng dưới');
    });
    // khu ướt tầng trên không đặt trên bếp / phòng thờ tầng dưới (TCVN 4451 6.11)
    up.rooms.filter(function(r){ return r.type === 'wc' || r.type === 'laundry'; }).forEach(function(w){
      lo.rooms.forEach(function(d){
        var o = ov(w, d);
        if(o < 0.3) return;
        // lô gia / ban công phơi ngoài trời: sàn hở, chống thấm như sân thượng → chỉ cảnh báo
        if(d.type === 'kitchen') (w.type === 'laundry' && /lô gia|ban công|sân phơi/i.test(w.name) ? W : F)(up, '"' + w.name + '" nằm trên "' + d.name + '" ' + f1(o) + ' m² (TCVN 4451:2012 6.11 cấm)');
        if(d.type === 'altar') F(up, '"' + w.name + '" nằm trên "' + d.name + '"');
      });
      var stacked = lo.rooms.some(function(d){ return (d.type === 'wc' || d.type === 'laundry') && ov(w, d) > 0.3; });
      if(!stacked && lo.idx >= 0) W(up, '"' + w.name + '" không chồng lên khu ướt tầng dưới → ống thoát phải đi ngang qua trần phòng khác');
    });
    // phòng thờ: không có phòng ở nào phía trên
    lo.rooms.filter(function(r){ return r.type === 'altar'; }).forEach(function(a){
      var above = up.rooms.filter(function(r){ return r.type !== 'rooftop' && r.type !== 'lightwell' && ov(a, r) > 0.5; });
      if(above.length) W(up, 'Có "' + above[0].name + '" đè lên phòng thờ tầng dưới — thờ nên ở tầng trên cùng');
    });
  }
  // 7. Chương trình tổng thể
  var g0 = floors[0];
  if(g0 && !g0.rooms.some(function(r){ return r.type === 'garage' || /xe/i.test(r.name); }) && !g0.rooms.some(function(r){ return r.type === 'shop'; }))
    W(g0, 'Tầng trệt không có chỗ để xe máy — nhà phố VN gần như bắt buộc (≈ 2 m²/xe, ngay sau cửa chính)');
  if(bl > 18 && !all.some(function(r){ return r.type === 'lightwell'; }))
    F(null, 'Nhà sâu ' + f1(bl) + ' m > 18 m mà không có giếng trời / sân trong (TCVN 9411:2012 5.1.2)');
  if(floors.length > 1 && !floors.every(function(f){ return f.rooms.some(function(r){ return r.type === 'stairs'; }); }))
    F(null, 'Có tầng không có cầu thang');
  var masters = all.filter(function(r){ return r.type === 'bedroom' && /master/i.test(r.name); });
  masters.forEach(function(m){
    var f = floors.filter(function(fl){ return fl.rooms.indexOf(m) >= 0; })[0];
    if(!f.rooms.some(function(r){ return r.type === 'wc' && edge(r, m) >= DOOR; })) W(f, '"' + m.name + '" không có WC riêng liền phòng');
  });

  return {house:{bw:+bw.toFixed(2), bl:+bl.toFixed(2)}, floors:floors.map(function(f){ return f.title + ' — ' + f.rooms.map(function(r){ return r.name + ' ' + f1(r.w) + '×' + f1(r.h); }).join('; '); }),
    fail:fail, warn:warn, ok:!fail.length};
  }

  // Hình học từ planGeometry (y nhỏ = mặt tiền) → dạng auditFloors (y lớn = mặt tiền, giống bản vẽ)
  function floorsFromGeo(geo){
    return geo.floors.map(function(f){
      var rooms = f.rooms.concat(f.openRooms || []).filter(function(r){ return r.w > 0 && r.h > 0; });
      // lotW: để biết tường hông nào cách ranh ≥ 1 m (mở được cửa sổ)
      return {title:f.name, tum:!!f.tum, lotW:geo.lotW, rooms:rooms.map(function(r){
        var t = r.type === 'other' || r.type === 'corridor' ? typeOf(r.name) : r.type;
        if(r.type === 'corridor' && t === 'other') t = 'corridor';
        return {name:r.name, type:t, x:r.x, y:-(r.y + r.h), w:r.w, h:r.h};
      })};
    });
  }
  // Chấm mọi mẫu × mọi lô. X = {HOUSE_TEMPLATES, LOT_PRESETS, buildPlanFromTemplate, planGeometry}
  // (tools/layout-audit-server.mjs chèn sẵn window.__X). Chỉ chấm lô nằm trong range của mẫu.
  function auditTemplates(X, opts){
    opts = opts || {};
    var lots = opts.lots || X.LOT_PRESETS, out = [], tot = {cases:0, fail:0, warn:0};
    X.HOUSE_TEMPLATES.forEach(function(t){
      if(opts.only && opts.only.indexOf(t.key) < 0) return;
      lots.forEach(function(lot){
        var w = lot[0], l = lot[1], rg = t.range;
        if(w < rg.w[0] || w > rg.w[1] || l < rg.l[0] || l > rg.l[1] || w * l < rg.a[0] || w * l > rg.a[1]) return;
        var ctx = {w:w, l:l, needs:opts.needs || {}, beds:0, level:'standard', method:'rough_finish_package', budgetMax:null};
        var built = null;
        try { built = X.buildPlanFromTemplate(t, ctx); } catch(e){ out.push({tpl:t.key, lot:w + 'x' + l, error:String(e)}); return; }
        if(!built) return;
        var res = auditFloors(floorsFromGeo(X.planGeometry(built.plan)));
        tot.cases++; tot.fail += res.fail.length; tot.warn += res.warn.length;
        if(res.fail.length || opts.withWarn) out.push({tpl:t.key, lot:w + 'x' + l, fail:res.fail, warn:opts.withWarn ? res.warn : res.warn.length});
      });
    });
    return {total:tot, bad:out.filter(function(o){ return o.error || o.fail.length; }).length, cases:out};
  }

  // Gom lỗi theo loại (bỏ tên phòng, số đo) và theo mẫu — để biết sửa chỗ nào trước
  function auditSummary(r){
    var cat = {}, tpl = {};
    r.cases.forEach(function(c){
      (c.fail || []).forEach(function(m){
        var k = m.replace(/^[^:]+: /, '').replace(/"[^"]*"/g, '"_"').replace(/[\d,]+( m²| m|%)/g, '#$1').replace(/(, "_")+/, ', "_"…').slice(0, 70);
        cat[k] = (cat[k] || 0) + 1;
      });
      tpl[c.tpl] = (tpl[c.tpl] || 0) + (c.fail || []).length;
    });
    function top(o){ return Object.keys(o).map(function(k){ return [k, o[k]]; }).sort(function(a, b){ return b[1] - a[1]; }); }
    return {total:r.total, bad:r.bad, byType:top(cat).slice(0, 15), byTpl:top(tpl).map(function(e){ return e.join(':'); }).join(' ')};
  }
  // In hình học 1 mẫu trên 1 lô (toạ độ theo planGeometry: y nhỏ = mặt tiền)
  function auditDump(X, key, w, l, needs){
    var t = X.HOUSE_TEMPLATES.filter(function(x){ return x.key === key; })[0];
    var b = X.buildPlanFromTemplate(t, {w:w, l:l, needs:needs || {}, beds:0, level:'standard', method:'rough_finish_package'});
    return X.planGeometry(b.plan).floors.map(function(f){
      return f.name + ': ' + f.rooms.concat(f.openRooms || []).map(function(r){ return r.name + '[' + r.type + '] ' + [r.x, r.y, r.w, r.h].map(function(v){ return (+v).toFixed(2); }).join(','); }).join(' | ');
    });
  }

  if(typeof window !== 'undefined'){
    window.auditFloors = auditFloors; window.auditTypeOf = typeOf; window.auditTemplates = auditTemplates; window.auditFloorsFromGeo = floorsFromGeo;
    window.auditSummary = auditSummary; window.auditDump = auditDump;
  }
  if(typeof document === 'undefined' || !document.querySelector) return null;
  var floors = readDom();
  return floors.length ? auditFloors(floors) : {error:'Không tìm thấy mặt bằng — hãy mở hộp thoại chi tiết 1 nhà mẫu trước.'};
})();
