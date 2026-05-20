const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const html = fs.readFileSync('page.html', 'utf8');
const dom = new JSDOM(html, { url: "https://kicona.pt.teramoba2.com/totsuka/standlist_slot/?kind_code=21&machine_name=S%25EF%25BE%258F%25EF%25BD%25B2%25EF%25BD%25BC%25EF%25BE%259E%25EF%25BD%25AC%25EF%25BD%25B8%25EF%25BE%259E%25EF%25BE%2597%25EF%25BD%25B0VKD" });
const window = dom.window;
const document = window.document;

// Simulate the bookmarklet
const targetUrl = 'http://localhost/nowdataviewer/';
  
function getText(el) {
    if (!el) return '';
    return String(el.innerText || el.textContent || '').trim();
}

let modelName = document.title;
const hTags = document.querySelectorAll('h1, h2, h3, .machine_name, .title, strong');
for (const h of hTags) {
    const txt = getText(h);
    if (txt && (txt.includes('ジャグラー') || txt.includes('ｼﾞｬｸﾞﾗｰ'))) {
        modelName += ' ' + txt;
    }
}

const modelMap = {
    'アイム': 'I6', 'ｱｲﾑ': 'I6',
    'ファンキー': 'F2', 'ﾌｧﾝｷｰ': 'F2',
    'マイジャグ': 'M5', 'ﾏｲｼﾞｬｸﾞ': 'M5',
    'ハッピー': 'H3', 'ﾊｯﾋﾟｰ': 'H3',
    'ゴーゴー': 'G3', 'ｺﾞｰｺﾞｰ': 'G3',
    'ガールズ': 'GG', 'ｶﾞｰﾙｽﾞ': 'GG',
    'ミスター': 'MR', 'ﾐｽﾀｰ': 'MR',
    'ミラクル': 'UM', 'ﾐﾗｸﾙ': 'UM'
};

let mid = 'J';
for (const [k, v] of Object.entries(modelMap)) {
    if (modelName.includes(k)) { mid = v; break; }
}

const tables = document.querySelectorAll('table');
let targetTable = null;
let idx = { no: -1, g: -1, bb: -1, rb: -1 };

for (const table of tables) {
    const trs = table.querySelectorAll('tr');
    if (trs.length === 0) continue;
    const firstRowCells = Array.from(trs[0].querySelectorAll('th, td') || []);
    const headers = firstRowCells.map(c => getText(c).replace(/\\s+/g, ''));
    
    idx.no = headers.findIndex(h => h.includes('台番'));
    idx.g = headers.findIndex(h => h.includes('G数') || h.includes('ゲーム') || h.includes('スタート') || h.includes('回転') || h.includes('総回'));
    idx.bb = headers.findIndex(h => h.includes('BB') || h.includes('BIG') || h.includes('大当'));
    idx.rb = headers.findIndex(h => h.includes('RB') || h.includes('REG') || h.includes('レギュラー'));
    
    if (idx.no !== -1 && (idx.bb !== -1 || idx.g !== -1)) {
        targetTable = table;
        break;
    }
}

if (!targetTable) {
    console.log('alert: NotFound');
    process.exit(0);
}

const rows = Array.from(targetTable.querySelectorAll('tr')).filter(tr => tr.style.display !== 'none');
const data = [];

for (let i = 0; i < rows.length; i++) {
    const td = rows[i].querySelectorAll('td');
    if (td.length === 0) continue; 
    
    const noText = getText(td[idx.no]);
    const no = noText.replace(/[^0-9]/g, '');
    if (!no || isNaN(parseInt(no, 10))) continue;
    
    const g = getText(td[idx.g]).replace(/[^0-9]/g, '') || '0';
    const bb = getText(td[idx.bb]).replace(/[^0-9]/g, '') || '0';
    const rb = getText(td[idx.rb]).replace(/[^0-9]/g, '') || '0';
    
    data.push([mid, no, g, 0, bb, rb].join(','));
}

if (data.length === 0) {
    console.log('alert: NoData');
    process.exit(0);
}

console.log(data);

console.log('Redirecting to:', targetUrl + '?d=' + encodeURIComponent(data.join('|')));
