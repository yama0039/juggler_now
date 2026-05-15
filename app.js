/**
 * Juggler Data Bridge - Bookmarklet Generator
 */

const BOOKMARKLET_CODE = `(function() {
  const modelName = document.querySelector('#slumpTi h2 strong')?.innerText || '';
  const modelMap = {
    'アイムジャグラー': 'I6',
    'ファンキージャグラー': 'F2',
    'マイジャグラー': 'M5',
    'ハッピージャグラー': 'H3',
    'ゴーゴージャグラー': 'G3',
    'ガールズ': 'GG',
    'ミスタージャグラー': 'MR',
    'ミラクルジャグラー': 'UM'
  };
  
  let mid = 'J'; // Default
  for (const [k, v] of Object.entries(modelMap)) {
    if (modelName.includes(k)) { 
      mid = v; 
      break; 
    }
  }

  const rows = Array.from(document.querySelectorAll('.tablesorter tbody tr'));
  if (rows.length === 0) {
    alert('台データが見つかりませんでした。機種別一覧ページ（テーブルが表示されているページ）で実行してください。');
    return;
  }

  const data = rows.map(tr => {
    const td = tr.querySelectorAll('td');
    const no = td[0].innerText.trim();
    const g = td[1].innerText.trim().replace(/,/g, '');
    const bb = td[2].innerText.trim();
    const rb = td[3].innerText.trim();
    // Format: mid,no,g,diff,bb,rb
    // Goraggio doesn't always show diff (difference) in unit_list, so we set it to 0
    return \`\${mid},\${no},\${g},0,\${bb},\${rb}\`;
  }).join('|');

  const url = 'https://kenslo65536.com/tool/ana-juggler-receiver.html?d=' + encodeURIComponent(data);
  window.open(url, '_blank');
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
