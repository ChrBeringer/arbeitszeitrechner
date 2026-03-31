/**
 * Arbeitszeitrechner Pro - Core Logic
 */

const DATA_KEY = 'worktime_data_pro';
const PREFS_KEY = 'worktime_ui_prefs';

const rowsContainer = document.getElementById('rows-container');
const targetTimeInput = document.getElementById('target-time');
const resultBox = document.getElementById('result-box');

let uiPrefs = JSON.parse(localStorage.getItem(PREFS_KEY)) || {
    showNetto: true,
    showActions: true,
    showRest: true
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
    row.className = 'grid grid-cols-1 md:grid-cols-12 gap-3 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow items-center row-fade-in';
    row.id = rowId;
    row.innerHTML = `
        <div class="col-span-3">
            <label class="block md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">Kommen</label>
            <input type="time" class="start-time w-full border-slate-200 rounded-lg p-2.5 font-semibold focus:ring-indigo-500 text-slate-700" value="${start}">
        </div>
        <div class="col-span-3">
            <label class="block md:hidden text-[10px] font-bold text-slate-400 uppercase mb-1">Gehen</label>
            <input type="time" class="end-time w-full border-slate-200 rounded-lg p-2.5 font-semibold focus:ring-indigo-500 text-slate-700" value="${end}">
        </div>
        <div class="col-span-4 text-center js-col-netto">
            <span class="row-result text-slate-400 font-mono font-medium text-sm">-</span>
        </div>
        <div class="col-span-2 text-right js-col-actions">
            <button class="btn-remove-row text-slate-300 hover:text-red-500 p-2 transition" data-id="${rowId}">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </button>
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

    // 1. Netto-Zeiten der Zeilen berechnen
    starts.forEach((startInput, index) => {
        const sVal = startInput.value;
        const eVal = ends[index].value;

        if (sVal && eVal) {
            const sMin = timeToMinutes(sVal);
            const eMin = timeToMinutes(eVal);
            
            let bruteDiff = eMin - sMin;
            if (bruteDiff < 0) bruteDiff += 1440; 

            let breakTime = 0;
            if (bruteDiff > 540) breakTime = 45;
            else if (bruteDiff > 360) breakTime = 30;

            const netDiff = Math.max(0, bruteDiff - breakTime);
            totalMinutesNetto += netDiff;
            totalBreakDeducted += breakTime;

            results[index].innerHTML = `<span class="text-indigo-600 font-bold">${minutesToHours(netDiff)}</span>` + 
                (breakTime > 0 ? `<br><span class="text-[9px] text-amber-500 font-bold uppercase">-${breakTime}m Pause</span>` : "");
        }
    });

    // 2. Ruhezeit-Berechnung (STRENG basierend auf der LETZTEN Zeile)
    const lastRowEndField = ends[ends.length - 1];
    if (lastRowEndField && lastRowEndField.value) {
        let lastEndMin = timeToMinutes(lastRowEndField.value);
        let nextStartMin = lastEndMin + 660; // +11 Stunden
        if (nextStartMin >= 1440) nextStartMin -= 1440;
        
        document.getElementById('earliest-start-display').innerText = minutesToHours(nextStartMin) + " Uhr";
    }

    // 3. Dashboard befüllen
    resultBox.classList.remove('hidden');
    const targetMin = timeToMinutes(targetTimeInput.value || "08:00");
    const diff = totalMinutesNetto - targetMin;
    
    document.getElementById('total-time-display').innerText = minutesToHours(totalMinutesNetto) + " h";
    document.getElementById('break-info-display').innerText = totalBreakDeducted > 0 ? `Pausen-Abzug: ${totalBreakDeducted} Min.` : "Kein Pausenabzug erfolgt.";
    
    const diffEl = document.getElementById('diff-time-display');
    const prefix = diff >= 0 ? "+" : "-";
    diffEl.innerText = `${prefix}${minutesToHours(Math.abs(diff))} h`;
    diffEl.className = diff >= 0 ? "text-5xl font-black text-emerald-400" : "text-5xl font-black text-red-400";

    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
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
    } else {
        addRow();
    }
}

function clearAll() {
    if(confirm("Alle Daten löschen?")) {
        localStorage.removeItem(DATA_KEY);
        location.reload();
    }
}

const timeToMinutes = (t) => { if(!t) return 0; const [h,m] = t.split(':').map(Number); return (h*60)+m; };
const minutesToHours = (m) => { 
    const hrs = Math.floor(m/60); 
    const mins = m%60; 
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}`; 
};
