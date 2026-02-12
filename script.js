let adrDatabase = null;

// Diese Funktion lädt die JSON-Datei automatisch beim Start
async function initApp() {
    try {
        const response = await fetch('./adr_data.json'); // Lädt die Datei aus deinem Verzeichnis
        adrDatabase = await response.json();
        console.log("Datenbank bereit");
    } catch (e) {
        console.error("Datenbank konnte nicht geladen werden");
    }
}

async function calculate() {
    // Sicherstellen, dass die Daten geladen sind
    if (!adrDatabase) {
        await initApp();
    }

    const un = document.getElementById('unInput').value.trim();
    const amount = parseFloat(document.getElementById('amountInput').value);
    const resultBox = document.getElementById('resultBox');

    const item = adrDatabase[un];

    if (!item) {
        resultBox.style.display = "block";
        resultBox.className = "warning";
        resultBox.innerHTML = "⚠️ UN-Nummer nicht gefunden.";
        return;
    }

    // Punkte-Logik
    let faktor = item.k === 1 ? 50 : (item.k === 2 ? 3 : 1);
    const punkte = amount * faktor;

    // Gotthard-Check (Tunnel Kat E)
    // Wenn Tunnelcode ungleich (-) und Punkte > 1000 -> Verboten
    const restricted = item.t !== "(-)";
    
    resultBox.style.display = "block";
    if (punkte > 1000 && restricted) {
        resultBox.className = "forbidden";
        resultBox.innerHTML = `❌ <b>Gesperrt</b><br>${item.n}<br>${punkte} Punkte`;
    } else {
        resultBox.className = "allowed";
        resultBox.innerHTML = `✅ <b>Fahrt erlaubt</b><br>${item.n}<br>${punkte} Punkte`;
    }
}

// Startet den Ladevorgang
initApp();
