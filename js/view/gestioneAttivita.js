import { attivitaDemo } from "../app.js";
import { categorieDemo } from "../app.js";
import { Attivita } from "../model/attivita.js";
import { renderSidebarCategorie } from "./navbar.js";

let currentIdCategoria = "";
let currentCestino = false;

export function renderGestioneAttivita(idCategoria = "", includiAttivitaCompletate = false, cestino = false) {
    currentIdCategoria = idCategoria;
    currentCestino = cestino;

    const mainElement = document.getElementById("main-content");
    let pageTitle = "";
    if (currentIdCategoria === "") {
        if (currentCestino) {
            pageTitle = "Attività eliminate";
        }
        else {
            pageTitle = "Tutte le attività";
        }
    }
    else {
        const descrizioneCategoria = categorieDemo.find(c => c.idCategoria === currentIdCategoria).descrizione;
        pageTitle = `Attività (${descrizioneCategoria})`;
    }

    mainElement.innerHTML = `
            <header>
                <h1 class="page-title">${pageTitle}</h1>
                <button id="btn-add-task" ${currentCestino ? 'class="hidden"' : ''}>Nuova Attività</button>
                <input type="checkbox" id="includi-attivita-completate" style="margin-left: 50px;" ${includiAttivitaCompletate ? "checked" : ""} ${currentCestino ? 'class="hidden"' : ''} />
                <label for="includi-attivita-completate" ${currentCestino ? 'class="hidden"' : ''}>Includi attività completate</label>
            </header>
            <table>
                <thead>
                    <tr>
                        ${currentIdCategoria === "" ? '<th id="th-categoria">Categoria</th>' : ''}
                        <th id="th-descrizione">Descrizione</th>
                        <th id="th-scadenza">Scadenza</th>
                        ${includiAttivitaCompletate ? '<th id="th-completamento">Completamento</th>' : ''}
                        ${currentCestino ? '<th id="th-eliminazione">Eliminazione</th>' : ''}
                        <th id="th-azioni">Azioni</th>
                    </tr>
                </thead>
                <tbody id="task-table-body"></tbody>
            </table>
            <div id="task-modal" class="modal hidden">
                <form id="task-form" class="modal-content">
                    <h2 id="modal-title">Nuova Attività</h2>

                    <label for="categoria-attivita">Categoria</label>
                    <select id="categoria-attivita" style="width:170px;" required></select>

                    <label for="descrizione-attivita" style="margin-top:10px">Descrizione</label>
                    <input type="text" id="descrizione-attivita" placeholder="Descrizione" required />

                    <label for="data-scadenza-attivita" style="margin-top:10px">Data Scadenza</label>
                    <input type="date" id="data-scadenza-attivita" required />

                    <div class="modal-buttons">
                        <button type="submit" class="modal-conferma">Conferma</button>
                        <button type="button" class="modal-chiudi" id="close-modal-attivita">Chiudi</button>
                    </div>
                </form>
            </div>`;

    const taskTableBody = document.getElementById("task-table-body");
    taskTableBody.innerHTML = "";

    const chkIncludiAttivitaCompletate = document.getElementById("includi-attivita-completate");
    const attivitaOrdinate = [...attivitaDemo].sort((a, b) => a.dataScadenza.localeCompare(b.dataScadenza));

    let attivitaFiltrate = attivitaOrdinate.filter(a => (currentIdCategoria === "" || a.categoriaId === currentIdCategoria) &&
        (chkIncludiAttivitaCompletate.checked || a.dataCompletamento === null));

    if (currentCestino) {
        attivitaFiltrate = attivitaFiltrate.filter(a => a.dataEliminazione !== null);
    }
    else {
        attivitaFiltrate = attivitaFiltrate.filter(a => a.dataEliminazione === null);
    }

    for (const attivita of attivitaFiltrate) {
        const trAttivita = document.createElement("tr");
        const categoriaAttivita = categorieDemo.find(c => c.idCategoria === attivita.categoriaId);
        if (categoriaAttivita.colore !== "transparent") {
            trAttivita.style.backgroundColor = categorieDemo.find(c => c.idCategoria === attivita.categoriaId).colore + "50";
        }

        trAttivita.innerHTML = `
                    ${currentIdCategoria === "" ? `<td>${categoriaAttivita.descrizione}</td>` : ''}
                    <td>${attivita.descrizione}</td>
                    <td>${new Date(attivita.dataScadenza).toLocaleDateString()}</td>
                    ${includiAttivitaCompletate ? `<td>${(attivita.dataCompletamento !== null ? new Date(attivita.dataCompletamento).toLocaleDateString() : "")}</td>` : ''}
                    ${currentCestino ? `<td>${new Date(attivita.dataEliminazione).toLocaleDateString()}</td>` : ''}
                    ${currentCestino
                ? `
                        <td>
                            <button class="restore-button" title="Ripristina l'attività selezionata" data-id="${attivita.idAttivita}">Ripristina</button>
                            <button class="delete-button" title="Elimina l'attività selezionata" data-id="${attivita.idAttivita}">Elimina</button>
                        </td>`
                : `
                        <td>
                            <button class="edit-button" title="Modifica l'attività selezionata" data-id="${attivita.idAttivita}">Modifica</button>
                            <button class="close-button" title="Contrassegna l'attività selezionata come completata" data-id="${attivita.idAttivita}">Chiudi</button>
                            <button class="recycle-bin-button" title="Sposta l'attività selezionata nel cestino" data-id="${attivita.idAttivita}">Elimina</button>
                        </td>`
            }`;

        taskTableBody.appendChild(trAttivita);
    }

    if (currentCestino) {
        const thCategoria = document.getElementById("th-categoria");
        const thDescrizione = document.getElementById("th-descrizione");
        const thScadenza = document.getElementById("th-scadenza");
        const thEliminazione = document.getElementById("th-eliminazione");
        const thAzioni = document.getElementById("th-azioni");

        thCategoria.style.width = "20%";
        thDescrizione.style.width = "41%";
        thScadenza.style.width = "12%";
        thEliminazione.style.width = "12%";
        thAzioni.style.width = "15%";
    }
    else if (currentIdCategoria === "") {
        if (includiAttivitaCompletate) {
            const thCategoria = document.getElementById("th-categoria");
            const thDescrizione = document.getElementById("th-descrizione");
            const thScadenza = document.getElementById("th-scadenza");
            const thCompletamento = document.getElementById("th-completamento");
            const thAzioni = document.getElementById("th-azioni");

            thCategoria.style.width = "20%";
            thDescrizione.style.width = "36%";
            thScadenza.style.width = "12%";
            thCompletamento.style.width = "12%";
            thAzioni.style.width = "20%";
        }
        else {
            const thCategoria = document.getElementById("th-categoria");
            const thDescrizione = document.getElementById("th-descrizione");
            const thScadenza = document.getElementById("th-scadenza");
            const thAzioni = document.getElementById("th-azioni");

            thCategoria.style.width = "20%";
            thDescrizione.style.width = "48%";
            thScadenza.style.width = "12%";
            thAzioni.style.width = "20%";
        }
    }
    else {
        if (includiAttivitaCompletate) {
            const thDescrizione = document.getElementById("th-descrizione");
            const thScadenza = document.getElementById("th-scadenza");
            const thCompletamento = document.getElementById("th-completamento");
            const thAzioni = document.getElementById("th-azioni");

            thDescrizione.style.width = "56%";
            thScadenza.style.width = "12%";
            thCompletamento.style.width = "12%";
            thAzioni.style.width = "20%";
        }
        else {
            const thDescrizione = document.getElementById("th-descrizione");
            const thScadenza = document.getElementById("th-scadenza");
            const thAzioni = document.getElementById("th-azioni");

            thDescrizione.style.width = "68%";
            thScadenza.style.width = "12%";
            thAzioni.style.width = "20%";
        }
    }

    document.getElementById("btn-add-task")
        .addEventListener("click", () => openTaskModal(null));

    taskTableBody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("edit-button")) {
            openTaskModal(id);
        }
        else if (e.target.classList.contains("close-button")) {
            closeTask(id);
        }
        else if (e.target.classList.contains("recycle-bin-button")) {
            recycleTask(id);
        }
        else if (e.target.classList.contains("restore-button")) {
            restoreTask(id);
        }
        else if (e.target.classList.contains("delete-button")) {
            deleteTask(id);
        }
    });

    const selectCategoria = document.getElementById("categoria-attivita");
    const categorieOrdinate = [...categorieDemo].sort((a, b) => {
        if (a.idCategoria === 'default') return -1;
        if (b.idCategoria === 'default') return 1;

        return a.descrizione.localeCompare(b.descrizione, "it", { sensitivity: "base" });
    });

    categorieOrdinate.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.idCategoria;
        option.textContent = categoria.descrizione;
        selectCategoria.appendChild(option);
    });

    document.getElementById("includi-attivita-completate").onchange = () => { renderGestioneAttivita(currentIdCategoria, chkIncludiAttivitaCompletate.checked, false) };
}

function openTaskModal(id = null) {
    const modalElement = document.getElementById("task-modal");
    const modalTitle = document.getElementById("modal-title");
    const inputDescrizione = document.getElementById("descrizione-attivita");
    const inputDataScadenza = document.getElementById("data-scadenza-attivita");
    const formElement = document.getElementById("task-form");
    const attivita = (id ? attivitaDemo.find(c => c.idAttivita === id) : null);

    if (id) {
        modalTitle.textContent = "Modifica Attività";
        inputDescrizione.value = attivita.descrizione;
        inputDataScadenza.value = attivita.dataScadenza;
        Array.from(document.getElementById("categoria-attivita")
            .getElementsByTagName("option"))
            .filter(c => c.value === attivita.categoriaId)[0]
            .selected = true;
    }
    else {
        modalTitle.textContent = "Nuova Attività";
        inputDescrizione.value = "";
        inputDataScadenza.value = null;
        Array.from(document.getElementById("categoria-attivita")
            .getElementsByTagName("option"))
            .filter(c => c.value === "default")[0]
            .selected = true;
    }

    modalElement.classList.remove("hidden");
    inputDescrizione.focus();

    formElement.onsubmit = (e) => {
        e.preventDefault();
        const descrizione = inputDescrizione.value;
        if (!descrizione) {
            alert("È necessario inserire una descrizione!");
            return;
        }

        const dataScadenza = inputDataScadenza.value;
        if (!dataScadenza) {
            alert("È necessario inserire una data di scadenza!");
            return;
        }

        if (id) {
            attivita.categoriaId = document.getElementById("categoria-attivita").value;
            attivita.descrizione = descrizione;
            attivita.dataScadenza = dataScadenza;
        }
        else {
            const newAttivita = Attivita.create(document.getElementById("categoria-attivita").value, descrizione, dataScadenza);
            attivitaDemo.push(newAttivita);
        }

        modalElement.classList.add("hidden");
        renderGestioneAttivita(currentIdCategoria, document.getElementById("includi-attivita-completate").checked, currentCestino);
    }

    document.getElementById("close-modal-attivita").onclick = () => {
        modalElement.classList.add("hidden");
    }
}

function closeTask(id) {
    const attivita = attivitaDemo.find(c => c.idAttivita === id);

    const confirmClose = confirm(`Confermi di voler contrassegnare l'attività "${attivita.descrizione}" come completata?`);
    if (confirmClose) {
        attivita.dataCompletamento = new Date().toISOString().slice(0, 10);
        renderGestioneAttivita(currentIdCategoria, document.getElementById("includi-attivita-completate").checked, currentCestino);
    }
}

function recycleTask(id) {
    const recycleAttivita = attivitaDemo.find(c => c.idAttivita === id);

    const confirmRecycle = confirm(`Confermi di voler spostare nel cestino l'attività "${recycleAttivita.descrizione}"?`);
    if (confirmRecycle) {
        recycleAttivita.dataEliminazione = new Date().toISOString().slice(0, 10);
        renderGestioneAttivita(currentIdCategoria, document.getElementById("includi-attivita-completate").checked, currentCestino);
        renderSidebarCategorie();
    }
}

function restoreTask(id) {
    const restoreAttivita = attivitaDemo.find(c => c.idAttivita === id);

    const confirmRestore = confirm(`Confermi di voler ripristinare l'attività "${restoreAttivita.descrizione}"?`);
    if (confirmRestore) {
        restoreAttivita.dataEliminazione = null;
        renderGestioneAttivita(currentIdCategoria, document.getElementById("includi-attivita-completate").checked, currentCestino);
        renderSidebarCategorie();
    }
}

function deleteTask(id) {
    const delAttivita = attivitaDemo.find(c => c.idAttivita === id);

    const confirmDelete = confirm(`Confermi di voler eliminare definitivamente l'attività "${delAttivita.descrizione}"?`);
    if (confirmDelete) {
        const index = attivitaDemo.findIndex(c => c.idAttivita === id);
        attivitaDemo.splice(index, 1);
        renderGestioneAttivita(currentIdCategoria, document.getElementById("includi-attivita-completate").checked, currentCestino);
        renderSidebarCategorie();
    }
}