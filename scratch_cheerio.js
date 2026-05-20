const fs = require('fs');
const cheerio = require('cheerio');

const html = fs.readFileSync('page.html', 'utf8');
const $ = cheerio.load(html);

function getText(el) {
    if (!el) return '';
    return $(el).text().trim();
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
    
    console.log('Headers:', headers);
    console.log('Detected Index:', idx);
    
    if (idx.no !== -1 && (idx.bb !== -1 || idx.g !== -1)) {
        targetTable = table;
        break;
    }
}

if (!targetTable) {
    console.log('alert: NotFound');
    process.exit(0);
}

const rows = $(targetTable).find('tr').toArray().filter(tr => $(tr).css('display') !== 'none');
const data = [];

for (let i = 0; i < rows.length; i++) {
    const td = $(rows[i]).find('td').toArray();
    if (td.length === 0) continue; 
    
    const noText = getText(td[idx.no]);
    const no = noText.replace(/[^0-9]/g, '');
    if (!no || isNaN(parseInt(no, 10))) continue;
    
    const gText = getText(td[idx.g]);
    const bbText = getText(td[idx.bb]);
    const rbText = getText(td[idx.rb]);
    
    const g = gText.replace(/[^0-9]/g, '') || '0';
    const bb = bbText.replace(/[^0-9]/g, '') || '0';
    const rb = rbText.replace(/[^0-9]/g, '') || '0';
    
    data.push(`no:${no}, g:${g}(raw:${gText}), bb:${bb}(raw:${bbText}), rb:${rb}(raw:${rbText})`);
}

console.log('Extracted Data:');
console.log(data.join('\n'));
