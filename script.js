/**
 * Arbeitszeitrechner Pro - Core Logic
 */

const DATA_KEY = 'worktime_data_pro';
const PREFS_KEY = 'worktime_ui_prefs';

// DOM Elements
const rowsContainer = document.getElementById('rows-container');
const targetTimeInput = document.getElementById('target-time');
const resultBox = document.getElementById('result-box');

// Initial State für UI-Einstellungen (aus LocalStorage oder Default)
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
    
    // Automatisch speichern wenn Sollzeit geändert wird
    targetTimeInput.addEventListener('change', saveData);

    // Event Delegation für Eingabefelder in den Zeilen
    rowsContainer.addEventListener('change', (e) => {
        if (e.target.type === 'time') saveData();
    });

    // Zeilen löschen
    rowsContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('.btn-remove-row');
        if (btn) removeRow(btn.dataset.id);
    });

    // UI-Toggles (Sichtbarkeit der Spalten)
    document.querySelectorAll('.ui-toggle').forEach(cb => {
        cb.addEventListener('change', (e) => {
            const prefKey = e.target.id.replace('pref-', '');
            uiPrefs[prefKey] = e.target.checked;
            localStorage.setItem(PREFS_KEY, JSON.stringify(uiPrefs));
            applyUIPrefs();
        });
    });
}

function initUI() {
    // Checkboxen im Header auf gespeicherten Stand setzen
    for (const key in uiPrefs) {
        const cb = document.getElementById(`pref-${key}`);
        if (cb) cb.checked = uiPrefs[key];
    }
    applyUIPrefs();
}

function applyUIPrefs() {
    // Spalten ein-/ausblenden basierend auf Präferenzen
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
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 inline" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
    `;
    rowsContainer.appendChild(row);
    applyUIPrefs(); // UI-Status auf neue Zeile anwenden
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
    let lastEndMinutes = 0;

    starts.forEach((startInput, index) => {
        const startVal = startInput.value;
        const endVal = ends[index].value;

        if (startVal && endVal) {
            const startMin = timeToMinutes(startVal);
            const endMin = timeToMinutes(endVal);
            
            // WICHTIG: Ruhezeit beginnt nach der letzten "Gehen"-Zeit
            // Wir nehmen hier einfach die höchste Endzeit des Tages
            if (endMin > lastEndMinutes) lastEndMinutes = endMin;

            let bruteDiff = endMin - startMin;
            if (bruteDiff < 0) bruteDiff += 1440; // Nachtschicht/Über Mitternacht

            let breakTime = 0;
            if (bruteDiff > 540) breakTime = 45;      // > 9 Std
            else if (bruteDiff > 360) breakTime = 30; // > 6 Std

            const netDiff = Math.max(0, bruteDiff - breakTime);
            totalMinutesNetto += netDiff;
            totalBreakDeducted += breakTime;

            results[index].innerHTML = `<span class="text-indigo-600 font-bold">${minutesToHours(netDiff)}</span>` + 
                (breakTime > 0 ? `<br><span class="text-[9px] text-amber-500 font-bold uppercase">-${breakTime}m Pause</span>` : "");
        }
    });

    if (lastEndMinutes === 0) return; // Nichts zu berechnen

    // Dashboard einblenden
    resultBox.classList.remove('hidden');
    
    // 1. Arbeitszeit & Differenz berechnen
    const targetMin = timeToMinutes(targetTimeInput.value || "08:00");
    const diff = totalMinutesNetto - targetMin;
    
    document.getElementById('total-time-display').innerText = minutesToHours(totalMinutesNetto) + " h";
    document.getElementById('break-info-display').innerText = `Pausen-Abzug: ${totalBreakDeducted} Min.`;
    
    const diffEl = document.getElementById('diff-time-display');
    const prefix = diff >= 0 ? "+" : "-";
    diffEl.innerText = `${prefix}${minutesToHours(Math.abs(diff))} h`;
    diffEl.className = diff >= 0 ? "text-5xl font-black text-emerald-400" : "text-5xl font-black text-red-400";

    // 2. Ruhezeit berechnen (11 Stunden = 660 Minuten)
    let nextStart = lastEndMinutes + 660; 
    if (nextStart >= 1440) nextStart -= 1440; // Umbruch wenn am nächsten Tag

    const restDisplay = document.getElementById('earliest-start-display');
    if (restDisplay) {
        restDisplay.innerText = minutesToHours(nextStart) + " Uhr";
    }

    // Scroll zum Ergebnis
    resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

function saveData() {
    const starts = Array.from(document.querySelectorAll('.start-time')).map(i => i.value);
    const ends = Array.from(document.querySelectorAll('.end-time')).map(i => i.value);
    localStorage.setItem(DATA_KEY, JSON.stringify({ 
        starts, 
        ends, 
        target: targetTimeInput.value 
    }));
}

function loadData() {
    const saved = localStorage.getItem(DATA_KEY);
    if (saved) {
        const data = JSON.parse(saved);
        targetTimeInput.value = data.target || "08:00";
        // Existierende Zeilen leeren falls nötig
        rowsContainer.innerHTML = '';
        data.starts.forEach((s, i) => addRow(s, data.ends[i]));
    } else {
        addRow(); // Standardmäßig eine Zeile
    }
}

function clearAll() {
    if(confirm("Alle gespeicherten Zeiten löschen?")) {
        localStorage.removeItem(DATA_KEY);
        location.reload();
    }
}

// Utility Helpers
const timeToMinutes = (t) => { 
    if(!t) return 0;
    const [h,m] = t.split(':').map(Number); 
    return (h*60) + m; 
};

const minutesToHours = (m) => { 
    const hrs = Math.floor(m/60); 
    const mins = m%60; 
    return `${String(hrs).padStart(2,'0')}:${String(mins).padStart(2,'0')}`; 
};
