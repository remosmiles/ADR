const SDR_DATA = {
    "1202": { name: "Dieselkraftstoff", cat: 3 },
    "1203": { name: "Benzin", cat: 2 },
    "1965": { name: "Flüssiggas", cat: 2 },
    "3082": { name: "Umweltgef. Stoff", cat: 3 }
};

document.getElementById('search-btn').addEventListener('click', function() {
    const un = document.getElementById('un-input').value;
    const weight = document.getElementById('un-weight').value;
    
    if(!SDR_DATA[un]) { alert("UN-Nummer nicht gefunden"); return; }

    // UI zurücksetzen & Ladebalken zeigen
    document.getElementById('loader-container').classList.remove('hidden');
    document.getElementById('result-card').classList.add('hidden');
    let progress = 0;
    const bar = document.getElementById('progress-bar');

    // Lade-Animation (2 Sekunden "Abfrage")
    const interval = setInterval(() => {
        progress += 5;
        bar.style.width = progress + "%";
        if (progress >= 100) {
            clearInterval(interval);
            showResult(un, weight);
        }
    }, 100);
});

function showResult(un, weight) {
    const data = SDR_DATA[un];
    const points = weight * (data.cat === 2 ? 3 : 1);
    
    document.getElementById('loader-container').classList.add('hidden');
    document.getElementById('result-card').classList.remove('hidden');
    document.getElementById('res-un-name').innerText = "UN " + un + " " + data.name;
    document.getElementById('points-val').innerText = points;

    const tBox = document.getElementById('tunnel-box');
    const tStatus = document.getElementById('tunnel-status');

    // Gotthard Logik (Kategorie E)
    // Über 1000 Punkte: Verboten für Kat E
    if (points > 1000) {
        tBox.className = "tunnel-result tunnel-error";
        tStatus.innerText = "DURCHFAHRT VERBOTEN";
    } else {
        tBox.className = "tunnel-result tunnel-ok";
        tStatus.innerText = "DURCHFAHRT ERLAUBT";
    }
}
