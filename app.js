/**
 * Juggler Data Bridge - Unified App Logic (v1.5.0)
 */

const BOOKMARKLET_TEMPLATE = `(function() {
  const targetUrl = 'TARGET_URL';
  
  function getText(el) {
    if (!el) return '';
    return String(el.innerText || el.textContent || '').trim();
  }
  
  let modelName = document.title;
  const hTags = document.querySelectorAll('h1, h2, h3, .machine_name, .title, strong, .in-wrap-machine-name, p');
  for (const h of hTags) {
    const txt = getText(h);
    if (txt && (txt.includes('\u30b8\u30e3\u30b0\u30e9\u30fc') || txt.includes('\uff7c\uff9e\uff6c\uff78\uff9e\uff97\uff70'))) {
      modelName += ' ' + txt;
    }
  }

  const modelMap = {
    '\u30a2\u30a4\u30e0': 'I6', '\uff71\uff72\uff91': 'I6',
    '\u30d5\u30a1\u30f3\u30ad\u30fc': 'F2', '\uff8c\uff67\uff9d\uff77\uff70': 'F2',
    '\u30de\u30a4\u30b8\u30e3\u30b0': 'M5', '\uff8f\uff72\uff7c\uff9e\uff6c\uff78\uff9e': 'M5',
    '\u30cf\u30c3\u30d4\u30fc': 'H3', '\uff8a\uff6f\uff8b\uff9f\uff70': 'H3',
    '\u30b4\u30fc\u30b4\u30fc': 'G3', '\uff7a\uff9e\uff70\uff7a\uff9e\uff70': 'G3',
    '\u30ac\u30fc\u30eb\u30ba': 'GG', '\uff76\uff9e\uff70\uff99\uff7d\uff9e': 'GG',
    '\u30df\u30b9\u30bf\u30fc': 'MR', '\uff90\uff7d\uff80\uff70': 'MR',
    '\u30df\u30e9\u30af\u30eb': 'UM', '\uff90\uff97\uff78\uff99': 'UM'
  };
  
  let mid = 'J';
  for (const [k, v] of Object.entries(modelMap)) {
    if (modelName.includes(k)) { mid = v; break; }
  }

  const tables = document.querySelectorAll('table');
  let targetTable = null;
  let idx = { no: -1, g: -1, bb: -1, rb: -1 };
  let debugInfo = 'Tables found: ' + tables.length;
  
  for (const table of tables) {
    const trs = table.querySelectorAll('tr');
    if (trs.length === 0) continue;
    const firstRowCells = Array.from(trs[0].querySelectorAll('th, td') || []);
    const headers = firstRowCells.map(c => getText(c).replace(/\s+/g, ''));
    debugInfo += ' | H[' + trs.length + ']: ' + headers.slice(0, 6).join(',');
    
    idx.no = headers.findIndex(h => h === '\u53f0\u756a' || h.includes('\u53f0\u756a') || h.includes('\u756a\u53f7'));
    
    let gIdx = headers.findIndex(h => h.includes('\u7dcf\u56de') || h.includes('\u7d2f\u8a08') || h.includes('\u7dcfG'));
    if (gIdx === -1) {
      gIdx = headers.findIndex(h => h.includes('G\u6570') || h.includes('\u30b2\u30fc\u30e0') || h.includes('\u30b9\u30bf\u30fc\u30c8') || h.includes('\u56de\u8ee2'));
    }
    idx.g = gIdx;
    
    idx.bb = headers.findIndex(h => (h.includes('BB') || h.includes('BIG') || h.includes('\u5927\u5f53')) && !h.includes('\u78ba\u7387') && !h.includes('\u7387'));
    idx.rb = headers.findIndex(h => (h.includes('RB') || h.includes('REG') || h.includes('\u30ec\u30ae\u30e5\u30e9\u30fc')) && !h.includes('\u78ba\u7387') && !h.includes('\u7387'));
    
    if (idx.no !== -1 && (idx.bb !== -1 || idx.g !== -1)) {
      targetTable = table;
      break;
    }
  }

  if (!targetTable) {
    alert('DEBUG: ' + debugInfo + ' | idx=' + JSON.stringify(idx));
    return;
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
    
    data.push([mid, no, g, bb, rb].join(','));
  }

  if (data.length === 0) {
    alert('DEBUG: Table found but no data. idx=' + JSON.stringify(idx) + ' rows=' + rows.length);
    return;
  }

  location.href = targetUrl + '#d=' + encodeURIComponent(data.join('|'));
})();`;

const machineSpecs = [
    { id: 'I6', name: 'S\u30a2\u30a4\u30e0\u30b8\u30e3\u30b0\u30e9\u30fcEX', bigPayout: 252, regPayout: 96, backcalcCherry: 35.617, settings: { 1: { big: 273.1, reg: 439.8, grape: 6.02, payout: 97.9 }, 2: { big: 269.7, reg: 399.6, grape: 6.02, payout: 99.0 }, 3: { big: 269.7, reg: 331.0, grape: 6.02, payout: 100.1 }, 4: { big: 259.0, reg: 315.1, grape: 6.02, payout: 101.9 }, 5: { big: 259.0, reg: 255.0, grape: 6.02, payout: 104.5 }, 6: { big: 255.0, reg: 255.0, grape: 5.85, payout: 106.8 } } },
    { id: 'M5', name: '\u30de\u30a4\u30b8\u30e3\u30b0\u30e9\u30fc\u2164', bigPayout: 240, regPayout: 96, backcalcCherry: 34.657, settings: { 1: { big: 273.1, reg: 409.6, grape: 5.91, payout: 98.1 }, 2: { big: 270.8, reg: 385.5, grape: 5.87, payout: 99.3 }, 3: { big: 266.4, reg: 336.1, grape: 5.83, payout: 101.5 }, 4: { big: 254.0, reg: 290.0, grape: 5.80, payout: 104.1 }, 5: { big: 240.1, reg: 268.6, grape: 5.76, payout: 106.3 }, 6: { big: 229.1, reg: 229.1, grape: 5.67, payout: 110.6 } } },
    { id: 'F2', name: '\u30d5\u30a1\u30f3\u30ad\u30fc\u30b8\u30e3\u30b0\u30e9\u30fc2', bigPayout: 240, regPayout: 96, backcalcCherry: 35.617, settings: { 1: { big: 266.4, reg: 439.8, grape: 5.94, payout: 98.2 }, 2: { big: 259.0, reg: 407.1, grape: 5.93, payout: 99.5 }, 3: { big: 256.0, reg: 366.1, grape: 5.88, payout: 101.2 }, 4: { big: 249.2, reg: 322.8, grape: 5.83, payout: 103.5 }, 5: { big: 240.1, reg: 299.3, grape: 5.80, payout: 105.8 }, 6: { big: 219.9, reg: 262.1, grape: 5.77, payout: 110.3 } } },
    { id: 'G3', name: '\u30b4\u30fc\u30b4\u30fc\u30b8\u30e3\u30b0\u30e9\u30fc3', bigPayout: 240, regPayout: 96, backcalcCherry: 33.2, settings: { 1: { big: 259.0, reg: 354.2, grape: 6.25, payout: 98.2 }, 2: { big: 258.0, reg: 332.7, grape: 6.20, payout: 99.5 }, 3: { big: 257.0, reg: 306.2, grape: 6.15, payout: 101.5 }, 4: { big: 254.0, reg: 268.6, grape: 6.07, payout: 104.0 }, 5: { big: 247.3, reg: 247.3, grape: 6.00, payout: 106.5 }, 6: { big: 234.9, reg: 234.9, grape: 5.92, payout: 110.1 } } },
    { id: 'H3', name: '\u30cf\u30c3\u30d4\u30fc\u30b8\u30e3\u30b0\u30e9\u30fcVIII', bigPayout: 240, regPayout: 96, backcalcCherry: 56.55, settings: { 1: { big: 273.1, reg: 397.2, grape: 6.04, payout: 98.0 }, 2: { big: 270.8, reg: 362.1, grape: 6.01, payout: 99.2 }, 3: { big: 263.2, reg: 332.7, grape: 5.98, payout: 101.0 }, 4: { big: 254.0, reg: 300.6, grape: 5.86, payout: 103.9 }, 5: { big: 239.2, reg: 273.1, grape: 5.84, payout: 106.9 }, 6: { big: 226.0, reg: 256.0, grape: 5.82, payout: 110.1 } } },
    { id: 'GG', name: '\u30b8\u30e3\u30b0\u30e9\u30fc\u30ac\u30fc\u30eb\u30baSS', bigPayout: 240, regPayout: 96, backcalcCherry: 33.3, settings: { 1: { big: 273.1, reg: 381.0, grape: 6.01, payout: 98.0 }, 2: { big: 270.8, reg: 350.5, grape: 6.01, payout: 99.2 }, 3: { big: 260.1, reg: 316.6, grape: 6.01, payout: 101.1 }, 4: { big: 250.1, reg: 281.3, grape: 6.01, payout: 103.8 }, 5: { big: 243.6, reg: 270.8, grape: 5.92, payout: 106.1 }, 6: { big: 226.0, reg: 252.1, grape: 5.89, payout: 110.1 } } },
    { id: 'MR', name: '\u30df\u30b9\u30bf\u30fc\u30b8\u30e3\u30b0\u30e9\u30fc', bigPayout: 240, regPayout: 96, backcalcCherry: 39.0, settings: { 1: { big: 268.6, reg: 374.5, grape: 6.22, payout: 98.0 }, 2: { big: 267.5, reg: 354.2, grape: 6.16, payout: 99.2 }, 3: { big: 260.1, reg: 331.0, grape: 6.12, payout: 101.3 }, 4: { big: 249.2, reg: 291.3, grape: 6.09, payout: 104.2 }, 5: { big: 240.9, reg: 257.0, grape: 6.05, payout: 107.0 }, 6: { big: 237.4, reg: 237.4, grape: 6.02, payout: 110.1 } } },
    { id: 'UM', name: '\u30a6\u30eb\u30c8\u30e9\u30df\u30e9\u30af\u30eb\u30b8\u30e3\u30b0\u30e9\u30fc', bigPayout: 240, regPayout: 96, backcalcCherry: 34.86, settings: { 1: { big: 267.5, reg: 425.6, grape: 5.94, payout: 98.1 }, 2: { big: 261.1, reg: 402.1, grape: 5.94, payout: 99.4 }, 3: { big: 256.0, reg: 350.5, grape: 5.94, payout: 101.4 }, 4: { big: 242.7, reg: 322.8, grape: 5.93, payout: 104.3 }, 5: { big: 233.2, reg: 297.9, grape: 5.93, payout: 106.9 }, 6: { big: 216.3, reg: 277.7, grape: 5.93, payout: 110.5 } } }
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
        let pTotal = pBig + pReg;
        let logL = (big * Math.log(pBig)) + (reg * Math.log(pReg));
        
        if (grape !== null && grape > 0) {
            const pGrape = 1 / specs.grape;
            pTotal += pGrape;
            logL += (grape * Math.log(pGrape));
        }
        
        const pMiss = 1 - pTotal;
        const observedCount = big + reg + (grape || 0);
        logL += (spins - observedCount) * Math.log(pMiss);
        return logL;
    });
    const maxLog = Math.max(...logLikelihoods);
    const likelihoods = logLikelihoods.map(l => Math.exp(l - maxLog));
    const sumLikelihood = likelihoods.reduce((a, b) => a + b, 0);
    return settings.map((s, i) => ({ setting: s, prob: (likelihoods[i] / sumLikelihood) * 100 }));
}

document.addEventListener('DOMContentLoaded', () => {
    const currentUrl = window.location.origin + window.location.pathname;
    
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
                alert('\u3053\u306e\u30dc\u30bf\u30f3\u3092\u30d6\u30c3\u30af\u30de\u30fc\u30af\u30d0\u30fc\u306b\u30c9\u30e9\u30c3\u30b0\uff06\u30c9\u30ed\u30c3\u30d7\u3057\u3066\u304f\u3060\u3055\u3044\u3002');
            }
        });
    }

    const copyBtn = document.getElementById('copy-code-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(`javascript:${minified}`).then(() => {
                copyBtn.innerText = '\u30b3\u30d4\u30fc\u3057\u307e\u3057\u305f\uff01';
                setTimeout(() => copyBtn.innerText = '\u30b3\u30fc\u30c9\u3092\u30b3\u30d4\u30fc', 2000);
            });
        });
    }
    
    const hash = window.location.hash;
    if (hash && hash.startsWith('#d=')) {
        const dataString = hash.substring(3);
        showAnalysis(decodeURIComponent(dataString));
    } else {
        const params = new URLSearchParams(window.location.search);
        const dataString = params.get('d');
        if (dataString) {
            showAnalysis(dataString);
        }
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
        const cols = rowData.split(',');
        const no = cols[1];
        const g = cols[2];
        const bb = cols.length === 6 ? cols[4] : cols[3];
        const rb = cols.length === 6 ? cols[5] : cols[4];
        
        const gameCount = parseInt(g) || 0;
        const bbCount = parseInt(bb) || 0;
        const rbCount = parseInt(rb) || 0;
        
        const card = document.createElement('div');
        card.className = 'unit-card';
        card.innerHTML = `
            <div class="card-top">
                <div class="unit-no"><span>No.</span>${no}</div>
                <div class="estimation-badge">
                    <span class="est-setting">\u8a2d\u5b9a ?</span>
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
                    <span class="label">\u5408\u7b97</span>
                    <span class="prob-val value">-</span>
                </div>
                <div class="data-item">
                    <span class="label">\u30d6\u30c9\u30a6</span>
                    <span class="grape-val value">-</span>
                </div>
            </div>
            <div class="card-input">
                <label>\u5dee\u679a\u6570 \u5165\u529b</label>
                <input type="number" class="diff-input" placeholder="\u672a\u5165\u529b\u306a\u3089\u30dc\u30fc\u30ca\u30b9\u306e\u307f">
            </div>
        `;
        container.appendChild(card);

        const input = card.querySelector('.diff-input');
        input.addEventListener('input', () => {
            const diffStr = input.value.trim();
            const diff = diffStr === '' ? null : parseInt(diffStr);
            updateRowAnalysis(card, machine, gameCount, bbCount, rbCount, diff);
            updateGlobalSummary(machine);
        });
        updateRowAnalysis(card, machine, gameCount, bbCount, rbCount, null);
    });
    updateGlobalSummary(machine);
}

function updateRowAnalysis(card, machine, spins, big, reg, diff) {
    const grapeCount = diff !== null ? backCalculateGrapes(machine, spins, big, reg, diff) : null;
    const grapeProb = grapeCount !== null && grapeCount > 0 ? (spins / grapeCount).toFixed(2) : '-';
    const estimation = calculateEstimation(machine, spins, big, reg, grapeCount);
    const sorted = [...estimation].sort((a, b) => b.prob - a.prob);
    const best = sorted[0];
    
    card.querySelector('.grape-val').innerText = grapeProb !== '-' ? '1/' + grapeProb : '-';
    card.querySelector('.prob-val').innerText = (big + reg > 0) ? '1/' + (spins / (big + reg)).toFixed(1) : '-';
    
    const estEl = card.querySelector('.est-setting');
    estEl.innerText = `\u8a2d\u5b9a${best.setting}`;
    card.querySelector('.est-prob').innerText = `${best.prob.toFixed(1)}%`;
    
    const highProb = estimation.filter(e => e.setting >= 5).reduce((s, e) => s + e.prob, 0);
    estEl.style.color = highProb > 50 ? '#00ff66' : (best.setting >= 4 ? '#ffcc00' : '#fff');
}

function updateGlobalSummary(machine) {
    const cards = Array.from(document.querySelectorAll('.unit-card'));
    let tSpins = 0, tBB = 0, tRB = 0, tDiff = 0, inputCount = 0;
    cards.forEach(card => {
        tSpins += parseInt(card.querySelector('.data-item .value').innerText.replace(/,/g, '')) || 0;
        const counts = card.querySelectorAll('.data-item .value')[1].innerText.split(' / ');
        tBB += parseInt(counts[0]) || 0;
        tRB += parseInt(counts[1]) || 0;
        const dVal = card.querySelector('.diff-input').value.trim();
        if (dVal !== '') {
            tDiff += parseInt(dVal);
            inputCount++;
        }
    });

    const tGrape = inputCount > 0 ? backCalculateGrapes(machine, tSpins, tBB, tRB, tDiff) : null;
    const avgGrape = tGrape !== null && tGrape > 0 ? (tSpins / tGrape).toFixed(2) : '-';
    const estimation = calculateEstimation(machine, tSpins, tBB, tRB, tGrape);
    const best = [...estimation].sort((a, b) => b.prob - a.prob)[0];

    document.getElementById('total-units').innerText = cards.length;
    document.getElementById('avg-counts').innerText = `${(tBB / cards.length).toFixed(1)} / ${(tRB / cards.length).toFixed(1)}`;
    document.getElementById('avg-grape').innerText = avgGrape !== '-' ? '1/' + avgGrape : '-';
    document.getElementById('estimated-setting').innerText = `\u8a2d\u5b9a${best.setting}`;
}

window.showTab = (tabId) => {
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
    event.currentTarget.classList.add('active');
    document.getElementById(`tab-${tabId}`).classList.add('active');
};
