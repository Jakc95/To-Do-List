import { categorie, attivita, impostazioni } from "../app.js";

export function renderSidebarCategorie() {
    applicaTema();

    const ulCategorie = document.getElementById("category-list");
    ulCategorie.innerHTML = "";

    const categorieOrdinate = [...categorie].sort((a, b) => a.descrizione.localeCompare(b.descrizione, "it", { sensitivity: "base" }));

    categorieOrdinate.forEach((categoria) => {
        const li = document.createElement("li");
        const button = document.createElement("button");
        const dot = document.createElement("span");

        button.className = "nav-button";
        button.dataset.view = `cat:${categoria.idCategoria}`;
        button.textContent = categoria.descrizione;

        dot.className = "category-dot";
        if (categoria.colore !== "transparent") {
            dot.style.backgroundColor = categoria.colore;
        }
        else {
            dot.classList.add("hidden");
        }

        button.appendChild(dot);
        li.appendChild(button);
        ulCategorie.appendChild(li);
    });

    const attivitaEliminate = attivita.filter(a => a.dataEliminazione !== null);
    const btnRecycleBin = document.getElementById("btn-recycle-bin");
    btnRecycleBin.textContent = `Cestino (${attivitaEliminate.length})`;

    const sidebar = document.getElementById("sidebar");
    const sidebarToggle = document.getElementById("sidebar-toggle");
    sidebarToggle.onclick = () => {
        const isExpanded = !sidebar.classList.contains("collapsed");
        if (isExpanded) {
            sidebar.classList.add("collapsed");
            sidebarToggle.ariaLabel = "Espandi sidebar";
            sidebarToggle.textContent = ">";
        }
        else {
            sidebar.classList.remove("collapsed");
            sidebarToggle.ariaLabel = "Comprimi sidebar";
            sidebarToggle.textContent = "<";
        }
    };

    const btnCestino = document.getElementById("li-cestino");
    if (!impostazioni.cestinoAbilitato) {
        btnCestino.classList.add("hidden");
    }
    else {
        btnCestino.classList.remove("hidden");
    }
}

function applicaTema() {
    const tema = impostazioni.tema;
    document.documentElement.setAttribute('data-theme', tema);
}