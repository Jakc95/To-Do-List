const chiaveCategorie = "todo-categorie";
const chiaveAttivita = "todo-attivita";
const chiaveImpostazioni = "todo-impostazioni";

export function loadCategorie() {
    const jsonCategorie = localStorage.getItem(chiaveCategorie);
    if (!jsonCategorie) return new Array();
    try {
        return JSON.parse(jsonCategorie);
    }
    catch {
        alert("Errore durante il recupero delle categorie!");
        return new Array();
    }
}

export function saveCategorie(listaCategorie) {
    try {
        localStorage.setItem(chiaveCategorie, JSON.stringify(listaCategorie));
    }
    catch {
        alert("Errore durante il salvataggio delle categorie!");
    }
}

export function loadAttivita() {
    const jsonAttivita = localStorage.getItem(chiaveAttivita);
    if (!jsonAttivita) return new Array();
    try {
        return JSON.parse(jsonAttivita);
    }
    catch {
        alert("Errore durante il recupero delle attività!");
        return new Array();
    }
}

export function saveAttivita(listaAttivita) {
    try {
        localStorage.setItem(chiaveAttivita, JSON.stringify(listaAttivita));
    }
    catch {
        alert("Errore durante il salvataggio delle attività!");
    }
}

export function loadImpostazioni() {
    const jsonImpostazioni = localStorage.getItem(chiaveImpostazioni);
    if (!jsonImpostazioni) return new Array();
    try {
        return JSON.parse(jsonImpostazioni);
    }
    catch {
        alert("Errore durante il recupero delle impostazioni!");
        return new Array();
    }
}

export function saveImpostazioni(impostazioni, showAlert = true) {
    try {
        localStorage.setItem(chiaveImpostazioni, JSON.stringify(impostazioni));
        if (showAlert === true) {
            alert("Impostazioni salvate con successo!");
        }
    }
    catch {
        alert("Errore durante il salvataggio delle impostazioni!");
    }
}