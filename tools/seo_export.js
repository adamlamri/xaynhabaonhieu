// Chạy trong DevTools của bản app đã gắn móc window.__X (xem tools/README.md).
// Xuất số liệu mọi cặp lô × mẫu nhà (dùng đúng logic app) + CSS cho SVG, POST về server thu file:
// mặc định cổng 8766; mở app qua tools/layout-audit-server.mjs thì đặt window.__SEO_OUT = '/__out/' trước khi chạy.
(async function(){
  var OUT = window.__SEO_OUT || 'http://127.0.0.1:8766/';
  var X = window.__X, out = {lots: [], levels: X.FINISH_LEVELS.map(function(l){ return {key:l.key, label:l.label, rough:l.rough, full:l.full}; }), cats: X.CATEGORIES.map(function(c){ return {key:c.key, label:X.categoryShort(c.key)}; })};
  function ctxOf(w, l, level, method){ return {w:w, l:l, needs:{}, beds:0, level:level, method:method, budget:null, budgetMax:null}; }
  X.LOT_PRESETS.forEach(function(p){
    var w = p[0], l = p[1], base = ctxOf(w, l, 'standard', 'rough_finish_package'), lot = {w:w, l:l, area:w*l, maxDensity:X.maxDensity(w*l), items:[], unfit:[]};
    X.HOUSE_TEMPLATES.forEach(function(t){
      var built = null; try { built = X.buildPlanFromTemplate(t, base); } catch(e){ built = null; }
      var sc = X.scoreTemplate(t, base, built);
      if(!sc.ok || !built){ lot.unfit.push({key:t.key, name:t.name, why:sc.why.slice(0,2)}); return; }
      var st = X.computePlanStats(built.plan), levels = {};
      // bản vẽ + danh sách phòng giống hệt phương án người dùng nhận khi bấm "Tạo phương án từ mẫu này"
      // (đã ghi kích thước → nhãn 📐, diện tích trong danh sách = trên bản vẽ); giá vẫn như thẻ nhà mẫu
      var shown = JSON.parse(JSON.stringify(built.plan));
      if(X.stampRoomDims) X.stampRoomDims(shown, true);
      var geo = X.planGeometry(shown);
      X.FINISH_LEVELS.forEach(function(lv){ var b2 = X.buildPlanFromTemplate(t, ctxOf(w, l, lv.key, 'rough_finish_package')); levels[lv.key] = b2 ? Math.round(X.computePlanStats(b2.plan).total) : null; });
      var br = X.buildPlanFromTemplate(t, ctxOf(w, l, 'standard', 'rough_package'));
      var fl = {}, outdoor = [];
      shown.floors.forEach(function(f){ fl[f.id] = {name:f.name, area:Number(f.area), dim:f.dimension, rooms:[]}; });
      shown.rooms.forEach(function(r){ var o = {n:r.name, a: r.area ? Number(r.area) : null, t:X.geoRoomType(r.name)}; if(r.floorId && fl[r.floorId]) fl[r.floorId].rooms.push(o); else outdoor.push(o); });
      lot.items.push({key:t.key, name:t.name, icon:t.icon, desc:t.desc, tags:t.tags, score:sc.score, why:sc.why, houseType:built.spec.houseType, roof:built.plan.house.roofType,
        info:built.info, bw:geo.bw, bl:geo.bl, density:geo.density, total:Math.round(st.total), perM2:Math.round(st.costPerM2 || 0), packageCost:Math.round(st.packageCost || 0),
        byCat: X.CATEGORIES.map(function(c){ return Math.round(st.byCategory[c.key].sum || 0); }), levels:levels, roughTotal: br ? Math.round(X.computePlanStats(br.plan).total) : null,
        floors: shown.floors.map(function(f){ return fl[f.id]; }), outdoor:outdoor,
        elevation: X.houseElevationSvg(shown, geo),
        floorSvgs: geo.floors.map(function(f, i){ return {name:f.name, area:f.area, svg:X.renderVizSvg(shown, geo, i, {interactive:false, colorBy:'type'})}; }),
        lotSvg: X.renderVizSvg(shown, geo, 'lot', {interactive:false, colorBy:'type'})});
    });
    lot.items.sort(function(a, b){ return b.score - a.score; });
    out.lots.push(lot);
  });
  await fetch(OUT + 'seo-data.json', {method:'POST', body: JSON.stringify(out)});
  // CSS: mọi quy tắc có class xuất hiện trong SVG + biến màu :root
  var cls = {};
  out.lots.forEach(function(l){ l.items.forEach(function(it){ [it.elevation, it.lotSvg].concat(it.floorSvgs.map(function(f){ return f.svg; })).forEach(function(s){ (s.match(/class="[^"]+"/g) || []).forEach(function(m){ m.slice(7, -1).split(/\s+/).forEach(function(c){ cls[c] = 1; }); }); }); }); });
  var names = Object.keys(cls), media = [], plain = [];
  function walk(list, acc){ for(var i = 0; i < list.length; i++){ var r = list[i];
    if(r.cssRules && r.media){ var inner = []; walk(r.cssRules, inner); if(inner.length) media.push('@media ' + r.media.mediaText + '{' + inner.join('') + '}'); continue; }
    if(!r.selectorText) continue;
    if(/^:root/.test(r.selectorText) || names.some(function(c){ return new RegExp('\\.' + c.replace(/-/g, '\\-') + '(?![\\w-])').test(r.selectorText); })) acc.push(r.cssText); } }
  walk(document.styleSheets[0].cssRules, plain);
  await fetch(OUT + 'seo-css.css', {method:'POST', body: plain.concat(media).join('\n')});
  console.log('xong', out.lots.length, 'lô');
})();
