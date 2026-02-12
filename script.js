const DB = {
    "1202": { name: "Dieselkraftstoff", factor: 1 },
    "1203": { name: "Benzin", factor: 3 },
    "1965": { name: "Flüssiggas", factor: 3 },
    "3082": { name: "Umweltgef. Stoffe", factor: 1 }
};

document.getElementById('scan-trigger').addEventListener('click', function() {
    const un = document.getElementById('un-id').value;
    const kg = document.getElementById('un-mass').value;

    if (!DB[un]) { alert("UN-Nummer nicht in Datenbank gefunden."); return; }

    // Start Simulation
    document.getElementById('loading-zone').classList.remove('hidden');
    document.getElementById('result-display').classList.add('hidden');
    
    let progress = 0;
    const bar = document.getElementById('dynamic-bar');

    const timer = setInterval(() => {
        progress += 4;
        bar.style.width = progress + "%";

        if (progress >= 100) {
            clearInterval(timer);
            processSDR(un, kg);
        }
    }, 80); // Dauer ca. 2 Sekunden
});

function processSDR(un, kg) {
    const item = DB[un];
    const points = kg * item.factor;
    
    document.getElementById('loading-zone').classList.add('hidden');
    document.getElementById('result-display').classList.remove('hidden');
    
    document.getElementById('un-title').innerText = "UN " + un + " - " + item.name;
    document.getElementById('final-points').innerText = points + " Punkte";

    const badge = document.getElementById('gotthard-badge');
    const status = document.getElementById('gotthard-status');

    // Schweizer Tunnel-Regel für Gotthard (Kat. E)
    // Wenn Punkte > 1000, ist die Durchfahrt nach SDR für Kat. E Tunnel verboten
    if (points > 1000) {
        badge.className = "tunnel-badge stop";
        status.innerText = "VERBOTEN (SDR 1.1.3.6 überschritten)";
    } else {
        badge.className = "tunnel-badge pass";
        status.innerText = "ERLAUBT (Freigrenze)";
    }
}
