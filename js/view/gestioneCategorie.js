import { categorieDemo } from "../app.js";
import { attivitaDemo } from "../app.js";
import { Categoria } from "../model/categoria.js";
import { renderSidebarCategorie } from "./navbar.js";

export function renderGestioneCategorie() {
    const mainElement = document.getElementById("main-content");
    mainElement.innerHTML = `
        <header>
            <h1 class="page-title">Gestione Categorie</h1>
            <button id="btn-add-category">Nuova categoria</button>
        </header>
        <table>
            <thead>
                <tr>
                    <th style="width: 70%;">Descrizione</th>
                    <th style="width: 10%;">Colore</th>
                    <th style="width: 20%;">Azioni</th>
                </tr>
            </thead>
            <tbody id="category-table-body"></tbody>
        </table>
        <div id="category-modal" class="modal hidden">
            <form id="category-form" class="modal-content">
                <h2 id="modal-title">Nuova Categoria</h2>

                <label for="descrizione-categoria">Descrizione</label>
                <input type="text" id="descrizione-categoria" placeholder="Descrizione" required />

                <label for="colore-trasparente-categoria" style="margin-top:10px">Nessun colore</label>
                <input type="checkbox" id="colore-trasparente-categoria" />

                <label id="label-colore-categoria" for="colore-categoria" style="margin-top:10px">Colore</label>
                <input type="color" id="colore-categoria" />

                <div class="modal-buttons">
                    <button type="submit" class="modal-conferma">Conferma</button>
                    <button type="button" class="modal-chiudi" id="close-modal-categoria">Chiudi</button>
                </div>
            </form>
        </div>`;

    const categoryTableBody = document.getElementById("category-table-body");
    categoryTableBody.innerHTML = "";

    const categorieOrdinate = [...categorieDemo].sort((a, b) => {
        if (a.idCategoria === 'default') return -1;
        if (b.idCategoria === 'default') return 1;

        return a.descrizione.localeCompare(b.descrizione, "it", { sensitivity: "base" });
    });

    categorieOrdinate.forEach((categoria) => {
        const trCategoria = document.createElement("tr");
        trCategoria.innerHTML = `
                <td>${categoria.descrizione}</td>
                <td>
                    <span class="category-color ${categoria.colore === 'transparent' ? "hidden" : ""}" style="background-color: ${categoria.colore};"></span>
                </td>
                <td class="td-azioni">
                    <button class="edit-button" data-id="${categoria.idCategoria}">Modifica</button>
                    <button class="delete-button" data-id="${categoria.idCategoria}" ${categoria.canDelete ? "" : "disabled"}>Elimina</button>
                </td>`;

        categoryTableBody.appendChild(trCategoria);
    });

    document.getElementById("btn-add-category")
        .addEventListener("click", () => openCategoryModal(null));

    categoryTableBody.addEventListener("click", (e) => {
        const id = e.target.dataset.id;
        if (!id) return;

        if (e.target.classList.contains("edit-button")) {
            openCategoryModal(id);
        }
        else if (e.target.classList.contains("delete-button")) {
            deleteCategory(id);
        }
    });

    const chkNessunColore = document.getElementById("colore-trasparente-categoria");
    const lblColoreCategoria = document.getElementById("label-colore-categoria");
    const inputColoreCategoria = document.getElementById("colore-categoria");

    chkNessunColore.onchange = () => {
        if (chkNessunColore.checked) {
            lblColoreCategoria.classList.add("hidden");
            inputColoreCategoria.classList.add("hidden");
        }
        else {
            lblColoreCategoria.classList.remove("hidden");
            inputColoreCategoria.classList.remove("hidden");
        }
    };
}

function openCategoryModal(id = null) {
    const modalElement = document.getElementById("category-modal");
    const modalTitle = document.getElementById("modal-title");
    const inputDescrizione = document.getElementById("descrizione-categoria");
    const inputColore = document.getElementById("colore-categoria");
    const formElement = document.getElementById("category-form");
    const categoria = (id ? categorieDemo.find(c => c.idCategoria === id) : null);
    const chkNessunColore = document.getElementById("colore-trasparente-categoria");

    if (id) {
        modalTitle.textContent = "Modifica Categoria";
        inputDescrizione.value = categoria.descrizione;
        inputColore.value = categoria.colore;
        chkNessunColore.checked = (categoria.colore === "transparent");
        chkNessunColore.onchange();
    }
    else {
        modalTitle.textContent = "Nuova Categoria";
        inputDescrizione.value = "";
        inputColore.value = "transparent";
        chkNessunColore.checked = true;
        chkNessunColore.onchange();
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

        if (id) {
            categoria.descrizione = descrizione;
            categoria.colore = (chkNessunColore.checked ? "transparent" : inputColore.value);
        }
        else {
            const newCategoria = Categoria.create(descrizione, (chkNessunColore.checked ? "transparent" : inputColore.value));
            categorieDemo.push(newCategoria);
        }

        modalElement.classList.add("hidden");
        renderGestioneCategorie();
        renderSidebarCategorie();
    }

    document.getElementById("close-modal-categoria").onclick = () => {
        modalElement.classList.add("hidden");
    }
}

function deleteCategory(id) {
    const delCategoria = categorieDemo.find(c => c.idCategoria === id);
    if (!delCategoria.canDelete) {
        alert("La categoria selezionata non è eliminabile!");
        return;
    }

    if (attivitaDemo.some(a => a.categoriaId === id)) {
        alert("Non è possibile eliminare la categoria selezionata perché risulta associata ad una o più attività!");
        return;
    }

    const confirmDelete = confirm(`Confermi di voler eliminare la categoria "${delCategoria.descrizione}"?`);
    if (confirmDelete) {
        const index = categorieDemo.findIndex(c => c.idCategoria === id);
        categorieDemo.splice(index, 1);
        renderGestioneCategorie();
        renderSidebarCategorie();
    }
}