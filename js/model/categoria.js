export class Categoria {
    /**
     * 
     * @param {string} idCategoria 
     * @param {string} descrizione 
     * @param {string} colore 
     * @param {boolean} canDelete 
     */
    constructor(idCategoria, descrizione, colore = 'transparent', canDelete = true) {
        this.idCategoria = idCategoria;
        this.descrizione = descrizione;
        this.colore = colore;
        this.canDelete = canDelete;
    }

    static create(descrizione, colore = 'transparent') {
        const id = crypto.randomUUID();
        return new Categoria(id, descrizione, colore);
    }
}