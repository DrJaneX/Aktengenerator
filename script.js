const medikamente = [
    "Paracetamol",
    "Ibuprofen",
    "Salbutamol",
    "Adrenalin",
    "Morphin",
    "Ringer-Lösung",
    "Glucose",
    "Ketamin"
];

// Dropdown für Medikamente erzeugen
function createDropdown() {
    const select = document.createElement("select");
    select.classList.add("medikament-dropdown");

    const defaultOption = document.createElement("option");
    defaultOption.textContent = "-- Medikament wählen --";
    defaultOption.disabled = true;
    defaultOption.selected = true;
    select.appendChild(defaultOption);

    medikamente.forEach(name => {
        const option = document.createElement("option");
        option.value = name;
        option.textContent = name;
        select.appendChild(option);
    });

    return select;
}

// Medikamentenfeld hinzufügen
function addMedikamentenFeld(parent) {
    console.log("addMedikamentenFeld aufgerufen");
    const wrapper = document.createElement("div");
    wrapper.classList.add("dropdown-wrapper");

    const dropdown = createDropdown();

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✖";
    removeBtn.classList.add("remove-dropdown");
    removeBtn.onclick = () => wrapper.remove();

    wrapper.appendChild(dropdown);
    wrapper.appendChild(removeBtn);

    parent.insertBefore(wrapper, parent.querySelector(".add-medikament"));
}

// Medikamente anwenden und formatiert ins Textfeld schreiben
function applyMedikamente(parent) {
    const textarea = parent.closest(".baustein").querySelector("textarea");
    const dropdowns = parent.querySelectorAll("select.medikament-dropdown");

    const selected = Array.from(dropdowns)
        .map(sel => sel.value)
        .filter(val => val);

    if (selected.length > 0) {
        let text = "";
        if (selected.length === 1) {
            text = `${selected[0]} wurde verabreicht`;
        } else {
            const last = selected.pop();
            text = `${selected.join(", ")} und ${last} wurden verabreicht`;
        }

        const current = textarea.value.trim();
        textarea.value = current ? `${current}, ${text}` : text;
    }

    parent.querySelectorAll(".dropdown-wrapper").forEach(el => el.remove());
}

// ✖-Button zum Entfernen von Bausteinen
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-baustein")) {
        const baustein = e.target.closest(".baustein");
        if (baustein) {
            baustein.style.display = "none"; // Baustein ausblenden
        }
    }
});

function addBaustein(field, labelText) {
    const bausteinContainer = document.createElement("div");
    bausteinContainer.classList.add("baustein");
    bausteinContainer.setAttribute("data-field", field);

    const label = document.createElement("label");
    label.innerHTML = `${labelText}: <button type="button" class="remove-baustein">✖</button>`;

    const textarea = document.createElement("textarea");
    textarea.name = field;

    bausteinContainer.appendChild(label);
    bausteinContainer.appendChild(textarea);

    document.querySelector("#baustein-auswahl").appendChild(bausteinContainer);
}

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".medikamentenliste").forEach(parent => {
        const addBtn = parent.querySelector(".add-medikament");
        const applyBtn = parent.querySelector(".apply-medikament");

        // Verhindere doppelte Registrierung für + Medikament
        if (!addBtn.dataset.listenerAdded) {
            addBtn.dataset.listenerAdded = true;

            console.log("Event-Listener für + Medikament registriert");

            // Medikamenten-Dropdown hinzufügen
            addBtn.addEventListener("click", () => {
                console.log("+ Medikament Button geklickt");
                addMedikamentenFeld(parent);
            });
        }

        // Verhindere doppelte Registrierung für Medikament übernehmen
        if (!applyBtn.dataset.listenerAdded) {
            applyBtn.dataset.listenerAdded = true;

            // Medikamente übernehmen
            applyBtn.addEventListener("click", () => {
                applyMedikamente(parent);
            });
        }
    });

    document.querySelectorAll(".add-medikament").forEach((btn, index) => {
        console.log(`+ Medikament Button ${index + 1}:`, btn);
    });

    // Nur patientName und personal beim Laden anzeigen
    document.querySelectorAll(".baustein").forEach(el => {
        const feld = el.getAttribute("data-field");
        el.style.display = (feld === "patientName" || feld === "personal") ? "block" : "none";
    });

    // Button-Logik: Bausteine anzeigen, wenn ein Button geklickt wird
    document.querySelectorAll(".baustein-buttons button").forEach(button => {
        button.addEventListener("click", () => {
            const target = button.getAttribute("data-target");
            const baustein = document.querySelector(`.baustein[data-field="${target}"]`);
            if (baustein) {
                baustein.style.display = "block"; // Sichtbar machen
            }
        });
    });

    // Bei Vorlagen-Auswahl: Alle relevanten Bausteine einblenden
    const vorlageSelect = document.getElementById("vorlage-select");
    if (vorlageSelect) {
        vorlageSelect.addEventListener("change", () => {
            const useVorlage = vorlageSelect.value;
            document.querySelectorAll(".baustein").forEach(el => {
                const feld = el.getAttribute("data-field");
                el.style.display = useVorlage ? "block" : (feld === "patientName" || feld === "personal") ? "block" : "none";
            });
        });
    }
});

function initBausteinAuswahl() {
    console.log("initBausteinAuswahl wurde aufgerufen");
    // Hier kann die Logik für die Bausteinauswahl hinzugefügt werden
}

initBausteinAuswahl();

document.getElementById("akte-form").addEventListener("submit", (e) => {
    e.preventDefault();

    const preview = document.getElementById("akte-preview");
    preview.innerHTML = ""; // Vorschau leeren

    let previewContent = ""; // Inhalt für die Zwischenablage

    // Alle sichtbaren Bausteine sammeln
    document.querySelectorAll(".baustein").forEach((baustein) => {
        const input = baustein.querySelector("input, textarea");
        if (input && input.value.trim()) {
            // Nur den Text des Labels ohne den Button und ohne zusätzlichen Doppelpunkt übernehmen
            const label = baustein.querySelector("label");
            let labelText = label ? label.childNodes[0].textContent.trim() : "Unbenannt";

            // Entferne einen eventuell vorhandenen Doppelpunkt am Ende des Labels
            labelText = labelText.replace(/:$/, "");

            const value = input.value.trim();

            // Baustein in die Vorschau einfügen
            const previewItem = document.createElement("div");
            previewItem.innerHTML = `<strong>${labelText}:</strong><br>${value}`;
            preview.appendChild(previewItem);

            // Zwei Absätze zwischen den Bausteinen
            preview.appendChild(document.createElement("br"));
            preview.appendChild(document.createElement("br"));

            // Inhalt für die Zwischenablage sammeln
            previewContent += `${labelText}:\n${value}\n\n`;
        }
    });

    // Copy-Button hinzufügen
    const copyButton = document.createElement("button");
    copyButton.textContent = "In Zwischenablage kopieren";
    copyButton.classList.add("copy-button");
    copyButton.addEventListener("click", () => {
        navigator.clipboard.writeText(previewContent.trim()).then(() => {
            alert("Akte wurde in die Zwischenablage kopiert!");
        }).catch(err => {
            console.error("Fehler beim Kopieren in die Zwischenablage:", err);
        });
    });
    preview.appendChild(copyButton);
});

function addDiagnoseSelectors() {
    const diagnoseBaustein = document.querySelector('.baustein[data-field="diagnose"]');
    if (!diagnoseBaustein) return;

    // Container für die zusätzlichen Auswahlmöglichkeiten
    let locationWrapper = diagnoseBaustein.querySelector(".location-wrapper");
    if (!locationWrapper) {
        locationWrapper = document.createElement("div");
        locationWrapper.classList.add("location-wrapper");
        diagnoseBaustein.appendChild(locationWrapper);
    }

    // Rechts/Links Dropdown
    const sideSelect = document.createElement("select");
    sideSelect.classList.add("side-select");
    sideSelect.innerHTML = `
        <option value="" disabled selected>-- Seite wählen --</option>
        <option value="rechts">Rechts</option>
        <option value="links">Links</option>
    `;

    // Körperteil Dropdown
    const bodyPartSelect = document.createElement("select");
    bodyPartSelect.classList.add("body-part-select");
    bodyPartSelect.innerHTML = `
        <option value="" disabled selected>-- Körperteil wählen --</option>
        <option value="Oberschenkel">Oberschenkel</option>
        <option value="Bauch">Bauch</option>
        <option value="Oberarm">Oberarm</option>
        <option value="Unterarm">Unterarm</option>
        <option value="Kopf">Kopf</option>
        <option value="Brust">Brust</option>
        <option value="Rücken">Rücken</option>
        <option value="Unterschenkel">Unterschenkel</option>
        <option value="Hand">Hand</option>
        <option value="Fuß">Fuß</option>
    `;

    // Button zum Anwenden der Auswahl
    const applyButton = document.createElement("button");
    applyButton.type = "button";
    applyButton.textContent = "Auswahl übernehmen";
    applyButton.classList.add("apply-location");
    applyButton.addEventListener("click", () => {
        const side = sideSelect.value;
        const bodyPart = bodyPartSelect.value;

        if (side && bodyPart) {
            const textarea = diagnoseBaustein.querySelector("textarea");
            const currentText = textarea.value.trim();
            const newText = `${bodyPart} ${side}`;
            textarea.value = currentText ? `${currentText}, ${newText}` : newText;
        } else {
            alert("Bitte sowohl Seite als auch Körperteil auswählen.");
        }
    });

    // Wrapper leeren und neue Elemente hinzufügen
    locationWrapper.innerHTML = "";
    locationWrapper.appendChild(sideSelect);
    locationWrapper.appendChild(bodyPartSelect);
    locationWrapper.appendChild(applyButton);

    // Auswahl immer sichtbar machen
    locationWrapper.style.display = "flex";
}

// Diagnose-Selektoren beim Laden initialisieren
document.addEventListener("DOMContentLoaded", () => {
    // Warten bis alle anderen DOM-Inhalte geladen sind
    setTimeout(() => {
        addDiagnoseSelectors();
    }, 100);
});

document.getElementById("clear-all").addEventListener("click", () => {
    // Alle Textfelder leeren
    document.querySelectorAll("textarea, input[type='text']").forEach(input => {
        input.value = "";
    });

    // Alle Dropdowns zurücksetzen
    document.querySelectorAll("select").forEach(select => {
        select.selectedIndex = 0; // Setzt auf die erste Option zurück
    });

    // Optional: Vorschau leeren
    const preview = document.getElementById("akte-preview");
    if (preview) {
        preview.innerHTML = "";
    }

    alert("Alle Felder wurden geleert!");
});

document.getElementById("toggle-darkmode").addEventListener("click", () => {
    document.body.classList.toggle("dark-mode");
});
