import { DateTime } from 'ionic-angular';
export class LavNote {
    public DataNotaString: string;
    public IdPrinterUpNoteLavorazione: number;
    public NumeroOrdine: string;
    public IdLavorazione?: number;
    public DescrizioneNota: string;
    public EmessoDa: string;
    public TipoEmissione?: number;
    public DataNota?: DateTime;
    public TipoNota?: number;
    public SSMA_TimeStamp: any;
    public LetturaNota: string;
    public Oggetto: string;
    public Tipo: string;
    public IdUserMittente?: number;
    public IdUserDestinatario?: number;
    public LetturaNotaBackoffice?: boolean; 
    public LettoDaBackoffice: string;
    public DataLettoBackoffice?: DateTime;
}