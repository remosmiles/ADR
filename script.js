// Erweiterte Datenbank
const adrData = {
    "1202": { name: "DIESELKRAFTSTOFF / HEIZÖL", kat: 3, tunnel: "E" },
    "1203": { name: "BENZIN", kat: 2, tunnel: "D/E" },
    "1965": { name: "KOHLENWASSERSTOFFGAS, GEMISCH, VERFLÜSSIGT (LPG)", kat: 2, tunnel: "B/D" },
    "3082": { name: "UMWELTGEFÄHRDENDER STOFF, FLÜSSIG", kat: 3, tunnel: "(-)" },
    "1001": { name: "ACETYLEN, GELÖST", kat: 2, tunnel: "B/D" }
};

function calculate() {
    const un = document.getElementById('unInput').value.trim();
    const amount = parseFloat(document.getElementById('amountInput').value);
    const resultBox = document.getElementById('resultBox');
    
    // Validierung
    if (!un || isNaN(amount)) {
        alert("Bitte UN-Nummer und Menge eingeben!");
        return;
    }

    const item = adrData[un];
    
    if (!item) {
        resultBox.style.display = "block";
        resultBox.className = "warning";
        resultBox.innerHTML = "⚠️ UN-Nummer nicht in lokaler Datenbank. <br><small>Bitte manuell im ADR-Buch prüfen.</small>";
        return;
    }

    // ADR Punkte-Logik (Berechnung nach 1.1.3.6 ADR)
    let faktor = 1;
    switch(item.kat) {
        case 1: faktor = 50; break;
        case 2: faktor = 3; break;
        case 3: faktor = 1; break;
        case 4: faktor = 0; break; // Unbegrenzt
        case 0: faktor = 1000; break; // Sofort kritisch
    }

    const punkte = amount * faktor;
    resultBox.style.display = "block";

    // Gotthard Regel (Tunnelkategorie E)
    // Fast alle gefährlichen Güter mit Tunnelcode (B, C, D oder E) 
    // sind verboten, wenn die 1000-Punkte-Grenze überschritten ist.
    const hasTunnelRestriction = item.tunnel !== "(-)";
    
    if (punkte > 1000 && hasTunnelRestriction) {
        resultBox.className = "forbidden";
        resultBox.innerHTML = `
            <h2>❌ DURCHFAHRT VERBOTEN</h2>
            <p><strong>${item.name}</strong></p>
            <p>Punkte: ${punkte} (Limit: 1000)</p>
            <p><small>Fahrzeug ist kennzeichnungspflichtig (Orange Tafeln). Tunnel Kat. E gesperrt.</small></p>
        `;
    } else {
        resultBox.className = "allowed";
        resultBox.innerHTML = `
            <h2>✅ DURCHFAHRT ERLAUBT</h2>
            <p><strong>${item.name}</strong></p>
            <p>Punkte: ${punkte}</p>
            <p><small>${punkte > 1000 ? "Keine Tunnelbeschränkung für diesen Stoff." : "Unter der Freigrenze (1000 Punkte)."}</small></p>
        `;
    }
}
