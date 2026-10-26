#!/usr/bin/env python3
"""Sinh trang tĩnh SEO /xay-nha/… từ số liệu nhà mẫu xuất bằng chính logic của app.

Cách chạy (xem tools/README.md):
    python3 -I tools/build_seo_pages.py <seo-data.json> <seo-svg.css>

Ghi ra: xay-nha/index.html, xay-nha/<lô>.html, xay-nha/<lô>-<mẫu>.html, xay-nha/style.css, sitemap.xml
"""
import html
import json
import os
import re
import sys
import unicodedata
from datetime import date

SITE = 'https://xaynhabaonhieu.web.app'
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'xay-nha')
TODAY = date.today().isoformat()
YEAR = date.today().year
MAX_PER_LOT = 12          # số mẫu điểm cao nhất mỗi lô được làm trang riêng (+ mọi mẫu "2 tầng 1 tum")

esc = lambda s: html.escape(str(s), quote=True)


def slugify(s):
    s = str(s).replace('đ', 'd').replace('Đ', 'D')
    s = unicodedata.normalize('NFD', s)
    s = ''.join(c for c in s if unicodedata.category(c) != 'Mn').lower()
    return re.sub(r'[^a-z0-9]+', '-', s).strip('-')


def num(v, d=1):
    """Số kiểu Việt: 1.234,5"""
    if v is None:
        return ''
    s = f'{v:,.{d}f}'.replace(',', '_').replace('.', ',').replace('_', '.')
    if ',' in s:
        s = s.rstrip('0').rstrip(',')
    return s


def lot_label(w, l):
    return f'{num(w)}x{num(l)}'


def lot_slug(w, l):
    return lot_label(w, l).replace(',', '-')


def money(v):
    """2,15 tỷ / 850 triệu"""
    if v is None:
        return '—'
    if v >= 1e9:
        return num(v / 1e9, 2) + ' tỷ'
    return num(round(v / 1e6), 0) + ' triệu'


def money_full(v):
    return num(round(v), 0) + ' đ'


def lc_first(s):
    return s[:1].lower() + s[1:]


# ---------------------------------------------------------------- khung trang
def page(title, desc, path, body, crumbs, ld=None):
    url = SITE + path
    crumb_html = ' › '.join(
        f'<a href="{esc(u)}">{esc(n)}</a>' if u else f'<span>{esc(n)}</span>' for n, u in crumbs)
    crumb_ld = {'@context': 'https://schema.org', '@type': 'BreadcrumbList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'name': n, **({'item': SITE + u} if u else {'item': url})}
        for i, (n, u) in enumerate(crumbs)]}
    lds = [crumb_ld] + (ld or [])
    ld_html = ''.join(f'<script type="application/ld+json">{json.dumps(x, ensure_ascii=False)}</script>' for x in lds)
    return f'''<!doctype html>
<html lang="vi">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="color-scheme" content="light dark">
<title>{esc(title)}</title>
<meta name="description" content="{esc(desc)}">
<link rel="canonical" href="{esc(url)}">
<link rel="icon" href="/icons/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png">
<link rel="manifest" href="/manifest.webmanifest">
<meta name="theme-color" content="#2563eb">
<meta property="og:type" content="article">
<meta property="og:locale" content="vi_VN">
<meta property="og:site_name" content="Xây Nhà Bao Nhiêu">
<meta property="og:url" content="{esc(url)}">
<meta property="og:title" content="{esc(title)}">
<meta property="og:description" content="{esc(desc)}">
<meta property="og:image" content="{SITE}/icons/og-image.png">
<meta name="twitter:card" content="summary_large_image">
<script>(function(){{var t='auto';try{{t=(JSON.parse(localStorage.getItem('duToanXayNhaUI')||'{{}}').theme)||'auto';}}catch(e){{}}if(t==='dark'||(t!=='light'&&window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches))document.documentElement.setAttribute('data-theme','dark');}})();</script>
<link rel="stylesheet" href="/xay-nha/style.css">
{ld_html}
</head>
<body>
<header class="top"><a class="brand" href="/"><img src="/icons/favicon.svg" alt="" width="28" height="28"> Xây Nhà Bao Nhiêu</a><a class="btn-top" href="/">Mở công cụ tính</a></header>
<nav class="crumbs" aria-label="Đường dẫn">{crumb_html}</nav>
<main>
{body}
</main>
<footer class="foot">
<p>Số liệu ước tính tự động theo đơn giá tham khảo năm {YEAR} (trọn gói thô + hoàn thiện, đã gồm nội thất & thiết bị cơ bản, ép cọc/gia cố móng, thiết kế + xin phép). Giá thực tế thay đổi theo địa phương, địa chất, nhà thầu và vật tư — hãy lấy báo giá ít nhất 3 nhà thầu. Mặt bằng là bố trí sơ bộ để hình dung, bản vẽ xin phép cần kiến trúc sư.</p>
<p><a href="/xay-nha/">Mẫu nhà theo lô đất</a> · <a href="/">Công cụ dự toán xây nhà</a> · Cập nhật {TODAY}</p>
</footer>
</body>
</html>
'''


def facts(rows):
    return '<dl class="facts">' + ''.join(f'<div><dt>{esc(k)}</dt><dd>{v}</dd></div>' for k, v in rows) + '</dl>'


def thumb(svg, big=False):
    return f'<div class="thumb{" big" if big else ""}">{svg}</div>'


# ---------------------------------------------------------------- dữ liệu
def load(data_path):
    data = json.load(open(data_path, encoding='utf-8'))
    levels = data['levels']
    cats = data['cats']
    lots = data['lots']
    for lot in lots:
        lot['label'] = lot_label(lot['w'], lot['l'])
        lot['slug'] = lot_slug(lot['w'], lot['l'])
        picked, seen = [], set()
        for i, it in enumerate(lot['items']):
            if i < MAX_PER_LOT or 'tum' in (it.get('tags') or []):
                picked.append(it)
                seen.add(it['key'])
        for it in lot['items']:
            it['page'] = it['key'] in seen
            it['slug'] = f"{lot['slug']}-{slugify(it['name'])}"
            it['url'] = f"/xay-nha/{it['slug']}"
            it['app'] = f"/?lo={lot['slug']}&mau={it['key']}"
    return levels, cats, lots


def floors_line(it):
    """Tum không tính là 1 tầng (TCVN 13967:2024), VD: 2 tầng + tum"""
    tum = any(re.match(r'(?i)tum', f['name']) for f in it['floors'])
    return f"{len(it['floors']) - (1 if tum else 0)} tầng" + (' + tum' if tum else '')


# ---------------------------------------------------------------- trang chi tiết
def detail_page(lot, it, levels, cats, lots):
    info = it['info']
    name_lc = lc_first(it['name'])
    lv_vals = [v for v in it['levels'].values() if v]
    lo, hi = min(lv_vals), max(lv_vals)
    title = f"Xây nhà {lot['label']} {name_lc} hết bao nhiêu tiền? ~{money(it['total'])} ({YEAR})"
    desc = (f"Lô {lot['label']} ({num(lot['area'])} m²): {name_lc}, {floors_line(it)}, {info['beds']} phòng ngủ, "
            f"{info['wcs']} WC, {num(info['floorArea'], 0)} m² sàn. Chi phí trọn gói khoảng {money(it['total'])}, "
            f"từ {money(lo)} đến {money(hi)} tùy mức hoàn thiện. Xem mặt bằng từng tầng.")
    path = it['url']

    beds = f"{info['rentRooms']} phòng cho thuê" if info.get('rentRooms') else f"{info['beds']} phòng ngủ"
    fact_rows = [
        ('Lô đất', f"{esc(lot['label'])} m · {num(lot['area'])} m²"),
        ('Kích thước nhà', f"{num(it['bw'])} × {num(it['bl'])} m"),
        ('Kiểu nhà', esc(it['houseType'])),
        ('Số tầng', floors_line(it)),
        ('Phòng', f"{beds} · {info['wcs']} WC"),
        ('Tổng sàn xây dựng', f"{num(info['floorArea'], 0)} m²"),
        ('Mật độ xây dựng', f"{num(it['density'], 0)}% (tối đa ~{num(lot['maxDensity'], 0)}%)"),
        ('Thời gian thi công', f"~{num(info['months'])} tháng"),
    ]
    if info.get('court'):
        fact_rows.append(('Sân trong / giếng trời', f"{num(info['courtArea'], 0)} m²"))

    lv_rows = ''.join(
        f"<tr{' class=\"hl\"' if lv['key'] == 'standard' else ''}><td>{esc(lv['label'])}</td>"
        f"<td class=\"r\">{money(it['levels'].get(lv['key']))}</td>"
        f"<td class=\"r\">{num(it['levels'][lv['key']] / info['floorArea'] / 1e6, 1) + ' tr/m²' if it['levels'].get(lv['key']) else ''}</td>"
        f"<td class=\"r muted\">{num(lv['full'] / 1e6, 1)} tr/m²</td></tr>"
        for lv in levels)
    cost_rows = []
    if it.get('packageCost'):
        cost_rows.append(('Trọn gói thô + hoàn thiện (nhà thầu)', it['packageCost']))
    for c, v in zip(cats, it['byCat']):
        if v:
            cost_rows.append((c['label'] + (' (ngoài gói)' if it.get('packageCost') else ''), v))
    cost_html = ''.join(f'<tr><td>{esc(n)}</td><td class="r">{money(v)}</td><td class="r muted">{num(v / it["total"] * 100, 0)}%</td></tr>' for n, v in cost_rows)

    floors_html = ''
    for f, fs in zip(it['floors'], it['floorSvgs']):
        rooms = ''.join(f'<li>{esc(r["n"])}<span>{num(r["a"]) + " m²" if r["a"] else ""}</span></li>' for r in f['rooms'])
        floors_html += (f'<figure class="floor"><figcaption>{esc(f["name"])} · {num(f["area"])} m²'
                        f'{" · " + esc(f["dim"]) + " m" if f.get("dim") else ""}</figcaption>{fs["svg"]}<ul class="rooms">{rooms}</ul></figure>')
    outdoor = ''.join(f'<li>{esc(r["n"])}<span>{num(r["a"]) + " m²" if r["a"] else ""}</span></li>' for r in it['outdoor'])
    floors_html += f'<figure class="floor"><figcaption>🌳 Lô đất</figcaption>{it["lotSvg"]}<ul class="rooms">{outdoor}</ul></figure>'

    why = ''.join(f'<li>{esc(w)}</li>' for w in it['why'])
    others = [x for x in lot['items'] if x['key'] != it['key'] and x['page']][:8]
    others_html = ''.join(
        f'<a class="mini" href="{x["url"]}"><b>{esc(x["icon"])} {esc(x["name"])}</b><span>{floors_line(x)} · {num(x["info"]["floorArea"], 0)} m² sàn · {money(x["total"])}</span></a>'
        for x in others)
    same = []
    for l2 in lots:
        if l2 is lot:
            continue
        for x in l2['items']:
            if x['key'] == it['key'] and x['page']:
                same.append((l2, x))
    same_html = ''.join(
        f'<a class="chip" href="{x["url"]}">Lô {esc(l2["label"])} · {money(x["total"])}</a>' for l2, x in same)

    roughline = ''
    if it.get('roughTotal'):
        roughline = (f"<li>Nếu chỉ thuê <strong>trọn gói phần thô</strong> rồi tự mua vật tư hoàn thiện: khoảng "
                     f"<strong>{money(it['roughTotal'])}</strong>.</li>")
    q1 = f"Xây nhà {lot['label']} {name_lc} hết bao nhiêu tiền?"
    a1 = (f"Khoảng {money(it['total'])} ({money_full(it['total'])}) cho {num(info['floorArea'], 0)} m² sàn, "
          f"trọn gói thô + hoàn thiện mức thông dụng, đã gồm nội thất cơ bản, móng, thiết kế và xin phép. "
          f"Tùy mức hoàn thiện, chi phí từ {money(lo)} đến {money(hi)}.")
    q2 = f"Đơn giá xây nhà {lot['label']} bao nhiêu 1 m²?"
    a2 = (f"Tính bình quân khoảng {num(it['perM2'] / 1e6, 1)} triệu/m² sàn (tổng chi phí chia diện tích sàn). "
          f"Đơn giá trọn gói của nhà thầu tham khảo {num(levels[1]['full'] / 1e6, 1)} triệu/m² mức thông dụng.")
    q3 = f"Xây nhà {lot['label']} {floors_line(it)} mất bao lâu?"
    a3 = f"Khoảng {num(info['months'])} tháng thi công, chưa tính thời gian thiết kế và xin giấy phép (thường 1–2 tháng)."
    faq_ld = {'@context': 'https://schema.org', '@type': 'FAQPage', 'mainEntity': [
        {'@type': 'Question', 'name': q, 'acceptedAnswer': {'@type': 'Answer', 'text': a}} for q, a in ((q1, a1), (q2, a2), (q3, a3))]}

    body = f'''<article>
<h1>Xây nhà {esc(lot['label'])} {esc(name_lc)} hết bao nhiêu tiền?</h1>
<div class="answer">
  <div class="big">~{money(it['total'])}</div>
  <div>trọn gói thô + hoàn thiện, mức thông dụng · <strong>{num(info['floorArea'], 0)} m² sàn</strong> · ≈ {num(it['perM2'] / 1e6, 1)} triệu/m²</div>
  <div class="muted">Tùy mức hoàn thiện: {money(lo)} – {money(hi)}</div>
  <a class="btn" href="{esc(it['app'])}">✏️ Mở mẫu này để chỉnh theo ý bạn</a>
</div>
<div class="hero">{thumb(it['elevation'], True)}<div><p class="lead">{esc(it['desc'])}</p>{facts(fact_rows)}</div></div>

<h2>Chi phí theo mức hoàn thiện</h2>
<div class="tw"><table><thead><tr><th>Mức hoàn thiện</th><th class="r">Tổng chi phí</th><th class="r">Bình quân</th><th class="r">Đơn giá trọn gói</th></tr></thead><tbody>{lv_rows}</tbody></table></div>
<ul class="notes">
<li>Tổng chi phí đã gồm: trọn gói thô + hoàn thiện, nội thất & thiết bị cơ bản, ép cọc/gia cố móng, sơn ngoại thất + chống thấm mái, thiết kế + xin phép, điện nước tạm.</li>
{roughline}
<li>Nên để thêm <strong>10–15% dự phòng</strong> cho phát sinh.</li>
</ul>

<h2>Chi phí gồm những gì? (mức thông dụng)</h2>
<div class="tw"><table><tbody>{cost_html}<tr class="hl"><td><strong>Tổng</strong></td><td class="r"><strong>{money(it['total'])}</strong></td><td class="r">100%</td></tr></tbody></table></div>

<h2>Mặt bằng sơ bộ từng tầng</h2>
<div class="floors">{floors_html}</div>

{('<h2>Vì sao mẫu này hợp lô ' + esc(lot['label']) + '?</h2><ul class="why">' + why + '</ul>') if why else ''}

<h2>Câu hỏi thường gặp</h2>
<details open><summary>{esc(q1)}</summary><p>{esc(a1)}</p></details>
<details><summary>{esc(q2)}</summary><p>{esc(a2)}</p></details>
<details><summary>{esc(q3)}</summary><p>{esc(a3)}</p></details>

<div class="cta"><p>Muốn đổi số phòng, mức hoàn thiện, vật liệu, hay lập lịch thanh toán và tính khoản vay?</p><a class="btn" href="{esc(it['app'])}">Mở trong công cụ Xây Nhà Bao Nhiêu</a></div>

{('<h2>Mẫu khác cho lô ' + esc(lot['label']) + '</h2><div class="minis">' + others_html + '</div><p><a href="/xay-nha/' + lot['slug'] + '">Xem tất cả mẫu nhà lô ' + esc(lot['label']) + ' →</a></p>') if others_html else ''}
{('<h2>' + esc(it['name']) + ' trên lô khác</h2><div class="chips">' + same_html + '</div>') if same_html else ''}
</article>'''
    crumbs = [('Trang chủ', '/'), ('Mẫu nhà', '/xay-nha/'), (f"Lô {lot['label']}", f"/xay-nha/{lot['slug']}"), (it['name'], None)]
    return page(title, desc, path, body, crumbs, [faq_ld])


# ---------------------------------------------------------------- trang lô
def card(it):
    info = it['info']
    beds = f"{info['rentRooms']} phòng thuê" if info.get('rentRooms') else f"{info['beds']} PN"
    inner = (f'{thumb(it["elevation"])}<div class="cb"><b>{esc(it["icon"])} {esc(it["name"])}</b>'
             f'<span class="meta">{floors_line(it)} · {beds} · {info["wcs"]} WC · {num(info["floorArea"], 0)} m² sàn</span>'
             f'<span class="cost">{money(it["total"])}</span></div>')
    href = it['url'] if it['page'] else it['app']
    return f'<a class="card" href="{esc(href)}">{inner}</a>'


def lot_page(lot, lots):
    items = lot['items']
    totals = [x['total'] for x in items]
    title = f"Xây nhà {lot['label']} hết bao nhiêu tiền? {len(items)} mẫu nhà, từ {money(min(totals))} ({YEAR})"
    desc = (f"Lô {lot['label']} ({num(lot['area'])} m²) xây được {len(items)} kiểu nhà: chi phí từ {money(min(totals))} "
            f"đến {money(max(totals))}. So sánh số tầng, phòng ngủ, m² sàn, mặt bằng từng tầng và chi phí trọn gói.")
    path = f"/xay-nha/{lot['slug']}"
    rows = ''.join(
        f'<tr><td><a href="{esc(x["url"] if x["page"] else x["app"])}">{esc(x["name"])}</a></td><td class="r">{floors_line(x)}</td>'
        f'<td class="r">{num(x["info"]["floorArea"], 0)} m²</td><td class="r">{money(x["total"])}</td></tr>' for x in items)
    near = [l2 for l2 in lots if l2 is not lot and (l2['w'] == lot['w'] or l2['l'] == lot['l'])]
    near_html = ''.join(f'<a class="chip" href="/xay-nha/{l2["slug"]}">Lô {esc(l2["label"])}</a>' for l2 in near)
    unfit = ', '.join(esc(u['name']) for u in lot['unfit'][:10])
    item_ld = {'@context': 'https://schema.org', '@type': 'ItemList', 'itemListElement': [
        {'@type': 'ListItem', 'position': i + 1, 'url': SITE + x['url'], 'name': x['name']} for i, x in enumerate(i2 for i2 in items if i2['page'])]}
    body = f'''<h1>Xây nhà {esc(lot['label'])} hết bao nhiêu tiền?</h1>
<div class="answer"><div class="big">{money(min(totals))} – {money(max(totals))}</div>
<div>{len(items)} mẫu nhà vừa lô {esc(lot['label'])} m ({num(lot['area'])} m²), trọn gói thô + hoàn thiện mức thông dụng. Mật độ xây dựng tối đa ~{num(lot['maxDensity'], 0)}%.</div>
<a class="btn" href="/?lo={lot['slug']}">✏️ Tự chọn nhu cầu cho lô {esc(lot['label'])}</a></div>
<div class="cards">{''.join(card(x) for x in items)}</div>
<h2>Bảng so sánh nhanh</h2>
<div class="tw"><table><thead><tr><th>Mẫu nhà</th><th class="r">Tầng</th><th class="r">Sàn</th><th class="r">Chi phí</th></tr></thead><tbody>{rows}</tbody></table></div>
{('<p class="muted">Chưa hợp lô này: ' + unfit + '.</p>') if unfit else ''}
{('<h2>Lô đất gần giống</h2><div class="chips">' + near_html + '</div>') if near_html else ''}'''
    crumbs = [('Trang chủ', '/'), ('Mẫu nhà', '/xay-nha/'), (f"Lô {lot['label']}", None)]
    return page(title, desc, path, body, crumbs, [item_ld])


def index_page(lots):
    title = f'Mẫu nhà theo lô đất & chi phí xây nhà {YEAR} — 5x20, 6x15, 7x20, 4x15…'
    desc = ('Chọn kích thước lô đất để xem các mẫu nhà phù hợp (nhà phố, 2 tầng 1 tum, cấp 4, biệt thự…), '
            'mặt bằng từng tầng và chi phí xây trọn gói.')
    cards = ''.join(
        f'<a class="lotc" href="/xay-nha/{l["slug"]}"><b>{esc(l["label"])}</b><span>{num(l["area"])} m² · {len(l["items"])} mẫu</span>'
        f'<span class="cost">từ {money(min(x["total"] for x in l["items"]))}</span></a>' for l in lots if l['items'])
    popular = []
    for l in lots:
        for x in l['items']:
            if x['page'] and 'tum' in (x.get('tags') or []) and l['label'] in ('5x20', '5x22', '6x15', '6x20', '7x20', '7x23', '4x18', '5x23'):
                popular.append((l, x))
    pop_html = ''.join(f'<a class="mini" href="{x["url"]}"><b>Lô {esc(l["label"])} · {esc(x["name"])}</b><span>{money(x["total"])}</span></a>' for l, x in popular[:16])
    body = f'''<h1>Mẫu nhà theo lô đất & chi phí xây</h1>
<p class="lead">Bấm vào kích thước lô của bạn để xem mẫu nhà vừa lô, mặt bằng từng tầng và ước tính hết bao nhiêu tiền. Không thấy lô của mình? <a href="/">Mở công cụ</a> và nhập đúng kích thước.</p>
<div class="lots">{cards}</div>
<h2>Nhà 2 tầng 1 tum được xem nhiều</h2>
<div class="minis">{pop_html}</div>'''
    return page(title, desc, '/xay-nha/', body, [('Trang chủ', '/'), ('Mẫu nhà', None)])


STYLE = '''
*{box-sizing:border-box}
body{margin:0;background:var(--color-bg);color:var(--color-text);font:15px/1.6 system-ui,-apple-system,"Segoe UI",Roboto,sans-serif}
a{color:var(--color-primary)}
.top{position:sticky;top:0;z-index:5;display:flex;align-items:center;justify-content:space-between;gap:12px;padding:10px 16px;background:var(--color-surface);border-bottom:1px solid var(--color-border)}
.brand{display:flex;align-items:center;gap:8px;font-weight:700;color:var(--color-text);text-decoration:none}
.btn-top,.btn{display:inline-block;background:var(--color-primary);color:#fff;text-decoration:none;font-weight:600;border-radius:10px;padding:8px 14px;font-size:14px}
.btn{margin-top:10px;padding:10px 16px}
.crumbs{max-width:980px;margin:12px auto 0;padding:0 16px;font-size:13px;color:var(--color-text-muted)}
.crumbs a{color:var(--color-text-muted)}
main{max-width:980px;margin:0 auto;padding:0 16px 24px}
h1{font-size:26px;line-height:1.25;margin:12px 0}
h2{font-size:19px;margin:28px 0 10px}
.lead{font-size:16px;margin:0 0 10px}
.muted{color:var(--color-text-muted)}
.answer{background:var(--color-primary-soft);border:1px solid var(--color-primary);border-radius:14px;padding:14px 16px;margin:12px 0 18px}
.answer .big{font-size:30px;font-weight:800;color:var(--color-primary)}
.hero{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.2fr);gap:18px;align-items:start}
.thumb{height:150px;border-radius:12px;overflow:hidden;background:linear-gradient(180deg,#bfdbfe 0%,#e0f2fe 70%,#f0fdf4 100%);display:flex;align-items:flex-end;justify-content:center;padding:8px 10px 0}
.thumb.big{height:220px}
.thumb svg{width:100%;height:100%}
:root[data-theme="dark"] .thumb{background:linear-gradient(180deg,#1e3a8a 0%,#1e293b 75%,#14532d 100%)}
.facts{margin:0;display:grid;grid-template-columns:1fr 1fr;gap:8px}
.facts div{background:var(--color-surface);border:1px solid var(--color-border);border-radius:10px;padding:8px 10px}
.facts dt{font-size:12px;color:var(--color-text-muted)}
.facts dd{margin:0;font-weight:600}
.tw{overflow-x:auto;background:var(--color-surface);border:1px solid var(--color-border);border-radius:12px}
table{width:100%;border-collapse:collapse;font-size:14px}
th,td{padding:8px 12px;border-bottom:1px solid var(--color-border);text-align:left}
th{font-size:12.5px;color:var(--color-text-muted);font-weight:600}
tr:last-child td{border-bottom:0}
.r{text-align:right;white-space:nowrap}
tr.hl td{background:var(--color-primary-soft)}
.notes{padding-left:20px;font-size:14px}
.floors{display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:12px}
.floor{margin:0;background:var(--color-surface);border:1px solid var(--color-border);border-radius:12px;padding:10px}
.floor figcaption{font-weight:600;font-size:13.5px;margin-bottom:6px}
.floor .viz-svg{width:100%;height:auto;max-height:340px;display:block}
.rooms{list-style:none;margin:8px 0 0;padding:0;font-size:13px}
.rooms li{display:flex;justify-content:space-between;gap:8px;border-top:1px dashed var(--color-border);padding:3px 0}
.rooms span{color:var(--color-text-muted);white-space:nowrap}
.why{padding-left:20px}
details{background:var(--color-surface);border:1px solid var(--color-border);border-radius:10px;padding:10px 14px;margin:8px 0}
summary{font-weight:600;cursor:pointer}
details p{margin:8px 0 0}
.cta{margin:24px 0;padding:16px;border-radius:14px;background:var(--color-surface);border:1px solid var(--color-border);text-align:center}
.cta p{margin:0}
.minis{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:10px}
.mini{display:flex;flex-direction:column;gap:2px;background:var(--color-surface);border:1px solid var(--color-border);border-radius:10px;padding:10px 12px;text-decoration:none;color:var(--color-text)}
.mini span{font-size:13px;color:var(--color-text-muted)}
.chips{display:flex;flex-wrap:wrap;gap:8px}
.chip{border:1px solid var(--color-border);background:var(--color-surface);border-radius:999px;padding:6px 12px;text-decoration:none;font-size:13.5px}
.cards{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:12px}
.card{display:flex;flex-direction:column;background:var(--color-surface);border:1px solid var(--color-border);border-radius:14px;overflow:hidden;text-decoration:none;color:var(--color-text)}
.card .thumb{border-radius:0}
.cb{display:flex;flex-direction:column;gap:2px;padding:10px 12px}
.meta{font-size:13px;color:var(--color-text-muted)}
.cost{font-weight:800;color:var(--color-primary);font-size:17px}
.lots{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px}
.lotc{display:flex;flex-direction:column;background:var(--color-surface);border:1px solid var(--color-border);border-radius:12px;padding:12px;text-decoration:none;color:var(--color-text)}
.lotc b{font-size:20px}
.lotc span{font-size:13px;color:var(--color-text-muted)}
.lotc .cost{font-size:15px;color:var(--color-primary)}
.foot{max-width:980px;margin:0 auto;padding:16px;font-size:12.5px;color:var(--color-text-muted);border-top:1px solid var(--color-border)}
@media (max-width:700px){
  h1{font-size:22px}
  .hero{grid-template-columns:1fr}
  .answer .big{font-size:26px}
  .btn-top{padding:6px 10px;font-size:13px}
  .facts{grid-template-columns:1fr 1fr}
  .floors{grid-template-columns:1fr 1fr}
}
@media (max-width:420px){ .floors{grid-template-columns:1fr} }
'''


def main():
    data_path, css_path = sys.argv[1], sys.argv[2]
    levels, cats, lots = load(data_path)
    svg_css = open(css_path, encoding='utf-8').read()
    os.makedirs(OUT, exist_ok=True)
    for f in os.listdir(OUT):          # dọn trang cũ (mẫu/lô có thể đổi tên)
        if f.endswith('.html'):
            os.remove(os.path.join(OUT, f))
    open(os.path.join(OUT, 'style.css'), 'w', encoding='utf-8').write(svg_css + '\n' + STYLE)
    urls = [('/', '1.0'), ('/xay-nha/', '0.9')]
    open(os.path.join(OUT, 'index.html'), 'w', encoding='utf-8').write(index_page(lots))
    n = 0
    for lot in lots:
        if not lot['items']:
            continue
        open(os.path.join(OUT, lot['slug'] + '.html'), 'w', encoding='utf-8').write(lot_page(lot, lots))
        urls.append((f"/xay-nha/{lot['slug']}", '0.8'))
        for it in lot['items']:
            if not it['page']:
                continue
            open(os.path.join(OUT, it['slug'] + '.html'), 'w', encoding='utf-8').write(detail_page(lot, it, levels, cats, lots))
            urls.append((it['url'], '0.7'))
            n += 1
    sm = ['<?xml version="1.0" encoding="UTF-8"?>', '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">']
    sm += [f'  <url><loc>{SITE}{u}</loc><lastmod>{TODAY}</lastmod><priority>{p}</priority></url>' for u, p in urls]
    sm.append('</urlset>')
    open(os.path.join(ROOT, 'sitemap.xml'), 'w', encoding='utf-8').write('\n'.join(sm) + '\n')
    print(f'{len(lots)} lô, {n} trang mẫu, {len(urls)} URL trong sitemap')


if __name__ == '__main__':
    main()
