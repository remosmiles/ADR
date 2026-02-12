// SDR-Datenbank für Schweizer Tunnel (Gotthard = Kategorie E)
const SDR_DATABASE = {
    "1202": { name: "DIESEL / HEIZÖL", factor: 1, tunnelCat: "E" },
    "1203": { name: "BENZIN / OTTOKRAFTSTOFF", factor: 3, tunnelCat: "D/E" },
    "1965": { name: "FLÜSSIGGAS (LPG)", factor: 3, tunnelCat: "B/D" },
    "3082": { name: "UMWELTGEFÄHRDEND (FLÜSSIG)", factor: 1, tunnelCat: "E" },
    "1072": { name: "SAUERSTOFF (KOMPRIMIERT)", factor: 1, tunnelCat: "E" }
};

document.getElementById('analyse-trigger').addEventListener('click', function() {
    const un = document.getElementById('un-input').value;
    const kg = parseFloat(document.getElementById('weight-input').value) || 0;

    if (!SDR_DATABASE[un]) {
        alert("CRITICAL ERROR: UN_CODE_NOT_IN_DATABASE");
        return;
    }

    // Simulation Scan
    document.getElementById('loading-sequence').classList.remove('hidden');
    document.getElementById('result-screen').classList.add('hidden');
    
    let progress = 0;
    const bar = document.getElementById('load-progress');

    const scan = setInterval(() => {
        progress += 2;
        bar.style.width = progress + "%";
        
        if (progress >= 100) {
            clearInterval(scan);
            processResults(un, kg);
        }
    }, 20); // Schnelle Desktop-Simulation
});

function processResults(un, kg) {
    const data = SDR_DATABASE[un];
    const points = kg * data.factor;
    
    document.getElementById('loading-sequence').classList.add('hidden');
    const screen = document.getElementById('result-screen');
    screen.classList.remove('hidden');

    document.getElementById('res-name').innerText = data.name;
    document.getElementById('res-points').innerText = points + " PKT";

    const verdictBox = document.getElementById('tunnel-card');
    const verdictText = document.getElementById('tunnel-verdict');

    // Gotthard-Regel: Kategorie E Tunnel (SDR 1.1.3.6)
    // Bei Überschreitung der 1000 Punkte Grenze ist der Gotthard verboten
    if (points > 1000) {
        verdictBox.className = "decision-box block";
        verdictText.innerText = "ACCESS_DENIED: TUNNEL_PASSAGE_FORBIDDEN";
    } else {
        verdictBox.className = "decision-box pass";
        verdictText.innerText = "ACCESS_GRANTED: TUNNEL_PASSAGE_OK";
    }
}
