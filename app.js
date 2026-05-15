/**
 * Juggler Data Bridge - Unified App Logic
 */

const BOOKMARKLET_TEMPLATE = `(function() {
  const targetUrl = 'TARGET_URL';
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
    return [mid, no, g, 0, bb, rb].join(',');
  }).join('|');

  location.href = targetUrl + '?d=' + encodeURIComponent(data);
})();`;

const machineSpecs = [
    { id: 'I6', name: 'SアイムジャグラーEX', bigPayout: 252, regPayout: 96, backcalcCherry: 35.617, settings: { 1: { big: 273.1, reg: 439.8, grape: 6.02, payout: 97.9 }, 2: { big: 269.7, reg: 399.6, grape: 6.02, payout: 99.0 }, 3: { big: 269.7, reg: 331.0, grape: 6.02, payout: 100.1 }, 4: { big: 259.0, reg: 315.1, grape: 6.02, payout: 101.9 }, 5: { big: 259.0, reg: 255.0, grape: 6.02, payout: 104.5 }, 6: { big: 255.0, reg: 255.0, grape: 5.85, payout: 106.8 } } },
    { id: 'M5', name: 'マイジャグラーⅤ', bigPayout: 240, regPayout: 96, backcalcCherry: 34.657, settings: { 1: { big: 273.1, reg: 409.6, grape: 5.91, payout: 98.1 }, 2: { big: 270.8, reg: 385.5, grape: 5.87, payout: 99.3 }, 3: { big: 266.4, reg: 336.1, grape: 5.83, payout: 101.5 }, 4: { big: 254.0, reg: 290.0, grape: 5.80, payout: 104.1 }, 5: { big: 240.1, reg: 268.6, grape: 5.76, payout: 106.3 }, 6: { big: 229.1, reg: 229.1, grape: 5.67, payout: 110.6 } } },
    { id: 'F2', name: 'ファンキージャグラー2', bigPayout: 240, regPayout: 96, backcalcCherry: 35.617, settings: { 1: { big: 266.4, reg: 439.8, grape: 5.94, payout: 98.2 }, 2: { big: 259.0, reg: 407.1, grape: 5.93, payout: 99.5 }, 3: { big: 256.0, reg: 366.1, grape: 5.88, payout: 101.2 }, 4: { big: 249.2, reg: 322.8, grape: 5.83, payout: 103.5 }, 5: { big: 240.1, reg: 299.3, grape: 5.80, payout: 105.8 }, 6: { big: 219.9, reg: 262.1, grape: 5.77, payout: 110.3 } } },
    { id: 'G3', name: 'ゴーゴージャグラー3', bigPayout: 240, regPayout: 96, backcalcCherry: 33.2, settings: { 1: { big: 259.0, reg: 354.2, grape: 6.25, payout: 98.2 }, 2: { big: 258.0, reg: 332.7, grape: 6.20, payout: 99.5 }, 3: { big: 257.0, reg: 306.2, grape: 6.15, payout: 101.5 }, 4: { big: 254.0, reg: 268.6, grape: 6.07, payout: 104.0 }, 5: { big: 247.3, reg: 247.3, grape: 6.00, payout: 106.5 }, 6: { big: 234.9, reg: 234.9, grape: 5.92, payout: 110.1 } } },
    { id: 'H3', name: 'ハッピージャグラーVIII', bigPayout: 240, regPayout: 96, backcalcCherry: 56.55, settings: { 1: { big: 273.1, reg: 397.2, grape: 6.04, payout: 98.0 }, 2: { big: 270.8, reg: 362.1, grape: 6.01, payout: 99.2 }, 3: { big: 263.2, reg: 332.7, grape: 5.98, payout: 101.0 }, 4: { big: 254.0, reg: 300.6, grape: 5.86, payout: 103.9 }, 5: { big: 239.2, reg: 273.1, grape: 5.84, payout: 106.9 }, 6: { big: 226.0, reg: 256.0, grape: 5.82, payout: 110.1 } } },
    { id: 'GG', name: 'ジャグラーガールズSS', bigPayout: 240, regPayout: 96, backcalcCherry: 33.3, settings: { 1: { big: 273.1, reg: 381.0, grape: 6.01, payout: 98.0 }, 2: { big: 270.8, reg: 350.5, grape: 6.01, payout: 99.2 }, 3: { big: 260.1, reg: 316.6, grape: 6.01, payout: 101.1 }, 4: { big: 250.1, reg: 281.3, grape: 6.01, payout: 103.8 }, 5: { big: 243.6, reg: 270.8, grape: 5.92, payout: 106.1 }, 6: { big: 226.0, reg: 252.1, grape: 5.89, payout: 110.1 } } },
    { id: 'MR', name: 'ミスタージャグラー', bigPayout: 240, regPayout: 96, backcalcCherry: 39.0, settings: { 1: { big: 268.6, reg: 374.5, grape: 6.22, payout: 98.0 }, 2: { big: 267.5, reg: 354.2, grape: 6.16, payout: 99.2 }, 3: { big: 260.1, reg: 331.0, grape: 6.12, payout: 101.3 }, 4: { big: 249.2, reg: 291.3, grape: 6.09, payout: 104.2 }, 5: { big: 240.9, reg: 257.0, grape: 6.05, payout: 107.0 }, 6: { big: 237.4, reg: 237.4, grape: 6.02, payout: 110.1 } } },
    { id: 'UM', name: 'ウルトラミラクルジャグラー', bigPayout: 240, regPayout: 96, backcalcCherry: 34.86, settings: { 1: { big: 267.5, reg: 425.6, grape: 5.94, payout: 98.1 }, 2: { big: 261.1, reg: 402.1, grape: 5.94, payout: 99.4 }, 3: { big: 256.0, reg: 350.5, grape: 5.94, payout: 101.4 }, 4: { big: 242.7, reg: 322.8, grape: 5.93, payout: 104.3 }, 5: { big: 233.2, reg: 297.9, grape: 5.93, payout: 106.9 }, 6: { big: 216.3, reg: 277.7, grape: 5.93, payout: 110.5 } } }
];

function backCalculateGrapes(machine, spins, big, reg, diff) {
    const replayProb = 1 / 7.298;
    const totalIn = spins * 3;
    const totalOut = totalIn + diff;
    const bonusOut = (big * machine.bigPayout) + (reg * machine.regPayout);
    const cherryOut = (spins / machine.backcalcCherry) * 2;
    const replayOut = (spins * replayProb) * 3;
    const remainingOut = totalOut - bonusOut - cherryOut - replayOut;
    return Math.max(0, Math.round(remainingOut / 8));
}

function calculateEstimation(machine, spins, big, reg, grape) {
    const settings = [1, 2, 3, 4, 5, 6];
    const logLikelihoods = settings.map(s => {
        const specs = machine.settings[s];
        const pBig = 1 / specs.big;
        const pReg = 1 / specs.reg;
        const pGrape = 1 / specs.grape;
        const pMiss = 1 - (pBig + pReg + pGrape);
        const missCount = spins - (big + reg + grape);
        return (big * Math.log(pBig)) + (reg * Math.log(pReg)) + (grape * Math.log(pGrape)) + (missCount * Math.log(pMiss));
    });
    const maxLog = Math.max(...logLikelihoods);
    const likelihoods = logLikelihoods.map(l => Math.exp(l - maxLog));
    const sumLikelihood = likelihoods.reduce((a, b) => a + b, 0);
    return settings.map((s, i) => ({ setting: s, prob: (likelihoods[i] / sumLikelihood) * 100 }));
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.origin + window.location.pathname;
    
    // Debug display
    const debugEl = document.getElementById('debug-url');
    if (debugEl) debugEl.innerText = `Redirecting to: ${currentUrl}`;

    const minified = BOOKMARKLET_TEMPLATE
        .replace('TARGET_URL', currentUrl)
        .replace(/\n/g, '')
        .replace(/\s{2,}/g, ' ');
        
    const bookmarkletLink = document.getElementById('bookmarklet');
    if (bookmarkletLink) {
        bookmarkletLink.href = `javascript:${minified}`;
        bookmarkletLink.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                alert('このボタンをブックマークバーにドラッグ＆ドロップしてください。');
            }
        });
    }

    const copyBtn = document.getElementById('copy-code-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(`javascript:${minified}`).then(() => {
                copyBtn.innerText = 'コピーしました！';
                setTimeout(() => copyBtn.innerText = 'コードをコピー', 2000);
            });
        });
    }
    
    const params = new URLSearchParams(window.location.search);
    const dataString = params.get('d');
    if (dataString) {
        showAnalysis(dataString);
    }
});

function showAnalysis(dataString) {
    document.getElementById('installer-section').style.display = 'none';
    document.getElementById('analysis-section').style.display = 'block';
    
    const rawRows = dataString.split('|');
    const container = document.getElementById('cards-container');
    container.innerHTML = '';
    
    const mid = rawRows[0].split(',')[0];
    const machine = machineSpecs.find(m => m.id === mid) || machineSpecs[0];
    document.getElementById('display-model-name').innerText = machine.name;
    document.getElementById('model-badge').innerText = mid;

    rawRows.forEach((rowData, index) => {
        const [_, no, g, __, bb, rb] = rowData.split(',');
        const gameCount = parseInt(g) || 0;
        const bbCount = parseInt(bb) || 0;
        const rbCount = parseInt(rb) || 0;
        
        const card = document.createElement('div');
        card.className = 'unit-card';
        card.innerHTML = `
            <div class="card-top">
                <div class="unit-no"><span>No.</span>${no}</div>
                <div class="estimation-badge">
                    <span class="est-setting">設定 ?</span>
                    <span class="est-prob">-%</span>
                </div>
            </div>
            <div class="card-main">
                <div class="data-item">
                    <span class="label">Games</span>
                    <span class="value">${gameCount.toLocaleString()}</span>
                </div>
                <div class="data-item">
                    <span class="label">BB / RB</span>
                    <span class="value">${bbCount} / ${rbCount}</span>
                </div>
                <div class="data-item">
                    <span class="label">合算</span>
                    <span class="prob-val value">-</span>
                </div>
                <div class="data-item">
                    <span class="label">ブドウ</span>
                    <span class="grape-val value">-</span>
                </div>
            </div>
            <div class="card-input">
                <label>差枚数 入力</label>
                <input type="number" class="diff-input" placeholder="0">
            </div>
        `;
        container.appendChild(card);

        const input = card.querySelector('.diff-input');
        input.addEventListener('input', () => {
            updateRowAnalysis(card, machine, gameCount, bbCount, rbCount, parseInt(input.value) || 0);
            updateGlobalSummary(machine);
        });
        updateRowAnalysis(card, machine, gameCount, bbCount, rbCount, 0);
    });
    updateGlobalSummary(machine);
}

function updateRowAnalysis(card, machine, spins, big, reg, diff) {
    const grapeCount = backCalculateGrapes(machine, spins, big, reg, diff);
    const grapeProb = grapeCount > 0 ? (spins / grapeCount).toFixed(2) : '-';
    const estimation = calculateEstimation(machine, spins, big, reg, grapeCount);
    const sorted = [...estimation].sort((a, b) => b.prob - a.prob);
    const best = sorted[0];
    
    card.querySelector('.grape-val').innerText = grapeProb !== '-' ? '1/' + grapeProb : '-';
    card.querySelector('.prob-val').innerText = (big + reg > 0) ? '1/' + (spins / (big + reg)).toFixed(1) : '-';
    
    const estEl = card.querySelector('.est-setting');
    estEl.innerText = `設定${best.setting}`;
    card.querySelector('.est-prob').innerText = `${best.prob.toFixed(1)}%`;
    
    const highProb = estimation.filter(e => e.setting >= 5).reduce((s, e) => s + e.prob, 0);
    estEl.style.color = highProb > 50 ? '#00ff66' : (best.setting >= 4 ? '#ffcc00' : '#fff');
}

function updateGlobalSummary(machine) {
    const cards = Array.from(document.querySelectorAll('.unit-card'));
    let tSpins = 0, tBB = 0, tRB = 0, tDiff = 0;
    cards.forEach(card => {
        tSpins += parseInt(card.querySelector('.data-item .value').innerText.replace(/,/g, '')) || 0;
        const counts = card.querySelectorAll('.data-item .value')[1].innerText.split(' / ');
        tBB += parseInt(counts[0]) || 0;
        tRB += parseInt(counts[1]) || 0;
        tDiff += parseInt(card.querySelector('.diff-input').value) || 0;
    });

    const tGrape = backCalculateGrapes(machine, tSpins, tBB, tRB, tDiff);
    const avgGrape = tGrape > 0 ? (tSpins / tGrape).toFixed(2) : '-';
    const estimation = calculateEstimation(machine, tSpins, tBB, tRB, tGrape);
    const best = [...estimation].sort((a, b) => b.prob - a.prob)[0];

    document.getElementById('total-units').innerText = cards.length;
    document.getElementById('avg-counts').innerText = `${(tBB / cards.length).toFixed(1)} / ${(tRB / cards.length).toFixed(1)}`;
    document.getElementById('avg-grape').innerText = avgGrape !== '-' ? '1/' + avgGrape : '-';
    document.getElementById('estimated-setting').innerText = `設定${best.setting}`;
}

window.showTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
};
