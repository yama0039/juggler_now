/**
 * Juggler Data Bridge - Bookmarklet Generator
 */

const BOOKMARKLET_CODE = `(function() {
  const modelName = document.querySelector('#slumpTi h2 strong')?.innerText || '';
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

  const table = document.querySelector('.tablesorter');
  if (!table) { alert('テーブルが見つかりません'); return; }
  
  const headers = Array.from(table.querySelectorAll('thead th')).map(th => th.innerText.trim());
  const idx = {
    no: headers.findIndex(h => h.includes('台番号')),
    g: headers.findIndex(h => h.includes('累計スタート')),
    bb: headers.findIndex(h => h.includes('BB')),
    rb: headers.findIndex(h => h.includes('RB'))
  };

  if (idx.no === -1 || idx.g === -1) {
    alert('必要な列（台番号、累計スタート等）が見つかりません');
    return;
  }

  const rows = Array.from(table.querySelectorAll('tbody tr')).filter(tr => tr.style.display !== 'none');
  const data = rows.map(tr => {
    const td = tr.querySelectorAll('td');
    const no = td[idx.no].innerText.trim();
    const g = td[idx.g].innerText.trim().replace(/,/g, '');
    const bb = td[idx.bb].innerText.trim();
    const rb = td[idx.rb].innerText.trim();
    return \`\${mid},\${no},\${g},0,\${bb},\${rb}\`;
  }).join('|');

  const url = window.location.origin + window.location.pathname + '?d=' + encodeURIComponent(data);
  location.href = url;
})();`;

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarklet');
    
    // Minify and wrap in javascript: pseudo-protocol
    const minified = BOOKMARKLET_CODE
        .replace(/\n/g, '')
        .replace(/\s{2,}/g, ' ');
        
    bookmarkletLink.href = `javascript:${minified}`;
    
    // Check for data in URL
    const params = new URLSearchParams(window.location.search);
    const dataString = params.get('d');
    if (dataString) {
        showAnalysis(dataString);
    }

    // ... (rest of existing logic) ...
    // Copy functionality
    const copyBtn = document.getElementById('copy-code-btn');
    copyBtn.addEventListener('click', () => {
        const fullCode = `javascript:${minified}`;
        navigator.clipboard.writeText(fullCode).then(() => {
            copyBtn.innerText = 'コピーしました！';
            copyBtn.style.background = 'rgba(0, 255, 100, 0.2)';
            setTimeout(() => {
                copyBtn.innerText = 'コードをコピー';
                copyBtn.style.background = '';
            }, 2000);
        });
    });

    // Drag and drop prevent default
    bookmarkletLink.addEventListener('click', (e) => {
        if (e.target.tagName === 'A') {
            e.preventDefault();
            alert('このボタンをブックマークバーにドラッグ＆ドロップしてください。');
        }
    });
});

function showAnalysis(dataString) {
    document.getElementById('installer-section').style.display = 'none';
    document.getElementById('analysis-section').style.display = 'block';
    
    const rows = dataString.split('|');
    const tbody = document.getElementById('analysis-tbody');
    tbody.innerHTML = '';
    
    let totalGames = 0, totalBB = 0, totalRB = 0;
    const modelIdMap = { 'I6': 'アイム', 'M5': 'マイジャグ', 'F2': 'ファンキー', 'G3': 'ゴーゴー', 'H3': 'ハッピー', 'GG': 'ガールズ', 'MR': 'ミスター', 'UM': 'ミラクル' };
    
    rows.forEach(rowData => {
        const [mid, no, g, diff, bb, rb] = rowData.split(',');
        const gameCount = parseInt(g) || 0;
        const bbCount = parseInt(bb) || 0;
        const rbCount = parseInt(rb) || 0;
        
        totalGames += gameCount;
        totalBB += bbCount;
        totalRB += rbCount;
        
        const combined = bbCount + rbCount;
        const prob = combined > 0 ? (gameCount / combined).toFixed(1) : '-';
        const modelName = modelIdMap[mid] || 'ジャグラー';
        document.getElementById('display-model-name').innerText = modelName + ' 解析結果';

        const tr = document.createElement('tr');
        const probClass = (parseFloat(prob) < 135) ? 'high-setting' : '';
        
        tr.innerHTML = `
            <td>${no}</td>
            <td>${gameCount.toLocaleString()}</td>
            <td>${bbCount}</td>
            <td>${rbCount}</td>
            <td>${combined}</td>
            <td class="${probClass}">${prob !== '-' ? '1/' + prob : '-'}</td>
        `;
        tbody.appendChild(tr);
    });
    
    // Summary
    const avgCombined = (totalBB + totalRB) > 0 ? (totalGames / (totalBB + totalRB)).toFixed(1) : '-';
    document.getElementById('total-units').innerText = rows.length;
    document.getElementById('avg-bb').innerText = (totalBB / rows.length).toFixed(1);
    document.getElementById('avg-rb').innerText = (totalRB / rows.length).toFixed(1);
    document.getElementById('avg-combined').innerText = avgCombined !== '-' ? '1/' + avgCombined : '-';
}

// Tab switcher
window.showTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
};
