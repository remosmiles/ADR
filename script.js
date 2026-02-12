// Beispiel-Datenbank (Diese kannst du beliebig erweitern)
const adrData = {
    "1202": { name: "DIESELKRAFTSTOFF", kat: 3, tunnel: "E" },
    "1203": { name: "BENZIN", kat: 2, tunnel: "D/E" },
    "1965": { name: "FLÜSSIGGAS (LPG)", kat: 2, tunnel: "B/D" },
    "3082": { name: "UMWELTGEFÄHRDENDER STOFF", kat: 3, tunnel: "(-)" }
};

function calculate() {
    const un = document.getElementById('unInput').value;
    const amount = parseFloat(document.getElementById('amountInput').value);
    const resultBox = document.getElementById('resultBox');
    
    const item = adrData[un];
    
    if (!item) {
        alert("UN-Nummer nicht in Datenbank gefunden. Bitte ADR-Buch prüfen.");
        return;
    }

    // ADR Punkte-Logik
    let faktor = 1;
    if (item.kat === 1) faktor = 50;
    else if (item.kat === 2) faktor = 3;
    else if (item.kat === 3) faktor = 1;
    else if (item.kat === 0) faktor = 1000; // Vereinfacht für "sofort verboten"

    const punkte = amount * faktor;
    resultBox.style.display = "block";

    // Prüfung Gotthard (Tunnel E)
    // Erlaubt wenn: Tunnelcode ist (-), ODER Punkte <= 1000
    const isForbiddenInE = item.tunnel.includes('E') || item.tunnel.includes('D') || item.tunnel.includes('B');
    
    if (punkte > 1000 && isForbiddenInE) {
        resultBox.className = "forbidden";
        document.getElementById('statusText').innerText = "❌ GESPERRT";
        document.getElementById('detailText').innerText = `${item.name} darf mit ${punkte} Punkten nicht durch den Gotthard.`;
    } else {
        resultBox.className = "allowed";
        document.getElementById('statusText').innerText = "✅ FREIE FAHRT";
        document.getElementById('detailText').innerText = `Unter 1000 Punkten (aktuell: ${punkte}) ist die Durchfahrt erlaubt.`;
    }
}
