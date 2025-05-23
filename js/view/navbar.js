import { categorieDemo } from "../app.js";
import { attivitaDemo } from "../app.js";

export function renderSidebarCategorie() {
    const ulCategorie = document.getElementById("category-list");
    ulCategorie.innerHTML = "";

    const categorieOrdinate = [...categorieDemo].sort((a, b) => {
        if (a.idCategoria === 'default') return -1;
        if (b.idCategoria === 'default') return 1;
        
        return a.descrizione.localeCompare(b.descrizione, "it", { sensitivity: "base" });
        });
        
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

    const attivitaEliminate = attivitaDemo.filter(a => a.dataEliminazione !== null);
    const btnRecycleBin = document.getElementById("btn-recycle-bin");
    btnRecycleBin.textContent = `Cestino (${attivitaEliminate.length})`;
}