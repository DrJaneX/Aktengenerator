// Vorlagen-Daten
const vorlagen = {
    steckschuss: {
        diagnose: "Steckschuss im rechten Oberschenkel",
        symptome: "Starke Blutung, Schmerzen, Schockzustand",
        massnahme: "Blutstillung durch Druckverband, Schmerzmittel verabreicht",
        untersuchung: "Röntgenaufnahme durchgeführt, Kugel lokalisiert",
        mitgabe: "Schmerzmittel (Ibuprofen 400mg), Antibiotikum",
        nachkontrolle: "Nachkontrolle in 7 Tagen empfohlen",
        besonderheiten: "Patient ist allergisch gegen Penicillin"
    },
    durchschuss: {
        diagnose: "Steckschuss im rechten Oberschenkel",
        symptome: "Starke Blutung, Schmerzen, Schockzustand",
        massnahme: "Blutstillung durch Druckverband, Schmerzmittel verabreicht",
        untersuchung: "Röntgenaufnahme durchgeführt, Kugel lokalisiert",
        mitgabe: "Schmerzmittel (Ibuprofen 400mg), Antibiotikum",
        nachkontrolle: "Nachkontrolle in 7 Tagen empfohlen",
        besonderheiten: "Patient ist allergisch gegen Penicillin"
    },
    verstauchung: {
        diagnose: "Verstauchung des linken Handgelenks",
        symptome: "Schwellung, Schmerzen, eingeschränkte Beweglichkeit",
        massnahme: "Kühlung, Ruhigstellung mit Verband",
        untersuchung: "Röntgenaufnahme durchgeführt, keine Fraktur festgestellt",
        mitgabe: "Schmerzgel (Diclofenac), elastischer Verband",
        nachkontrolle: "Nachkontrolle in 3 Tagen empfohlen",
        besonderheiten: "Keine Allergien bekannt"
    }
};

// Funktion zum Anwenden einer Vorlage
function applyVorlage(vorlageKey) {
    const vorlage = vorlagen[vorlageKey];
    if (!vorlage) return;

    // Fülle die entsprechenden Felder mit den Vorlagen-Daten
    Object.keys(vorlage).forEach(field => {
        const baustein = document.querySelector(`.baustein[data-field="${field}"]`);
        if (baustein) {
            console.log(`Baustein "${field}" gefunden und wird angezeigt.`);
            // Baustein sichtbar machen
            baustein.style.display = "block";

            // Eingabefeld füllen
            const input = baustein.querySelector("input, textarea");
            if (input) {
                input.value = vorlage[field];
            }

            // Entfernen-Button sicherstellen
            const removeButton = baustein.querySelector(".remove-baustein");
            if (removeButton) {
                removeButton.style.display = "inline-block"; // Sicherstellen, dass der Button sichtbar ist
            }
        } else {
            console.warn(`Baustein mit data-field="${field}" nicht gefunden.`);
        }
    });
}

// Event-Listener für die Vorlagen-Auswahl
document.addEventListener("DOMContentLoaded", () => {
    const vorlageSelect = document.getElementById("vorlage-select");

    // Vorlagen in das Dropdown einfügen
    Object.keys(vorlagen).forEach(key => {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1); // Erster Buchstabe groß
        vorlageSelect.appendChild(option);
    });

    // Vorlage anwenden, wenn eine ausgewählt wird
    vorlageSelect.addEventListener("change", () => {
        const selectedVorlage = vorlageSelect.value;
        if (selectedVorlage) {
            applyVorlage(selectedVorlage);
        }
    });

    document.querySelectorAll(".medikamentenliste").forEach(parent => {
        const addBtn = parent.querySelector(".add-medikament");
        const applyBtn = parent.querySelector(".apply-medikament");

        // Event-Listener für + Medikament
        if (!addBtn.dataset.listenerAdded) {
            addBtn.dataset.listenerAdded = true;
            addBtn.addEventListener("click", () => {
                addMedikamentenFeld(parent);
            });
        }

        // Event-Listener für Medikament übernehmen
        if (!applyBtn.dataset.listenerAdded) {
            applyBtn.dataset.listenerAdded = true;
            applyBtn.addEventListener("click", () => {
                applyMedikamente(parent);
            });
        }
    }); // Hier wurde die fehlende Klammer hinzugefügt
});
