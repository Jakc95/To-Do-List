import { attivita, impostazioni } from "./app.js";
import { saveAttivita } from "./storage.js";
import { renderSidebarCategorie } from "./view/navbar.js";

export function cleanAttivita() {
    if (impostazioni.cestinoAbilitato && impostazioni.giorniConservazioneAttivita > 0) {
        const attivitaCestino = attivita.filter(a => a.dataEliminazione !== null);
        if (attivitaCestino.length > 0) {
            let refresh = false;
            attivitaCestino.forEach(att => {
                const dataEliminazione = new Date(att.dataEliminazione).getTime();
                const dataLimite = dataEliminazione + (impostazioni.giorniConservazioneAttivita * 24 * 60 * 60 * 1000);
                if (dataLimite < Date.now()) {
                    const index = attivita.findIndex(c => c.idAttivita === att.idAttivita);
                    attivita.splice(index, 1);
                    refresh = true;
                }
            });

            if (refresh) {
                saveAttivita(attivita);
                renderSidebarCategorie();
            }
        }
    }
}