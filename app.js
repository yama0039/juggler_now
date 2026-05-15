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

  const url = 'https://kenslo65536.com/tool/ana-juggler-receiver.html?d=' + encodeURIComponent(data);
  location.href = url;
})();`;

document.addEventListener('DOMContentLoaded', () => {
    const bookmarkletLink = document.getElementById('bookmarklet');
    
    // Minify and wrap in javascript: pseudo-protocol
    const minified = BOOKMARKLET_CODE
        .replace(/\n/g, '')
        .replace(/\s{2,}/g, ' ');
        
    bookmarkletLink.href = `javascript:${minified}`;
    
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

// Tab switcher
window.showTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    
    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
};
