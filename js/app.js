import { Categoria } from "./model/categoria.js";
import { initController } from "./controller.js";
import { loadCategorie, loadAttivita, saveCategorie, loadImpostazioni, saveImpostazioni } from "./storage.js";

export let categorie = loadCategorie();
export let attivita = loadAttivita();
export let impostazioni = loadImpostazioni();

if (categorie.length === 0) {
    const categoriaDefault = new Categoria('default', 'Default', 'transparent', false);
    categorie = [categoriaDefault];
    saveCategorie(categorie);
}

if (impostazioni.length === 0) {
    impostazioni = {
        categoriaPredefinita: "default",
        cestinoAbilitato: true,
    };
    saveImpostazioni(impostazioni);
}

initController();