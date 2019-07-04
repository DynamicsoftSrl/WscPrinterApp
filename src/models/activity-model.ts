export class ActivityModel {
    public Annulla_Processo_Operatore: string;
    public DataAnnullamento_Processo: string;
    public DataAssegnazione_Processo: string;
    public DataFine_Processo: string;
    public DataInizio_Processo: string;
    public DataScadenzaOrdine?: Date;
    public Descrizione_Elemento: string;
    public Fine_Processo_Operatore: string;
    public IdCliente: string;
    public IdOperatore: string;
    public IdOperatori: string;
    public IdOrder: number;
    public Id_Attivita: string;
    public Id_Elemento: string;
    public Id_Fase: string;
    public Id_Gruppo: string;
    public Id_Order_Dettail: number;
    public Id_Processo_Lavorazione: number;
    public Id_Reparto: string;
    public Id_Workflow: string;
    public Inizio_Processo_Operatore: string;
    public Nome_Fase: string;
    public Nome_Gruppo: string;
    public Nome_Processo: string;
    public Nome_Reparto: string;
    public Nome_Workflow: string;
    public NoteAnnullamento_Processo: string;
    public Note_Sospensione_Processo: string;
    public NumeroOrdine: string;
    public Ordine_Fase: number;
    public PosizioneProcesso: number;
    public SSMA_TimeStamp: string;
    public Sospeso_Processo_Operatore: string;
    public Stato_Processo: number;
    public statoProcesso: string;
    public Tipo_Processo: string;
    public cliente: string;
    public data_scadenza_ordine?: Date;
    public scadenzaAttivita?: Date;
    public descrizione: string;
    public flagPermesso: boolean;
    public flag_assegnazione: string;
    public idAssociazioneWorkflow: string;
    public idOperatoriAttivita: string;
    public isOperatorePresent: boolean;
    public jobname: string;
    public lower_case_cliente: string;
    public lower_case_jobname: string;
    public lower_case_nome_attivita: string;
    public lower_case_nome_fase: string;
    public lower_case_operatore_annulla: string;
    public lower_case_operatore_avvio: string;
    public lower_case_operatore_termina: string;
    public operatore: string;
    public operatori_assegnati: string;
    public statoLavorazione: string;
    public strDataAnnulla: string;
    public strDataFine: string;
    public strDataInizio: string;
    public tipo_associazione: string;
    public ConsuntivoTempoTotale?: Number;
}