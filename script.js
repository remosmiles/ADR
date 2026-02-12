const DB = {
    "1203": { name: "PETROL / BENZIN", cat: 2 },
    "1202": { name: "DIESEL / FUEL OIL", cat: 3 },
    "1965": { name: "HYDROCARBON GAS", cat: 2 }
};

// Live Uhr für den Desktop-Look
setInterval(() => {
    document.getElementById('live-clock').innerText = new Date().toLocaleTimeString();
}, 1000);

document.getElementById('run-btn').addEventListener('click', () => {
    const un = document.getElementById('un-input').value;
    const kg = parseFloat(document.getElementById('un-weight').value) || 0;

    if (!DB[un]) return alert("ACCESS DENIED: UN_CODE NOT FOUND");

    // Start Simulation
    document.getElementById('loader').classList.remove('hidden');
    let width = 0;
    const bar = document.getElementById('bar');

    const proc = setInterval(() => {
        width += 2;
        bar.style.width = width + "%";
        if (width >= 100) {
            clearInterval(proc);
            showResults(un, kg);
        }
    }, 30);
});

function showResults(un, kg) {
    document.getElementById('loader').classList.add('hidden');
    document.getElementById('results').classList.remove('hidden');
    
    const data = DB[un];
    const points = kg * (data.cat === 2 ? 3 : 1);
    
    document.getElementById('un-name').innerText = `IDENTIFIED: UN ${un} [${data.name}]`;
    document.getElementById('points-val').innerText = points;

    const tBox = document.getElementById('tunnel-status-box');
    const tText = document.getElementById('tunnel-text');

    // Gotthard Check (SDR Tunnelkat E)
    if (points > 1000) {
        tText.innerText = "ACCESS_DENIED";
        tBox.style.borderColor = "red";
        tText.style.color = "red";
    } else {
        tText.innerText = "ACCESS_GRANTED";
        tBox.style.borderColor = "var(--matrix-green)";
        tText.style.color = "var(--matrix-green)";
    }
}
