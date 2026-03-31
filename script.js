const DATA_KEY = 'worktime_data_pro';
const PREFS_KEY = 'worktime_ui_prefs';

const rowsContainer = document.getElementById('rows-container');
const targetTimeInput = document.getElementById('target-time');
const resultBox = document.getElementById('result-box');

let uiPrefs = JSON.parse(localStorage.getItem(PREFS_KEY)) || {
    showNetto: true, showActions: true, showRest: true
};

document.addEventListener('DOMContentLoaded', () => {
    initUI();
    loadData();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('btn-add-row').addEventListener('click', () => addRow());
    document.getElementById('btn-calculate').addEventListener('click', calculateTotal);
    document.getElementById('btn-clear').addEventListener('click', clearAll);
    targetTimeInput.addEventListener('change', saveData);
    rowsContainer.addEventListener('change', (e) => { if (e.target.type === 'time') saveData(); });
    rowsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-remove-row');
        if (btn) removeRow(btn.dataset.id);
    });
    document.querySelectorAll('.ui-toggle').forEach(cb => {
        cb.addEventListener('change', (e) => {
            uiPrefs[e.target.id.replace('pref-', '')] = e.target.checked;
            localStorage.setItem(PREFS_KEY, JSON.stringify(uiPrefs));
            applyUIPrefs();
        });
    });
}

function initUI() {
    for (const key in uiPrefs) {
        const cb = document.getElementById(`pref-${key}`);
        if (cb) cb.checked = uiPrefs[key];
    }
    applyUIPrefs();
}

function applyUIPrefs() {
    document.querySelectorAll('.js-col-netto').forEach(el => el.classList.toggle('hidden-column', !uiPrefs.showNetto));
    document.querySelectorAll('.js-col-actions').forEach(el => el.classList.toggle('hidden-column', !uiPrefs.showActions));
    const restContainer = document.getElementById('res-rest-container');
    if (restContainer) restContainer.classList.toggle('hidden', !uiPrefs.showRest);
}

function addRow(start = "08:00", end = "16:30") {
    const rowId = 'row-' + Math.random().toString(36).substring(2, 9);
    const row = document.createElement('div');
    row.className = 'grid grid-cols-1 md:grid-cols-12 gap-3 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm items-center row-fade-in';
    row.id = rowId;
    row.innerHTML = `
        <div class="col-span-3"><input type="time" class="start-time w-full border-slate-200 rounded-lg p-2.5 font-semibold" value="${start}"></div>
        <div class="col-span-3"><input type="time" class="end-time w-full border-slate-200 rounded-lg p-2.5 font-semibold" value="${end}"></div>
        <div class="col-span-4 text-center js-col-netto"><span class="row-result text-slate-400 font-mono font-medium text-sm">-</span></div>
        <div class="col-span-2 text-right js-col-actions">
            <button class="btn-remove-row text-red-400 hover:text-red-600 font-bold px-2" data-id="${rowId}">✕</button>
        </div>`;
    rowsContainer.appendChild(row);
    applyUIPrefs();
    saveData();
}

function removeRow(id) {
    if (document.querySelectorAll('.start-time').length > 1) {
        document.getElementById(id).remove();
        saveData();
    }
}

function calculateTotal() {
    const starts = document.querySelectorAll('.start-time');
    const ends = document.querySelectorAll('.end-time');
    const results = document.querySelectorAll('.row-result');
    
    let totalMinutesNetto = 0;
    let totalBreakDeducted = 0;

    starts.forEach((startInput, index) => {
        const sVal = startInput.value;
        const eVal = ends[index].value;
        if (sVal && eVal) {
            const sMin = timeToMinutes(sVal);
            const eMin = timeToMinutes(eVal);
            let diff = eMin - sMin;
            if (diff < 0) diff += 1440; 
            let breakT = 0;
            if (diff > 540) breakT = 45; else if (diff > 360) breakT = 30;
            totalMinutesNetto += (diff - breakT);
            totalBreakDeducted += breakT;
            results[index].innerHTML = `<span class="text-indigo-600 font-bold">${minutesToHours(diff - breakT)}</span>`;
        }
    });

    // --- RUHEZEIT FIX: Wir greifen uns direkt den Wert aus dem DOM ---
    const allEndInputs = document.querySelectorAll('.end-time');
    const lastInputField = allEndInputs[allEndInputs.length - 1];
    const restDisplay = document.getElementById('earliest-start-display');

    if (lastInputField && lastInputField.value) {
        let lastEndMin = timeToMinutes(lastInputField.value);
        let nextStartMin = lastEndMin + 660; // 11 Stunden später
        if (nextStartMin >= 1440) nextStartMin -= 1440;
        restDisplay.innerText = minutesToHours(nextStartMin) + " Uhr";
    }

    // Dashboard befüllen
    resultBox.classList.remove('hidden');
    const targetMin = timeToMinutes(targetTimeInput.value || "08:00");
    const totalDiff = totalMinutesNetto - targetMin;
    
    document.getElementById('total-time-display').innerText = minutesToHours(totalMinutesNetto) + " h";
    document.getElementById('break-info-display').innerText = totalBreakDeducted > 0 ? `Pausenabzug: ${totalBreakDeducted} Min.` : "Kein Pausenabzug erfolgt.";
    
    const diffEl = document.getElementById('diff-time-display');
    diffEl.innerText = (totalDiff >= 0 ? "+" : "-") + minutesToHours(Math.abs(totalDiff)) + " h";
    diffEl.className = totalDiff >= 0 ? "text-5xl font-black text-emerald-400" : "text-5xl font-black text-red-400";
}

function saveData() {
    const starts = Array.from(document.querySelectorAll('.start-time')).map(i => i.value);
    const ends = Array.from(document.querySelectorAll('.end-time')).map(i => i.value);
    localStorage.setItem(DATA_KEY, JSON.stringify({ starts, ends, target: targetTimeInput.value }));
}

function loadData() {
    const saved = localStorage.getItem(DATA_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        targetTimeInput.value = data.target || "08:00";
        rowsContainer.innerHTML = '';
        data.starts.forEach((s, i) => addRow(s, data.ends[i]));
        
        // NEU: Sofort berechnen, wenn Daten geladen wurden!
        calculateTotal(); 
    } else {
        addRow();
    }
}

function clearAll() {
    if(confirm("Alles löschen?")) { localStorage.removeItem(DATA_KEY); location.reload(); }
}

const timeToMinutes = (t) => { if(!t) return 0; const [h,m] = t.split(':').map(Number); return (h*60)+m; };
const minutesToHours = (m) => { 
    const hrs = Math.floor(m/60); 
    const mins = m%60; 
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}`; 
};
