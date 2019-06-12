import { LavorazioniModel } from './lavorazioni-model';

export class LavorazioniViewModel {
    public CountLavorazioni: number;
    public LavorazioniList: LavorazioniModel[];

    constructor() {
        this.LavorazioniList = [];
    }
}