import { renderSidebarCategorie } from "./view/navbar.js";
import { renderGestioneCategorie } from "./view/gestioneCategorie.js";
import { renderGestioneAttivita } from "./view/gestioneAttivita.js";
import { renderGestioneImpostazioni } from "./view/gestioneImpostazioni.js";

export function initController() {
    renderSidebarCategorie();

    document.getElementById("sidebar")
            .addEventListener("click", onSidebarClick);

    renderGestioneAttivita();
}

function onSidebarClick(event) {
    const btn = event.target.closest(".nav-button");
    if (!btn) return;

    const view = btn.dataset.view;
    if (!view) return;

    document.querySelectorAll(".nav-button.active")
        .forEach((button) => button.classList.remove("active"));

    btn.classList.add("active");

    changeView(view);
}

function changeView(view) {
    if (view === "all") {
        renderGestioneAttivita();
    }
    else if (view == "manage-categories") {
        renderGestioneCategorie();
    }
    else if (view === "recycle-bin") {
        renderGestioneAttivita("", false, true);
    }
    else if (view === "settings") {
        renderGestioneImpostazioni();
    }
    else if (view.startsWith("cat:")) {
        renderGestioneAttivita(view.slice(4));
    }
}