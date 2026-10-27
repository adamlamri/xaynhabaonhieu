// Server tĩnh để chấm mặt bằng nhà mẫu hàng loạt và xuất số liệu trang SEO (không cần cài gì thêm):
//   node tools/layout-audit-server.mjs        → http://127.0.0.1:8767/
// Trang chính là app thật, chèn thêm window.__X (hàm nội bộ) và tools/layout-audit.js.
// Trong DevTools / javascript_tool:  auditTemplates(__X)            → mọi mẫu × LOT_PRESETS
//                                     auditTemplates(__X, {only:['tube3'], lots:[[5,20]], withWarn:true})
// POST /__out/<tên file> ghi nội dung vào thư mục OUT_DIR (mặc định <tmp>/xaynhabaonhieu-seo) — dùng cho
// tools/seo_export.js (xem tools/README.md).
import http from 'node:http';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const PORT = Number(process.env.PORT) || 8767;
const OUT_DIR = process.env.OUT_DIR || path.join(os.tmpdir(), 'xaynhabaonhieu-seo');
const HOOK = "if(document.readyState === 'loading'){";
const EXPOSE = 'window.__X = {HOUSE_TEMPLATES:HOUSE_TEMPLATES, LOT_PRESETS:LOT_PRESETS, buildPlanFromTemplate:buildPlanFromTemplate, planGeometry:planGeometry, geoRoomType:geoRoomType, scoreTemplate:scoreTemplate, planLivability:planLivability,'
  + ' FINISH_LEVELS:FINISH_LEVELS, CATEGORIES:CATEGORIES, categoryShort:categoryShort, computePlanStats:computePlanStats, houseElevationSvg:houseElevationSvg, renderVizSvg:renderVizSvg, maxDensity:maxDensity};\n';
const TYPES = {'.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.json':'application/json', '.svg':'image/svg+xml', '.png':'image/png', '.webmanifest':'application/manifest+json'};

function app(){
  let html = fs.readFileSync(path.join(root, 'du-toan-xay-nha.html'), 'utf8');
  if(!html.includes(HOOK)) throw new Error('Không tìm thấy điểm chèn: ' + HOOK);
  html = html.replace(HOOK, EXPOSE + HOOK);
  // '</body>' còn xuất hiện trong chuỗi JS (in ấn) → chèn vào thẻ đóng cuối cùng
  const end = html.lastIndexOf('</body>');
  return html.slice(0, end) + '<script src="/tools/layout-audit.js"></script>\n' + html.slice(end);
}

http.createServer((req, res) => {
  try {
    const url = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    if(req.method === 'POST' && url.startsWith('/__out/')){
      const name = path.basename(url);
      const chunks = [];
      req.on('data', c => chunks.push(c));
      req.on('end', () => {
        fs.mkdirSync(OUT_DIR, {recursive:true});
        fs.writeFileSync(path.join(OUT_DIR, name), Buffer.concat(chunks));
        console.log('Đã ghi', path.join(OUT_DIR, name));
        res.writeHead(200); res.end('ok');
      });
      return;
    }
    if(url === '/' || url === '/app.html'){
      res.writeHead(200, {'Content-Type':TYPES['.html'], 'Cache-Control':'no-store'});
      return res.end(app());
    }
    const file = path.join(root, url);
    if(!file.startsWith(root) || !fs.existsSync(file) || fs.statSync(file).isDirectory()){ res.writeHead(404); return res.end('404'); }
    res.writeHead(200, {'Content-Type':TYPES[path.extname(file)] || 'application/octet-stream', 'Cache-Control':'no-store'});
    fs.createReadStream(file).pipe(res);
  } catch(e){
    res.writeHead(500); res.end(String(e && e.stack || e));
  }
}).listen(PORT, '127.0.0.1', () => console.log('Layout audit: http://127.0.0.1:' + PORT + '/'));
