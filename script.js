let adrDatabase = null;
let isDataLoading = false;

// Lädt die JSON-Datei automatisch beim Start
async function initApp() {
    if (isDataLoading) return;
    isDataLoading = true;
    try {
        const response = await fetch('./adr_data.json');
        if (!response.ok) throw new Error("Netzwerk-Antwort war nicht ok");
        adrDatabase = await response.json();
        console.log("✨ Magische Datenbank geladen");
        
        // Optional: Datalist für Autocomplete füllen, sobald Daten da sind
        fillAutocomplete();
    } catch (e) {
        console.error("Datenbank-Fehler:", e);
        showStatus("⚠️ Fehler beim Laden der Stoffdaten.", "warning");
    } finally {
        isDataLoading = false;
    }
}

async function calculate() {
    // 1. Warte-Check
    if (!adrDatabase) {
        await initApp();
        if (!adrDatabase) return;
    }

    const un = document.getElementById('unInput').value.trim();
    const amountRaw = document.getElementById('amountInput').value;
    const amount = parseFloat(amountRaw);
    const resultBox = document.getElementById('resultBox');

    // 2. Eingabe-Validierung
    if (!un) {
        showStatus("🔮 Bitte gib eine UN-Nummer ein.", "info");
        return;
    }
    if (isNaN(amount) || amount <= 0) {
        showStatus("⚖️ Bitte gib eine gültige Menge ein.", "info");
        return;
    }

    const item = adrDatabase[un];

    if (!item) {
        showStatus(`❓ UN ${un} unbekannt. Bitte manuell prüfen.`, "warning");
        return;
    }

    // 3. Verfeinerte ADR-Punkte-Logik
    // Kat 0 = Sofort kennzeichnungspflichtig (wir nutzen 1001 als "Trigger")
    // Kat 1 = 50, Kat 2 = 3, Kat 3 = 1, Kat 4 = 0
    let faktor;
    switch(parseInt(item.k)) {
        case 0: faktor = 1001; break; // Sofort über Limit
        case 1: faktor = 50; break;
        case 2: faktor = 3; break;
        case 3: faktor = 1; break;
        case 4: faktor = 0; break;
        default: faktor = 1;
    }

    const punkte = amount * faktor;
    const restricted = item.t !== "(-)"; // Tunnelcode vorhanden?
    
    // 4. Anzeige-Logik
    resultBox.style.display = "block";
    
    if (item.k === 0 || (punkte > 1000 && restricted)) {
        resultBox.className = "forbidden";
        resultBox.innerHTML = `
            <div class="res-title">❌ Gesperrt</div>
            <div class="res-subtitle">${item.n}<br>
            <b>${punkte > 1000 ? punkte : '∞'} Punkte</b> (Limit: 1000)<br>
            <small>Durchfahrt durch Gotthard (Kat. E) untersagt.</small></div>
        `;
    } else {
        resultBox.className = "allowed";
        resultBox.innerHTML = `
            <div class="res-title">✅ Fahrt erlaubt</div>
            <div class="res-subtitle">${item.n}<br>
            <b>${punkte} Punkte</b><br>
            <small>Unter Freigrenze oder keine Tunnelbeschränkung.</small></div>
        `;
    }
}

function showStatus(msg, type) {
    const rb = document.getElementById('resultBox');
    rb.style.display = "block";
    rb.className = type;
    rb.innerHTML = msg;
}

function fillAutocomplete() {
    const dl = document.getElementById('unList');
    if (!dl) return;
    dl.innerHTML = "";
    for (let un in adrDatabase) {
        let opt = document.createElement('option');
        opt.value = un;
        opt.label = adrDatabase[un].n;
        dl.appendChild(opt);
    }
}

// Initialisierung
document.addEventListener('DOMContentLoaded', initApp);
