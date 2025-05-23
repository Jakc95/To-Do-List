import { Categoria } from "./model/categoria.js";
import { Attivita } from "./model/attivita.js";
import { initController } from "./controller.js";

const categoriaDefault = new Categoria('default', 'Default', 'transparent', false);
export const categorieDemo = [
    categoriaDefault,
    Categoria.create('Categoria B', '#FF0000'),
    Categoria.create('Categoria A', '#00FF00'),
    Categoria.create('Categoria C', '#0000FF'),
];

export const attivitaDemo = [
    Attivita.create(categorieDemo[1].idCategoria, 'Attività 1', '2025-08-01'),
    Attivita.create(categorieDemo[1].idCategoria, 'Attività 2', '2025-06-01'),
    Attivita.create(categorieDemo[1].idCategoria, 'Attività 3', '2025-07-01'),

    Attivita.create(categorieDemo[2].idCategoria, 'Attività 1', '2025-10-30'),
    Attivita.create(categorieDemo[2].idCategoria, 'Attività 2', '2025-11-30'),
];

initController();