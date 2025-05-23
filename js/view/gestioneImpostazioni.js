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
            <label for="categoria-predefinita">Categoria predefinita</label>
            <select id="categoria-predefinita" style="width:170px;"></select>

            <label for="abilitazione-cestino" style="margin-top:10px">Abilita cestino</label>
            <input type="checkbox" id="abilitazione-cestino" />

            <button type="button" id="salva-impostazioni">Salva impostazioni</button>
        </div>`;

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

    const btnSalvaImpostazioni = document.getElementById("salva-impostazioni");
    btnSalvaImpostazioni.addEventListener("click", () => {
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

        impostazioni.categoriaPredefinita = selectCategoria.value;
        impostazioni.cestinoAbilitato = checkCestino.checked;
        saveImpostazioni(impostazioni);
        renderSidebarCategorie();
    });
}