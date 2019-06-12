export class LavorazioniModel {
    public id: number;
    public idPrev: number;
    public jobname: string;
    public dettaglio: string;
    public gruppo: string;
    public instanceUniqueName: string;
    public instanceName: string;
    public idGruppo: number;
    public listino: string;
    public um: string;
    public quantita: number;
    public prezzoUnitario: number;
    public scontoDocumento: number;
    public scontoRiga: number;
    public imponibile: number;
    public costoTotale: number;
    public peso: number;
    public tempo: number;
    public note: string;
    public descrizione: string;
    public hasChild: boolean;
    public dataCreazione: Date;
    public dataScadenzaOrdine?: Date;
    public statoVerificaLavorazione: boolean;
    public statoLavorazione: number;
    public numeroOrdine: string;
    public countWorkFlow: number;
    public nomeOperatore: string;
    public idOperatore?: number;
    public cliente: string;
    public idCliente: number;
    public descrizioneAnnullamento: string;
    public dataInizio?: Date;
    public dataFine?: Date;
    public data_consegna?: Date;
    public dataAnnullamento?: Date;
    public numeroProcessi: number;
    public countAttivita: number;
    public stato_file: number;
    public clienteTipologia: number;
    public clienteNome: string;
    public clienteCognome: string;
    public clienteRagSoc: string;
    public priorityId: number;
    public colorPriority: string;
    public namePriority: string;
    public priorityOrder: number;
    public idOperatori: string;
    public Stato_Processo: number;
    public FILES_STATO: number;
    public AliquotaIva: number;
    public CodiceIvaId: number;
    public PrezzoUnitarioCadauno: number;
    public ProdOrderId: string;
    public ProdOrderEndDate?: Date;
    public DataInvio?: Date;
    public DataRisposta?: Date;
    public REFFERER_ID?: number;
    public ActivitiProgress: string;
    public ActivitiesCount: number;
    public CodiceArticolo: string;
    public IdArticoloMagazzino?: number;
    public CodiceArticoloPadre: string;
    public REFFERER_NAME: string;
}