import { NewNote } from './new-note';

export class AnnullaActivityModel extends NewNote {
    public ActivityId: number;
    public ProcessPosition: number;
    public OperationType: string;
}