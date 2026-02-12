let adrDatabase = {};

// Lädt die Datenbank beim Start der Seite
async function loadDatabase() {
    try {
        // Ersetze dies durch die URL deiner JSON-Datei (z.B. auf GitHub oder Vercel)
        const response = await fetch('https://deine-url.vercel.app/adr_data.json');
        adrDatabase = await response.json();
        console.log("Datenbank erfolgreich geladen");
    } catch (error) {
        console.error("Fehler beim Laden der Daten:", error);
    }
}

// Initialisierung
loadDatabase();

function calculate() {
    const un = document.getElementById('unInput').value.trim();
    const item = adrDatabase[un]; // Greift auf die online geladenen Daten zu
    
    if (!item) {
        // ... Fehlerbehandlung ...
    }
    // ... restliche Logik ...
}
