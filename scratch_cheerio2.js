const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('page.html', 'utf8');
const $ = cheerio.load(html);

function getText(el) {
    if (!el) return '';
    return $(el).text().trim();
}

function extractMainNumber(txt) {
    // 改行や空白、スラッシュなどで分割し、最初に現れた有効な数字の塊を返す
    const parts = txt.split(/[\s\n/・]+/);
    for (const p of parts) {
      const num = p.replace(/[^0-9]/g, '');
      if (num !== '') return num;
    }
    return '0';
}

const tables = $('table').toArray();
let targetTable = null;
let idx = { no: -1, g: -1, bb: -1, rb: -1 };

for (const table of tables) {
    const trs = $(table).find('tr').toArray();
    if (trs.length === 0) continue;
    
    // HTMLソース上のtr[0]からthとtdを取得
    const firstRowCells = $(trs[0]).find('th, td').toArray();
    const headers = firstRowCells.map(c => getText(c).replace(/\s+/g, ''));
    
    idx.no = headers.findIndex(h => h.includes('台番'));
    
    let gIdx = headers.findIndex(h => h.includes('総回') || h.includes('累計') || h.includes('総G'));
    if (gIdx === -1) {
        gIdx = headers.findIndex(h => h.includes('G数') || h.includes('ゲーム') || h.includes('スタート') || h.includes('回転'));
    }
    idx.g = gIdx;
    
    idx.bb = headers.findIndex(h => (h.includes('BB') || h.includes('BIG') || h.includes('大当')) && !h.includes('確率') && !h.includes('率'));
    idx.rb = headers.findIndex(h => (h.includes('RB') || h.includes('REG') || h.includes('レギュラー')) && !h.includes('確率') && !h.includes('率'));
    
    if (idx.no !== -1 && (idx.bb !== -1 || idx.g !== -1)) {
        targetTable = table;
        break;
    }
}

const rows = $(targetTable).find('tr').toArray();
const data = [];

for (let i = 0; i < rows.length; i++) {
    const td = $(rows[i]).find('td').toArray();
    if (td.length === 0) continue; 
    
    const noText = getText(td[idx.no]);
    const no = extractMainNumber(noText);
    if (!no || isNaN(parseInt(no, 10))) continue;
    
    const g = extractMainNumber(getText(td[idx.g]));
    const bb = extractMainNumber(getText(td[idx.bb]));
    const rb = extractMainNumber(getText(td[idx.rb]));
    
    data.push(['M5', no, g, bb, rb].join(','));
}

console.log(data.join('|'));
