import { DateTime } from 'ionic-angular';

export class ShipmentDetailsModel {
    public RowId: number;
    public OrderNumber: string;
    public NColliBancali?: number;
    public NumSpedizione: string;
    public RichiestaCorriere?: boolean;
    public DataScadenzaSpedizione?: DateTime;
    public DataConsegnaSpedizione?: DateTime;
    public DataSpedizione?: DateTime;
    public TipologiaSpedizione: string;
    public StatoSpedizione?: number;
    public NoteSpedizione: string;
    public UserId: string;
    public UserFirstName: string;
    public ShipmentOperator: string;
}