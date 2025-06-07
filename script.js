// ========================
// Vorlagen-Definition
// ========================
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

const medikamente = [
    "Paracetamol", "Ibuprofen", "Salbutamol", "Adrenalin",
    "Morphin", "Ringer-Lösung", "Glucose", "Ketamin"
];

// ========================
// Diagnose aus Vorlage + Position
// ========================
function createDiagnose(vorlage, teil, seite) {
    if (!vorlage) return "";
    let name = vorlage.charAt(0).toUpperCase() + vorlage.slice(1);
    if (teil) name += ` ${teil}`;
    if (seite) name += ` ${seite}`;
    return name;
}

function updateDiagnoseFeld() {
    const vorlage = document.getElementById("vorlage-select").value;
    const teil = document.querySelector(".body-part-select")?.value || "";
    const seite = document.querySelector(".side-select")?.value || "";
    const diagnose = createDiagnose(vorlage, teil, seite);
    const feld = document.querySelector('.baustein[data-field="diagnose"] textarea');
    if (feld) feld.value = feld.value.trim() ? `${feld.value.trim()}\n${diagnose}` : diagnose;
}

// ========================
// Vorlagen anwenden
// ========================
function applyVorlage(key) {
    const daten = vorlagen[key];
    if (!daten) return;
    Object.entries(daten).forEach(([feld, text]) => {
        const baustein = document.querySelector(`.baustein[data-field="${feld}"]`);
        if (!baustein) return;
        baustein.style.display = "block";
        const textarea = baustein.querySelector("textarea");
        if (textarea) textarea.value = textarea.value.trim() ? `${textarea.value.trim()}\n${text}` : text;
    });
    updateDiagnoseFeld();
}

// ========================
// Medikamentenfeld Logik
// ========================
function createDropdown() {
    const select = document.createElement("select");
    select.classList.add("medikament-dropdown");

    select.innerHTML = '<option disabled selected>-- Medikament wählen --</option>' +
        medikamente.map(m => `<option value="${m}">${m}</option>`).join("");

    return select;
}

function addMedikamentenFeld(parent) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("dropdown-wrapper");

    const dropdown = createDropdown();
    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✖";
    removeBtn.classList.add("remove-dropdown");
    removeBtn.onclick = () => wrapper.remove();

    wrapper.append(dropdown, removeBtn);
    parent.insertBefore(wrapper, parent.querySelector(".add-medikament"));
}

function applyMedikamente(parent) {
    const textarea = parent.closest(".baustein")?.querySelector("textarea");
    if (!textarea) return;

    const selected = Array.from(parent.querySelectorAll("select.medikament-dropdown"))
        .map(s => s.value).filter(Boolean);

    if (!selected.length) return;

    const text = selected.length === 1
        ? `${selected[0]} wurde verabreicht`
        : `${selected.slice(0, -1).join(", ")} und ${selected.slice(-1)} wurden verabreicht`;

    textarea.value = textarea.value.trim()
        ? `${textarea.value.trim()}\n${text}`
        : text;

    parent.querySelectorAll(".dropdown-wrapper").forEach(e => e.remove());
}

// ========================
// Initialisierung
// ========================
document.addEventListener("DOMContentLoaded", () => {
    const vorlageSelect = document.getElementById("vorlage-select");
    Object.keys(vorlagen).forEach(key => {
        const opt = document.createElement("option");
        opt.value = key;
        opt.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        vorlageSelect.appendChild(opt);
    });

    vorlageSelect.addEventListener("change", e => {
        applyVorlage(e.target.value);
        document.querySelectorAll(".baustein").forEach(el => el.style.display = "block");
    });

    document.querySelectorAll(".add-medikament").forEach(btn => {
        btn.addEventListener("click", () => addMedikamentenFeld(btn.parentElement));
    });

    document.querySelectorAll(".apply-medikament").forEach(btn => {
        btn.addEventListener("click", () => applyMedikamente(btn.parentElement));
    });

    document.querySelectorAll(".remove-baustein").forEach(btn => {
        btn.addEventListener("click", () => {
            btn.closest(".baustein").style.display = "none";
        });
    });

    document.querySelectorAll(".baustein-buttons button").forEach(btn => {
        btn.addEventListener("click", () => {
            const target = btn.getAttribute("data-target");
            const el = document.querySelector(`.baustein[data-field="${target}"]`);
            if (el) el.style.display = "block";
        });
    });

    // Seite/Körperteil Dropdown
    document.querySelectorAll(".body-part-select, .side-select").forEach(select => {
        select.addEventListener("change", updateDiagnoseFeld);
    });

    document.getElementById("clear-all").addEventListener("click", () => {
        document.querySelectorAll("textarea, input[type='text']").forEach(el => el.value = "");
        document.querySelectorAll("select").forEach(sel => sel.selectedIndex = 0);
        document.getElementById("akte-preview").innerHTML = "";
    });

    document.getElementById("toggle-darkmode").addEventListener("click", () => {
        document.body.classList.toggle("dark-mode");
    });

    document.getElementById("akte-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const preview = document.getElementById("akte-preview");
        preview.innerHTML = "";
        let content = "";

        document.querySelectorAll(".baustein").forEach(baustein => {
            const input = baustein.querySelector("input, textarea");
            if (!input || !input.value.trim()) return;

            const label = baustein.querySelector("label").childNodes[0].textContent.replace(/:$/, "").trim();
            const value = input.value.trim();
            const block = document.createElement("div");
            block.innerHTML = `<strong>${label}:</strong><br>${value}`;
            preview.append(block, document.createElement("br"), document.createElement("br"));
            content += `${label}:
${value}
\n`;
        });

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "In Zwischenablage kopieren";
        copyBtn.classList.add("copy-button");
        copyBtn.addEventListener("click", () => {
            navigator.clipboard.writeText(content.trim()).then(() => {
                alert("Akte wurde in die Zwischenablage kopiert!");
            });
        });

        preview.appendChild(copyBtn);
    });
});
