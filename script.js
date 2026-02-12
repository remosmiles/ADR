const UN_DB = {
    "1202": { name: "Dieselkraftstoff", cat: 3, class: "3", tunnel: "E" },
    "1203": { name: "Benzin", cat: 2, class: "3", tunnel: "D/E" },
    "1965": { name: "Flüssiggas", cat: 2, class: "2.1", tunnel: "B/D" },
    "3082": { name: "Umweltgef. Stoff", cat: 3, class: "9", tunnel: "E" }
};

document.getElementById('check-btn').addEventListener('click', function() {
    const un = document.getElementById('un-num').value;
    const weight = parseFloat(document.getElementById('un-weight').value) || 0;
    const resultView = document.getElementById('result-view');

    if (UN_DB[un]) {
        resultView.classList.remove('hidden');
        const data = UN_DB[un];
        
        // Punkte-Rechner
        const factor = data.cat === 2 ? 3 : 1;
        const points = weight * factor;
        
        // Update UI
        document.getElementById('res-label').innerText = data.name;
        document.getElementById('res-un').innerText = "UN " + un;
        document.getElementById('points-display').innerText = points + " / 1000";
        
        const bar = document.getElementById('points-bar');
        bar.style.width = Math.min((points/10), 100) + "%";
        bar.style.backgroundColor = points > 1000 ? "#FF3B30" : "#007AFF";

        // Tunnel-Logik (SDR)
        const tStatus = document.getElementById('tunnel-status');
        if (points > 1000) {
            tStatus.className = "status-box forbidden";
            tStatus.innerText = "🚨 Tunnel Gotthard / San Bernardino verboten";
        } else {
            tStatus.className = "status-box allowed";
            tStatus.innerText = "✅ Freigestellt: Tunnelpassage erlaubt";
        }

        // Regeln
        const rules = document.getElementById('rules-list');
        rules.innerHTML = points > 1000 
            ? "<li>Warntafeln offen</li><li>ADR-Card erforderlich</li><li>Ausrüstung S-Koffer</li>"
            : "<li>Keine Warntafeln nötig</li><li>Feuerlöscher 2kg</li><li>Beförderungspapier</li>";

    } else {
        alert("Bitte eine gültige UN-Nummer eingeben (z.B. 1202)");
    }
});
