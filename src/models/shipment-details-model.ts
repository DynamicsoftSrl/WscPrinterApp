import { DateTime } from "ionic-angular";

export class ShipmentDetailsModel {
    public RowId: number;
    public OrderNumber: string;
    public NColli?: number;
    public NumSpedizione: string;
    public RichiestaCorriere?: boolean;
    public DataConsegnaSpedizione?: DateTime;
    public TipologiaSpedizione: string;
}