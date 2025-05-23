export class Attivita {
    /**
     * 
     * @param {string} idAttivita 
     * @param {string} categoriaId 
     * @param {string} descrizione 
     * @param {string} dataScadenza 
     * @param {string|null} dataCompletamento 
     * @param {string|null} dataEliminazione 
     */
    constructor(idAttivita, categoriaId, descrizione, dataScadenza) {
        this.idAttivita = idAttivita;
        this.categoriaId = categoriaId;
        this.descrizione = descrizione;
        this.dataScadenza = dataScadenza;
        this.dataCompletamento = null;
        this.dataEliminazione = null;
    }

    static create(categoriaId, descrizione, dataScadenza) {
        const id = crypto.randomUUID();
        return new Attivita(id, categoriaId, descrizione, dataScadenza);
    }
}