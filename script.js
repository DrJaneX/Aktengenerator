
// ========================
// Vorlagen-Definition
// ========================
const vorlagen = {
    steckschuss: {
        symptome: "Starke Blutung\nSchmerzen\nSchockzustand",
        massnahme: "Blutstillung durch Druckverband/Stopfverband",
        untersuchung: "Fast-Sono durchgeführt: Kugel lokalisiert\nLidocain (örtliche Betäubung) verabreicht\nWunde gereinigt und desinfiziert\nProjektil entfernt\nWunde ausgespült\nWunde mit XX Stichen (non-reso) vernäht\nWunde verbunden",
        mitgabe: "Schmerzmittel (Ibuprofen 800mg)\nAntibiotikum",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen & Wundkontrolle"
    },
    durchschuss: {
        symptome: "Starke Blutung\nSchmerzen\nSchockzustand",
        massnahme: "Blutstillung durch Druckverband/Stopfverband\nSchmerzmittel verabreicht",
        untersuchung: "Lidocain verabreicht\nWunde ausgespült\nEin- und Austrittswunde mit XX Stichen vernäht\nWunde verbunden",
        mitgabe: "Schmerzmittel (Ibuprofen 800mg)\nAntibiotikum",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen & Wundkontrolle"
    },
    streifschuss: {
        symptome: "Starke Blutung\nSchmerzen\nSchockzustand",
        massnahme: "Blutstillung durch Druckverband\nSchmerzmittel verabreicht",
        untersuchung: "Lidocain verabreicht\nWunde ausgespült\nWunde mit XX Stichen vernäht\nWunde verbunden",
        mitgabe: "Schmerzmittel (Ibuprofen 800mg)\nAntibiotikum",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen & Wundkontrolle"
    },
    stichwunde: {
        symptome: "Starke Blutung\nSchmerzen\nSchockzustand",
        massnahme: "Blutstillung durch Druckverband/Stopfverband\nSchmerzmittel verabreicht",
        untersuchung: "Fast-Sono\nErgebnis:\nLidocain verabreicht\nWunde ausgespült\nWunde mit XX Stichen vernäht\nWunde verbunden",
        mitgabe: "Schmerzmittel (Ibuprofen 600mg)\nAntibiotikum",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen & Wundkontrolle"
    },
    schnittverletzung: {
        symptome: "Starke Blutung\nSchmerzen\nSchockzustand",
        massnahme: "Blutstillung durch Druckverband/Stopfverband\nSchmerzmittel verabreicht",
        untersuchung: "Fast-Sono\nErgebnis:\nLidocain verabreicht\nWunde ausgespült\nWunde mit XX Stichen vernäht\nWunde verbunden",
        mitgabe: "Schmerzmittel (Ibuprofen 600mg)\nAntibiotikum",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen & Wundkontrolle"
    },
    verstauchung: {
        symptome: "Schwellung\nSchmerzen\neingeschränkte Beweglichkeit",
        massnahme: "Kühlung\nRuhigstellung mit Verband",
        untersuchung: "Röntgen/CT/MRT durchgeführt, Ergebnis:\nkeine Fraktur festgestellt\nWunde verbunden",
        mitgabe: "Schmerzgel (Diclofenac)\nelastischer Verband",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen,Wundkontrolle & erneutes Röntgen/CT/MRT"
    },
    haarriss: {
        symptome: "Schwellung\nSchmerzen\neingeschränkte Beweglichkeit",
        massnahme: "Kühlung\nRuhigstellung mit Verband",
        untersuchung: "Röntgen/CT/MRT durchgeführt, Ergebnis:\nHaarriss festgestellt\nWunde verbunden",
        mitgabe: "Schmerzgel (Diclofenac)\nelastischer Verband",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen,Wundkontrolle & erneutes Röntgen/CT/MRT"
    },
    fraktur: {
        symptome: "Starke Schmerzen\nSchwellung\nBewegungseinschränkung",
        massnahme: "Ruhigstellung\nSchmerztherapie",
        untersuchung: "Röntgen/CT/MRT durchgeführt, Ergebnis:\n Fraktur festgestellt\nVerband/Gips angelegt",
        mitgabe: "Schmerzmittel (Ibuprofen 600mg)\nKrücken",
        nachkontrolle: "XX.XX.XXXX\nFäden ziehen & Wundkontrolle"
    }
};

const medikamente = [
    "Paracetamol (Schmerzmittel)", "Ibuprofen (Schmerzmittel)", "Ringerlösung", "Adrenalin",
    "Morphin (BTM - starkes Schmerzmittel)", "Novalgin", "Glucose", "Ketamin"
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

// ========================
// Diagnose übernehmen Button
// ========================
document.addEventListener("click", (e) => {
    if (e.target && e.target.classList.contains("apply-location")) {
        const vorlage = document.getElementById("vorlage-select").value;
        const teil = document.querySelector(".body-part-select")?.value || "";
        const seite = document.querySelector(".side-select")?.value || "";
        const diagnose = createDiagnose(vorlage, teil, seite);
        const feld = document.querySelector('.baustein[data-field="diagnose"] textarea');
        if (feld && diagnose) {
            feld.value = feld.value.trim() ? `${feld.value.trim()}\n${diagnose}` : diagnose;
        }
    }
});

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
    wrapper.style.display = "block";
    wrapper.style.marginTop = "0.5rem";

    const dropdown = createDropdown();
    dropdown.style.width = "100%";
    dropdown.style.marginBottom = "0.5rem";

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✖";
    removeBtn.classList.add("remove-dropdown");
    removeBtn.onclick = () => wrapper.remove();
    removeBtn.style.display = "block";
    removeBtn.style.marginTop = "0.25rem";

    wrapper.appendChild(dropdown);
    wrapper.appendChild(removeBtn);

    const list = parent.querySelector(".medikament-list");
    if (list) list.appendChild(wrapper);
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
        btn.addEventListener("click", () => addMedikamentenFeld(btn.closest(".medikament-section")));
    });

    document.querySelectorAll(".apply-medikament").forEach(btn => {
        btn.addEventListener("click", () => applyMedikamente(btn.closest(".medikament-section")));
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

`;
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
