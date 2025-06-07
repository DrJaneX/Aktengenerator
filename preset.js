// Vorlagen-Daten
const vorlagen = {
    steckschuss: {
        symptome: "Starke Blutung, Schmerzen, Schockzustand",
        massnahme: "Blutstillung durch Druckverband, Schmerzmittel verabreicht",
        untersuchung: "Röntgenaufnahme durchgeführt, Kugel lokalisiert",
        mitgabe: "Schmerzmittel (Ibuprofen 400mg), Antibiotikum",
        nachkontrolle: "Nachkontrolle in 7 Tagen empfohlen",
        besonderheiten: "Patient ist allergisch gegen Penicillin"
    },
    durchschuss: {
        symptome: "Starke Blutung, Schmerzen, Schockzustand",
        massnahme: "Blutstillung durch Druckverband, Schmerzmittel verabreicht",
        untersuchung: "Röntgenaufnahme durchgeführt, Kugel lokalisiert",
        mitgabe: "Schmerzmittel (Ibuprofen 400mg), Antibiotikum",
        nachkontrolle: "Nachkontrolle in 7 Tagen empfohlen",
        besonderheiten: "Patient ist allergisch gegen Penicillin"
    },
    verstauchung: {
        symptome: "Schwellung, Schmerzen, eingeschränkte Beweglichkeit",
        massnahme: "Kühlung, Ruhigstellung mit Verband",
        untersuchung: "Röntgenaufnahme durchgeführt, keine Fraktur festgestellt",
        mitgabe: "Schmerzgel (Diclofenac), elastischer Verband",
        nachkontrolle: "Nachkontrolle in 3 Tagen empfohlen",
        besonderheiten: "Keine Allergien bekannt"
    },
    fraktur: {
        symptome: "Starke Schmerzen, Schwellung, Bewegungseinschränkung",
        massnahme: "Ruhigstellung, Schmerztherapie",
        untersuchung: "Röntgenaufnahme durchgeführt, Fraktur bestätigt",
        mitgabe: "Schmerzmittel (Ibuprofen 600mg), Krücken",
        nachkontrolle: "Nachkontrolle in 5 Tagen empfohlen",
        besonderheiten: "Keine Allergien bekannt"
    }
};

// Funktion zum Erstellen der dynamischen Diagnose
function createDynamicDiagnose(vorlageKey, koerperteil, seite) {
    if (!vorlageKey) return "";
    
    const vorlageName = vorlageKey.charAt(0).toUpperCase() + vorlageKey.slice(1);
    let diagnose = vorlageName;
    
    if (koerperteil) {
        diagnose += " " + koerperteil;
    }
    
    if (seite) {
        diagnose += " " + seite;
    }
    
    return diagnose;
}

// Funktion zum Aktualisieren der Diagnose basierend auf Auswahl
function updateDiagnose() {
    const vorlageSelect = document.getElementById("vorlage-select");
    const koerperteilSelect = document.getElementById("koerperteil-select");
    const seiteSelect = document.getElementById("seite-select");
    
    if (!vorlageSelect || !vorlageSelect.value) return;
    
    const vorlageKey = vorlageSelect.value;
    const koerperteil = koerperteilSelect ? koerperteilSelect.value : "";
    const seite = seiteSelect ? seiteSelect.value : "";
    
    const dynamischeDiagnose = createDynamicDiagnose(vorlageKey, koerperteil, seite);
    
    // Diagnose-Feld aktualisieren
    const diagnoseBaustein = document.querySelector('.baustein[data-field="diagnose"]');
    if (diagnoseBaustein) {
        const diagnoseInput = diagnoseBaustein.querySelector("input, textarea");
        if (diagnoseInput && dynamischeDiagnose) {
            diagnoseInput.value = dynamischeDiagnose;
        }
    }
}

// Funktion zum Anwenden einer Vorlage
function applyVorlage(vorlageKey) {
    const vorlage = vorlagen[vorlageKey];
    if (!vorlage) return;

    // Fülle die entsprechenden Felder mit den Vorlagen-Daten (außer Diagnose)
    Object.keys(vorlage).forEach(field => {
        if (field === 'diagnose') return; // Diagnose wird dynamisch erstellt
        
        const baustein = document.querySelector(`.baustein[data-field="${field}"]`);
        if (baustein) {
            baustein.style.display = "block";

            const input = baustein.querySelector("input, textarea");
            if (input) {
                input.value = vorlage[field];
            }
        }
    });

    // Zeige die Auswahl für Seite und Körperteil immer an, wenn eine Vorlage ausgewählt ist
    const diagnoseBaustein = document.querySelector('.baustein[data-field="diagnose"]');
    if (diagnoseBaustein) {
        diagnoseBaustein.style.display = "block";
        addLocationSelectors(); // Auswahl hinzufügen
        
        // Event-Listener für Körperteil- und Seiten-Auswahl hinzufügen
        setTimeout(() => {
            const koerperteilSelect = document.getElementById("koerperteil-select");
            const seiteSelect = document.getElementById("seite-select");
            
            if (koerperteilSelect && !koerperteilSelect.dataset.listenerAdded) {
                koerperteilSelect.dataset.listenerAdded = true;
                koerperteilSelect.addEventListener("change", updateDiagnose);
            }
            
            if (seiteSelect && !seiteSelect.dataset.listenerAdded) {
                seiteSelect.dataset.listenerAdded = true;
                seiteSelect.addEventListener("change", updateDiagnose);
            }
            
            // Initiale Diagnose setzen
            updateDiagnose();
        }, 100);
    }
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
    });
});
