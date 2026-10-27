#!/usr/bin/env node
// Bản Node của build_seo_pages.py (máy không có Python vẫn chạy được), cùng đầu ra.
// Sinh trang tĩnh SEO /xay-nha/… từ số liệu nhà mẫu xuất bằng chính logic của app.
//
// Cách chạy (xem tools/README.md):
//     node tools/build_seo_pages.mjs <seo-data.json> <seo-svg.css>
//
// Ghi ra: xay-nha/index.html, xay-nha/<lô>.html, xay-nha/<lô>-<mẫu>.html, xay-nha/style.css, sitemap.xml
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const SITE = 'https://xaynhabaonhieu.web.app';
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT = path.join(ROOT, 'xay-nha');
const NOW = new Date();
const TODAY = NOW.getFullYear() + '-' + String(NOW.getMonth() + 1).padStart(2, '0') + '-' + String(NOW.getDate()).padStart(2, '0');
const YEAR = NOW.getFullYear();
const MAX_PER_LOT = 12;          // số mẫu điểm cao nhất mỗi lô được làm trang riêng (+ mọi mẫu "2 tầng 1 tum")

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');

function slugify(s){
  s = String(s).replace(/đ/g, 'd').replace(/Đ/g, 'D').normalize('NFD').replace(/\p{Mn}/gu, '').toLowerCase();
  return s.replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

// Số kiểu Việt: 1.234,5
function num(v, d = 1){
  if(v === null || v === undefined) return '';
  const neg = v < 0;
  let [i, f] = Math.abs(v).toFixed(d).split('.');
  i = i.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  let s = f ? i + ',' + f : i;
  if(s.includes(',')) s = s.replace(/0+$/, '').replace(/,$/, '');
  return (neg ? '-' : '') + s;
}
const lotLabel = (w, l) => `${num(w)}x${num(l)}`;
const lotSlug = (w, l) => lotLabel(w, l).replace(/,/g, '-');
// 2,15 tỷ / 850 triệu
function money(v){
  if(v === null || v === undefined) return '—';
  if(v >= 1e9) return num(v / 1e9, 2) + ' tỷ';
  return num(Math.round(v / 1e6), 0) + ' triệu';
}
const moneyFull = v => num(Math.round(v), 0) + ' đ';
const lcFirst = s => s.slice(0, 1).toLowerCase() + s.slice(1);

// ---------------------------------------------------------------- khung trang
function page(title, desc, p, body, crumbs, ld){
  const url = SITE + p;
  const crumbHtml = crumbs.map(([n, u]) => u ? `<a href="${esc(u)}">${esc(n)}</a>` : `<span>${esc(n)}</span>`).join(' › ');
  const crumbLd = {'@context':'https://schema.org', '@type':'BreadcrumbList', itemListElement: crumbs.map(([n, u], i) => ({'@type':'ListItem', position:i + 1, name:n, item: u ? SITE + u : url}))};
  const lds = [crumbLd].concat(ld || []);
  const ldHtml = lds.map(x => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('');
  return `<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#2563eb">
<meta property="og:type" content="article">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Xây Nhà Bao Nhiêu">
<meta property="og:url" content="${esc(url)}">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:image" content="${SITE}/icons/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<script>(function(){var t='auto';try{t=(JSON.parse(localStorage.getItem('duToanXayNhaUI')||'{}').theme)||'auto';}catch(e){}if(t==='dark'||(t!=='light'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.setAttribute('data-theme','dark');})();</script>
<link rel="stylesheet" href="/xay-nha/style.css">
${ldHtml}
</head>
<body>
<header class="top"><a class="brand" href="/"><img src="/icons/favicon.svg" alt="" width="28" height="28"> Xây Nhà Bao Nhiêu</a><a class="btn-top" href="/">Mở công cụ tính</a></header>
<nav class="crumbs" aria-label="Đường dẫn">${crumbHtml}</nav>
<main>
${body}
</main>
<footer class="foot">
<p>Số liệu ước tính tự động theo đơn giá tham khảo năm ${YEAR} (trọn gói thô + hoàn thiện, đã gồm nội thất & thiết bị cơ bản, ép cọc/gia cố móng, thiết kế + xin phép). Giá thực tế thay đổi theo địa phương, địa chất, nhà thầu và vật tư — hãy lấy báo giá ít nhất 3 nhà thầu. Mặt bằng là bố trí sơ bộ để hình dung, bản vẽ xin phép cần kiến trúc sư.</p>
<p><a href="/xay-nha/">Mẫu nhà theo lô đất</a> · <a href="/">Công cụ dự toán xây nhà</a> · Cập nhật ${TODAY}</p>
</footer>
</body>
</html>
`;
}

const facts = rows => '<dl class="facts">' + rows.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`).join('') + '</dl>';
const thumb = (svg, big) => `<div class="thumb${big ? ' big' : ''}">${svg}</div>`;

// ---------------------------------------------------------------- dữ liệu
function load(dataPath){
  const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const {levels, cats, lots} = data;
  for(const lot of lots){
    lot.label = lotLabel(lot.w, lot.l);
    lot.slug = lotSlug(lot.w, lot.l);
    const seen = new Set();
    lot.items.forEach((it, i) => { if(i < MAX_PER_LOT || (it.tags || []).includes('tum')) seen.add(it.key); });
    for(const it of lot.items){
      it.page = seen.has(it.key);
      it.slug = `${lot.slug}-${slugify(it.name)}`;
      it.url = `/xay-nha/${it.slug}`;
      it.app = `/?lo=${lot.slug}&mau=${it.key}`;
    }
  }
  return {levels, cats, lots};
}

// Tum không tính là 1 tầng (TCVN 13967:2024), VD: 2 tầng + tum
function floorsLine(it){
  const tum = it.floors.some(f => /^tum/i.test(f.name));
  return `${it.floors.length - (tum ? 1 : 0)} tầng` + (tum ? ' + tum' : '');
}

// ---------------------------------------------------------------- trang chi tiết
function detailPage(lot, it, levels, cats, lots){
  const info = it.info;
  const nameLc = lcFirst(it.name);
  const lvVals = Object.values(it.levels).filter(v => v);
  const lo = Math.min(...lvVals), hi = Math.max(...lvVals);
  const title = `Xây nhà ${lot.label} ${nameLc} hết bao nhiêu tiền? ~${money(it.total)} (${YEAR})`;
  const desc = `Lô ${lot.label} (${num(lot.area)} m²): ${nameLc}, ${floorsLine(it)}, ${info.beds} phòng ngủ, `
    + `${info.wcs} WC, ${num(info.floorArea, 0)} m² sàn. Chi phí trọn gói khoảng ${money(it.total)}, `
    + `từ ${money(lo)} đến ${money(hi)} tùy mức hoàn thiện. Xem mặt bằng từng tầng.`;
  const p = it.url;

  const beds = info.rentRooms ? `${info.rentRooms} phòng cho thuê` : `${info.beds} phòng ngủ`;
  const factRows = [
    ['Lô đất', `${esc(lot.label)} m · ${num(lot.area)} m²`],
    ['Kích thước nhà', `${num(it.bw)} × ${num(it.bl)} m`],
    ['Kiểu nhà', esc(it.houseType)],
    ['Số tầng', floorsLine(it)],
    ['Phòng', `${beds} · ${info.wcs} WC`],
    ['Tổng sàn xây dựng', `${num(info.floorArea, 0)} m²`],
    ['Mật độ xây dựng', `${num(it.density, 0)}% (tối đa ~${num(lot.maxDensity, 0)}%)`],
    ['Thời gian thi công', `~${num(info.months)} tháng`],
  ];
  if(info.court) factRows.push(['Sân trong / giếng trời', `${num(info.courtArea, 0)} m²`]);

  const lvRows = levels.map(lv => `<tr${lv.key === 'standard' ? ' class="hl"' : ''}><td>${esc(lv.label)}</td>`
    + `<td class="r">${money(it.levels[lv.key])}</td>`
    + `<td class="r">${it.levels[lv.key] ? num(it.levels[lv.key] / info.floorArea / 1e6, 1) + ' tr/m²' : ''}</td>`
    + `<td class="r muted">${num(lv.full / 1e6, 1)} tr/m²</td></tr>`).join('');
  const costRows = [];
  if(it.packageCost) costRows.push(['Trọn gói thô + hoàn thiện (nhà thầu)', it.packageCost]);
  cats.forEach((c, i) => { const v = it.byCat[i]; if(v) costRows.push([c.label + (it.packageCost ? ' (ngoài gói)' : ''), v]); });
  const costHtml = costRows.map(([n, v]) => `<tr><td>${esc(n)}</td><td class="r">${money(v)}</td><td class="r muted">${num(v / it.total * 100, 0)}%</td></tr>`).join('');

  let floorsHtml = '';
  it.floors.forEach((f, i) => {
    const fs2 = it.floorSvgs[i];
    if(!fs2) return;
    const rooms = f.rooms.map(r => `<li>${esc(r.n)}<span>${r.a ? num(r.a) + ' m²' : ''}</span></li>`).join('');
    floorsHtml += `<figure class="floor"><figcaption>${esc(f.name)} · ${num(f.area)} m²`
      + `${f.dim ? ' · ' + esc(f.dim) + ' m' : ''}</figcaption>${fs2.svg}<ul class="rooms">${rooms}</ul></figure>`;
  });
  const outdoor = it.outdoor.map(r => `<li>${esc(r.n)}<span>${r.a ? num(r.a) + ' m²' : ''}</span></li>`).join('');
  floorsHtml += `<figure class="floor"><figcaption>🌳 Lô đất</figcaption>${it.lotSvg}<ul class="rooms">${outdoor}</ul></figure>`;

  const why = it.why.map(w => `<li>${esc(w)}</li>`).join('');
  const others = lot.items.filter(x => x.key !== it.key && x.page).slice(0, 8);
  const othersHtml = others.map(x => `<a class="mini" href="${x.url}"><b>${esc(x.icon)} ${esc(x.name)}</b><span>${floorsLine(x)} · ${num(x.info.floorArea, 0)} m² sàn · ${money(x.total)}</span></a>`).join('');
  const same = [];
  for(const l2 of lots){
    if(l2 === lot) continue;
    for(const x of l2.items) if(x.key === it.key && x.page) same.push([l2, x]);
  }
  const sameHtml = same.map(([l2, x]) => `<a class="chip" href="${x.url}">Lô ${esc(l2.label)} · ${money(x.total)}</a>`).join('');

  const roughline = it.roughTotal ? `<li>Nếu chỉ thuê <strong>trọn gói phần thô</strong> rồi tự mua vật tư hoàn thiện: khoảng <strong>${money(it.roughTotal)}</strong>.</li>` : '';
  const q1 = `Xây nhà ${lot.label} ${nameLc} hết bao nhiêu tiền?`;
  const a1 = `Khoảng ${money(it.total)} (${moneyFull(it.total)}) cho ${num(info.floorArea, 0)} m² sàn, `
    + `trọn gói thô + hoàn thiện mức thông dụng, đã gồm nội thất cơ bản, móng, thiết kế và xin phép. `
    + `Tùy mức hoàn thiện, chi phí từ ${money(lo)} đến ${money(hi)}.`;
  const q2 = `Đơn giá xây nhà ${lot.label} bao nhiêu 1 m²?`;
  const a2 = `Tính bình quân khoảng ${num(it.perM2 / 1e6, 1)} triệu/m² sàn (tổng chi phí chia diện tích sàn). `
    + `Đơn giá trọn gói của nhà thầu tham khảo ${num(levels[1].full / 1e6, 1)} triệu/m² mức thông dụng.`;
  const q3 = `Xây nhà ${lot.label} ${floorsLine(it)} mất bao lâu?`;
  const a3 = `Khoảng ${num(info.months)} tháng thi công, chưa tính thời gian thiết kế và xin giấy phép (thường 1–2 tháng).`;
  const faqLd = {'@context':'https://schema.org', '@type':'FAQPage', mainEntity: [[q1, a1], [q2, a2], [q3, a3]].map(([q, a]) => ({'@type':'Question', name:q, acceptedAnswer:{'@type':'Answer', text:a}}))};

  const body = `<article>
<h1>Xây nhà ${esc(lot.label)} ${esc(nameLc)} hết bao nhiêu tiền?</h1>
<div class="answer">
  <div class="big">~${money(it.total)}</div>
  <div>trọn gói thô + hoàn thiện, mức thông dụng · <strong>${num(info.floorArea, 0)} m² sàn</strong> · ≈ ${num(it.perM2 / 1e6, 1)} triệu/m²</div>
  <div class="muted">Tùy mức hoàn thiện: ${money(lo)} – ${money(hi)}</div>
  <a class="btn" href="${esc(it.app)}">✏️ Mở mẫu này để chỉnh theo ý bạn</a>
</div>
<div class="hero">${thumb(it.elevation, true)}<div><p class="lead">${esc(it.desc)}</p>${facts(factRows)}</div></div>

<h2>Chi phí theo mức hoàn thiện</h2>
<div class="tw"><table><thead><tr><th>Mức hoàn thiện</th><th class="r">Tổng chi phí</th><th class="r">Bình quân</th><th class="r">Đơn giá trọn gói</th></tr></thead><tbody>${lvRows}</tbody></table></div>
<ul class="notes">
<li>Tổng chi phí đã gồm: trọn gói thô + hoàn thiện, nội thất & thiết bị cơ bản, ép cọc/gia cố móng, sơn ngoại thất + chống thấm mái, thiết kế + xin phép, điện nước tạm.</li>
${roughline}
<li>Nên để thêm <strong>10–15% dự phòng</strong> cho phát sinh.</li>
</ul>

<h2>Chi phí gồm những gì? (mức thông dụng)</h2>
<div class="tw"><table><tbody>${costHtml}<tr class="hl"><td><strong>Tổng</strong></td><td class="r"><strong>${money(it.total)}</strong></td><td class="r">100%</td></tr></tbody></table></div>

<h2>Mặt bằng sơ bộ từng tầng</h2>
<div class="floors">${floorsHtml}</div>

${why ? '<h2>Vì sao mẫu này hợp lô ' + esc(lot.label) + '?</h2><ul class="why">' + why + '</ul>' : ''}

<h2>Câu hỏi thường gặp</h2>
<details open><summary>${esc(q1)}</summary><p>${esc(a1)}</p></details>
<details><summary>${esc(q2)}</summary><p>${esc(a2)}</p></details>
<details><summary>${esc(q3)}</summary><p>${esc(a3)}</p></details>

<div class="cta"><p>Muốn đổi số phòng, mức hoàn thiện, vật liệu, hay lập lịch thanh toán và tính khoản vay?</p><a class="btn" href="${esc(it.app)}">Mở trong công cụ Xây Nhà Bao Nhiêu</a></div>

${othersHtml ? '<h2>Mẫu khác cho lô ' + esc(lot.label) + '</h2><div class="minis">' + othersHtml + '</div><p><a href="/xay-nha/' + lot.slug + '">Xem tất cả mẫu nhà lô ' + esc(lot.label) + ' →</a></p>' : ''}
${sameHtml ? '<h2>' + esc(it.name) + ' trên lô khác</h2><div class="chips">' + sameHtml + '</div>' : ''}
</article>`;
  const crumbs = [['Trang chủ', '/'], ['Mẫu nhà', '/xay-nha/'], [`Lô ${lot.label}`, `/xay-nha/${lot.slug}`], [it.name, null]];
  return page(title, desc, p, body, crumbs, [faqLd]);
}

// ---------------------------------------------------------------- trang lô
function card(it){
  const info = it.info;
  const beds = info.rentRooms ? `${info.rentRooms} phòng thuê` : `${info.beds} PN`;
  const inner = `${thumb(it.elevation)}<div class="cb"><b>${esc(it.icon)} ${esc(it.name)}</b>`
    + `<span class="meta">${floorsLine(it)} · ${beds} · ${info.wcs} WC · ${num(info.floorArea, 0)} m² sàn</span>`
    + `<span class="cost">${money(it.total)}</span></div>`;
  const href = it.page ? it.url : it.app;
  return `<a class="card" href="${esc(href)}">${inner}</a>`;
}

function lotPage(lot, lots){
  const items = lot.items;
  const totals = items.map(x => x.total);
  const n = items.length;
  const title = `Xây nhà ${lot.label} hết bao nhiêu tiền? ${n} mẫu nhà, từ ${money(Math.min(...totals))} (${YEAR})`;
  const desc = `Lô ${lot.label} (${num(lot.area)} m²) xây được ${n} kiểu nhà: chi phí từ ${money(Math.min(...totals))} `
    + `đến ${money(Math.max(...totals))}. So sánh số tầng, phòng ngủ, m² sàn, mặt bằng từng tầng và chi phí trọn gói.`;
  const p = `/xay-nha/${lot.slug}`;
  const rows = items.map(x => `<tr><td><a href="${esc(x.page ? x.url : x.app)}">${esc(x.name)}</a></td><td class="r">${floorsLine(x)}</td>`
    + `<td class="r">${num(x.info.floorArea, 0)} m²</td><td class="r">${money(x.total)}</td></tr>`).join('');
  const near = lots.filter(l2 => l2 !== lot && l2.items.length && (l2.w === lot.w || l2.l === lot.l));
  const nearHtml = near.map(l2 => `<a class="chip" href="/xay-nha/${l2.slug}">Lô ${esc(l2.label)}</a>`).join('');
  const unfit = lot.unfit.slice(0, 10).map(u => esc(u.name)).join(', ');
  const itemLd = {'@context':'https://schema.org', '@type':'ItemList', itemListElement: items.filter(x => x.page).map((x, i) => ({'@type':'ListItem', position:i + 1, url:SITE + x.url, name:x.name}))};
  const body = `<h1>Xây nhà ${esc(lot.label)} hết bao nhiêu tiền?</h1>
<div class="answer"><div class="big">${money(Math.min(...totals))} – ${money(Math.max(...totals))}</div>
<div>${n} mẫu nhà vừa lô ${esc(lot.label)} m (${num(lot.area)} m²), trọn gói thô + hoàn thiện mức thông dụng. Mật độ xây dựng tối đa ~${num(lot.maxDensity, 0)}%.</div>
<a class="btn" href="/?lo=${lot.slug}">✏️ Tự chọn nhu cầu cho lô ${esc(lot.label)}</a></div>
<div class="cards">${items.map(card).join('')}</div>
<h2>Bảng so sánh nhanh</h2>
<div class="tw"><table><thead><tr><th>Mẫu nhà</th><th class="r">Tầng</th><th class="r">Sàn</th><th class="r">Chi phí</th></tr></thead><tbody>${rows}</tbody></table></div>
${unfit ? '<p class="muted">Chưa hợp lô này: ' + unfit + '.</p>' : ''}
${nearHtml ? '<h2>Lô đất gần giống</h2><div class="chips">' + nearHtml + '</div>' : ''}`;
  const crumbs = [['Trang chủ', '/'], ['Mẫu nhà', '/xay-nha/'], [`Lô ${lot.label}`, null]];
  return page(title, desc, p, body, crumbs, [itemLd]);
}

function indexPage(lots){
  const title = `Mẫu nhà theo lô đất & chi phí xây nhà ${YEAR} — 5x20, 6x15, 7x20, 4x15…`;
  const desc = 'Chọn kích thước lô đất để xem các mẫu nhà phù hợp (nhà phố, 2 tầng 1 tum, cấp 4, biệt thự…), '
    + 'mặt bằng từng tầng và chi phí xây trọn gói.';
  const cards = lots.filter(l => l.items.length).map(l => `<a class="lotc" href="/xay-nha/${l.slug}"><b>${esc(l.label)}</b><span>${num(l.area)} m² · ${l.items.length} mẫu</span>`
    + `<span class="cost">từ ${money(Math.min(...l.items.map(x => x.total)))}</span></a>`).join('');
  const popular = [];
  for(const l of lots) for(const x of l.items)
    if(x.page && (x.tags || []).includes('tum') && ['5x20', '5x22', '6x15', '6x20', '7x20', '7x23', '4x18', '5x23'].includes(l.label)) popular.push([l, x]);
  const popHtml = popular.slice(0, 16).map(([l, x]) => `<a class="mini" href="${x.url}"><b>Lô ${esc(l.label)} · ${esc(x.name)}</b><span>${money(x.total)}</span></a>`).join('');
  const body = `<h1>Mẫu nhà theo lô đất & chi phí xây</h1>
<p class="lead">Bấm vào kích thước lô của bạn để xem mẫu nhà vừa lô, mặt bằng từng tầng và ước tính hết bao nhiêu tiền. Không thấy lô của mình? <a href="/">Mở công cụ</a> và nhập đúng kích thước.</p>
<div class="lots">${cards}</div>
<h2>Nhà 2 tầng 1 tum được xem nhiều</h2>
<div class="minis">${popHtml}</div>`;
  return page(title, desc, '/xay-nha/', body, [['Trang chủ', '/'], ['Mẫu nhà', null]]);
}

// CSS trang tĩnh: đọc từ bản Python để 2 bản luôn giống nhau
function styleCss(){
  const py = fs.readFileSync(path.join(ROOT, 'tools', 'build_seo_pages.py'), 'utf8');
  const m = py.match(/STYLE = '''([\s\S]*?)'''/);
  if(!m) throw new Error('Không đọc được STYLE trong build_seo_pages.py');
  return m[1];
}

function main(){
  const [dataPath, cssPath] = process.argv.slice(2);
  if(!dataPath || !cssPath){ console.error('Dùng: node tools/build_seo_pages.mjs <seo-data.json> <seo-svg.css>'); process.exit(1); }
  const {levels, cats, lots} = load(dataPath);
  const svgCss = fs.readFileSync(cssPath, 'utf8');
  fs.mkdirSync(OUT, {recursive:true});
  for(const f of fs.readdirSync(OUT)) if(f.endsWith('.html')) fs.unlinkSync(path.join(OUT, f));   // dọn trang cũ (mẫu/lô có thể đổi tên)
  fs.writeFileSync(path.join(OUT, 'style.css'), svgCss + '\n' + styleCss(), 'utf8');
  const urls = [['/', '1.0'], ['/xay-nha/', '0.9']];
  fs.writeFileSync(path.join(OUT, 'index.html'), indexPage(lots), 'utf8');
  let n = 0;
  for(const lot of lots){
    if(!lot.items.length) continue;
    fs.writeFileSync(path.join(OUT, lot.slug + '.html'), lotPage(lot, lots), 'utf8');
    urls.push([`/xay-nha/${lot.slug}`, '0.8']);
    for(const it of lot.items){
      if(!it.page) continue;
      fs.writeFileSync(path.join(OUT, it.slug + '.html'), detailPage(lot, it, levels, cats, lots), 'utf8');
      urls.push([it.url, '0.7']);
      n++;
    }
  }
  const sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    .concat(urls.map(([u, p]) => `  <url><loc>${SITE}${u}</loc><lastmod>${TODAY}</lastmod><priority>${p}</priority></url>`), ['</urlset>']);
  fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sm.join('\n') + '\n', 'utf8');
  console.log(`${lots.length} lô, ${n} trang mẫu, ${urls.length} URL trong sitemap`);
}

main();
