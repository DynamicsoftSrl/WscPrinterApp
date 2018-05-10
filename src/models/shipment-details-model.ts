import { DateTime } from "ionic-angular";

export class ShipmentDetailsModel {
    public RowId: number;
    public OrderNumber: string;
    public NColli?: number;
    public NumSpedizione: string;
    public RichiestaCorriere?: boolean;
    public DataScadenzaSpedizione?: DateTime;
    public TipologiaSpedizione: string;
    public StatoSpedizione?: number;
    public NoteSpedizione: string;
}