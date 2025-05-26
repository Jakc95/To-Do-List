import { attivita, categorie, impostazioni } from "../app.js";
import { saveAttivita, saveImpostazioni } from "../storage.js";
import { renderSidebarCategorie } from "./navbar.js";

export function renderGestioneImpostazioni() {
    const mainElement = document.getElementById("main-content");
    mainElement.innerHTML = `
        <header>
            <h1 class="page-title">Impostazioni</h1>
        </header>
        <div id="div-impostazioni">
            <label for="tema">Usa modalità notte</label>
            <input type="checkbox" id="tema" />

            <label for="categoria-predefinita" style="margin-top:10px">Categoria predefinita</label>
            <select id="categoria-predefinita" style="width:170px;"></select>

            <label for="abilitazione-cestino" style="margin-top:10px">Abilita cestino</label>
            <input type="checkbox" id="abilitazione-cestino" />

            <div id="div-giorni-conservazione" style="margin-top:10px">
                <label for="giorni-conservazione-attivita" style="display: block">Giorni di conservazione delle attività nel cestino</label>
                <input type="number" min="0" max="120" step="1" id="giorni-conservazione-attivita" style="width: 45px; margin-top: 10px;" required />
                <span class="info-text">(inserire 0 per disabilitare l'eliminazione automatica delle attività)</span>
            </div>
            
            <button type="button" id="salva-impostazioni" style="margin-top: 20px;">Salva impostazioni</button>
        </div>`;

    const chkTema = document.getElementById("tema");
    chkTema.checked = impostazioni.tema === "scuro";

    const selectCategoria = document.getElementById("categoria-predefinita");
    const categorieOrdinate = [...categorie].sort((a, b) => a.descrizione.localeCompare(b.descrizione, "it", { sensitivity: "base" }));

    categorieOrdinate.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.idCategoria;
        option.textContent = categoria.descrizione
        if (categoria.idCategoria === impostazioni.categoriaPredefinita) {
            option.selected = true;
        }
        selectCategoria.appendChild(option);
    });

    const checkCestino = document.getElementById("abilitazione-cestino");
    checkCestino.checked = impostazioni.cestinoAbilitato;

    const divGiorniConservazione = document.getElementById("div-giorni-conservazione");
    if (!checkCestino.checked) {
        divGiorniConservazione.classList.add("hidden");
    }

    checkCestino.addEventListener("change", () => {
        if (!checkCestino.checked) {
            divGiorniConservazione.classList.add("hidden");
        }
        else {
            divGiorniConservazione.classList.remove("hidden");
        }
    });

    const inputGiorniConservazione = document.getElementById("giorni-conservazione-attivita");
    inputGiorniConservazione.value = impostazioni.giorniConservazioneAttivita;

    const btnSalvaImpostazioni = document.getElementById("salva-impostazioni");
    btnSalvaImpostazioni.addEventListener("click", () => {

        if (!inputGiorniConservazione.value) {
            alert("È necessario indicare un numero di giorni di conservazione delle attività compreso tra 0 e 120.");
            return;
        }

        if (inputGiorniConservazione.value < 0 || inputGiorniConservazione.value > 120) {
            alert("Il numero di giorni di conservazione delle attività deve essere compreso tra 0 e 120.");
            return;
        }

        if (impostazioni.cestinoAbilitato && !checkCestino.checked) {
            const attivitaCestino = attivita.filter(a => a.dataEliminazione !== null);
            if (attivitaCestino.length > 0) {
                const confermaDisabilitazioneCestino = confirm("Disabilitando il cestino, tutte le attività eliminate verranno eliminate definitivamente. Vuoi continuare?");
                if (!confermaDisabilitazioneCestino) {
                    checkCestino.checked = true;
                    return;
                }
                else {
                    attivitaCestino.forEach(delAttivita => {
                        const index = attivita.findIndex(c => c.idAttivita === delAttivita.idAttivita);
                        attivita.splice(index, 1);
                    });

                    saveAttivita(attivita);
                    renderSidebarCategorie();
                }
            }
        }

        impostazioni.tema = chkTema.checked ? "scuro" : "chiaro";
        impostazioni.categoriaPredefinita = selectCategoria.value;
        impostazioni.cestinoAbilitato = checkCestino.checked;
        impostazioni.giorniConservazioneAttivita = inputGiorniConservazione.value;
        saveImpostazioni(impostazioni);
        renderSidebarCategorie();
    });
}