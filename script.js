// SDR Datenbank Schweiz
const ADR_DATABASE = {
    "1202": { name: "Diesel / Heizöl", cat: 3, class: "3", tunnels: "E", risk: "Umweltgefährdend" },
    "1203": { name: "Benzin", cat: 2, class: "3", tunnels: "D/E", risk: "Leichtentzündlich" },
    "1965": { name: "LPG Flüssiggas", cat: 2, class: "2.1", tunnels: "B/D", risk: "Explosionsgefahr" },
    "3082": { name: "Umweltgefährdend", cat: 3, class: "9", tunnels: "E", risk: "Klasse 9" }
};

document.getElementById('check-btn').addEventListener('click', function() {
    const un = document.getElementById('un-input').value;
    const weight = parseFloat(document.getElementById('un-weight').value) || 0;
    const resultView = document.getElementById('result-overlay');

    if (ADR_DATABASE[un]) {
        const data = ADR_DATABASE[un];
        resultView.classList.remove('hidden');

        // 1000-Punkte Logik
        const factor = (data.cat === 2) ? 3 : 1;
        const points = weight * factor;
        
        // UI Bespielen
        document.getElementById('res-un').innerText = "UN " + un;
        document.getElementById('res-name').innerText = data.name;
        document.getElementById('points-val').innerText = points + " Pkt.";

        // Tunnel-Logik (Schweiz SDR)
        const tVal = document.getElementById('tunnel-val');
        const tBox = document.getElementById('tunnel-box');
        
        if (points > 1000) {
            tVal.innerText = "PASSIEREN VERBOTEN (E)";
            tBox.style.color = "#ff3b30";
        } else {
            tVal.innerText = "TUNNEL ERLAUBT";
            tBox.style.color = "#34c759";
        }

        // Bestimmungen generieren
        let rules = points > 1000 
            ? ["Orangene Tafeln öffnen", "ADR-Bescheinigung Pflicht", "S-Koffer Ausrüstung", "Fahrzeugüberwachung"]
            : ["Freigestellt nach 1.1.3.6", "2kg Feuerlöscher", "Beförderungspapier nötig", "Ladungssicherung nach SDR"];
        
        document.getElementById('rule-list').innerHTML = rules.map(r => `<li>${r}</li>`).join('');

    } else {
        alert("UN-Nummer nicht gefunden. Bitte nutzen Sie z.B. 1202 oder 1203.");
    }
});
