let gewaehlteMethode = "";
let maxErreichterSchritt = 1;

// FORTSCHRITTSLEISTE
//--------------------------------------------------------------------
function aktualisiereLeiste(nr) {
    if (nr > maxErreichterSchritt) maxErreichterSchritt = nr;

    for (let i = 1; i <= 5; i++) {
        const schritt = document.getElementById("schritt-" + i);
        schritt.classList.remove("aktiv", "abgeschlossen", "gesperrt");

        if (i === nr) {
            schritt.classList.add("aktiv");
            schritt.onclick = null;
        } else if (i <= maxErreichterSchritt && i > 1) {
            schritt.classList.add("abgeschlossen");
            schritt.onclick = () => geheZuSchritt(i);
            schritt.style.cursor = "pointer";
        } else if (i === 1) {
            schritt.classList.add("abgeschlossen");
            schritt.onclick = null;
        } else {
            schritt.classList.add("gesperrt");
            schritt.onclick = null;
        }
    }
}
function geheZuSchritt(nr) {
    if (nr ===5) {
        weiterZuUebersicht();
        return;
    }
    const sektionen = ["sektion-spendemethode", "sektion-art", "sektion-krisengebiet", "sektion-angaben", "sektion-uebersicht"];
    sektionen.forEach(s => document.getElementById(s).style.display = "none");
    document.getElementById(sektionen[nr - 1]).style.display = "block";
    aktualisiereLeiste(nr);
}

// 1) SPENDENMETHODE
//----------------------------------------------------------------------
  // Schritt 1: Abgabe vor Ort
  function waehleAbgabe() {
    gewaehlteMethode = "abgabe";
    document.getElementById("sektion-spendemethode").style.display = "none";
    document.getElementById("sektion-art").style.display = "block";
    aktualisiereLeiste(2);
  }
  // Schritt 1: Abholung per Sammelfahrzeug
  function waehleAbholung() {
    gewaehlteMethode = "abholung";
    document.getElementById("sektion-spendemethode").style.display = "none";
    document.getElementById("sektion-art").style.display = "block";
    aktualisiereLeiste(2);
  }
  // Prüfen der Postleitzahl für Abholung
  function pruefePLZ() {
  const plz = document.getElementById("plz").value;
    const hinweis = document.getElementById("plzHinweis");
    if (plz.startsWith("31") && plz.length === 5) {
        hinweis.textContent = "Wir können Ihre Kleidung bei Ihnen abholen. Bitte geben Sie im Anschluss Ihre Abholadresse an.";
        hinweis.style.color = "green";
        document.getElementById("abholkarte").classList.remove("disabled-card");
    } else if (plz.length === 5) {
        hinweis.textContent = "Diese PLZ liegt leider nicht in unserem Sammelgebiet.";
        hinweis.style.color = "red";
        document.getElementById("abholkarte").classList.add("disabled-card");
    } else {
        hinweis.textContent = "Geben Sie Ihre PLZ an, damit wir prüfen können, ob wir in Ihrer Region Abholungen anbieten.";
        hinweis.style.color = "";
        document.getElementById("abholkarte").classList.add("disabled-card");
    }
  }



// 2) KLEIDERART
//---------------------------------------------------------------------
  // Toggle WEITER-Button bei Auswahl eines Krisengebiets
  function toggleAuswahl(element) {
    element.classList.toggle("selected");
    pruefeUmfang();
  }
    function pruefeUmfang() {
    const kartons = document.getElementById("kartons").value;
    const saecke = document.getElementById("saecke").value;
    const hatUmfang = (kartons !== "0" && kartons !== "") || (saecke !== "0" && saecke !== "");
    const hatKleiderart = document.querySelectorAll(".card-kleiderart.selected").length > 0;
    document.getElementById("btn-weiter-krisengebiet").disabled = !(hatUmfang && hatKleiderart);
}
  // ZURÜCK von Schritt 2 zu Schritt 1
  function zurueckZuSpendemethode() {
    document.getElementById("sektion-art").style.display = "none";
    document.getElementById("sektion-spendemethode").style.display = "block";
    aktualisiereLeiste(1);
  }
  // WEITER von Schritt 2 zu Schritt 3
  function weiterZuKrisengebiet() {
    document.getElementById("sektion-art").style.display = "none";
    document.getElementById("sektion-krisengebiet").style.display = "block";
    aktualisiereLeiste(3);
  }

// 3) KRISENGEBIET
//---------------------------------------------------------------------------
  // Schritt 3: Auswahl eines Krisengebiets
  function waehleKrisengebiet(element) {
    document.querySelectorAll(".card-krisengebiet").forEach(function(card) {
        card.classList.remove("selected");
    });
    element.classList.add("selected");

    const anzahlAusgewaehlt = document.querySelectorAll(".card-krisengebiet.selected").length;
    document.getElementById("btn-weiter-angaben").disabled = anzahlAusgewaehlt === 0;
  }
  // ZURÜCK von Schritt 3 zu Schritt 2
  function zurueckZuArt() {
    document.getElementById("sektion-krisengebiet").style.display = "none";
    document.getElementById("sektion-art").style.display = "block";
    aktualisiereLeiste(2);
  }
  // WEITER von Schritt 3 zu Schritt 4
  function weiterZuAngaben() {
    document.getElementById("sektion-krisengebiet").style.display = "none";
    document.getElementById("sektion-angaben").style.display = "block";
    if (gewaehlteMethode === "abholung") {
    document.getElementById("abholangaben").style.display = "block";
    befuelleAbholtage();
    } else {
    document.getElementById("abholangaben").style.display = "none";
    }
    aktualisiereLeiste(4);
  }

// 4) ANGABEN
//------------------------------------------------------------------------------
  // Wochentage für die zweitnächste volle Woche
  function befuelleAbholtage() {
    const heute = new Date();
    const bisNaechstenMontag = (1 - heute.getDay() + 7) % 7 || 7;
    const start = new Date(heute);
    start.setDate(heute.getDate() + bisNaechstenMontag + 7);

    const wochentage = ["Montag", "Dienstag", "Mittwoch", "Donnerstag", "Freitag", "Samstag"];
    const select = document.getElementById("abholtag");
    select.innerHTML = '<option value="">Bitte wählen</option>';

    for (let i = 0; i < 6; i++) {
        const datum = new Date(start);
        datum.setDate(start.getDate() + i);
        const option = document.createElement("option");
        option.textContent = wochentage[i] + ", " + datum.toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"});
        select.appendChild(option);
    }
  }
  // AbholPLZ Validierung
  function pruefeAbholPLZ() {
    const plz = document.getElementById("abholplz").value;
    const fehler = document.getElementById("fehlerAbholPLZ");
    fehler.style.display = (plz.length === 5 && !plz.startsWith("31")) ? "block" : "none";
  }
  
  // ZURÜCK von Schritt 4 zu Schritt 3
  function zurueckZuKrisengebiet() {
    document.getElementById("sektion-angaben").style.display = "none";
    document.getElementById("sektion-krisengebiet").style.display = "block";
    aktualisiereLeiste(3);
  }
    // WEITER von Schritt 4 zu Schritt 5
    function weiterZuUebersicht() {
        if (!validiereAngaben()) return;
    
        document.getElementById("uebersicht-vorname").textContent = document.getElementById("vorname").value.trim();
        document.getElementById("uebersicht-name").textContent = document.getElementById("name").value.trim();
        document.getElementById("uebersicht-email").textContent = document.getElementById("email").value.trim();
    
        document.getElementById("uebersicht-spendenmethode").textContent = 
            (gewaehlteMethode === "abholung") ? "Abholung per Sammelfahrzeug" : "Übergabe vor Ort";
    
        if (gewaehlteMethode === "abholung") {
            document.getElementById("uebersicht-abholangaben").style.display = "block";
            document.getElementById("uebersicht-straße").textContent = document.getElementById("straße").value.trim();
            document.getElementById("uebersicht-hausnr").textContent = document.getElementById("hausnummer").value.trim();
            document.getElementById("uebersicht-plz").textContent = document.getElementById("abholplz").value.trim();
            document.getElementById("uebersicht-ort").textContent = document.getElementById("abholort").value.trim();
    
            const adresszusatz = document.getElementById("adresszusatz").value.trim();
            if (adresszusatz) {
                document.getElementById("uebersicht-adresszusatz").textContent = adresszusatz;
                document.getElementById("uebersicht-adresszusatzangabe").removeAttribute("hidden");
            } else {
                document.getElementById("uebersicht-adresszusatzangabe").setAttribute("hidden", "true");
            }
    
            const telnummer = document.getElementById("telnummer").value.trim();
            if (telnummer) {
                document.getElementById("uebersicht-telnummer").textContent = telnummer;
                document.getElementById("uebersicht-telefonangabe").removeAttribute("hidden");
            } else {
                document.getElementById("uebersicht-telefonangabe").setAttribute("hidden", "true");
            }
    
            document.getElementById("uebersicht-abholtag").textContent = document.getElementById("abholtag").value;
            document.getElementById("uebersicht-abholzeit").textContent = document.getElementById("abholzeit").value;
        } else {
            document.getElementById("uebersicht-abholangaben").style.display = "none";
        } 
    
        const kartonsVal = document.getElementById("kartons").value;
        const saeckeVal = document.getElementById("saecke").value;
        document.getElementById("uebersicht-kartons").textContent = document.getElementById("kartons").value;
        document.getElementById("uebersicht-saecke").textContent = document.getElementById("saecke").value;
    
        const ausgewaehlteKleider = [];
        document.querySelectorAll(".selected:not(.card-krisengebiet)").forEach(function(karte) {
            ausgewaehlteKleider.push(karte.querySelector(".card-title").textContent);
        });
        document.getElementById("uebersicht-kleidung-art").textContent = ausgewaehlteKleider.join(", ");
    
        const krisengebiet = document.querySelector(".card-krisengebiet.selected");
        if (krisengebiet) {
            document.getElementById("uebersicht-krisengebiet-name").textContent = krisengebiet.querySelector(".card-title").textContent;
        }
    
        document.getElementById("sektion-angaben").style.display = "none";
        document.getElementById("sektion-uebersicht").style.display = "block";
        aktualisiereLeiste(5);
    }

    //ZURÜCK von Schritt 5 zu Schritt 4
    function zurueckZuAngaben() {
        document.getElementById("sektion-uebersicht").style.display = "none";
        document.getElementById("sektion-angaben").style.display = "block";
        aktualisiereLeiste(4)
    }
  // WEITER von Schritt 5 zur Bestätigung mit Zusammenfassung der Angaben
  function weiterZuBestaetigung() {
    // Kleiderarten: alle ausgewählten Kacheln die KEINE Krisengebiet-Kacheln sind
    const ausgewaehlteKleider = [];
    document.querySelectorAll(".selected:not(.card-krisengebiet)").forEach(function(karte) {
        ausgewaehlteKleider.push(karte.querySelector(".card-title").textContent);
    });
    document.getElementById("kleidung-art").textContent = ausgewaehlteKleider.join(", ");

    // Angabe zu Krisengebiet
    const krisengebiet = document.querySelector(".card-krisengebiet.selected");
    document.getElementById("krisengebiet-name").textContent = krisengebiet.querySelector(".card-title").textContent;

    // Datum und Uhrzeit von Registrierungseingang
    const jetzt = new Date();
    document.getElementById("reg-datum").textContent = jetzt.toLocaleDateString("de-DE", {day: "2-digit", month: "2-digit", year: "numeric"});
    document.getElementById("reg-zeit").textContent = jetzt.toLocaleTimeString("de-DE", {hour: "2-digit", minute: "2-digit"});

    // Angaben des Spenders
    document.getElementById("bstg-vorname").textContent = document.getElementById("vorname").value.trim();
    document.getElementById("bstg-name").textContent = document.getElementById("name").value.trim();
    document.getElementById("bstg-email").textContent = document.getElementById("email").value.trim();

    if (gewaehlteMethode === "abholung") {
      document.getElementById("infoAbholung").style.display = "block";
      document.getElementById("infoAbgabe").style.display = "none";
    // Angaben zur Abholung
    // → Abholadresse
    document.getElementById("bstg-straße").textContent = document.getElementById("straße").value.trim();
    document.getElementById("bstg-hausnummer").textContent = document.getElementById("hausnummer").value.trim();
    const adresszusatz = document.getElementById("adresszusatz").value.trim();
      if (adresszusatz) {
        document.getElementById("bstg-adresszusatz").textContent = document.getElementById("adresszusatz").value.trim();
        document.getElementById("br-adresszusatz").removeAttribute("hidden");
      }
    document.getElementById("bstg-abholplz").textContent = document.getElementById("abholplz").value.trim();
    document.getElementById("bstg-abholort").textContent = document.getElementById("abholort").value.trim();
    const telnummer = document.getElementById("telnummer").value.trim();
      if (telnummer) {
        document.getElementById("bstg-telnummer").textContent = document.getElementById("telnummer").value.trim();
        document.getElementById("angabe-telefon").removeAttribute("hidden");
      }
    // → Abholzeitpunkt
    const abholtag = document.getElementById("abholtag").value;
    document.getElementById("bstg-abholtag").textContent = abholtag;
    const abholzeit = document.getElementById("abholzeit").value;
    document.getElementById("bstg-abholzeit").textContent = abholzeit;
    } else {
      document.getElementById("infoAbholung").style.display = "none";
      document.getElementById("infoAbgabe").style.display = "block";
    } 
    const checkAlter = document.getElementById("checkAlter");
    const checkDaten = document.getElementById("checkDatenverarbeitung");
    let valide = true;
    
    if (!checkAlter.checked) { 
        checkAlter.classList.add("is-invalid"); 
        valide = false; 
    } else { 
        checkAlter.classList.remove("is-invalid"); 
    }
    
    if (!checkDaten.checked) { 
        checkDaten.classList.add("is-invalid"); 
        valide = false; 
    } else { 
        checkDaten.classList.remove("is-invalid"); 
    }
    
    // ERST wenn beide Checkboxen geprüft wurden, abbrechen:
    if (!valide) return;

    // Sektion wechseln
    document.getElementById("sektion-uebersicht").style.display = "none";
    document.getElementById("sektion-bestaetigung").style.display = "block";
    document.getElementById("Registrierungsschritte").style.display = "none";
    document.getElementById("regIP").style.display = "none";
    document.getElementById("regDONE").style.display = "block";
  }

// Enter für Eingabe bestätigen und nächsten Schritt
document.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const weiterBtn = document.querySelector("section:not([style*='display: none']) button[id^='btn-weiter']:not([disabled])");
        if (weiterBtn) weiterBtn.click();
    }
});

function validiereAngaben() {
    let valide = true;
    const namenRegex = /^[a-zA-ZäöüÄÖÜß\s.'-]+$/;

    // Hilfsfunktion: Textfeld prüfen (nicht leer)
    function pruefeTextfeld(id) {
        const el = document.getElementById(id);
        if (el.value.trim() === "") {
            el.classList.add("is-invalid");
            el.classList.remove("is-valid");
            return false;
        } else {
            el.classList.add("is-valid");
            el.classList.remove("is-invalid");
            return true;
        }
    }

    // Vorname prüfen (keine Zahlen)
    const vorname = document.getElementById("vorname");
    if (!namenRegex.test(vorname.value.trim())) {
        vorname.classList.add("is-invalid");
        vorname.classList.remove("is-valid");
        valide = false;
    } else {
        vorname.classList.add("is-valid");
        vorname.classList.remove("is-invalid");
    }

    // Nachname prüfen (keine Zahlen)
    const name = document.getElementById("name");
    if (!namenRegex.test(name.value.trim())) {
        name.classList.add("is-invalid");
        name.classList.remove("is-valid");
        valide = false;
    } else {
        name.classList.add("is-valid");
        name.classList.remove("is-invalid");
    }

    // E-Mail mit Format-Check
    const email = document.getElementById("email");
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.value.trim())) {
        email.classList.add("is-invalid");
        email.classList.remove("is-valid");
        valide = false;
    } else {
        email.classList.add("is-valid");
        email.classList.remove("is-invalid");
    }

    // Abholfelder nur prüfen wenn Abholung sichtbar
    const abholangaben = document.getElementById("abholangaben");
    if (abholangaben.style.display !== "none") {

        // Straße prüfen (keine Zahlen)
        const straße = document.getElementById("straße");
        if (!namenRegex.test(straße.value.trim())) {
            straße.classList.add("is-invalid");
            straße.classList.remove("is-valid");
            valide = false;
        } else {
            straße.classList.add("is-valid");
            straße.classList.remove("is-invalid");
        }

        if (!pruefeTextfeld("hausnummer")) valide = false;
        if (!pruefeTextfeld("abholort"))   valide = false;

        // PLZ: genau 5 Ziffern oder mit 31 beginnend
        const abholplz = document.getElementById("abholplz");
        const fehlerAbholPLZ = document.getElementById("fehlerAbholPLZ");
        if (!/^\d{5}$/.test(abholplz.value) || !abholplz.value.startsWith("31")) {
            abholplz.classList.add("is-invalid");
            abholplz.classList.remove("is-valid");
            fehlerAbholPLZ.style.display = (abholplz.value.length === 5 && !abholplz.value.startsWith("31")) ? "block" : "none";
            valide = false;
        } else {
            abholplz.classList.add("is-valid");
            abholplz.classList.remove("is-invalid");
            fehlerAbholPLZ.style.display = "none";
        }

        // Select-Felder: Wunsch-Abholtermin & -zeit
        ["abholtag", "abholzeit"].forEach(id => {
            const el = document.getElementById(id);
            if (el.value === "") {
                el.classList.add("is-invalid");
                el.classList.remove("is-valid");
                valide = false;
            } else {
                el.classList.add("is-valid");
                el.classList.remove("is-invalid");
            }
        });
    }



    return valide;
}


// LIVE-VALIDIERUNG: Feedback beim Bearbeiten der Felder
function initialisiereValidierung() {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const namenRegex = /^[a-zA-ZäöüÄÖÜß\s.'-]+$/;

    // Namensfelder & Straße: Feedback beim Verlassen mit Regex-Prüfung (keine Zahlen)
    ["vorname", "name", "straße"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("blur", function () {
            if (namenRegex.test(el.value.trim())) {
                el.classList.add("is-valid");
                el.classList.remove("is-invalid");
            } else {
                el.classList.add("is-invalid");
                el.classList.remove("is-valid");
            }
        });
    });

    // Andere Textfelder (Hausnummer & Abholort): Feedback beim Verlassen (nur nicht leer)
    ["hausnummer", "abholort"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("blur", function () {
            if (el.value.trim() !== "") {
                el.classList.add("is-valid");
                el.classList.remove("is-invalid");
            } else {
                el.classList.add("is-invalid");
                el.classList.remove("is-valid");
            }
        });
    });

    // E-Mail: Feedback beim Verlassen mit Format-Prüfung
    const emailEl = document.getElementById("email");
    if (emailEl) {
        emailEl.addEventListener("blur", function () {
            if (emailRegex.test(emailEl.value.trim())) {
                emailEl.classList.add("is-valid");
                emailEl.classList.remove("is-invalid");
            } else {
                emailEl.classList.add("is-invalid");
                emailEl.classList.remove("is-valid");
            }
        });
    }

    // Abholung-PLZ: Feedback beim Verlassen
    const abholplzEl = document.getElementById("abholplz");
    const fehlerAbholPLZ = document.getElementById("fehlerAbholPLZ");
    if (abholplzEl) {
        abholplzEl.addEventListener("blur", function () {
            const valid = /^\d{5}$/.test(abholplzEl.value) && abholplzEl.value.startsWith("31");
            if (valid) {
                abholplzEl.classList.add("is-valid");
                abholplzEl.classList.remove("is-invalid");
                if (fehlerAbholPLZ) fehlerAbholPLZ.style.display = "none";
            } else {
                abholplzEl.classList.add("is-invalid");
                abholplzEl.classList.remove("is-valid");
                if (fehlerAbholPLZ) fehlerAbholPLZ.style.display = (abholplzEl.value.length === 5 && !abholplzEl.value.startsWith("31")) ? "block" : "none";
            }
        });
    }

    // Select-Felder: Feedback bei Auswahl
    ["abholtag", "abholzeit"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("change", function () {
            if (el.value !== "") {
                el.classList.add("is-valid");
                el.classList.remove("is-invalid");
            } else {
                el.classList.add("is-invalid");
                el.classList.remove("is-valid");
            }
        });
    });

    // Checkboxen: Feedback bei Änderung
    ["checkAlter", "checkDatenverarbeitung"].forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("change", function () {
            if (el.checked) {
                el.classList.remove("is-invalid");
            } else {
                el.classList.add("is-invalid");
                el.classList.remove("is-valid");
            }
        });
    });
}

// Einmalig aufrufen beim Laden der Seite
initialisiereValidierung();
